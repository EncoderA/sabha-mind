import Link from "next/link";
import {
  AudioLines,
  BadgeCheck,
  ChevronRight,
  Clock3,
  FileText,
  Users,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const metrics = [
  { label: "Summary Turnaround", value: "< 2 min" },
  { label: "Speaker Visibility", value: "100%" },
  { label: "Meeting Records", value: "Searchable" },
] as const;

export function HeroSection() {
  return (
    <section className="border-b border-border/70 bg-muted/20">
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
                "h-11 px-5",
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
                  <p className="truncate text-sm font-semibold">
                    Product Sync
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Summary generated 1 min ago
                  </p>
                </div>
              </div>
              <BadgeCheck
                className="size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
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
  );
}
