'use client';

import { CircleDot } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useMeetAddon } from './meet-addon-provider';

export default function MeetAddOnPage() {
    const { errorMessage, isPending, isReady, startRecording, statusMessage } =
        useMeetAddon();

    return (
        <Card className="flex min-h-[calc(100vh-89px)] flex-col rounded-none border-0 bg-background font-mono">
            <CardContent className="flex flex-1 flex-col gap-3">
                <div className="rounded-lg border border-border/70 bg-muted/25 p-3">
                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        <CircleDot className="size-3.5 text-foreground/70" />
                        Session status
                    </div>
                    <p
                        aria-live="polite"
                        className="mt-2 text-[13px] leading-5 text-foreground"
                    >
                        {statusMessage}
                    </p>
                </div>

                <div className="rounded-lg border border-border/70 bg-muted/15 p-3">
                    <div className="flex items-start gap-2">
                        <span className="mt-1.75 size-1.5 shrink-0 rounded-full bg-foreground/65" />
                        <div className="space-y-1">
                            <p className="text-[13px] font-medium">Built for live calls</p>
                            <p className="text-[12px] leading-5 text-muted-foreground">
                                Start recording here, then continue in the main stage
                                without leaving the meeting flow.
                            </p>
                        </div>
                    </div>
                </div>

                {errorMessage ? (
                    <div
                        aria-live="polite"
                        className="rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-[13px] leading-5 text-destructive"
                        role="alert"
                    >
                        {errorMessage}
                    </div>
                ) : null}
            </CardContent>

            <CardFooter className="mt-auto flex flex-col gap-2 rounded-none border-t border-border/70 pt-4">
                <Button
                    className="w-full"
                    disabled={!isReady || isPending}
                    onClick={startRecording}
                    size="lg"
                    type="button"
                >
                    {isPending ? 'Starting Recording…' : 'Start Recording'}
                </Button>
            </CardFooter>
        </Card>
    );
}
