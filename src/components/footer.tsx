import Link from "next/link";

const socialLinks = [
  { href: "#", label: "Website", text: "W" },
  { href: "#", label: "Twitter", text: "X" },
  { href: "#", label: "Instagram", text: "IG" },
  { href: "#", label: "LinkedIn", text: "in" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-8 py-14 md:grid-cols-3">
        <div>
          <h2 className="font-heading text-2xl font-bold">
            Sabha<span className="text-primary">Mind</span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Transform your meetings into meaningful insights with AI-powered
            summaries, speaker analytics, and smart topic detection.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-foreground">Quick Links</h3>

          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="rounded-md px-2 py-1 text-sm text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="rounded-md px-2 py-1 text-sm text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-md px-2 py-1 text-sm text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
            >
              Register
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-foreground">Follow Us</h3>

          <div className="flex gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/30 text-xs font-semibold transition hover:border-primary/30 hover:bg-muted"
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t py-5 text-center text-sm text-muted-foreground">
        Copyright 2026 SabhaMind. All rights reserved.
      </div>
    </footer>
  );
}
