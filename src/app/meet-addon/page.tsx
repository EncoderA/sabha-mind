'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useTransition } from 'react';
import {
    CircleDot,
    ClipboardList,
    LoaderCircle,
    Send,
    Square,
} from 'lucide-react';

import {
    extractJobId,
    extractMeetingIdFromUrl,
    getTranscriptItemId,
    getTranscriptItemPreview,
    getTranscriptItemTitle,
    loadStoredJobId,
    normalizeTranscriptList,
    storeJobId,
    type TranscriptListItem,
} from '@/lib/bot-api';
import {
    getAllTranscripts,
    submitBotDoneSignal,
    submitMeetingLink,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useMeetAddon } from './meet-addon-provider';

const DEFAULT_MEET_URL = 'https://meet.google.com/abc-defg-hij';

function prettyPrint(value: unknown) {
    return JSON.stringify(value, null, 2);
}

export default function MeetAddOnPage() {
    const {
        errorMessage: meetErrorMessage,
        isPending: isMeetPending,
        isReady,
        sidePanelClient,
        startRecording: openMeetWorkspace,
        statusMessage: meetStatusMessage,
    } = useMeetAddon();
    const [meetUrl, setMeetUrl] = useState(DEFAULT_MEET_URL);
    const [meetingId, setMeetingId] = useState('');
    const [jobId, setJobId] = useState('');
    const [transcripts, setTranscripts] = useState<TranscriptListItem[]>([]);
    const [lastSubmitResponse, setLastSubmitResponse] = useState<Record<
        string,
        unknown
    > | null>(null);
    const [apiMessage, setApiMessage] = useState('Ready to connect the recording bot.');
    const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
    const [isApiPending, startApiTransition] = useTransition();
    const submittedUrlRef = useRef<string | null>(null);

    async function refreshTranscripts() {
        const payload = await getAllTranscripts();
        setTranscripts(normalizeTranscriptList(payload));
    }

    function runApiAction(action: () => Promise<void>) {
        setApiErrorMessage(null);
        startApiTransition(() => {
            void action().catch((error) => {
                setApiErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Recording bot request failed.'
                );
            });
        });
    }

    function handleSubmitLink() {
        const url = meetUrl.trim();
        if (!url) {
            setApiErrorMessage('Enter a Meet URL before submitting.');
            return;
        }

        runApiAction(async () => {
            submittedUrlRef.current = url;
            const response = await submitMeetingLink(url);
            const nextJobId = extractJobId(response);
            const derivedMeetingId =
                extractMeetingIdFromUrl(url) ||
                (typeof response.meetingId === 'string' ? response.meetingId : '');

            if (derivedMeetingId) {
                setMeetingId(derivedMeetingId);
            }
            if (nextJobId) {
                setJobId(nextJobId);
                storeJobId(nextJobId);
            }

            setLastSubmitResponse(
                response && typeof response === 'object'
                    ? (response as Record<string, unknown>)
                    : null
            );
            setApiMessage(
                nextJobId
                    ? `Meeting link submitted. Job ID: ${nextJobId}`
                    : 'Meeting link submitted.'
            );
            await refreshTranscripts();
        });
    }

    function handleBotDone() {
        const resolvedJobId = jobId.trim() || loadStoredJobId();
        const resolvedMeetingId =
            meetingId.trim() || extractMeetingIdFromUrl(meetUrl.trim());

        if (!resolvedJobId) {
            setApiErrorMessage('Submit a meeting link first to obtain a job ID.');
            return;
        }

        if (!resolvedMeetingId) {
            setApiErrorMessage('Meeting ID is required for the bot-done signal.');
            return;
        }

        runApiAction(async () => {
            const response = await submitBotDoneSignal(
                resolvedJobId,
                resolvedMeetingId
            );
            setApiMessage(`Bot-done signal sent for meeting ${resolvedMeetingId}.`);
            setLastSubmitResponse(
                response && typeof response === 'object' ? response : null
            );
            await refreshTranscripts();
        });
    }

    function handleRefreshTranscripts() {
        runApiAction(async () => {
            await refreshTranscripts();
            setApiMessage('Transcript list refreshed.');
        });
    }

    useEffect(() => {
        const storedJobId = loadStoredJobId();
        if (storedJobId) {
            setJobId(storedJobId);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function bootstrapBotApi() {
            try {
                await refreshTranscripts();
                if (!isMounted) {
                    return;
                }
                setApiMessage('Recording bot API connected.');
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setApiErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Recording bot request failed.'
                );
            }
        }

        void bootstrapBotApi();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!sidePanelClient) {
            return;
        }

        let isMounted = true;

        async function fetchMeetingInfo() {
            try {
                if (!sidePanelClient) {
                    return;
                }

                const meetingInfo = await sidePanelClient.getMeetingInfo();

                if (!isMounted) {
                    return;
                }

                if (meetingInfo?.meetingCode) {
                    const actualMeetUrl = `https://meet.google.com/${meetingInfo.meetingCode}`;
                    setMeetUrl(actualMeetUrl);
                    setMeetingId(meetingInfo.meetingCode);

                    if (submittedUrlRef.current !== actualMeetUrl) {
                        submittedUrlRef.current = actualMeetUrl;

                        try {
                            const response = await submitMeetingLink(actualMeetUrl);
                            const nextJobId = extractJobId(response);

                            if (!isMounted) {
                                return;
                            }

                            if (nextJobId) {
                                setJobId(nextJobId);
                                storeJobId(nextJobId);
                            }

                            setLastSubmitResponse(
                                response && typeof response === 'object'
                                    ? (response as Record<string, unknown>)
                                    : null
                            );
                            setApiMessage(
                                nextJobId
                                    ? `Auto-submitted Meet link. Job ID: ${nextJobId}`
                                    : 'Auto-submitted Meet link.'
                            );
                            await refreshTranscripts();
                        } catch (error) {
                            if (!isMounted) {
                                return;
                            }

                            setApiErrorMessage(
                                error instanceof Error
                                    ? error.message
                                    : 'Failed to auto-submit meeting link.'
                            );
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch meeting info:', error);
            }
        }

        void fetchMeetingInfo();

        return () => {
            isMounted = false;
        };
    }, [sidePanelClient]);

    return (
        <div className="flex flex-1 flex-col gap-3 bg-background p-3 font-mono">
            <section className="rounded-lg border border-border/70 bg-muted/20 p-3">
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    <CircleDot className="size-3.5 text-foreground/70" />
                    Meet add-on status
                </div>
                <p aria-live="polite" className="mt-2 text-[13px] leading-5 text-foreground">
                    {meetStatusMessage}
                </p>
                {meetErrorMessage ? (
                    <p
                        aria-live="polite"
                        className="mt-2 text-[12px] leading-5 text-destructive"
                        role="alert"
                    >
                        {meetErrorMessage}
                    </p>
                ) : null}
                <Button
                    className="mt-3 w-full"
                    disabled={!isReady || isMeetPending}
                    onClick={openMeetWorkspace}
                    size="sm"
                    type="button"
                    variant="outline"
                >
                    {isMeetPending ? 'Opening workspace...' : 'Open Meet workspace'}
                </Button>
            </section>

            <Card className="rounded-lg border-border/70">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                        <Send className="size-4" />
                        Recording bot
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <label className="space-y-1.5 text-[12px] font-medium">
                        <span>Meet URL</span>
                        <input
                            className="h-9 w-full rounded-lg border border-border/70 bg-background px-3 text-[13px] outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-primary/15"
                            onChange={(event) => {
                                submittedUrlRef.current = null;
                                setMeetUrl(event.target.value);
                            }}
                            placeholder="https://meet.google.com/abc-defg-hij"
                            type="url"
                            value={meetUrl}
                        />
                    </label>
                    <label className="space-y-1.5 text-[12px] font-medium">
                        <span>Meeting ID</span>
                        <input
                            className="h-9 w-full rounded-lg border border-border/70 bg-background px-3 text-[13px] outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-primary/15"
                            onChange={(event) => setMeetingId(event.target.value)}
                            placeholder="abc-defg-hij"
                            type="text"
                            value={meetingId}
                        />
                    </label>
                    <label className="space-y-1.5 text-[12px] font-medium">
                        <span>Job ID</span>
                        <input
                            className="h-9 w-full rounded-lg border border-border/70 bg-background px-3 text-[13px] outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-primary/15"
                            onChange={(event) => setJobId(event.target.value)}
                            placeholder="From submit-link response"
                            type="text"
                            value={jobId}
                        />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            disabled={isApiPending || !meetUrl.trim()}
                            onClick={handleSubmitLink}
                            type="button"
                        >
                            {isApiPending ? (
                                <LoaderCircle className="size-3.5 animate-spin" />
                            ) : (
                                <Send className="size-3.5" />
                            )}
                            Submit link
                        </Button>
                        <Button
                            disabled={isApiPending}
                            onClick={handleBotDone}
                            type="button"
                            variant="destructive"
                        >
                            <Square className="size-3.5" />
                            Bot done
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        disabled={isApiPending}
                        onClick={handleRefreshTranscripts}
                        size="sm"
                        type="button"
                        variant="outline"
                    >
                        <ClipboardList className="size-3.5" />
                        Refresh transcripts
                    </Button>
                </CardFooter>
            </Card>

            <section aria-live="polite" className="space-y-2">
                <div className="rounded-lg border border-border/70 bg-muted/15 p-3 text-[12px] leading-5">
                    <div className="font-medium text-foreground">{apiMessage}</div>
                    {lastSubmitResponse ? (
                        <pre className="mt-2 max-h-28 overflow-auto whitespace-pre-wrap rounded-md bg-background p-2 text-[11px] text-muted-foreground">
                            {prettyPrint(lastSubmitResponse)}
                        </pre>
                    ) : null}
                </div>
                {apiErrorMessage ? (
                    <div
                        className="rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-[12px] leading-5 text-destructive"
                        role="alert"
                    >
                        {apiErrorMessage}
                    </div>
                ) : null}
            </section>

            <section className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        <ClipboardList className="size-3.5" />
                        Transcripts
                    </h2>
                    <Link
                        className="text-[11px] font-medium text-primary hover:underline"
                        href="/meet-addon/summaries"
                    >
                        All summaries
                    </Link>
                </div>
                {transcripts.length > 0 ? (
                    <div className="space-y-2">
                        {transcripts.map((item, index) => {
                            const id =
                                getTranscriptItemId(item) || `transcript-${index}`;

                            return (
                                <Link
                                    className="block w-full rounded-lg border border-border/70 bg-background p-3 text-left text-[12px] transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"
                                    href={`/meet-addon/summaries/${encodeURIComponent(id)}`}
                                    key={id}
                                >
                                    <div className="font-medium text-foreground">
                                        {getTranscriptItemTitle(item)}
                                    </div>
                                    <div className="mt-1 text-muted-foreground">
                                        {getTranscriptItemPreview(item)}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-border/70 p-4 text-center text-[12px] text-muted-foreground">
                        No transcripts returned yet.
                    </div>
                )}
            </section>
        </div>
    );
}
