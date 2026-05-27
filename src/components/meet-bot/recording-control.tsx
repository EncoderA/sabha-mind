'use client';

import { LoaderCircle, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

type RecordingControlProps = {
    isRecording: boolean;
    isApiPending: boolean;
    isProcessing: boolean;
    hasMeeting: boolean;
    isReady: boolean;
    onStart: () => void;
    onStop: () => void;
};

export function RecordingControl({
    isRecording,
    isApiPending,
    isProcessing,
    hasMeeting,
    isReady,
    onStart,
    onStop,
}: RecordingControlProps) {
    if (isRecording) {
        return (
            <Button
                className="h-11 w-full gap-2 text-[15px]"
                disabled={isApiPending}
                onClick={onStop}
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
        );
    }

    return (
        <Button
            className="h-11 w-full gap-2 text-[15px]"
            disabled={isApiPending || isProcessing || !hasMeeting || !isReady}
            onClick={onStart}
            type="button"
        >
            {isApiPending ? (
                <LoaderCircle className="size-4 animate-spin" />
            ) : (
                <Mic className="size-4" />
            )}
            Start bot
        </Button>
    );
}
