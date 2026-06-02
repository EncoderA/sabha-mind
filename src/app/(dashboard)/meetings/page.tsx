"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  AudioLines, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  Users,
  Clock,
  FileText,
  ChevronRight,
  LoaderCircle,
  Sparkles,
  TrendingUp,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Timer,
  Zap,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMeetingsApiUrl } from "@/lib/meetings-api";
import { cn } from "@/lib/utils";

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

type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

type SortOption = "date-desc" | "date-asc" | "participants-desc" | "participants-asc" | "duration-desc" | "duration-asc";

const WORDS_PER_MINUTE = 150;

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [participantFilter, setParticipantFilter] = useState<string>("all");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

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

  // Helper function to get quick date ranges
  const getQuickDateRange = (preset: string): DateRange => {
    const today = new Date();
    const from = new Date();
    
    switch (preset) {
      case "today":
        from.setHours(0, 0, 0, 0);
        return { from, to: new Date() };
      case "yesterday":
        from.setDate(today.getDate() - 1);
        from.setHours(0, 0, 0, 0);
        const yesterday = new Date(from);
        yesterday.setHours(23, 59, 59, 999);
        return { from, to: yesterday };
      case "last7":
        from.setDate(today.getDate() - 7);
        from.setHours(0, 0, 0, 0);
        return { from, to: new Date() };
      case "last30":
        from.setDate(today.getDate() - 30);
        from.setHours(0, 0, 0, 0);
        return { from, to: new Date() };
      case "thisWeek":
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        from.setDate(diff);
        from.setHours(0, 0, 0, 0);
        return { from, to: new Date() };
      case "thisMonth":
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        return { from, to: new Date() };
      default:
        return { from: undefined, to: undefined };
    }
  };

  // Filter and sort meetings
  const filteredAndSortedMeetings = useMemo(() => {
    // First, filter meetings
    let filtered = meetings.filter((meeting) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = meeting.meeting_title.toLowerCase().includes(query);
        const summaryMatch = meeting.summary.toLowerCase().includes(query);
        const topicsMatch = meeting.topics?.some((topic) =>
          topic.topic.toLowerCase().includes(query)
        );
        if (!titleMatch && !summaryMatch && !topicsMatch) {
          return false;
        }
      }

      // Participant count filter
      if (participantFilter !== "all") {
        const count = meeting.participant_count || 0;
        if (participantFilter === "1-3" && (count < 1 || count > 3)) return false;
        if (participantFilter === "4-10" && (count < 4 || count > 10)) return false;
        if (participantFilter === "11+" && count < 11) return false;
      }

      // Duration filter
      if (durationFilter !== "all") {
        const duration = Math.floor((meeting.transcript_length || 0) / WORDS_PER_MINUTE);
        if (durationFilter === "short" && duration >= 15) return false;
        if (durationFilter === "medium" && (duration < 15 || duration >= 45)) return false;
        if (durationFilter === "long" && (duration < 45 || duration >= 90)) return false;
        if (durationFilter === "verylong" && duration < 90) return false;
      }

      // Date range filter
      if (dateRange.from) {
        const meetingDate = new Date(meeting.created_at || meeting.date || "");
        if (isNaN(meetingDate.getTime())) return true;
        
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        
        if (meetingDate < fromDate) return false;
        
        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (meetingDate > toDate) return false;
        }
      }

      return true;
    });

    // Then, sort meetings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc": {
          const dateA = new Date(a.created_at || a.date || 0).getTime();
          const dateB = new Date(b.created_at || b.date || 0).getTime();
          return dateB - dateA;
        }
        case "date-asc": {
          const dateA = new Date(a.created_at || a.date || 0).getTime();
          const dateB = new Date(b.created_at || b.date || 0).getTime();
          return dateA - dateB;
        }
        case "participants-desc":
          return (b.participant_count || 0) - (a.participant_count || 0);
        case "participants-asc":
          return (a.participant_count || 0) - (b.participant_count || 0);
        case "duration-desc":
          return (b.transcript_length || 0) - (a.transcript_length || 0);
        case "duration-asc":
          return (a.transcript_length || 0) - (b.transcript_length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, meetings, participantFilter, durationFilter, dateRange, sortBy]);

  // Check if any filters are active
  const hasActiveFilters = 
    participantFilter !== "all" || 
    durationFilter !== "all" || 
    dateRange.from !== undefined;

  // Clear all filters
  const clearFilters = () => {
    setParticipantFilter("all");
    setDurationFilter("all");
    setDateRange({ from: undefined, to: undefined });
    setSortBy("date-desc");
  };

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
        <div className="flex flex-col gap-3">
          {/* Search and Filters Row */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Search Bar - Expands to fill space */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search meetings, topics, or summaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border/70 bg-muted/20 py-2 pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-muted-foreground/60 focus:bg-muted/30 focus-visible:border-primary/40 focus-visible:ring-3 focus-visible:ring-primary/15"
              />
            </div>

            {/* Filters - Compact row */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[140px] h-9 text-[13px] border-border/70">
                  <ArrowUpDown className="size-3.5 mr-1.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="size-3.5" />
                      Newest First
                    </div>
                  </SelectItem>
                  <SelectItem value="date-asc">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="size-3.5" />
                      Oldest First
                    </div>
                  </SelectItem>
                  <SelectItem value="participants-desc">
                    <div className="flex items-center gap-2">
                      <Users className="size-3.5" />
                      Most Participants
                    </div>
                  </SelectItem>
                  <SelectItem value="participants-asc">
                    <div className="flex items-center gap-2">
                      <Users className="size-3.5" />
                      Least Participants
                    </div>
                  </SelectItem>
                  <SelectItem value="duration-desc">
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5" />
                      Longest First
                    </div>
                  </SelectItem>
                  <SelectItem value="duration-asc">
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5" />
                      Shortest First
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Participant Filter */}
              <Select value={participantFilter} onValueChange={setParticipantFilter}>
                <SelectTrigger className="w-[130px] h-9 text-[13px] border-border/70">
                  <Users className="size-3.5 mr-1.5" />
                  <SelectValue placeholder="Participants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Participants</SelectItem>
                  <SelectItem value="1-3">1-3 People</SelectItem>
                  <SelectItem value="4-10">4-10 People</SelectItem>
                  <SelectItem value="11+">11+ People</SelectItem>
                </SelectContent>
              </Select>

              {/* Duration Filter */}
              <Select value={durationFilter} onValueChange={setDurationFilter}>
                <SelectTrigger className="w-[120px] h-9 text-[13px] border-border/70">
                  <Timer className="size-3.5 mr-1.5" />
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Durations</SelectItem>
                  <SelectItem value="short">Short (&lt; 15 min)</SelectItem>
                  <SelectItem value="medium">Medium (15-45 min)</SelectItem>
                  <SelectItem value="long">Long (45-90 min)</SelectItem>
                  <SelectItem value="verylong">Very Long (90+ min)</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-2 text-[13px] h-9 border-border/70 w-[140px]",
                      dateRange.from && "text-primary border-primary/40"
                    )}
                  >
                    <CalendarIcon className="size-3.5" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {dateRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                          {dateRange.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </>
                      ) : (
                        dateRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      )
                    ) : (
                      "Date Range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 max-w-[min(90vw,800px)]" align="end" sideOffset={8}>
                  {/* Quick Date Presets */}
                  <div className="border-b border-border/70 p-3 bg-muted/20">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Quick Select
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDateRange(getQuickDateRange("today"))}
                        className="h-7 text-[10px] border-border/60 px-2"
                      >
                        <Zap className="size-2.5 mr-1" />
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDateRange(getQuickDateRange("yesterday"))}
                        className="h-7 text-[10px] border-border/60 px-2"
                      >
                        Yesterday
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDateRange(getQuickDateRange("last7"))}
                        className="h-7 text-[10px] border-border/60 px-2"
                      >
                        Last 7 Days
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDateRange(getQuickDateRange("thisWeek"))}
                        className="h-7 text-[10px] border-border/60 px-2"
                      >
                        This Week
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDateRange(getQuickDateRange("last30"))}
                        className="h-7 text-[10px] border-border/60 px-2"
                      >
                        Last 30 Days
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDateRange(getQuickDateRange("thisMonth"))}
                        className="h-7 text-[10px] border-border/60 px-2"
                      >
                        This Month
                      </Button>
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="p-3">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => {
                        if (range) {
                          setDateRange({ from: range.from, to: range.to });
                        } else {
                          setDateRange({ from: undefined, to: undefined });
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </div>
                  <div className="border-t border-border/70 p-2 flex justify-between bg-muted/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDateRange({ from: undefined, to: undefined })}
                      className="text-[11px] h-7"
                    >
                      Clear
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-medium text-muted-foreground">Active filters:</span>
              {participantFilter !== "all" && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-muted/50">
                  <Users className="size-3 text-primary" />
                  {participantFilter === "1-3" && "1-3 People"}
                  {participantFilter === "4-10" && "4-10 People"}
                  {participantFilter === "11+" && "11+ People"}
                  <button
                    onClick={() => setParticipantFilter("all")}
                    className="ml-0.5 hover:text-foreground transition-colors"
                    aria-label="Remove participant filter"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}
              {durationFilter !== "all" && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-muted/50">
                  <Timer className="size-3 text-amber-600 dark:text-amber-400" />
                  {durationFilter === "short" && "Short"}
                  {durationFilter === "medium" && "Medium"}
                  {durationFilter === "long" && "Long"}
                  {durationFilter === "verylong" && "Very Long"}
                  <button
                    onClick={() => setDurationFilter("all")}
                    className="ml-0.5 hover:text-foreground transition-colors"
                    aria-label="Remove duration filter"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}
              {dateRange.from && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-muted/50">
                  <CalendarIcon className="size-3 text-emerald-600 dark:text-emerald-400" />
                  {dateRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {dateRange.to && ` - ${dateRange.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                  <button
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
                    className="ml-0.5 hover:text-foreground transition-colors"
                    aria-label="Remove date filter"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 text-[11px] px-2 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Meetings Grid */}
      {filteredAndSortedMeetings.length === 0 ? (
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
              <Link href="/meet-bot">
                <Button size="sm" className="gap-2">
                  <Sparkles className="size-3.5" />
                  Start Recording
                </Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedMeetings.map((meeting) => {
            const duration = Math.floor(meeting.transcript_length / WORDS_PER_MINUTE);
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
