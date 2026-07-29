"use client";

import { useEffect, useRef } from "react";

export function useLazyVideo(options?: { threshold?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.preload = "auto";
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: options?.threshold ?? 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold]);

  return videoRef;
}
