"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  CheckCircle2,
  Lightbulb,
  FileText,
  BarChart3,
  Clock,
  Calendar,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getMeetingsApiUrl } from "@/lib/meetings-api";

type ScoreBreakdown = Record<string, number>;

type MeetingScore =
  | number
  | {
      final_score?: number;
      rating?: string;
      breakdown?: ScoreBreakdown;
      [key: string]: number | string | ScoreBreakdown | undefined;
    };

type Topic = {
  topic: string;
  relevance_score: number;
};

type ActionItem = {
  task: string;
  assignee?: string;
  deadline?: string;
  priority?: "High" | "Normal" | "Low" | string;
};

type Decision = {
  decision: string;
};

type TranscriptItem = {
  speaker: string;
  text: string;
};

type SpeakerAnalysisEntry = {
  participation_percentage?: number;
  engagement_level?: string;
  word_count?: number;
  effectiveness_score?: number;
};

type MeetingData = {
  id?: number;
  meeting_title: string;
  created_at?: string | number;
  participant_count?: number;
  transcript_length?: number;
  summary?: string;
  topics?: Topic[];
  action_items?: ActionItem[];
  decisions?: Decision[];
  ai_insights?: string[];
  speaker_analysis?: Record<string, SpeakerAnalysisEntry>;
  transcript?: TranscriptItem[];
  score?: MeetingScore;
};

function getScoreBreakdown(score: MeetingScore | undefined) {
  if (!score || typeof score === "number") {
    return null;
  }
  return score.breakdown ?? null;
}

const isNumberEntry = (entry: [string, unknown]): entry is [string, number] =>
  typeof entry[1] === "number";

function isMeetingData(data: unknown): data is MeetingData {
  return (
    data !== null &&
    typeof data === "object" &&
    "meeting_title" in data &&
    typeof (data as MeetingData).meeting_title === "string"
  );
}

