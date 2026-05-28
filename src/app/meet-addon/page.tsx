'use client';

import { useCallback, useEffect, useState } from 'react';
import { normalizeTranscriptList, type TranscriptListItem } from '@/lib/bot-api';
import { getAllTranscripts } from '@/lib/api';
import { StatusBadge, MeetingInfoCard, RecordingControl, RecentTranscripts } from '@/components/meet-bot';
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
        <div className="flex flex-1 flex-col gap-4 p-4">
            <StatusBadge
                phase={phase}
                jobStatus={jobStatus}
                isReady={isReady}
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
                errorMessage={meetErrorMessage}
            />

            <div className="flex flex-col gap-2">
                <RecordingControl
                    isRecording={isRecording}
                    isApiPending={isApiPending}
                    isProcessing={isProcessing}
                    hasMeeting={hasMeeting}
                    isReady={isReady}
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
                basePath="/meet-addon/transcripts"
            />
        </div>
    );
}
