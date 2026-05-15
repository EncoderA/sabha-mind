// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { ChevronRight, Clock, FileText, Search } from 'lucide-react';

// import { Card, CardContent } from '@/components/ui/card';
// "use client";


// const summaryDateFormatter = new Intl.DateTimeFormat('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
// });

// const summaryTimeFormatter = new Intl.DateTimeFormat('en-IN', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
// });

// // Placeholder data - replace with actual API calls later.
// const mockSummaries = [
//     {
//         date: '2026-04-21T10:30:00',
//         duration: '45 min',
//         id: 'summary-1',
//         participantCount: 6,
//         preview:
//             'Discussed sprint goals, assigned tickets, and reviewed blockers from last week.',
//         title: 'Weekly Sprint Planning',
//     },
//     {
//         date: '2026-04-18T14:00:00',
//         duration: '32 min',
//         id: 'summary-2',
//         participantCount: 4,
//         preview:
//             'Reviewed Q2 roadmap priorities and realigned timelines for the auth integration.',
//         title: 'Product Roadmap Review',
//     },
//     {
//         date: '2026-04-16T11:00:00',
//         duration: '22 min',
//         id: 'summary-3',
//         participantCount: 3,
//         preview:
//             'Finalized the side panel layout, navigation patterns, and theme toggle placement.',
//         title: 'Design Sync - Add-on UI',
//     },
// ] as const;

// function formatDate(dateStr: string) {
//     return summaryDateFormatter.format(new Date(dateStr));
// }

// function formatTime(dateStr: string) {
//     return summaryTimeFormatter.format(new Date(dateStr));
// }

// export default function SummariesPage() {
//     const [searchQuery, setSearchQuery] = useState('');

//     const filtered = mockSummaries.filter((summary) =>
//         summary.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <div className="flex flex-1 flex-col gap-3 p-4">
//             <div className="relative">
//                 <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
//                 <input
//                     aria-label="Search summaries"
//                     autoComplete="off"
//                     className="w-full rounded-lg border border-border/70 bg-muted/20 py-2 pl-9 pr-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:bg-muted/30 focus-visible:border-primary/40 focus-visible:ring-3 focus-visible:ring-primary/15"
//                     name="summary-search"
//                     onChange={(event) => setSearchQuery(event.target.value)}
//                     placeholder="Search summaries…"
//                     type="text"
//                     value={searchQuery}
//                 />
//             </div>

//             {filtered.length === 0 ? (
//                 <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
//                     <FileText className="size-8 text-muted-foreground/40" />
//                     <p className="text-[13px] text-muted-foreground">
//                         {searchQuery
//                             ? 'No summaries match your search.'
//                             : 'No meeting summaries yet.'}
//                     </p>
//                 </div>
//             ) : (
//                 <div className="flex flex-col gap-2">
//                     {filtered.map((summary) => (
//                         <Link
//                             className="rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"
//                             key={summary.id}
//                             href={`/meet-addon/summaries/${summary.id}`}
//                         >
//                             <Card className="group cursor-pointer border-border/60 bg-background transition-all hover:border-border hover:bg-muted/20 hover:shadow-sm">
//                                 <CardContent className="flex items-start gap-3 p-3">
//                                     <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/30 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
//                                         <FileText className="size-3.5" />
//                                     </div>
//                                     <div className="min-w-0 flex-1 space-y-1">
//                                         <div className="flex items-center justify-between gap-2">
//                                             <h3 className="truncate text-[13px] font-medium text-foreground">
//                                                 {summary.title}
//                                             </h3>
//                                             <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground/60" />
//                                         </div>
//                                         <p className="line-clamp-2 text-[12px] leading-[1.4] text-muted-foreground">
//                                             {summary.preview}
//                                         </p>
//                                         <div className="flex items-center gap-3 pt-0.5 text-[11px] text-muted-foreground/70">
//                                             <span className="flex items-center gap-1">
//                                                 <Clock className="size-3" />
//                                                 {formatDate(summary.date)} -{' '}
//                                                 {formatTime(summary.date)}
//                                             </span>
//                                             <span>{summary.duration}</span>
//                                             <span>
//                                                 {summary.participantCount} participants
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </Link>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, FileText, Search } from 'lucide-react';

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

// Placeholder data - replace with actual API calls later.
const mockSummaries = [
    {
        date: '2026-04-21T10:30:00',
        duration: '45 min',
        id: 'summary-1',
        participantCount: 6,
        preview:
            'Discussed sprint goals, assigned tickets, and reviewed blockers from last week.',
        title: 'Weekly Sprint Planning',
    },
    {
        date: '2026-04-18T14:00:00',
        duration: '32 min',
        id: 'summary-2',
        participantCount: 4,
        preview:
            'Reviewed Q2 roadmap priorities and realigned timelines for the auth integration.',
        title: 'Product Roadmap Review',
    },
    {
        date: '2026-04-16T11:00:00',
        duration: '22 min',
        id: 'summary-3',
        participantCount: 3,
        preview:
            'Finalized the side panel layout, navigation patterns, and theme toggle placement.',
        title: 'Design Sync - Add-on UI',
    },
] as const;

function formatDate(dateStr: string) {
    return summaryDateFormatter.format(new Date(dateStr));
}

function formatTime(dateStr: string) {
    return summaryTimeFormatter.format(new Date(dateStr));
}

export default function SummariesPage() {

    const [searchQuery, setSearchQuery] = useState('');

    const filtered = mockSummaries.filter((summary) =>
        summary.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-1 flex-col gap-3 p-4">
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

            {filtered.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
                    <FileText className="size-8 text-muted-foreground/40" />
                    <p className="text-[13px] text-muted-foreground">
                        {searchQuery
                            ? 'No summaries match your search.'
                            : 'No meeting summaries yet.'}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map((summary) => (
                        <Link
                            className="rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"
                            key={summary.id}
                            href={`/meet-addon/summaries/${summary.id}`}
                        >
                            <Card className="group cursor-pointer border-border/60 bg-background transition-all hover:border-border hover:bg-muted/20 hover:shadow-sm">
                                <CardContent className="flex items-start gap-3 p-3">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/30 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
                                        <FileText className="size-3.5" />
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1">

                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="truncate text-[13px] font-medium text-foreground">
                                                {summary.title}
                                            </h3>

                                            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground/60" />
                                        </div>

                                        <p className="line-clamp-2 text-[12px] leading-[1.4] text-muted-foreground">
                                            {summary.preview}
                                        </p>

                                        <div className="flex items-center gap-3 pt-0.5 text-[11px] text-muted-foreground/70">
                                            <span className="flex items-center gap-1">
                                                <Clock className="size-3" />
                                                {formatDate(summary.date)} -{' '}
                                                {formatTime(summary.date)}
                                            </span>

                                            <span>{summary.duration}</span>

                                            <span>
                                                {summary.participantCount} participants
                                            </span>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
