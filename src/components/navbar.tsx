"use client";

import Link from "next/link";
import { useState } from "react";

import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  NavItems,
  Navbar as ResizableNavbar,
  NavbarButton,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";
import { ThemeSwitch } from "@/components/theme-switch";

const navItems = [
  { name: "Platform", link: "#platform" },
  { name: "Workflow", link: "#workflow" },
  { name: "Add-on", link: "/meet-addon" },
] as const;

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <ResizableNavbar>
      <NavBody>
        <NavbarLogo />
        <NavItems items={[...navItems]} />
        <div className="relative z-20 flex items-center gap-2">
          <ThemeSwitch enableShortcut={false} className="size-9" />
          <NavbarButton as={Link} href="/login" variant="secondary">
            Sign In
          </NavbarButton>
          <NavbarButton as={Link} href="/register" variant="primary">
            Start Free
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu}>
          {navItems.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              onClick={closeMobileMenu}
              className="w-full rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-2 flex w-full flex-col gap-2">
            <NavbarButton
              as={Link}
              href="/login"
              onClick={closeMobileMenu}
              variant="secondary"
              className="w-full"
            >
              Sign In
            </NavbarButton>
            <NavbarButton
              as={Link}
              href="/register"
              onClick={closeMobileMenu}
              variant="primary"
              className="w-full"
            >
              Start Free
            </NavbarButton>
            <div className="flex justify-center pt-1">
              <ThemeSwitch enableShortcut={false} />
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
}
