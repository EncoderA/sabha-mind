'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, Home, ScrollText, Mic } from 'lucide-react';

// import { ThemeSwitch } from '@/components/theme-switch';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

const navItems = [
    {
        label: 'Home',
        href: '/meet-addon',
        icon: Home,
        exact: true,
    },
    {
        label: 'Summaries',
        href: '/meet-addon/summaries',
        icon: ScrollText,
        exact: false,
    },
] as const;

export function AddonHeader() {
    const pathname = usePathname();

    function isActive(href: string, exact: boolean) {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    }

    return (
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-muted/40 text-foreground">
                        <Mic className="size-3.5" />           
                    </div>
                    <span className="text-sm font-semibold tracking-tight">
                        VartaIQ
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Link
                        href="https://sabha-mind.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs text-foreground/70")}
                        title="Open Sabha Mind website"
                    >
                        <ExternalLink className="size-3" />
                        Website
                    </Link>
                    {/* <ThemeSwitch enableShortcut className="size-7 shrink-0" /> */}
                </div>
            </div>
            <nav className="flex gap-0.5 px-3" aria-label="Add-on navigation">
                {navItems.map(({ label, href, icon: Icon, exact }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'group relative flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-colors',
                                active
                                    ? 'text-foreground'
                                    : 'text-muted-foreground hover:text-foreground/80'
                            )}
                        >
                            <Icon className={cn(
                                'size-3.5 transition-colors',
                                active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground/70'
                            )} />
                            {label}
                            {active && (
                                <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}
