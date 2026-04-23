import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, AudioLines } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { ThemeSwitch } from '@/components/theme-switch';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-muted/30 p-6">
      <div className="absolute top-5 right-5">
        <ThemeSwitch />
      </div>
      <div className='flex flex-col '>
        <h1>This will be landing page.</h1>
        <Link
          href="/meet-addon/summaries"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'mt-6 inline-flex items-center gap-2'
          )}
        > Go to Addon Page<AudioLines className="size-4" />
        </Link>
      </div>
    </main>
  );
}
