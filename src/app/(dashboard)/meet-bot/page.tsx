'use client';

import { useCallback, useEffect, useState } from 'react';
import { extractMeetingIdFromUrl, normalizeTranscriptList, type TranscriptListItem } from '@/lib/bot-api';
import { getAllTranscripts } from '@/lib/api';
import { MeetBotPanel } from '@/features/add-on/components/meet-bot-panel';
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
        <MeetBotPanel
            className="md:p-6"
            phase={phase}
            jobStatus={jobStatus}
            isReady={true}
            hasMeeting={hasMeeting}
            isApiPending={isApiPending}
            statusNote={statusNote}
            meetingCode={meetingCode}
            showManualInput={true}
            meetUrl={meetUrl}
            onMeetUrlChange={handleMeetUrlChange}
            isRecording={isRecording}
            isProcessing={isProcessing}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
            apiErrorMessage={apiErrorMessage}
            transcripts={transcripts}
            isLoadingTranscripts={isLoadingTranscripts}
            basePath="/meet-bot/transcripts"
        />
    );
}
