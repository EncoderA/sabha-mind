'use client';

import { useCallback, useEffect, useState } from 'react';
import { extractMeetingIdFromUrl, normalizeTranscriptList, type TranscriptListItem } from '@/lib/bot-api';
import { getAllTranscripts } from '@/lib/api';
import { StatusBadge } from '@/components/meet-bot/status-badge';
import { MeetingInfoCard } from '@/components/meet-bot/meeting-info-card';
import { RecordingControl } from '@/components/meet-bot/recording-control';
import { RecentTranscripts } from '@/components/meet-bot/recent-transcripts';
import { useMeetBot } from '@/hooks/use-meet-bot';

export default function MeetBotPage() {
    const [transcripts, setTranscripts] = useState<TranscriptListItem[]>([]);
    const [isLoadingTranscripts, setIsLoadingTranscripts] = useState(true);

    const refreshTranscripts = useCallback(async () => {
        const payload = await getAllTranscripts();
        setTranscripts(normalizeTranscriptList(payload));
    }, []);

    const {
        meetUrl,
        setMeetUrl,
        meetingCode,
        setMeetingCode,
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
    } = useMeetBot(refreshTranscripts);

    // Handle manual URL input
    const handleMeetUrlChange = (url: string) => {
        setMeetUrl(url);
        const code = extractMeetingIdFromUrl(url);
        if (code) {
            setMeetingCode(code);
        }
    };

    // Load transcripts on mount
    useEffect(() => {
        let isMounted = true;

        async function loadRecentTranscripts() {
            try {
                await refreshTranscripts();
            } catch {
                // Non-blocking: page still works if list fails
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

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <StatusBadge
                phase={phase}
                jobStatus={jobStatus}
                isReady={true}
                hasMeeting={hasMeeting}
                isApiPending={isApiPending}
            />

            <section className="space-y-1">
                <h1 className="text-lg font-semibold tracking-tight">
                    {isRecording ? 'Bot is active' : 'Start meeting bot'}
                </h1>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {statusNote}
                </p>
            </section>

            <MeetingInfoCard
                meetingCode={meetingCode}
                errorMessage={null}
                showManualInput={true}
                meetUrl={meetUrl}
                onMeetUrlChange={handleMeetUrlChange}
            />

            <div className="flex flex-col gap-2">
                <RecordingControl
                    isRecording={isRecording}
                    isApiPending={isApiPending}
                    isProcessing={isProcessing}
                    hasMeeting={hasMeeting}
                    isReady={true}
                    onStart={handleStartRecording}
                    onStop={handleStopRecording}
                />
            </div>

            {apiErrorMessage ? (
                <div
                    className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive"
                    role="alert"
                >
                    {apiErrorMessage}
                </div>
            ) : null}

            <RecentTranscripts
                transcripts={transcripts}
                isLoading={isLoadingTranscripts}
                basePath="/meet-bot/transcripts"
            />
        </div>
    );
}
