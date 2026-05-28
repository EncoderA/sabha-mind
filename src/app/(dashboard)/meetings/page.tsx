"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  AudioLines, 
  Search, 
  Filter, 
  Calendar,
  Users,
  Clock,
  FileText,
  ChevronRight,
  LoaderCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMeetingsApiUrl } from "@/lib/meetings-api";

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
  created_at?: string;
  date?: string;
}

interface MeetingsApiResponse {
  pagination?: {
    total?: number;
  };
  meetings?: Meeting[];
}

function normalizeMeetingsResponse(data: unknown) {
  if (Array.isArray(data)) {
    return {
      meetings: data as Meeting[],
      total: data.length,
    };
  }

  if (data && typeof data === "object") {
    const response = data as MeetingsApiResponse;
    const meetings = Array.isArray(response.meetings) ? response.meetings : [];

    return {
      meetings,
      total:
        typeof response.pagination?.total === "number"
          ? response.pagination.total
          : meetings.length,
    };
  }

  return {
    meetings: [],
    total: 0,
  };
}

const meetingDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

function formatMeetingDate(dateStr?: string) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return meetingDateFormatter.format(date);
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${getMeetingsApiUrl()}/meetings`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch meetings");
        return res.json();
      })
      .then((data: unknown) => {
        const normalized = normalizeMeetingsResponse(data);
        setMeetings(normalized.meetings);
        setTotalMeetings(normalized.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load meetings");
        setLoading(false);
      });
  }, []);

  // Filter meetings based on search query
  const filteredMeetings = useMemo(() => {
    if (!searchQuery.trim()) {
      return meetings;
    }

    const query = searchQuery.toLowerCase();
    return meetings.filter((meeting) => {
      const titleMatch = meeting.meeting_title.toLowerCase().includes(query);
      const summaryMatch = meeting.summary.toLowerCase().includes(query);
      const topicsMatch = meeting.topics?.some((topic) =>
        topic.topic.toLowerCase().includes(query)
      );
      return titleMatch || summaryMatch || topicsMatch;
    });
  }, [searchQuery, meetings]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
        <LoaderCircle className="size-10 animate-spin text-muted-foreground/40" />
        <p className="text-[13px] text-muted-foreground">Loading meetings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
        <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <AudioLines className="size-8 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Failed to load meetings
          </h2>
          <p className="text-[13px] text-muted-foreground">{error}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </div>
    );
  }

  const totalParticipants = meetings.reduce(
    (sum, m) => sum + (m.participant_count || 0),
    0
  );
  const avgTranscriptLength = meetings.length > 0
    ? Math.round(
        meetings.reduce((sum, m) => sum + (m.transcript_length || 0), 0) /
          meetings.length
      )
    : 0;

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Meeting Library</h1>
        <p className="text-[13px] text-muted-foreground">
          Access all your analyzed meetings with AI-powered summaries and insights
        </p>
      </div>

      {/* Stats Cards */}
      {meetings.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <FileText className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Total Meetings
                  </p>
                  <p className="text-2xl font-semibold tracking-tight">
                    {totalMeetings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Users className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Total Participants
                  </p>
                  <p className="text-2xl font-semibold tracking-tight">
                    {totalParticipants}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <TrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Avg. Transcript
                  </p>
                  <p className="text-2xl font-semibold tracking-tight">
                    {avgTranscriptLength}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter Bar */}
      {meetings.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search meetings, topics, or summaries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-muted/20 py-2 pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-muted-foreground/60 focus:bg-muted/30 focus-visible:border-primary/40 focus-visible:ring-3 focus-visible:ring-primary/15"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="size-3.5" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="size-3.5" />
              Date
            </Button>
          </div>
        </div>
      )}

      {/* Meetings Grid */}
      {filteredMeetings.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
          {searchQuery ? (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-muted/50">
                <Search className="size-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  No meetings found
                </h2>
                <p className="text-[13px] text-muted-foreground max-w-sm">
                  No meetings match your search. Try different keywords.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            </>
          ) : (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-muted/50">
                <AudioLines className="size-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  No meetings yet
                </h2>
                <p className="text-[13px] text-muted-foreground max-w-sm">
                  Your analyzed meetings will appear here. Start recording from
                  Google Meet to generate AI-powered summaries.
                </p>
              </div>
              <Button size="sm" className="gap-2">
                <Link href="/meet-bot">
                  <Sparkles className="size-3.5" />
                  Start Recording
                </Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMeetings.map((meeting) => {
            const duration = Math.floor(meeting.transcript_length / 150);
            const dateStr = meeting.created_at || meeting.date;
            const formattedDate = formatMeetingDate(dateStr);

            return (
              <Link
                key={meeting.id}
                href={`/meetings/${meeting.id}`}
                className="group rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"
              >
                <Card className="h-full border-border/60 transition-all hover:border-border hover:bg-muted/20 hover:shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                        <FileText className="size-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[14px] font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {meeting.meeting_title}
                        </h3>
                        {formattedDate && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {formattedDate}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground/60" />
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {meeting.participant_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {duration} min
                      </span>
                    </div>

                    {/* Summary */}
                    <p className="text-[12px] leading-[1.5] text-muted-foreground line-clamp-2">
                      {meeting.summary}
                    </p>

                    {/* Topics */}
                    {meeting.topics && meeting.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {meeting.topics.slice(0, 2).map((topic, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-foreground"
                          >
                            {topic.topic}
                          </span>
                        ))}
                        {meeting.topics.length > 2 && (
                          <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            +{meeting.topics.length - 2}
                          </span>
                        )}
                      </div>
                    )}
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
