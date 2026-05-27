'use client';

import Link from 'next/link';
import { ChevronRight, LoaderCircle } from 'lucide-react';
import {
    getTranscriptItemId,
    getTranscriptItemPreview,
    getTranscriptItemTitle,
    type TranscriptListItem,
} from '@/lib/bot-api';

type RecentTranscriptsProps = {
    transcripts: TranscriptListItem[];
    isLoading: boolean;
    basePath?: string;
};

export function RecentTranscripts({
    transcripts,
    isLoading,
    basePath = '/meet-addon/transcripts',
}: RecentTranscriptsProps) {
    const recentTranscripts = transcripts.slice(0, 3);

    return (
        <section className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
                <h2 className="text-[13px] font-semibold text-foreground">
                    Recent transcripts
                </h2>
                <Link
                    className="flex items-center gap-0.5 text-[12px] font-medium text-primary hover:underline"
                    href={basePath}
                >
                    See all
                    <ChevronRight className="size-3.5" />
                </Link>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/70 py-8 text-[13px] text-muted-foreground">
                    <LoaderCircle className="size-4 animate-spin" />
                    Loading…
                </div>
            ) : recentTranscripts.length > 0 ? (
                <ul className="space-y-2">
                    {recentTranscripts.map((item, index) => {
                        const id = getTranscriptItemId(item) || `transcript-${index}`;

                        return (
                            <li key={id}>
                                <Link
                                    className="block rounded-lg border border-border/60 bg-background p-3 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"
                                    href={`${basePath}/${encodeURIComponent(id)}`}
                                >
                                    <p className="text-[13px] font-medium text-foreground">
                                        {getTranscriptItemTitle(item)}
                                    </p>
                                    <p className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">
                                        {getTranscriptItemPreview(item)}
                                    </p>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="rounded-lg border border-dashed border-border/70 py-8 text-center text-[13px] text-muted-foreground">
                    Your transcripts will show up here after you record a meeting.
                </p>
            )}
        </section>
    );
}
