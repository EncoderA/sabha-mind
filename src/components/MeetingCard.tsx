"use client";

import Link from "next/link";
import { Users, FileText, ChevronRight, Clock } from "lucide-react";

interface Topic {
  topic: string;
  relevance_score: number;
}

interface Meeting {
  id: number;
  meeting_title: string;
  participant_count: number;
  transcript_length: number;
  summary: string;
  topics: Topic[];
}

export default function MeetingCard({
  meeting,
}: {
  meeting: Meeting;
}) {
  const duration = Math.floor(meeting.transcript_length / 150);

  return (
    <Link href={`/meetings/${meeting.id}`} className="group">
      <div className="h-full rounded-lg border border-border/70 bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/70 p-5">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
              <FileText className="size-5 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold font-heading text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                {meeting.meeting_title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" />
                  {meeting.participant_count}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {duration} min
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Summary */}
          <p className="text-sm leading-6 text-muted-foreground line-clamp-3">
            {meeting.summary}
          </p>

          {/* Topics */}
          {meeting.topics && meeting.topics.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Key Topics</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {meeting.topics.slice(0, 3).map((topic, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full border border-border/70 bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-foreground"
                  >
                    {topic.topic}
                  </span>
                ))}
                {meeting.topics.length > 3 && (
                  <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    +{meeting.topics.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}