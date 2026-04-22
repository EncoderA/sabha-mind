'use client';

import { useEffect, useState, useTransition } from 'react';
import {
    meet,
    MeetSidePanelClient,
} from '@googleworkspace/meet-addons/meet.addons';
import { CircleDot, Keyboard, Mic } from 'lucide-react';

import { MeetDebugCard } from '@/components/meet-debug-card';

import { ThemeSwitch } from '@/components/theme-switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function MeetAddOnPage() {
    const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();
    const [isReady, setIsReady] = useState(false);
    const [statusMessage, setStatusMessage] = useState(
        'Connecting to the Meet side panel...'
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function startRecording() {
        if (!sidePanelClient) {
            setErrorMessage('The Meet side panel is still initializing.');
            return;
        }

        setErrorMessage(null);
        startTransition(async () => {
            try {
                await sidePanelClient.startActivity({
                    mainStageUrl: 'https://sabha-mind.vercel.app/meet-addon',
                });
                setStatusMessage('Recording workspace opened in the main stage.');
            } catch (error) {
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Unable to start the recording activity.'
                );
            }
        });
    }

    useEffect(() => {
        let isMounted = true;

        async function initializeSidePanel() {
            try {
                const session = await meet.addon.createAddonSession({
                    cloudProjectNumber: '882230198706',
                });
                const client = await session.createSidePanelClient();

                if (!isMounted) {
                    return;
                }

                setSidePanelClient(client);
                setIsReady(true);
                setStatusMessage('Ready to launch the Sabha Mind recording workspace.');
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Failed to initialize the Meet add-on side panel.'
                );
                setStatusMessage('Initialization failed.');
            }
        }

        initializeSidePanel();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <Card className="flex flex-col min-h-screen bg-background font-mono">
            <CardHeader className="flex items-start justify-between gap-3 border-b border-border/70 pb-4">
                <div className="min-w-0 space-y-2">
                    <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/40 text-foreground">
                            <Mic className="size-4" />
                        </div>
                        <div className="min-w-0 space-y-1">
                            <h1 className="text-sm font-medium font-mono tracking-tight">
                                VartaIQ
                            </h1>
                            <p className="text-[13px] leading-5 text-muted-foreground">
                                Launch VartaIQ from the Meet sidebar and continue in the
                                main stage.
                            </p>
                        </div>
                    </div>
                </div>
                <ThemeSwitch enableShortcut className="size-8 shrink-0" />
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-3 py-4">
                <div className="rounded-lg border border-border/70 bg-muted/25 p-3">
                    <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                        <CircleDot className="size-3.5 text-foreground/70" />
                        Session status
                    </div>
                    <p className="mt-2 text-[13px] leading-5 text-foreground">
                        {statusMessage}
                    </p>
                </div>

                <div className="rounded-lg border border-border/70 bg-muted/15 p-3">
                    <div className="flex items-start gap-2">
                        <span className="mt-1.75 size-1.5 shrink-0 rounded-full bg-foreground/65" />
                        <div className="space-y-1">
                            <p className="text-[13px] font-medium">Built for live calls</p>
                            <p className="text-[12px] leading-5 text-muted-foreground">
                                Start recording here, then continue in the main stage without
                                leaving the meeting flow.
                            </p>
                        </div>
                    </div>
                </div>

                {errorMessage ? (
                    <div className="rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-[13px] leading-5 text-destructive">
                        {errorMessage}
                    </div>
                ) : null}

                {/* 🧪 TEMPORARY — Remove after testing */}
                <MeetDebugCard sidePanelClient={sidePanelClient} />
            </CardContent>

            <CardFooter className="mt-auto flex flex-col gap-2 border-t border-border/70 pt-4">
                <Button
                    className="w-full"
                    size="lg"
                    onClick={startRecording}
                    disabled={!isReady || isPending}
                >
                    {isPending ? 'Starting Recording...' : 'Start Recording'}
                </Button>
            </CardFooter>
        </Card>

    );
}
