'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import {
    CircleDot,
    ClipboardList,
    LoaderCircle,
    Mic,
    RefreshCw,
    Square,
} from 'lucide-react';

import {
    checkRecordingApiHealth,
    getRecordingStatus,
    listRecordings,
    startRecording as startRecordingApi,
    stopRecording,
    type Recording,
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

function getRecordingId(recording: Recording | null) {
    if (!recording) {
        return '';
    }

    if (typeof recording.recordingId === 'string') {
        return recording.recordingId;
    }

    if (typeof recording.id === 'string') {
        return recording.id;
    }

    const data = recording.data;
    if (data && typeof data === 'object' && 'recordingId' in data) {
        const nestedId = (data as { recordingId?: unknown }).recordingId;
        return typeof nestedId === 'string' ? nestedId : '';
    }

    return '';
}

function getRecordingsList(payload: Recording[] | { recordings: Recording[] }) {
    return Array.isArray(payload) ? payload : payload.recordings;
}

function prettyPrint(value: unknown) {
    return JSON.stringify(value, null, 2);
}

export default function MeetAddOnPage() {
    const {
        errorMessage: meetErrorMessage,
        isPending: isMeetPending,
        isReady,
        startRecording: openMeetWorkspace,
        statusMessage: meetStatusMessage,
    } = useMeetAddon();
    const [meetUrl, setMeetUrl] = useState(DEFAULT_MEET_URL);
    const [recordingId, setRecordingId] = useState('');
    const [activeRecording, setActiveRecording] = useState<Recording | null>(null);
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [health, setHealth] = useState<Record<string, unknown> | null>(null);
    const [apiMessage, setApiMessage] = useState('Ready to call the recording API.');
    const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
    const [isApiPending, startApiTransition] = useTransition();

    const activeRecordingId = useMemo(
        () => recordingId || getRecordingId(activeRecording),
        [activeRecording, recordingId]
    );

    async function refreshRecordings() {
        const payload = await listRecordings();
        setRecordings(getRecordingsList(payload));
    }

    function runApiAction(action: () => Promise<void>) {
        setApiErrorMessage(null);
        startApiTransition(() => {
            void action().catch((error) => {
                setApiErrorMessage(
                    error instanceof Error ? error.message : 'Recording API request failed.'
                );
            });
        });
    }

    function handleHealthCheck() {
        runApiAction(async () => {
            const result = await checkRecordingApiHealth();
            setHealth(result);
            setApiMessage('Recording API health check completed.');
        });
    }

    function handleRefreshRecordings() {
        runApiAction(async () => {
            await refreshRecordings();
            setApiMessage('Recording list refreshed.');
        });
    }

    function handleStartRecording() {
        runApiAction(async () => {
            const recording = await startRecordingApi(meetUrl.trim());
            const id = getRecordingId(recording);

            setActiveRecording(recording);
            setRecordingId(id);
            setApiMessage(id ? `Recording started: ${id}` : 'Recording started.');
            await refreshRecordings();
        });
    }

    function handleCheckStatus() {
        if (!activeRecordingId) {
            setApiErrorMessage('Enter or start a recording before checking status.');
            return;
        }

        runApiAction(async () => {
            const status = await getRecordingStatus(activeRecordingId);
            setActiveRecording(status);
            setApiMessage(`Status loaded for ${activeRecordingId}.`);
        });
    }

    function handleStopRecording() {
        if (!activeRecordingId) {
            setApiErrorMessage('Enter or start a recording before stopping it.');
            return;
        }

        runApiAction(async () => {
            const stopped = await stopRecording(activeRecordingId);
            setActiveRecording(stopped);
            setApiMessage(`Stop request sent for ${activeRecordingId}.`);
            await refreshRecordings();
        });
    }

    useEffect(() => {
        let isMounted = true;

        async function bootstrapRecordingApi() {
            try {
                const [healthResult, recordingsResult] = await Promise.all([
                    checkRecordingApiHealth(),
                    listRecordings(),
                ]);

                if (!isMounted) {
                    return;
                }

                setHealth(healthResult);
                setRecordings(getRecordingsList(recordingsResult));
                setApiMessage('Recording API connected.');
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setApiErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Recording API request failed.'
                );
            }
        }

        void bootstrapRecordingApi();

        return () => {
            isMounted = false;
        };
    }, []);

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
                        <Mic className="size-4" />
                        Recording control
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <label className="space-y-1.5 text-[12px] font-medium">
                        <span>Meet URL</span>
                        <input
                            className="h-9 w-full rounded-lg border border-border/70 bg-background px-3 text-[13px] outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-primary/15"
                            onChange={(event) => setMeetUrl(event.target.value)}
                            placeholder="https://meet.google.com/abc-defg-hij"
                            type="url"
                            value={meetUrl}
                        />
                    </label>
                    <label className="space-y-1.5 text-[12px] font-medium">
                        <span>Recording ID</span>
                        <input
                            className="h-9 w-full rounded-lg border border-border/70 bg-background px-3 text-[13px] outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-primary/15"
                            onChange={(event) => setRecordingId(event.target.value)}
                            placeholder="Use returned ID or paste one here"
                            type="text"
                            value={activeRecordingId}
                        />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            disabled={isApiPending || !meetUrl.trim()}
                            onClick={handleStartRecording}
                            type="button"
                        >
                            {isApiPending ? (
                                <LoaderCircle className="size-3.5 animate-spin" />
                            ) : (
                                <Mic className="size-3.5" />
                            )}
                            Start
                        </Button>
                        <Button
                            disabled={isApiPending || !activeRecordingId}
                            onClick={handleStopRecording}
                            type="button"
                            variant="destructive"
                        >
                            <Square className="size-3.5" />
                            Stop
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button
                        className="flex-1"
                        disabled={isApiPending || !activeRecordingId}
                        onClick={handleCheckStatus}
                        size="sm"
                        type="button"
                        variant="outline"
                    >
                        <CircleDot className="size-3.5" />
                        Status
                    </Button>
                    <Button
                        className="flex-1"
                        disabled={isApiPending}
                        onClick={handleRefreshRecordings}
                        size="sm"
                        type="button"
                        variant="outline"
                    >
                        <RefreshCw className="size-3.5" />
                        Refresh
                    </Button>
                </CardFooter>
            </Card>

            <section aria-live="polite" className="space-y-2">
                <div className="rounded-lg border border-border/70 bg-muted/15 p-3 text-[12px] leading-5">
                    <div className="font-medium text-foreground">{apiMessage}</div>
                    {health ? (
                        <pre className="mt-2 max-h-28 overflow-auto whitespace-pre-wrap rounded-md bg-background p-2 text-[11px] text-muted-foreground">
                            {prettyPrint(health)}
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
                {activeRecording ? (
                    <pre className="max-h-44 overflow-auto rounded-lg border border-border/70 bg-background p-3 text-[11px] leading-5 text-muted-foreground">
                        {prettyPrint(activeRecording)}
                    </pre>
                ) : null}
            </section>

            <section className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        <ClipboardList className="size-3.5" />
                        Recordings
                    </h2>
                    <Button
                        disabled={isApiPending}
                        onClick={handleHealthCheck}
                        size="xs"
                        type="button"
                        variant="ghost"
                    >
                        Health
                    </Button>
                </div>
                {recordings.length > 0 ? (
                    <div className="space-y-2">
                        {recordings.map((recording, index) => {
                            const id = getRecordingId(recording) || `recording-${index}`;

                            return (
                                <button
                                    className="w-full rounded-lg border border-border/70 bg-background p-3 text-left text-[12px] transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"
                                    key={id}
                                    onClick={() => {
                                        setActiveRecording(recording);
                                        setRecordingId(getRecordingId(recording));
                                    }}
                                    type="button"
                                >
                                    <div className="font-medium text-foreground">{id}</div>
                                    <div className="mt-1 text-muted-foreground">
                                        {recording.status ? `Status: ${recording.status}` : 'Open details'}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-border/70 p-4 text-center text-[12px] text-muted-foreground">
                        No recordings returned yet.
                    </div>
                )}
            </section>
        </div>
    );
}
