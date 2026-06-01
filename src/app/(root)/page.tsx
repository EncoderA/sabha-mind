import { CtaSection } from "@/features/landing_page/components/cta-section";
import { HeroSection } from "@/features/landing_page/components/hero-section";
import { PlatformSection } from "@/features/landing_page/components/platform-section";
import { WorkflowSection } from "@/features/landing_page/components/workflow-section";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <HeroSection />
      <PlatformSection />
      <WorkflowSection />
      <CtaSection />
    </main>
  );
}
