import { BarChart3, FileText, Search, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export function PlatformSection() {
  return (
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
  );
}
