"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapReveal(
  options?: {
    y?: number;
    x?: number;
    opacity?: number;
    duration?: number;
    delay?: number;
    ease?: string;
    start?: string;
  },
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      {
        y: options?.y ?? 30,
        x: options?.x ?? 0,
        opacity: options?.opacity ?? 0,
      },
      {
        y: 0,
        x: 0,
        opacity: 1,
        duration: options?.duration ?? 0.7,
        delay: options?.delay ?? 0,
        ease: options?.ease ?? "power3.out",
        scrollTrigger: {
          trigger: el,
          start: options?.start ?? "top 88%",
          once: true,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return ref;
}

export function useGsapStagger(
  selector: string,
  options?: {
    y?: number;
    x?: number;
    opacity?: number;
    duration?: number;
    stagger?: number;
    ease?: string;
    start?: string;
  },
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = container.querySelectorAll(selector);
    if (!children.length) return;

    gsap.fromTo(
      children,
      {
        y: options?.y ?? 30,
        x: options?.x ?? 0,
        opacity: options?.opacity ?? 0,
      },
      {
        y: 0,
        x: 0,
        opacity: 1,
        duration: options?.duration ?? 0.6,
        stagger: options?.stagger ?? 0.1,
        ease: options?.ease ?? "power3.out",
        scrollTrigger: {
          trigger: container,
          start: options?.start ?? "top 85%",
          once: true,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return ref;
}

export function useGsapHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-tag",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
      )
        .fromTo(
          ".hero-title",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.3",
        )
        .fromTo(
          ".hero-desc",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.35",
        )
        .fromTo(
          ".hero-cta",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
          "-=0.25",
        )
        .fromTo(
          ".hero-stats",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          "-=0.2",
        )
        .fromTo(
          ".hero-image",
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7 },
          "-=0.6",
        )
        .fromTo(
          ".hero-callout",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3",
        )
        .fromTo(
          ".hero-strip-item",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.08 },
          "-=0.3",
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

export function useGsapParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      y: () => speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return ref;
}
