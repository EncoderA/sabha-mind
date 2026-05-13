import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="max-w-7xl mx-auto px-8 py-14 grid md:grid-cols-3 gap-12">
        {/* ABOUT */}
        <div>
          <h2 className="text-2xl font-bold font-heading">
            Sabha<span className="text-primary">Mind</span>
          </h2>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Transform your meetings into meaningful insights with AI-powered
            summaries, speaker analytics, and smart topic detection.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>

          <div className="flex flex-col gap-2">
            <a href="/" className="text-muted-foreground hover:text-foreground transition text-sm px-2 py-1 rounded-md hover:bg-muted/50">
              Home
            </a>

            <a href="/login" className="text-muted-foreground hover:text-foreground transition text-sm px-2 py-1 rounded-md hover:bg-muted/50">
              Login
            </a>

            <a href="/register" className="text-muted-foreground hover:text-foreground transition text-sm px-2 py-1 rounded-md hover:bg-muted/50">
              Register
            </a>
          </div>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-foreground font-semibold mb-4">Follow Us</h3>

          <div className="flex gap-2">
            <a href="#" aria-label="Website" className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition">
              🌐
            </a>

            <a href="#" aria-label="Twitter" className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition">
              🐦
            </a>

            <a href="#" aria-label="Instagram" className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition">
              📸
            </a>

            <a href="#" aria-label="LinkedIn" className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition">
              💼
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t text-center text-sm text-muted-foreground py-5">
        © 2026 SabhaMind. All rights reserved.
      </div>
    </footer>
  );
}