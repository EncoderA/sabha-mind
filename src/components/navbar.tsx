"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold font-heading text-foreground">
          Sabha<span className="text-primary">Mind</span>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className={`transition ${
              isActive("/")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Home
          </Link>

          <Link
            href="/meet-addon/summaries"
            className={`transition ${
              isActive("/meet-addon/summaries")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Features
          </Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>

          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}