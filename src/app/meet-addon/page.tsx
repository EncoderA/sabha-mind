'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, useTransition } from 'react';
import {
    ChevronRight,
    Circle,
    LoaderCircle,
    Mic,
    Square,
} from 'lucide-react';

import {
    extractJobId,
    extractMeetingIdFromUrl,
    getTranscriptItemId,
    getTranscriptItemPreview,
    getTranscriptItemTitle,
    clearStoredJobId,
    loadStoredJobId,
    normalizeTranscriptList,
    statusText,
    storeJobId,
    type BotJob,
    type BotJobStatus,
    type TranscriptListItem,
} from '@/lib/bot-api';
import {
    getBotJob,
    getAllTranscripts,
    getTranscriptDirect,
    stopBot,
    submitMeetingLink,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMeetAddon } from './meet-addon-provider';

type RecordingPhase = 'idle' | 'recording' | 'processing';

const terminalJobStatuses = new Set<BotJobStatus>([
    'completed',
    'failed',
    'stopped',
]);

function formatMeetingCode(code: string) {
    if (code.includes('-')) {
        return code;
    }
    if (code.length === 10) {
        return `${code.slice(0, 3)}-${code.slice(3, 7)}-${code.slice(7)}`;
    }
    return code;
}

export default function MeetAddOnPage() {
    const {
        errorMessage: meetErrorMessage,
        isReady,
        sidePanelClient,
    } = useMeetAddon();
    const [meetUrl, setMeetUrl] = useState('');
    const [meetingCode, setMeetingCode] = useState('');
    const [jobId, setJobId] = useState('');
    const [jobStatus, setJobStatus] = useState<BotJobStatus | null>(null);
    const [phase, setPhase] = useState<RecordingPhase>('idle');
    const [transcripts, setTranscripts] = useState<TranscriptListItem[]>([]);
    const [statusNote, setStatusNote] = useState(
        'Record this meeting to generate a transcript when you are done.'
    );
    const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
    const [isApiPending, startApiTransition] = useTransition();
    const [isLoadingTranscripts, setIsLoadingTranscripts] = useState(true);

    const hasMeeting = Boolean(meetingCode.trim());
    const isRecording = phase === 'recording';
    const isProcessing = phase === 'processing';

    const refreshTranscripts = useCallback(async () => {
        const payload = await getAllTranscripts();
        setTranscripts(normalizeTranscriptList(payload));
    }, []);

    function runApiAction(action: () => Promise<void>) {
        setApiErrorMessage(null);
        startApiTransition(() => {
            void action().catch((error) => {
                setApiErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Something went wrong. Please try again.'
                );
                if (phase === 'recording') {
                    setPhase('idle');
                    setJobStatus(null);
                }
            });
        });
    }

    const handleJobUpdate = useCallback(
        async (job: BotJob) => {
            setJobStatus(job.status);

            if (job.status === 'pending' || job.status === 'running') {
                setPhase('recording');
                setStatusNote(statusText[job.status]);
                return;
            }

            if (job.status === 'completed') {
                setPhase('processing');
                setStatusNote(statusText.completed);

                if (job.meetingId) {
                    try {
                        await getTranscriptDirect(job.meetingId);
                    } catch {
                        // Fall back to the transcript list below.
                    }
                }

                await refreshTranscripts();
                clearStoredJobId();
                setJobId('');
                setPhase('idle');
                return;
            }

            clearStoredJobId();
            setJobId('');
            setPhase('idle');
            setStatusNote(statusText[job.status]);

            if (job.status === 'failed') {
                setApiErrorMessage(
                    job.error || 'Bot failed, but no detailed error was available.'
                );
            }
        },
        [refreshTranscripts]
    );

    function handleStartRecording() {
        const url = meetUrl.trim();
        if (!url) {
            setApiErrorMessage(
                'We could not detect this meeting yet. Open VartaIQ from inside an active Google Meet call.'
            );
            return;
        }

        runApiAction(async () => {
            const response = await submitMeetingLink(url);
            const nextJobId = extractJobId(response);
            const derivedMeetingId =
                extractMeetingIdFromUrl(url) ||
                (typeof response.meetingId === 'string' ? response.meetingId : '');

            if (derivedMeetingId) {
                setMeetingCode(derivedMeetingId);
            }
            if (!nextJobId) {
                throw new Error('Bot started, but no job id was returned.');
            }

            setJobId(nextJobId);
            storeJobId(nextJobId);

            setJobStatus(response.status ?? 'running');
            setPhase('recording');
            setStatusNote('Bot started. Waiting for host admission.');
        });
    }

    function handleStopRecording() {
        const resolvedJobId = jobId.trim() || loadStoredJobId();

        if (!resolvedJobId) {
            setApiErrorMessage(
                'Could not find an active recording session. Start recording again.'
            );
            return;
        }

        runApiAction(async () => {
            const response = await stopBot(resolvedJobId);
            setJobStatus(response.status);
            setPhase('idle');
            setJobId('');
            clearStoredJobId();
            setStatusNote(response.message || statusText.stopped);
        });
    }

    useEffect(() => {
        const storedJobId = loadStoredJobId();
        if (!storedJobId) {
            return;
        }

        queueMicrotask(() => {
            setJobId(storedJobId);
            setJobStatus('running');
            setPhase('recording');
            setStatusNote(statusText.running);
        });
    }, []);

    useEffect(() => {
        if (!jobId || (jobStatus && terminalJobStatuses.has(jobStatus))) {
            return;
        }

        let isMounted = true;

        async function pollOnce() {
            try {
                const job = await getBotJob(jobId);
                if (!isMounted) {
                    return;
                }
                await handleJobUpdate(job);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                clearStoredJobId();
                setJobId('');
                setJobStatus('failed');
                setPhase('idle');
                setApiErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Failed to check bot status'
                );
                setStatusNote(statusText.failed);
            }
        }

        const timer = window.setInterval(() => {
            void pollOnce();
        }, 3000);

        void pollOnce();

        return () => {
            isMounted = false;
            window.clearInterval(timer);
        };
    }, [handleJobUpdate, jobId, jobStatus]);

    useEffect(() => {
        let isMounted = true;

        async function loadRecentTranscripts() {
            try {
                await refreshTranscripts();
            } catch {
                // Non-blocking: home still works if list fails
            } finally {
                if (isMounted) {
                    setIsLoadingTranscripts(false);
                }
            }
        }

        void loadRecentTranscripts();

        return () => {
            isMounted = false;
        };
    }, [refreshTranscripts]);

    useEffect(() => {
        if (!sidePanelClient) {
            return;
        }

        let isMounted = true;

        async function fetchMeetingInfo() {
            try {
                const meetingInfo = await sidePanelClient!.getMeetingInfo();

                if (!isMounted || !meetingInfo?.meetingCode) {
                    return;
                }

                const code = meetingInfo.meetingCode;
                setMeetingCode(code);
                setMeetUrl(`https://meet.google.com/${code}`);
            } catch {
                // Outside Meet or SDK unavailable — user sees empty state
            }
        }

        void fetchMeetingInfo();

        return () => {
            isMounted = false;
        };
    }, [sidePanelClient]);

    const recentTranscripts = transcripts.slice(0, 3);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div
                className={cn(
                    'flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium w-fit',
                    isRecording
                        ? 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'
                        : isProcessing
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200'
                          : 'border-border/70 bg-muted/30 text-muted-foreground'
                )}
            >
                {isRecording ? (
                    <Circle className="size-2 fill-current text-red-500 animate-pulse" />
                ) : isProcessing || isApiPending ? (
                    <LoaderCircle className="size-3 animate-spin" />
                ) : (
                    <Circle
                        className={cn(
                            'size-2 fill-current',
                            isReady && hasMeeting
                                ? 'text-emerald-500'
                                : 'text-muted-foreground/50'
                        )}
                    />
                )}
                {isRecording
                    ? jobStatus === 'pending'
                      ? 'Preparing bot'
                      : 'Bot running'
                    : isProcessing
                      ? 'Processing'
                      : isReady && hasMeeting
                        ? 'Ready to start bot'
                        : 'Waiting for meeting'}
            </div>

            <section className="space-y-1">
                <h1 className="text-lg font-semibold tracking-tight">
                    {isRecording ? 'Bot is active' : 'Start meeting bot'}
                </h1>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {statusNote}
                </p>
            </section>

            <section className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Google Meet
                </p>
                {hasMeeting ? (
                    <p className="mt-1 text-base font-medium tracking-tight">
                        {formatMeetingCode(meetingCode)}
                    </p>
                ) : (
                    <p className="mt-1 text-[13px] text-muted-foreground">
                        Join a meeting and open VartaIQ from the Meet side panel.
                    </p>
                )}
                {meetErrorMessage ? (
                    <p className="mt-2 text-[12px] text-destructive" role="alert">
                        {meetErrorMessage}
                    </p>
                ) : null}
            </section>

            <div className="flex flex-col gap-2">
                {isRecording ? (
                    <Button
                        className="h-11 w-full gap-2 text-[15px]"
                        disabled={isApiPending}
                        onClick={handleStopRecording}
                        type="button"
                        variant="destructive"
                    >
                        {isApiPending ? (
                            <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                            <Square className="size-4 fill-current" />
                        )}
                        Stop bot
                    </Button>
                ) : (
                    <Button
                        className="h-11 w-full gap-2 text-[15px]"
                        disabled={
                            isApiPending || isProcessing || !hasMeeting || !isReady
                        }
                        onClick={handleStartRecording}
                        type="button"
                    >
                        {isApiPending ? (
                            <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                            <Mic className="size-4" />
                        )}
                        Start bot
                    </Button>
                )}
            </div>

            {apiErrorMessage ? (
                <div
                    className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive"
                    role="alert"
                >
                    {apiErrorMessage}
                </div>
            ) : null}

            <section className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-[13px] font-semibold text-foreground">
                        Recent transcripts
                    </h2>
                    <Link
                        className="flex items-center gap-0.5 text-[12px] font-medium text-primary hover:underline"
                        href="/meet-addon/transcripts"
                    >
                        See all
                        <ChevronRight className="size-3.5" />
                    </Link>
                </div>

                {isLoadingTranscripts ? (
                    <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/70 py-8 text-[13px] text-muted-foreground">
                        <LoaderCircle className="size-4 animate-spin" />
                        Loading…
                    </div>
                ) : recentTranscripts.length > 0 ? (
                    <ul className="space-y-2">
                        {recentTranscripts.map((item, index) => {
                            const id =
                                getTranscriptItemId(item) || `transcript-${index}`;

                            return (
                                <li key={id}>
                                    <Link
                                        className="block rounded-lg border border-border/60 bg-background p-3 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"
                                        href={`/meet-addon/transcripts/${encodeURIComponent(id)}`}
                                    >
                                        <p className="text-[13px] font-medium text-foreground">
                                            {getTranscriptItemTitle(item)}
                                        </p>
                                        <p className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">
                                            {getTranscriptItemPreview(item)}
                                        </p>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="rounded-lg border border-dashed border-border/70 py-8 text-center text-[13px] text-muted-foreground">
                        Your transcripts will show up here after you record a meeting.
                    </p>
                )}
            </section>
        </div>
    );
}
