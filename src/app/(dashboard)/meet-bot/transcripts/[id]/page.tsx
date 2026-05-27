'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, LoaderCircle, MessageSquare, Users } from 'lucide-react';

import { TranscriptSegments } from '@/components/transcript-segments';
import { buttonVariants } from '@/components/ui/button';
import { fetchMeetingTranscript } from '@/lib/fetch-meeting-transcript';
import type { MeetingTranscript } from '@/lib/bot-api';
import { cn } from '@/lib/utils';

const transcriptDateFormatter = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
});

function formatCreatedAt(dateStr: string) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
        return dateStr;
    }
    return transcriptDateFormatter.format(date);
}

function getUniqueSpeakers(transcript: MeetingTranscript) {
    const speakers = new Set<string>();
    for (const segment of transcript.segments) {
        if (segment.speaker.trim()) {
            speakers.add(segment.speaker.trim());
        }
    }
    return [...speakers];
}

export default function TranscriptDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: meetingId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [transcript, setTranscript] = useState<MeetingTranscript | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadTranscript() {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const result = await fetchMeetingTranscript(meetingId);

                if (!isMounted) {
                    return;
                }

                if (!result || result.segments.length === 0) {
                    setTranscript(result);
                    setErrorMessage(
                        result
                            ? 'This meeting has no transcript segments yet.'
                            : 'Transcript not found for this meeting.'
                    );
                    return;
                }

                setTranscript({
                    ...result,
                    meetingId: result.meetingId || meetingId,
                });
            } catch (error) {
                if (!isMounted) {
                    return;
                }
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load transcript.'
                );
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadTranscript();

        return () => {
            isMounted = false;
        };
    }, [meetingId]);

    if (isLoading) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
                <LoaderCircle className="size-10 animate-spin text-muted-foreground/40" />
                <p className="text-[13px] text-muted-foreground">Loading transcript…</p>
            </div>
        );
    }

    if (errorMessage || !transcript) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
                <MessageSquare className="size-10 text-muted-foreground/30" />
                <p className="text-[13px] text-muted-foreground">{errorMessage}</p>
                <Link
                    href="/meet-bot/transcripts"
                    className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
                >
                    <ArrowLeft className="size-3.5" />
                    All transcripts
                </Link>
            </div>
        );
    }

    const speakers = getUniqueSpeakers(transcript);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <Link
                href="/meet-bot/transcripts"
                className="inline-flex w-fit items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3" />
                All transcripts
            </Link>

            <div className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight">Meeting transcript</h1>
                {transcript.createdAt ? (
                    <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                        <Calendar className="size-3.5" />
                        {formatCreatedAt(transcript.createdAt)}
                    </div>
                ) : null}
                <p className="break-all text-[11px] text-muted-foreground">
                    Meeting ID: {transcript.meetingId}
                </p>
                {speakers.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Users className="size-3 shrink-0" />
                        <span>{speakers.length} speaker{speakers.length === 1 ? '' : 's'}:</span>
                        {speakers.map((name) => (
                            <span
                                key={name}
                                className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 font-medium text-foreground/80"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                ) : null}
                <p className="text-[11px] text-muted-foreground">
                    {transcript.segments.length} segment
                    {transcript.segments.length === 1 ? '' : 's'}
                </p>
            </div>

            <TranscriptSegments transcript={transcript} />
        </div>
    );
}
