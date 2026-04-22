'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import {
  meet,
  MeetSidePanelClient,
} from '@googleworkspace/meet-addons/meet.addons';
import { ArrowLeft, Keyboard, Mic, Radio } from 'lucide-react';

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
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm border border-border/70 bg-background shadow-lg">
        <CardHeader className="gap-4 border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-foreground">
                <Mic className="size-5" />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                <Radio className="size-3.5" />
                Meet add-on
              </div>
            </div>
            <ThemeSwitch enableShortcut />
          </div>
          <div className="space-y-1">
            <CardTitle>Start Recording</CardTitle>
            <CardDescription>
              Open the Sabha Mind recording stage for this meeting from the side
              panel.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-sm text-muted-foreground">
            {statusMessage}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 p-3 text-sm text-muted-foreground">
            <Keyboard className="size-4 text-primary" />
            Press <span className="font-semibold text-foreground">D</span> to
            switch dark mode from the side panel.
          </div>
          {errorMessage ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3 sm:flex-row">
          <Button
            className="flex-1"
            size="lg"
            onClick={startRecording}
            disabled={!isReady || isPending}
          >
            {isPending ? 'Starting Recording...' : 'Start Recording'}
          </Button>
          <Link
            href="/"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
