'use client';

import {
  startTransition,
  useEffect,
  useEffectEvent,
  useState,
} from 'react';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const editableTags = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export function ThemeSwitch({
  className,
  enableShortcut = true,
}: {
  className?: string;
  enableShortcut?: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';
  const ThemeIcon = isDark ? Sun : Moon;

  const toggleTheme = () => {
    startTransition(() => {
      setTheme(isDark ? 'light' : 'dark');
    });
  };

  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (!enableShortcut || event.defaultPrevented || event.repeat) {
      return;
    }

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (event.key.toLowerCase() !== 'd') {
      return;
    }

    const target = event.target;
    if (target instanceof HTMLElement) {
      if (target.isContentEditable || editableTags.has(target.tagName)) {
        return;
      }
    }

    event.preventDefault();
    toggleTheme();
  });

  useEffect(() => {
    if (!enableShortcut) {
      return;
    }

    window.addEventListener('keydown', onShortcut);
    return () => {
      window.removeEventListener('keydown', onShortcut);
    };
  }, [enableShortcut]);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        'rounded-full border-border/70 bg-background/75 shadow-sm backdrop-blur-sm',
        className
      )}
      aria-label={
        mounted
          ? isDark
            ? 'Switch to light theme'
            : 'Switch to dark theme'
          : 'Toggle theme'
      }
      title={
        enableShortcut
          ? 'Toggle theme. Press D to switch dark mode.'
          : 'Toggle theme'
      }
    >
      <span
        suppressHydrationWarning
        className="flex size-4 items-center justify-center"
      >
        {mounted ? <ThemeIcon className="size-4" /> : null}
      </span>
    </Button>
  );
}
