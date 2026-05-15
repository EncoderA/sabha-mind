'use client';

import { use } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Clock,
    ExternalLink,
    FileText,
    Users,
} from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const summaryDateFormatter = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
});

const summaryTimeFormatter = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
});

const mockSummaries: Record<
    string,
    {
        actionItems: string[];
        date: string;
        duration: string;
        keyPoints: string[];
        participantCount: number;
        participants: string[];
        summary: string;
        title: string;
    }
> = {
    'summary-1': {
        actionItems: [
            'Arjun: Complete OAuth flow implementation by Wednesday.',
            'Priya: Finalize the summary card component designs.',
            'Rahul: Set up load testing environment for the transcription service.',
            'Sneha: Write integration tests for the Meet SDK initialization.',
        ],
        date: '2026-04-21T10:30:00',
        duration: '45 min',
        keyPoints: [
            'Sprint velocity from last week was 34 points, slightly below target.',
            'OAuth integration with Google is the top priority for this sprint.',
            'Design review for the Meet add-on sidebar is complete.',
            'Performance testing for the transcription pipeline should begin mid-week.',
        ],
        participantCount: 6,
        participants: [
            'Arjun S.',
            'Priya K.',
            'Rahul M.',
            'Sneha D.',
            'Vikram R.',
            'Ananya P.',
        ],
        summary:
            'The team discussed sprint goals for the upcoming week, reviewed outstanding tickets from the previous sprint, and identified potential blockers. Backend authentication integration was prioritized as the primary focus area.',
        title: 'Weekly Sprint Planning',
    },
    'summary-2': {
        actionItems: [
            'Vikram: Update the project timeline in Jira.',
            'Arjun: Prepare the security review documentation.',
        ],
        date: '2026-04-18T14:00:00',
        duration: '32 min',
        keyPoints: [
            'Public beta timeline shifted to May 12th.',
            'Meet add-on marketplace submission requires additional security review.',
            'Real-time collaboration features moved to Q3.',
        ],
        participantCount: 4,
        participants: ['Arjun S.', 'Priya K.', 'Vikram R.', 'Manager N.'],
        summary:
            'Reviewed the Q2 roadmap and discussed timeline adjustments. The authentication module needs an additional week, pushing the public beta to the second week of May.',
        title: 'Product Roadmap Review',
    },
    'summary-3': {
        actionItems: [
            'Priya: Export final design assets to Figma.',
            'Sneha: Implement the addon header component.',
        ],
        date: '2026-04-16T11:00:00',
        duration: '22 min',
        keyPoints: [
            'Tab navigation with active indicator approved.',
            'Summary cards should show preview text, date, and participant count.',
            'Dark mode should persist across sessions using next-themes.',
        ],
        participantCount: 3,
        participants: ['Priya K.', 'Sneha D.', 'Ananya P.'],
        summary:
            'Finalized the side panel layout for the Meet add-on. Agreed on tab-based navigation with Home and Summaries sections. Theme toggle will be placed in the header alongside the website link.',
        title: 'Design Sync - Add-on UI',
    },
};

function formatDate(dateStr: string) {
    return summaryDateFormatter.format(new Date(dateStr));
}

function formatTime(dateStr: string) {
    return summaryTimeFormatter.format(new Date(dateStr));
}

export default function SummaryDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const summary = mockSummaries[id];

    if (!summary) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
                <FileText className="size-10 text-muted-foreground/30" />
                <p className="text-[13px] text-muted-foreground">Summary not found.</p>
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
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold tracking-tight">
                        {summary.title}
                    </h2>
                    <Link
                        href="https://vartaiq.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            buttonVariants({ size: 'sm', variant: 'outline' }),
                            'text-xs'
                        )}
                        title="Open VartaIQ website"
                    >
                        <ExternalLink className="size-3" />
                        Open Full Summary
                    </Link>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(summary.date)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {formatTime(summary.date)} - {summary.duration}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {summary.participantCount} participants
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {summary.participants.map((name) => (
                    <span
                        key={name}
                        className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-foreground/80"
                    >
                        {name}
                    </span>
                ))}
            </div>

            <Card className="border-border/60">
                <CardContent className="p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                        Summary
                    </div>
                    <p className="mt-2 text-[13px] leading-[1.6] text-foreground/90">
                        {summary.summary}
                    </p>
                </CardContent>
            </Card>

            <Card className="border-border/60">
                <CardContent className="p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                        Key Points
                    </div>
                    <ul className="mt-2 space-y-1.5">
                        {summary.keyPoints.map((point, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-2 text-[12px] leading-[1.5] text-foreground/85"
                            >
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                                {point}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card className="border-border/60">
                <CardContent className="p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                        Action Items
                    </div>
                    <ul className="mt-2 space-y-1.5">
                        {summary.actionItems.map((item, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-2 text-[12px] leading-[1.5] text-foreground/85"
                            >
                                <span className="mt-[5px] flex size-3.5 shrink-0 items-center justify-center rounded border border-border/70 text-[9px] text-muted-foreground">
                                    {index + 1}
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
