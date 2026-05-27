'use client';

import { Circle, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BotJobStatus } from '@/lib/bot-api';

type RecordingPhase = 'idle' | 'recording' | 'processing';

type StatusBadgeProps = {
    phase: RecordingPhase;
    jobStatus: BotJobStatus | null;
    isReady: boolean;
    hasMeeting: boolean;
    isApiPending: boolean;
};

export function StatusBadge({
    phase,
    jobStatus,
    isReady,
    hasMeeting,
    isApiPending,
}: StatusBadgeProps) {
    const isRecording = phase === 'recording';
    const isProcessing = phase === 'processing';

    return (
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
    );
}
