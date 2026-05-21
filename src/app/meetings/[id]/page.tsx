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
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const API_URL = "http://127.0.0.1:8000";

export default function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [meeting, setMeeting] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetch(`${API_URL}/meetings/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        setMeeting(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [resolvedParams.id]);

  if (!meeting) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading meeting details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate final score from all score components
  const calculateFinalScore = (scoreObj: any) => {
    if (!scoreObj) return 0;
    if (typeof scoreObj === 'number') return scoreObj;
    if (scoreObj.final_score !== undefined) return scoreObj.final_score;
    
    // Calculate average of all score components
    const scores = Object.values(scoreObj).filter((val): val is number => typeof val === 'number');
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
  const duration = Math.floor(meeting.transcript_length / 150);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="border-b border-border/70 bg-muted/20">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <Link
              href="/meetings"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="size-4" />
              Back to Meetings
            </Link>

            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <FileText className="size-7 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl mb-3">
                      {meeting.meeting_title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-4" />
                        {new Date(meeting.created_at || Date.now()).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-4" />
                        {new Date(meeting.created_at || Date.now()).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-4" />
                        {duration} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Badge */}
              <div className="flex flex-col items-center rounded-lg border border-border/70 bg-background/90 p-6 shadow-sm">
                <div className="relative">
                  <svg className="size-28" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/30"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke={scoreInfo.color}
                      strokeWidth="8"
                      strokeDasharray={`${score * 3.39} 339`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold font-heading" style={{ color: scoreInfo.color }}>
                      {score.toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">/ 100</div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-sm font-semibold" style={{ color: scoreInfo.color }}>
                    {scoreInfo.label}
                  </div>
                  <div className="text-xs text-muted-foreground">Meeting Score</div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
                <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <Users className="size-3.5" />
                  Participants
                </dt>
                <dd className="font-heading text-2xl font-semibold text-foreground">
                  {meeting.participant_count}
                </dd>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
                <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <MessageSquare className="size-3.5" />
                  Topics
                </dt>
                <dd className="font-heading text-2xl font-semibold text-foreground">
                  {meeting.topics?.length || 0}
                </dd>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
                <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <CheckCircle2 className="size-3.5" />
                  Action Items
                </dt>
                <dd className="font-heading text-2xl font-semibold text-foreground">
                  {meeting.action_items?.length || 0}
                </dd>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
                <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <Lightbulb className="size-3.5" />
                  Decisions
                </dt>
                <dd className="font-heading text-2xl font-semibold text-foreground">
                  {meeting.decisions?.length || 0}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Tabs */}
        <section className="border-b border-border/70 bg-background sticky top-0 z-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <nav className="flex gap-8 overflow-x-auto">
              {["Overview", "Transcript", "Action Items", "Insights", "Analytics"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(" ", ""))}
                  className={cn(
                    "whitespace-nowrap border-b-2 py-4 text-sm font-semibold transition-colors",
                    activeTab === tab.toLowerCase().replace(" ", "")
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 py-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Summary and Topics */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <FileText className="size-5 text-primary" />
                        <CardTitle>Executive Summary</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {meeting.summary}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="size-5 text-primary" />
                          <CardTitle>Top Topics</CardTitle>
                        </div>
                        <button
                          onClick={() => setActiveTab("analytics")}
                          className="text-xs text-primary hover:underline"
                        >
                          View All ({meeting.topics?.length || 0})
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {meeting.topics?.slice(0, 3).map((topic: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">{topic.topic}</span>
                            <span className="text-muted-foreground">
                              {(topic.relevance_score * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${topic.relevance_score * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Action Items and Decisions */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-5 text-primary" />
                          <CardTitle>Action Items</CardTitle>
                        </div>
                        <button
                          onClick={() => setActiveTab("actionitems")}
                          className="text-xs text-primary hover:underline"
                        >
                          View All ({meeting.action_items?.length || 0})
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {meeting.action_items?.slice(0, 3).map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-lg border border-border/70 bg-muted/20 p-3"
                        >
                          <input
                            type="checkbox"
                            className="mt-1 size-4 shrink-0 rounded border-border"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium mb-2">{item.task}</p>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>{item.assignee}</span>
                              <span>•</span>
                              <span>{item.deadline}</span>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5",
                                  item.priority === "High"
                                    ? "bg-destructive/10 text-destructive"
                                    : item.priority === "Normal"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {item.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="size-5 text-primary" />
                        <CardTitle>Key Decisions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {meeting.decisions?.slice(0, 3).map((decision: any, index: number) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-lg border border-border/70 bg-muted/20 p-3"
                        >
                          <CheckCircle2 className="size-5 shrink-0 text-primary" />
                          <p className="text-sm">{decision.decision}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* AI Insights */}
                {meeting.ai_insights && meeting.ai_insights.length > 0 && (
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-5 text-primary" />
                          <CardTitle>AI Insights</CardTitle>
                        </div>
                        <button
                          onClick={() => setActiveTab("insights")}
                          className="text-xs text-primary hover:underline"
                        >
                          View All
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {meeting.ai_insights.slice(0, 3).map((insight: string, index: number) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-lg border border-border/70 bg-muted/20 p-3"
                        >
                          <Lightbulb className="size-5 shrink-0 text-primary" />
                          <p className="text-sm">{insight}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Speaker Analysis */}
                {meeting.speaker_analysis && Object.keys(meeting.speaker_analysis).length > 0 && (
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="size-5 text-primary" />
                        <CardTitle>Speaker Analysis</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(meeting.speaker_analysis).map(([speaker, data]: any) => {
                          const participation = data.participation_percentage || 0;
                          return (
                            <div
                              key={speaker}
                              className="rounded-lg border border-border/70 bg-muted/20 p-4 text-center"
                            >
                              <div className="relative mx-auto mb-3 size-20">
                                <svg className="size-20" viewBox="0 0 80 80">
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="36"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    className="text-muted"
                                  />
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="36"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    strokeDasharray={`${participation * 2.26} 226`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 40 40)"
                                    className="text-primary"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-lg font-bold font-heading">
                                    {participation.toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                              <h3 className="font-semibold text-sm mb-1">{speaker}</h3>
                              <p className="text-xs text-muted-foreground">
                                {data.engagement_level}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Transcript Tab */}
            {activeTab === "transcript" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold font-heading mb-6">Full Transcript</h2>
                {meeting.transcript?.map((item: any, index: number) => (
                  <Card key={index} className="border-border/70 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {item.speaker.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-primary mb-1">
                            {item.speaker}
                          </div>
                          <p className="text-sm leading-6 text-foreground">{item.text}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Action Items Tab */}
            {activeTab === "actionitems" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold font-heading mb-6">All Action Items</h2>
                {meeting.action_items?.map((item: any, index: number) => (
                  <Card key={index} className="border-border/70 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <input
                          type="checkbox"
                          className="mt-1 size-5 shrink-0 rounded border-border"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-medium mb-3">{item.task}</p>
                          <div className="grid gap-3 text-sm sm:grid-cols-3">
                            <div>
                              <span className="text-muted-foreground">Assignee: </span>
                              <span className="font-medium">{item.assignee}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Deadline: </span>
                              <span className="font-medium">{item.deadline}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Priority: </span>
                              <span
                                className={cn(
                                  "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                                  item.priority === "High"
                                    ? "bg-destructive/10 text-destructive"
                                    : item.priority === "Normal"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
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
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold font-heading mb-6">AI-Generated Insights</h2>
                {meeting.ai_insights?.map((insight: string, index: number) => (
                  <Card key={index} className="border-border/70 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Sparkles className="size-5 text-primary" />
                        </div>
                        <p className="text-sm leading-7">{insight}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold font-heading mb-6">Meeting Analytics</h2>

                {/* Score Breakdown */}
                {meeting.score && typeof meeting.score === 'object' && (
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <CardTitle>Score Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(meeting.score)
                        .filter(([key, value]) => typeof value === 'number')
                        .map(([key, value]: [string, any]) => (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium capitalize">
                                {key.replace(/_/g, ' ')}
                              </span>
                              <span className="text-muted-foreground">
                                {value.toFixed(2)} / 100
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                )}

                {/* All Topics */}
                {meeting.topics && meeting.topics.length > 0 && (
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <CardTitle>All Topics Discussed</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {meeting.topics.map((topic: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">{topic.topic}</span>
                            <span className="text-muted-foreground">
                              {(topic.relevance_score * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${(topic.relevance_score || 0) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Detailed Speaker Analysis */}
                {meeting.speaker_analysis && Object.keys(meeting.speaker_analysis).length > 0 && (
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <CardTitle>Detailed Speaker Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {Object.entries(meeting.speaker_analysis).map(([speaker, data]: [string, any]) => (
                          <div
                            key={speaker}
                            className="rounded-lg border border-border/70 bg-muted/20 p-4"
                          >
                            <h4 className="font-semibold mb-3">{speaker}</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Word Count:</span>
                                <span className="font-medium">{data.word_count || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Participation:</span>
                                <span className="font-medium">
                                  {data.participation_percentage?.toFixed(2) || 0}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Effectiveness:</span>
                                <span className="font-medium">
                                  {data.effectiveness_score?.toFixed(2) || 0}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Engagement:</span>
                                <span className="font-medium">{data.engagement_level || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
