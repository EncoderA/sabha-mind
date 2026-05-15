import Link from "next/link";
import {
  AudioLines,
  BadgeCheck,
  BarChart3,
  Bot,
  ChevronRight,
  Clock3,
  FileText,
  LockKeyhole,
  MessageSquareText,
  Mic2,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const metrics = [
  { label: "Summary Turnaround", value: "< 2 min" },
  { label: "Speaker Visibility", value: "100%" },
  { label: "Meeting Records", value: "Searchable" },
] as const;

const features = [
  {
    title: "Structured Summaries",
    desc: "Convert long conversations into decisions, blockers, and next steps your team can scan quickly.",
    icon: FileText,
  },
  {
    title: "Speaker Analytics",
    desc: "Understand participation patterns without replaying recordings or reading full transcripts.",
    icon: BarChart3,
  },
  {
    title: "Topic Intelligence",
    desc: "Detect recurring themes, open questions, and follow-up areas across every meeting.",
    icon: Sparkles,
  },
  {
    title: "Smart Search",
    desc: "Find discussions by customer, project, owner, or topic across past meeting history.",
    icon: Search,
  },
] as const;

const workflow = [
  {
    title: "Record",
    desc: "Start from the Google Meet add-on and keep the capture flow inside the call.",
    icon: Mic2,
  },
  {
    title: "Analyze",
    desc: "Extract speakers, decisions, action items, and topic clusters from the session.",
    icon: Bot,
  },
  {
    title: "Share",
    desc: "Publish concise summaries to the people who need context after the meeting.",
    icon: MessageSquareText,
  },
] as const;

const trustItems = [
  { label: "Role-aware meeting history", icon: Users },
  { label: "Secure recording controls", icon: LockKeyhole },
  { label: "Audit-ready summaries", icon: ShieldCheck },
] as const;

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <section className="border-b border-border/70 bg-muted/20 ">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24 items-center">
            <div className="flex min-w-0 flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                <AudioLines className="size-3.5 text-primary" aria-hidden="true" />
                Google Meet add-on for AI meeting intelligence
              </div>

              <h1 className="mt-6 max-w-4xl text-balance font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                VartaIQ turns live meetings into accountable decisions.
              </h1>

              <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
                Record from Google Meet, capture speaker context, and generate
                structured summaries your team can trust after every call.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
                >
                  Start Free
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "h-11 px-5"
                  )}
                >
                  Sign In
                </Link>
              </div>

              <dl className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm"
                  >
                    <dt className="text-xs font-medium text-muted-foreground">
                      {metric.label}
                    </dt>
                    <dd className="mt-2 font-heading text-xl font-semibold text-foreground">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative min-w-0">
              <div className="rounded-lg border border-border/80 bg-card shadow-xl shadow-foreground/5">
                <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <AudioLines className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">Product Sync</p>
                      <p className="truncate text-xs text-muted-foreground">
                        Summary generated 1 min ago
                      </p>
                    </div>
                  </div>
                  <BadgeCheck className="size-5 shrink-0 text-primary" aria-hidden="true" />
                </div>

                <div className="space-y-4 p-4">
                  <div className="rounded-lg border border-border/70 bg-muted/25 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <FileText className="size-3.5" aria-hidden="true" />
                      Executive Summary
                    </div>
                    <p className="mt-3 text-sm leading-6 text-foreground/90">
                      Team aligned on the add-on launch path, confirmed the
                      recording API flow, and assigned owners for onboarding,
                      analytics, and support readiness.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-border/70 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock3 className="size-4 text-primary" aria-hidden="true" />
                        Action Items
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                          Finalize marketplace copy
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                          Validate recording stop flow
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-border/70 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Users className="size-4 text-primary" aria-hidden="true" />
                        Speaker Split
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="h-2 rounded-full bg-muted">
                          <div className="h-2 w-3/4 rounded-full bg-primary" />
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div className="h-2 w-1/2 rounded-full bg-foreground/70" />
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div className="h-2 w-1/3 rounded-full bg-muted-foreground/70" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="scroll-mt-28 px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Platform
              </p>
              <h2 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Built for teams that need meeting memory, not more notes.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map(({ desc, icon: Icon, title }) => (
                <Card
                  key={title}
                  className="rounded-lg border-border/70 bg-card shadow-sm transition-colors hover:border-primary/40 hover:bg-muted/20"
                >
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-md border border-border/70 bg-muted/30 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-pretty text-sm leading-6 text-muted-foreground">
                      {desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="workflow"
          className="scroll-mt-28 border-y border-border/70 bg-muted/25 px-6 py-20 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Workflow
              </p>
              <h2 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                From conversation to follow-through in 3 steps.
              </h2>
              <p className="mt-4 text-pretty text-sm leading-7 text-muted-foreground">
                VartaIQ keeps the operational flow simple: capture the call,
                structure the important details, and give every stakeholder a
                clean source of truth.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {workflow.map(({ desc, icon: Icon, title }, index) => (
                <div
                  key={title}
                  className="rounded-lg border border-border/70 bg-background p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-lg border border-border/70 bg-card p-6 shadow-sm md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-balance font-heading text-3xl font-semibold tracking-tight">
                  Ready for a cleaner meeting workflow?
                </h2>
                <p className="mt-3 max-w-2xl text-pretty text-sm leading-7 text-muted-foreground">
                  Start with the Meet add-on, then bring summaries, action
                  items, and speaker context back to the team.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {trustItems.map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      <Icon className="size-3.5 text-primary" aria-hidden="true" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
              >
                Create Account
                <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
