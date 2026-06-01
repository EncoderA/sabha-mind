'use client';

import {
    MeetingInfoCard,
    RecordingControl,
    RecentTranscripts,
    StatusBadge,
} from '@/components/meet-bot';
import { cn } from '@/lib/utils';
import type { BotJobStatus, TranscriptListItem } from '@/lib/bot-api';

type RecordingPhase = 'idle' | 'recording' | 'processing';

type MeetBotPanelProps = {
    phase: RecordingPhase;
    jobStatus: BotJobStatus | null;
    isReady: boolean;
    hasMeeting: boolean;
    isApiPending: boolean;
    statusNote: string;
    meetingCode: string;
    meetErrorMessage?: string | null;
    showManualInput?: boolean;
    meetUrl?: string;
    onMeetUrlChange?: (url: string) => void;
    isRecording: boolean;
    isProcessing: boolean;
    onStart: () => void;
    onStop: () => void;
    apiErrorMessage?: string | null;
    transcripts: TranscriptListItem[];
    isLoadingTranscripts: boolean;
    basePath: string;
    className?: string;
};

export function MeetBotPanel({
    phase,
    jobStatus,
    isReady,
    hasMeeting,
    isApiPending,
    statusNote,
    meetingCode,
    meetErrorMessage = null,
    showManualInput = false,
    meetUrl = '',
    onMeetUrlChange,
    isRecording,
    isProcessing,
    onStart,
    onStop,
    apiErrorMessage,
    transcripts,
    isLoadingTranscripts,
    basePath,
    className,
}: MeetBotPanelProps) {
    return (
        <div className={cn('flex flex-1 flex-col gap-4 p-4', className)}>
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
                showManualInput={showManualInput}
                meetUrl={meetUrl}
                onMeetUrlChange={onMeetUrlChange}
            />

            <div className="flex flex-col gap-2">
                <RecordingControl
                    isRecording={isRecording}
                    isApiPending={isApiPending}
                    isProcessing={isProcessing}
                    hasMeeting={hasMeeting}
                    isReady={isReady}
                    onStart={onStart}
                    onStop={onStop}
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
                basePath={basePath}
            />
        </div>
    );
}
