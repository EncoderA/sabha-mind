'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    FileText,
    LoaderCircle,
} from 'lucide-react';

import { getMeetingTranscript, getTranscriptDirect } from '@/lib/api';
import { extractTranscriptBody } from '@/lib/bot-api';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const summaryDateFormatter = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
});

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
        return dateStr;
    }
    return summaryDateFormatter.format(date);
}

export default function SummaryDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: meetingId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [dateLabel, setDateLabel] = useState('');
    const [transcriptBody, setTranscriptBody] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadTranscript() {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const [wrapped, direct] = await Promise.all([
                    getMeetingTranscript(meetingId).catch(() => null),
                    getTranscriptDirect(meetingId).catch(() => null),
                ]);

                if (!isMounted) {
                    return;
                }

                const body = extractTranscriptBody(wrapped, direct);
                if (!body) {
                    setErrorMessage('Transcript not found for this meeting.');
                    return;
                }

                const record =
                    wrapped && typeof wrapped === 'object'
                        ? (wrapped as Record<string, unknown>)
                        : null;

                const resolvedTitle =
                    (typeof record?.title === 'string' && record.title) ||
                    `Meeting ${meetingId}`;
                const resolvedDate =
                    (typeof record?.createdAt === 'string' && record.createdAt) ||
                    (typeof record?.date === 'string' && record.date) ||
                    '';

                setTitle(resolvedTitle);
                setDateLabel(resolvedDate);
                setTranscriptBody(body);
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

    if (errorMessage) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
                <FileText className="size-10 text-muted-foreground/30" />
                <p className="text-[13px] text-muted-foreground">{errorMessage}</p>
                <Link
                    href="/meet-addon/summaries"
                    className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
                >
                    <ArrowLeft className="size-3.5" />
                    Back to summaries
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-3 p-4">
            <Link
                href="/meet-addon/summaries"
                className="inline-flex w-fit items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3" />
                All summaries
            </Link>

            <div className="space-y-2">
                <h2 className="text-base font-semibold tracking-tight">{title}</h2>
                {dateLabel ? (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="size-3" />
                        {formatDate(dateLabel)}
                    </div>
                ) : null}
                <p className="text-[11px] text-muted-foreground">Meeting ID: {meetingId}</p>
            </div>

            <Card className="border-border/60">
                <CardContent className="p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                        Transcript
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-[13px] leading-[1.6] text-foreground/90">
                        {transcriptBody}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
