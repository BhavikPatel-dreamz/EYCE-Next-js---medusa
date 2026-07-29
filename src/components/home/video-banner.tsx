"use client";

import { useGsapReveal } from "@/hooks/use-gsap";
import { useLazyVideo } from "@/hooks/use-lazy-video";

export function VideoBanner({ video, poster }: { video: string; poster?: string }) {
  const ref = useGsapReveal({ y: 20 });
  const videoRef = useLazyVideo();

  return (
    <section ref={ref} className="relative h-[50vh] min-h-[400px] overflow-hidden opacity-0">
      <video
        ref={videoRef}
        muted loop playsInline
        preload="none"
        poster={poster}
        className="absolute inset-0 size-full object-cover"
      >
        <source src={video} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/60 mb-2">Product showcase</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white">See it in action</h2>
      </div>
    </section>
  );
}
