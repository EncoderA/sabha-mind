// import Image from 'next/image';
// import Link from 'next/link';
// import { ArrowRight, AudioLines } from 'lucide-react';

// import { buttonVariants } from '@/components/ui/button';
// import { ThemeSwitch } from '@/components/theme-switch';
// import { cn } from '@/lib/utils';

// export default function Home() {
//   return (
//     <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-muted/30 p-6">
//       <div className="absolute top-5 right-5">
//         <ThemeSwitch />
//       </div>
//       <div className='flex flex-col '>
//         <h1>This will be landing page.</h1>
//         <Link
//           href="/meet-addon/summaries"
//           className={cn(
//             buttonVariants({ size: 'lg' }),
//             'mt-6 inline-flex items-center gap-2'
//           )}
//         > Go to Addon Page<AudioLines className="size-4" />
//         </Link>
//         <Link
//           href="/login"
//           className={cn(
//             buttonVariants({ size: 'lg' }),
//             'mt-6 inline-flex items-center gap-2'
//           )}
//         > Go to Login Page<AudioLines className="size-4" />
//         </Link>
//          <Link
//           href="/register"
//           className={cn(
//             buttonVariants({ size: 'lg' }),
//             'mt-6 inline-flex items-center gap-2'
//           )}
//         > Go to Register Page<AudioLines className="size-4" />
//         </Link>
//       </div>
//     </main>
//   );
// }

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  const slides = [
    {
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      title: "AI Meeting Insights",
      desc: "Turn transcripts into summaries, speaker analytics and smart insights.",
    },
    {
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978",
      title: "Track Speaker Contributions",
      desc: "Know who spoke the most and what matters in every meeting.",
    },
    {
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      title: "Smart Topic Detection",
      desc: "Automatically identify important discussion topics instantly.",
    },
  ];

  const features = [
    {
      title: "Summarization",
      desc: "Get concise meeting summaries instantly.",
      icon: "📝",
    },
    {
      title: "Speaker Analytics",
      desc: "Analyze contributions of each participant.",
      icon: "🎤",
    },
    {
      title: "Topic Detection",
      desc: "Identify key discussion topics automatically.",
      icon: "🧠",
    },
    {
      title: "Real-time Insights",
      desc: "View live insights during meetings.",
      icon: "⚡",
    },
    {
      title: "Meeting History",
      desc: "Access all past meeting summaries anytime.",
      icon: "📂",
    },
    {
      title: "Smart Search",
      desc: "Quickly find topics or discussions.",
      icon: "🔍",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="bg-background text-foreground min-h-screen">
        {/* HERO SECTION */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 3500 }}
          loop
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-screen">
                {/* IMAGE */}
                <img
                  src={`${slide.img}?auto=format&fit=crop&w=1600&q=80`}
                  alt="hero"
                  className="w-full h-full object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-primary/20 to-background/90" />

                {/* CONTENT */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <h1 className="text-5xl md:text-7xl font-extrabold font-heading text-foreground">
                    {slide.title}
                  </h1>

                  <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
                    {slide.desc}
                  </p>

                  {/* BUTTONS */}
                  <div className="mt-8 flex gap-5">
                    <Button
                      size="lg"
                      onClick={() => router.push("/register")}
                      className="px-8 py-6 text-lg"
                    >
                      Get Started
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => router.push("/login")}
                      className="px-8 py-6 text-lg"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* FEATURES */}
        <section className="py-24 px-8 md:px-16 bg-muted/30">
          <h2 className="text-4xl font-bold font-heading text-center text-primary mb-20">
            What Our Platform Does
          </h2>

          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group p-10 border-border hover:border-primary/50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer bg-card"
              >
                <CardContent className="p-0 space-y-4">
                  <div className="text-5xl mb-6">{feature.icon}</div>

                  <h3 className="text-2xl font-bold font-heading text-foreground">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {feature.desc}
                  </p>

                  <div className="h-1 w-0 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 rounded-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}