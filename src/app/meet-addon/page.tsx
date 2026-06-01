'use client';

import { useCallback, useEffect, useState } from 'react';
import { normalizeTranscriptList, type TranscriptListItem } from '@/lib/bot-api';
import { getAllTranscripts } from '@/lib/api';
import { MeetBotPanel } from '@/features/add-on/components/meet-bot-panel';
import { useMeetBot } from '@/hooks/use-meet-bot';
import { useMeetAddon } from './meet-addon-provider';

export default function MeetAddOnPage() {
    const {
        errorMessage: meetErrorMessage,
        isReady,
        sidePanelClient,
    } = useMeetAddon();
    
    const [transcripts, setTranscripts] = useState<TranscriptListItem[]>([]);
    const [isLoadingTranscripts, setIsLoadingTranscripts] = useState(true);

    const refreshTranscripts = useCallback(async () => {
        const payload = await getAllTranscripts();
        setTranscripts(normalizeTranscriptList(payload));
    }, []);

    const {
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

    // Load transcripts on mount
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

    // Fetch meeting info from Google Meet Add-on
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
    }, [sidePanelClient, setMeetingCode, setMeetUrl]);

    return (
        <MeetBotPanel
            phase={phase}
            jobStatus={jobStatus}
            isReady={isReady}
            hasMeeting={hasMeeting}
            isApiPending={isApiPending}
            statusNote={statusNote}
            meetingCode={meetingCode}
            meetErrorMessage={meetErrorMessage}
            isRecording={isRecording}
            isProcessing={isProcessing}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
            apiErrorMessage={apiErrorMessage}
            transcripts={transcripts}
            isLoadingTranscripts={isLoadingTranscripts}
            basePath="/meet-addon/transcripts"
        />
    );
}
