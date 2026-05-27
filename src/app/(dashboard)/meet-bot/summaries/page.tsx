'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, FileText, LoaderCircle, Search } from 'lucide-react';

import { getAllTranscripts } from '@/lib/api';
import {
    getTranscriptItemDate,
    getTranscriptItemId,
    getTranscriptItemPreview,
    getTranscriptItemTitle,
    normalizeTranscriptList,
    type TranscriptListItem,
} from '@/lib/bot-api';
import { Card, CardContent } from '@/components/ui/card';

const summaryDateFormatter = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

const summaryTimeFormatter = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
});

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
        return dateStr;
    }
    return summaryDateFormatter.format(date);
}

function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    return summaryTimeFormatter.format(date);
}

export default function SummariesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [summaries, setSummaries] = useState<TranscriptListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadSummaries() {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const payload = await getAllTranscripts();
                if (!isMounted) {
                    return;
                }
                setSummaries(normalizeTranscriptList(payload));
            } catch (error) {
                if (!isMounted) {
                    return;
                }
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load transcripts.'
                );
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadSummaries();

        return () => {
            isMounted = false;
        };
    }, []);

    const filtered = summaries.filter((summary) => {
        const title = getTranscriptItemTitle(summary).toLowerCase();
        const preview = getTranscriptItemPreview(summary).toLowerCase();
        const query = searchQuery.toLowerCase();
        return title.includes(query) || preview.includes(query);
    });

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">AI Summaries</h1>
                <p className="text-[13px] text-muted-foreground">
                    AI-generated summaries of your meeting transcripts
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                    aria-label="Search summaries"
                    autoComplete="off"
                    className="w-full rounded-lg border border-border/70 bg-muted/20 py-2 pl-9 pr-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:bg-muted/30 focus-visible:border-primary/40 focus-visible:ring-3 focus-visible:ring-primary/15"
                    name="summary-search"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search summaries…"
                    type="text"
                    value={searchQuery}
                />
            </div>

            {isLoading ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
                    <LoaderCircle className="size-8 animate-spin text-muted-foreground/50" />
                    <p className="text-[13px] text-muted-foreground">Loading summaries…</p>
                </div>
            ) : errorMessage ? (
                <div
                    className="rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-[13px] text-destructive"
                    role="alert"
                >
                    {errorMessage}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
                    <FileText className="size-8 text-muted-foreground/40" />
                    <p className="text-[13px] text-muted-foreground">
                        {searchQuery
                            ? 'No summaries match your search.'
                            : 'No meeting summaries yet. Start recording a meeting to generate AI summaries.'}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map((summary, index) => {
                        const id =
                            getTranscriptItemId(summary) || `transcript-${index}`;
                        const dateStr = getTranscriptItemDate(summary);

                        return (
                            <Link
                                className="rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"
                                href={`/meet-bot/summaries/${encodeURIComponent(id)}`}
                                key={id}
                            >
                                <Card className="group cursor-pointer border-border/60 bg-background transition-all hover:border-border hover:bg-muted/20 hover:shadow-sm">
                                    <CardContent className="flex items-start gap-3 p-3">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/30 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
                                            <FileText className="size-3.5" />
                                        </div>

                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="truncate text-[13px] font-medium text-foreground">
                                                    {getTranscriptItemTitle(summary)}
                                                </h3>

                                                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground/60" />
                                            </div>

                                            <p className="line-clamp-2 text-[12px] leading-[1.4] text-muted-foreground">
                                                {getTranscriptItemPreview(summary)}
                                            </p>

                                            {dateStr ? (
                                                <div className="flex items-center gap-3 pt-0.5 text-[11px] text-muted-foreground/70">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="size-3" />
                                                        {formatDate(dateStr)}
                                                        {formatTime(dateStr)
                                                            ? ` - ${formatTime(dateStr)}`
                                                            : null}
                                                    </span>
                                                    {typeof summary.duration ===
                                                    'string' ? (
                                                        <span>{summary.duration}</span>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
