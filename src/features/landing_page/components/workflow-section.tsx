import { Bot, MessageSquareText, Mic2 } from "lucide-react";

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

export function WorkflowSection() {
  return (
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
            structure the important details, and give every stakeholder a clean
            source of truth.
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
  );
}
