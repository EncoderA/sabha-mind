'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Users, FileText, ExternalLink } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const mockSummaries: Record<string, {
    title: string;
    date: string;
    duration: string;
    participantCount: number;
    participants: string[];
    summary: string;
    keyPoints: string[];
    actionItems: string[];
}> = {
    'summary-1': {
        title: 'Weekly Sprint Planning',
        date: '2026-04-21T10:30:00',
        duration: '45 min',
        participantCount: 6,
        participants: ['Arjun S.', 'Priya K.', 'Rahul M.', 'Sneha D.', 'Vikram R.', 'Ananya P.'],
        summary: 'The team discussed sprint goals for the upcoming week, reviewed outstanding tickets from the previous sprint, and identified potential blockers. Backend authentication integration was prioritized as the primary focus area.',
        keyPoints: [
            'Sprint velocity from last week was 34 points, slightly below target.',
            'OAuth integration with Google is the top priority for this sprint.',
            'Design review for the Meet add-on sidebar is complete.',
            'Performance testing for the transcription pipeline should begin mid-week.',
        ],
        actionItems: [
            'Arjun: Complete OAuth flow implementation by Wednesday.',
            'Priya: Finalize the summary card component designs.',
            'Rahul: Set up load testing environment for the transcription service.',
            'Sneha: Write integration tests for the Meet SDK initialization.',
        ],
    },
    'summary-2': {
        title: 'Product Roadmap Review',
        date: '2026-04-18T14:00:00',
        duration: '32 min',
        participantCount: 4,
        participants: ['Arjun S.', 'Priya K.', 'Vikram R.', 'Manager N.'],
        summary: 'Reviewed the Q2 roadmap and discussed timeline adjustments. The authentication module needs an additional week, pushing the public beta to the second week of May.',
        keyPoints: [
            'Public beta timeline shifted to May 12th.',
            'Meet add-on marketplace submission requires additional security review.',
            'Real-time collaboration features moved to Q3.',
        ],
        actionItems: [
            'Vikram: Update the project timeline in Jira.',
            'Arjun: Prepare the security review documentation.',
        ],
    },
    'summary-3': {
        title: 'Design Sync — Add-on UI',
        date: '2026-04-16T11:00:00',
        duration: '22 min',
        participantCount: 3,
        participants: ['Priya K.', 'Sneha D.', 'Ananya P.'],
        summary: 'Finalized the side panel layout for the Meet add-on. Agreed on tab-based navigation with Home and Summaries sections. Theme toggle will be placed in the header alongside the website link.',
        keyPoints: [
            'Tab navigation with active indicator approved.',
            'Summary cards should show preview text, date, and participant count.',
            'Dark mode should persist across sessions using next-themes.',
        ],
        actionItems: [
            'Priya: Export final design assets to Figma.',
            'Sneha: Implement the addon header component.',
        ],
    },
};

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
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
                <Link href="/meet-addon/summaries">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="size-3.5" />
                        Back to summaries
                    </Button>
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
                <div className='flex items-center gap-2 justify-between'>
                    <h2 className="text-base font-semibold tracking-tight">{summary.title}</h2>
                    <Link
                        href="https://sabha-mind.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs")}
                        title="Open Sabha Mind website"
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
                        {formatTime(summary.date)} · {summary.duration}
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
                    <div className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground/70 uppercase">
                        Summary
                    </div>
                    <p className="mt-2 text-[13px] leading-[1.6] text-foreground/90">
                        {summary.summary}
                    </p>
                </CardContent>
            </Card>

            <Card className="border-border/60">
                <CardContent className="p-3">
                    <div className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground/70 uppercase">
                        Key Points
                    </div>
                    <ul className="mt-2 space-y-1.5">
                        {summary.keyPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-[12px] leading-[1.5] text-foreground/85">
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                                {point}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card className="border-border/60">
                <CardContent className="p-3">
                    <div className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground/70 uppercase">
                        Action Items
                    </div>
                    <ul className="mt-2 space-y-1.5">
                        {summary.actionItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-[12px] leading-[1.5] text-foreground/85">
                                <span className="mt-[5px] flex size-3.5 shrink-0 items-center justify-center rounded border border-border/70 text-[9px] text-muted-foreground">
                                    {i + 1}
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
