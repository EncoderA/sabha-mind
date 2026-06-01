import Link from "next/link";
import { ChevronRight, LockKeyhole, ShieldCheck, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const trustItems = [
  { label: "Role-aware meeting history", icon: Users },
  { label: "Secure recording controls", icon: LockKeyhole },
  { label: "Audit-ready summaries", icon: ShieldCheck },
] as const;

export function CtaSection() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-lg border border-border/70 bg-card p-6 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-balance font-heading text-3xl font-semibold tracking-tight">
              Ready for a cleaner meeting workflow?
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-7 text-muted-foreground">
              Start with the Meet add-on, then bring summaries, action items,
              and speaker context back to the team.
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
  );
}
