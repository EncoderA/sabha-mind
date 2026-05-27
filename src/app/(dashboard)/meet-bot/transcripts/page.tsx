'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    ChevronRight,
    Clock,
    FileText,
    LoaderCircle,
    MessageSquare,
    Search,
} from 'lucide-react';

import { getAllTranscripts } from '@/lib/api';
import {
    getSegmentCount,
    getTranscriptItemDate,
    getTranscriptItemId,
    getTranscriptItemPreview,
    getTranscriptItemTitle,
    normalizeTranscriptList,
    type TranscriptListItem,
} from '@/lib/bot-api';
import { Card, CardContent } from '@/components/ui/card';

const transcriptDateFormatter = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
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

export default function TranscriptsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [transcripts, setTranscripts] = useState<TranscriptListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadTranscripts() {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const payload = await getAllTranscripts();
                if (!isMounted) {
                    return;
                }
                setTranscripts(normalizeTranscriptList(payload));
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

        void loadTranscripts();

        return () => {
            isMounted = false;
        };
    }, []);

    const filtered = transcripts.filter((item) => {
        const title = getTranscriptItemTitle(item).toLowerCase();
        const preview = getTranscriptItemPreview(item).toLowerCase();
        const id = getTranscriptItemId(item).toLowerCase();
        const query = searchQuery.toLowerCase();
        return (
            title.includes(query) ||
            preview.includes(query) ||
            id.includes(query)
        );
    });

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">Transcripts</h1>
                <p className="text-[13px] text-muted-foreground">
                    View and search all your meeting transcripts
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                    aria-label="Search transcripts"
                    autoComplete="off"
                    className="w-full rounded-lg border border-border/70 bg-muted/20 py-2 pl-9 pr-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:bg-muted/30 focus-visible:border-primary/40 focus-visible:ring-3 focus-visible:ring-primary/15"
                    name="transcript-search"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by meeting or speaker…"
                    type="text"
                    value={searchQuery}
                />
            </div>

            {isLoading ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
                    <LoaderCircle className="size-8 animate-spin text-muted-foreground/50" />
                    <p className="text-[13px] text-muted-foreground">Loading transcripts…</p>
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
                            ? 'No transcripts match your search.'
                            : 'No transcripts yet. Start recording a meeting to generate transcripts.'}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map((item, index) => {
                        const id =
                            getTranscriptItemId(item) || `transcript-${index}`;
                        const dateStr = getTranscriptItemDate(item);
                        const segmentCount = getSegmentCount(item);

                        return (
                            <Link
                                className="rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"
                                href={`/meet-bot/transcripts/${encodeURIComponent(id)}`}
                                key={id}
                            >
                                <Card className="group cursor-pointer border-border/60 bg-background transition-all hover:border-border hover:bg-muted/20 hover:shadow-sm">
                                    <CardContent className="flex items-start gap-3 p-3">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/30 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
                                            <MessageSquare className="size-3.5" />
                                        </div>

                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="truncate text-[13px] font-medium text-foreground">
                                                    {getTranscriptItemTitle(item)}
                                                </h3>
                                                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground/60" />
                                            </div>

                                            <p className="line-clamp-2 text-[12px] leading-[1.4] text-muted-foreground">
                                                {getTranscriptItemPreview(item)}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px] text-muted-foreground/70">
                                                {dateStr ? (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="size-3" />
                                                        {formatCreatedAt(dateStr)}
                                                    </span>
                                                ) : null}
                                                {segmentCount > 0 ? (
                                                    <span>
                                                        {segmentCount} segment
                                                        {segmentCount === 1 ? '' : 's'}
                                                    </span>
                                                ) : null}
                                            </div>
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
