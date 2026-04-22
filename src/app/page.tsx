import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, AudioLines } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { ThemeSwitch } from '@/components/theme-switch';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-muted/30 p-6">
      <div className="absolute top-5 right-5">
        <ThemeSwitch />
      </div>
      <section className="w-full max-w-3xl rounded-[2rem] border border-border/60 bg-background p-8 shadow-xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-5">
            <div className="inline-flex items-center font-mono gap-3 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
              <AudioLines className="size-4" />
              Sabha Mind
            </div>
            <div className="space-y-3">
              <h1 className="max-w-lg text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
                Meet recording controls with faster dark mode switching.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                Use the shared theme button here, then open the Meet add-on
                panel with the same control and the <span className="font-semibold text-foreground">D</span>{' '}
                shortcut.
              </p>
            </div>
          </div>
          <Image
            src="/favicon.ico"
            alt="Sabha Mind logo"
            width={72}
            height={72}
            className="rounded-2xl border border-border/60 bg-muted/40 p-3 shadow-sm"
          />
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href="/meet-addon" className={buttonVariants({ size: 'lg' })}>
            Open Meet Add-on
            <ArrowRight className="size-4" />
          </Link>
          <p className="text-sm text-muted-foreground">
            Theme toggle is available on both screens.
          </p>
        </div>
      </section>
    </main>
  );
}