function normalizeMeetingResponse(data: unknown, id: string) {
  if (isMeetingData(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    const response = data as {
      meeting?: unknown;
      meetings?: unknown[];
    };

    if (isMeetingData(response.meeting)) {
      return response.meeting;
    }

    if (Array.isArray(response.meetings)) {
      return (
        response.meetings.find(
          (meeting): meeting is MeetingData =>
            isMeetingData(meeting) && String(meeting.id) === id,
        ) ?? null
      );
    }
  }

  return null;
}

export default function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [meeting, setMeeting] = useState<MeetingData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${getMeetingsApiUrl()}/meetings/${resolvedParams.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch meeting");
        return res.json();
      })
      .then((data: unknown) => {
        setMeeting(normalizeMeetingResponse(data, resolvedParams.id));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load meeting details");
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
        <LoaderCircle className="size-10 animate-spin text-muted-foreground/40" />
        <p className="text-[13px] text-muted-foreground">Loading meeting details...</p>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
        <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <FileText className="size-8 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Failed to load meeting
          </h2>
          <p className="text-[13px] text-muted-foreground">{error}</p>
        </div>
        <Button variant="outline" size="sm">
          <Link href="/meetings">
            <ArrowLeft className="size-3.5 mr-1" />
            Back to Meetings
          </Link>
        </Button>
      </div>
    );
  }

  // Calculate final score
  const calculateFinalScore = (scoreObj: MeetingScore | undefined) => {
    if (!scoreObj) return 0;
    if (typeof scoreObj === "number") return scoreObj;
    if (scoreObj.final_score !== undefined) return scoreObj.final_score;

    const breakdown = getScoreBreakdown(scoreObj);
    const scores = Object.values(breakdown ?? scoreObj).filter(
      (val): val is number => typeof val === "number",
    );
    if (scores.length === 0) return 0;
    return scores.reduce((sum, val) => sum + val, 0) / scores.length;
  };

  const score = calculateFinalScore(meeting.score);
  const getScoreColor = (score: number) => {
    if (score >= 80) return { color: "#10b981", label: "Very Good" };
    if (score >= 70) return { color: "#22c55e", label: "Good" };
    if (score >= 60) return { color: "#f59e0b", label: "Average" };
    return { color: "#ef4444", label: "Needs Improvement" };
  };
  const scoreInfo = getScoreColor(score);
  const duration = Math.floor((meeting.transcript_length ?? 0) / 150);
  const createdAt = meeting.created_at ? new Date(meeting.created_at) : null;
  const scoreBreakdown = getScoreBreakdown(meeting.score);
  const createdDateLabel = createdAt
    ? createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown date";
  const createdTimeLabel = createdAt
    ? createdAt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/meetings"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          All meetings
        </Link>
      </div>

      {/* Meeting Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            {meeting.meeting_title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {createdDateLabel}
            </span>
            {createdTimeLabel && (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {createdTimeLabel}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {duration} min
            </span>
          </div>
        </div>

        {/* Score Badge */}
        <Card className="border-border/60 w-fit">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="relative">
              <svg className="size-20" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-muted/30"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke={scoreInfo.color}
                  strokeWidth="6"
                  strokeDasharray={`${score * 2.26} 226`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className="text-xl font-bold"
                  style={{ color: scoreInfo.color }}
                >
                  {score.toFixed(0)}
                </div>
                <div className="text-[10px] text-muted-foreground">/ 100</div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <div
                className="text-[11px] font-semibold"
                style={{ color: scoreInfo.color }}
              >
                {scoreInfo.label}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
              <Users className="size-3.5" />
              Participants
            </div>
            <p className="text-2xl font-semibold">{meeting.participant_count}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
              <MessageSquare className="size-3.5" />
              Topics
            </div>
            <p className="text-2xl font-semibold">{meeting.topics?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
              <CheckCircle2 className="size-3.5" />
              Action Items
            </div>
            <p className="text-2xl font-semibold">{meeting.action_items?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
              <Lightbulb className="size-3.5" />
              Decisions
            </div>
            <p className="text-2xl font-semibold">{meeting.decisions?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/70">
        <nav className="flex gap-6 overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "transcript", label: "Transcript" },
            { id: "actionitems", label: "Action Items" },
            { id: "insights", label: "Insights" },
            { id: "analytics", label: "Analytics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap border-b-2 py-3 text-[13px] font-medium transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pb-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Summary and Topics */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="border-border/60">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    <CardTitle className="text-base">Executive Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[13px] leading-6 text-muted-foreground">
                    {meeting.summary}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="size-4 text-primary" />
                      <CardTitle className="text-base">Top Topics</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {meeting.topics?.slice(0, 3).map((topic, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-[12px] mb-1.5">
                        <span className="font-medium">{topic.topic}</span>
                        <span className="text-muted-foreground">
                          {(topic.relevance_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${topic.relevance_score * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Action Items and Decisions */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="border-border/60">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />
                    <CardTitle className="text-base">Action Items</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {meeting.action_items?.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-2 rounded-lg border border-border/60 bg-muted/20 p-3"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 size-4 shrink-0 rounded border-border"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium mb-1">
                          {item.task}
                        </p>
                        <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                          <span>{item.assignee}</span>
                          {item.deadline && (
                            <>
                              <span>•</span>
                              <span>{item.deadline}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="size-4 text-primary" />
                    <CardTitle className="text-base">Key Decisions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {meeting.decisions?.slice(0, 3).map((decision, index) => (
                    <div
                      key={index}
                      className="flex gap-2 rounded-lg border border-border/60 bg-muted/20 p-3"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                      <p className="text-[12px]">{decision.decision}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            {meeting.ai_insights && meeting.ai_insights.length > 0 && (
              <Card className="border-border/60">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <CardTitle className="text-base">AI Insights</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {meeting.ai_insights.slice(0, 3).map((insight, index) => (
                    <div
                      key={index}
                      className="flex gap-2 rounded-lg border border-border/60 bg-muted/20 p-3"
                    >
                      <Lightbulb className="size-4 shrink-0 text-primary mt-0.5" />
                      <p className="text-[12px]">{insight}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Speaker Analysis */}
            {meeting.speaker_analysis &&
              Object.keys(meeting.speaker_analysis).length > 0 && (
                <Card className="border-border/60">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="size-4 text-primary" />
                      <CardTitle className="text-base">Speaker Analysis</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(meeting.speaker_analysis).map(
                        ([speaker, data]) => {
                          const participation =
                            data.participation_percentage || 0;
                          return (
                            <div
                              key={speaker}
                              className="rounded-lg border border-border/60 bg-muted/20 p-3 text-center"
                            >
                              <div className="relative mx-auto mb-2 size-16">
                                <svg className="size-16" viewBox="0 0 64 64">
                                  <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="5"
                                    className="text-muted"
                                  />
                                  <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="5"
                                    strokeDasharray={`${participation * 1.76} 176`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 32 32)"
                                    className="text-primary"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-sm font-bold">
                                    {participation.toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                              <h3 className="font-semibold text-[12px] mb-0.5">
                                {speaker}
                              </h3>
                              <p className="text-[10px] text-muted-foreground">
                                {data.engagement_level}
                              </p>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        )}

        {/* Transcript Tab */}
        {activeTab === "transcript" && (
          <div className="space-y-3">
            {meeting.transcript?.map((item, index) => (
              <Card key={index} className="border-border/60">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {item.speaker.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[11px] text-primary mb-1">
                        {item.speaker}
                      </div>
                      <p className="text-[12px] leading-5 text-foreground">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Items Tab */}
        {activeTab === "actionitems" && (
          <div className="space-y-3">
            {meeting.action_items?.map((item, index) => (
              <Card key={index} className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 size-4 shrink-0 rounded border-border"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium mb-2">
                        {item.task}
                      </p>
                      <div className="grid gap-2 text-[11px] sm:grid-cols-3">
                        <div>
                          <span className="text-muted-foreground">Assignee: </span>
                          <span className="font-medium">{item.assignee}</span>
                        </div>
                        {item.deadline && (
                          <div>
                            <span className="text-muted-foreground">Deadline: </span>
                            <span className="font-medium">{item.deadline}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Priority: </span>
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                              item.priority === "High"
                                ? "bg-destructive/10 text-destructive"
                                : item.priority === "Normal"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground",
                            )}
                          >
                            {item.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === "insights" && (
          <div className="space-y-3">
            {meeting.ai_insights?.map((insight, index) => (
              <Card key={index} className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Sparkles className="size-4 text-primary" />
                    </div>
                    <p className="text-[12px] leading-6">{insight}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            {/* Score Breakdown */}
            {scoreBreakdown && (
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-base">Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(scoreBreakdown)
                    .filter(isNumberEntry)
                    .map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-[12px] mb-1.5">
                          <span className="font-medium capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-muted-foreground">
                            {value.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            {/* All Topics */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">All Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {meeting.topics?.map((topic, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="font-medium">{topic.topic}</span>
                      <span className="text-muted-foreground">
                        {(topic.relevance_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${topic.relevance_score * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
