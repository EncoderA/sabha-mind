'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import {
  meet,
  MeetSidePanelClient,
} from '@googleworkspace/meet-addons/meet.addons';
import {
  ArrowLeft,
  CircleDot,
  Keyboard,
  Mic,
  Radio,
  Sparkles,
} from 'lucide-react';

import { ThemeSwitch } from '@/components/theme-switch';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
    <main className="min-h-screen bg-muted/20 p-2">
      <Card
        size="sm"
        className="min-h-[calc(100vh-1rem)] border-border/70 bg-background shadow-sm"
      >
        <CardHeader className="gap-3 border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Mic className="size-4" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
                  <Radio className="size-3" />
                  Meet side panel
                </div>
                <CardTitle className="text-sm">Start Recording</CardTitle>
                <CardDescription className="text-[13px] leading-5">
                  Launch Sabha Mind from the Google Meet sidebar.
                </CardDescription>
              </div>
            </div>
            <ThemeSwitch enableShortcut className="size-8" />
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-3 pt-3">
          <div className="rounded-xl border border-border/60 bg-muted/35 p-3">
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              <CircleDot className="size-3.5 text-primary" />
              Session status
            </div>
            <p className="mt-2 text-[13px] leading-5 text-foreground">
              {statusMessage}
            </p>
          </div>

          <div className="grid gap-2">
            <div className="rounded-lg border border-border/60 bg-background p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="space-y-1">
                  <p className="text-[13px] font-medium">Built for live calls</p>
                  <p className="text-[12px] leading-5 text-muted-foreground">
                    Start recording here, then continue in the main stage without
                    leaving the meeting flow.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-background p-3">
              <div className="flex items-start gap-2">
                <Keyboard className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="space-y-1">
                  <p className="text-[13px] font-medium">Quick theme toggle</p>
                  <p className="text-[12px] leading-5 text-muted-foreground">
                    Press <span className="font-semibold text-foreground">D</span>{' '}
                    to switch dark mode without reaching for the header button.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-[13px] leading-5 text-destructive">
              {errorMessage}
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="mt-auto flex-col items-stretch gap-2 border-t bg-background">
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
    </main>
  );
}
