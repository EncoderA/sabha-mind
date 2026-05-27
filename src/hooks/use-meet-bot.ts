'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import {
    extractJobId,
    extractMeetingIdFromUrl,
    clearStoredJobId,
    loadStoredJobId,
    statusText,
    storeJobId,
    type BotJob,
    type BotJobStatus,
} from '@/lib/bot-api';
import {
    getBotJob,
    getTranscriptDirect,
    stopBot,
    submitMeetingLink,
} from '@/lib/api';

type RecordingPhase = 'idle' | 'recording' | 'processing';

const terminalJobStatuses = new Set<BotJobStatus>([
    'completed',
    'failed',
    'stopped',
]);

export function useMeetBot(onTranscriptReady?: () => Promise<void>) {
    const [meetUrl, setMeetUrl] = useState('');
    const [meetingCode, setMeetingCode] = useState('');
    const [jobId, setJobId] = useState('');
    const [jobStatus, setJobStatus] = useState<BotJobStatus | null>(null);
    const [phase, setPhase] = useState<RecordingPhase>('idle');
    const [statusNote, setStatusNote] = useState(
        'Record this meeting to generate a transcript when you are done.'
    );
    const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
    const [isApiPending, startApiTransition] = useTransition();

    const hasMeeting = Boolean(meetingCode.trim());
    const isRecording = phase === 'recording';
    const isProcessing = phase === 'processing';

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

                if (onTranscriptReady) {
                    await onTranscriptReady();
                }

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
        [onTranscriptReady, phase]
    );

    function handleStartRecording() {
        const url = meetUrl.trim();
        if (!url) {
            setApiErrorMessage(
                'Please enter a valid Google Meet URL to start recording.'
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

    // Restore job from storage on mount
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

    // Poll job status
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

    return {
        meetUrl,
        setMeetUrl,
        meetingCode,
        setMeetingCode,
        jobId,
        jobStatus,
        phase,
        statusNote,
        apiErrorMessage,
        isApiPending,
        hasMeeting,
        isRecording,
        isProcessing,
        handleStartRecording,
        handleStopRecording,
    };
}
