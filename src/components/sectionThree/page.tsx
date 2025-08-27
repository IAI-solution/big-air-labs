// app/sectionThree/page.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/** Reuse the same Lenis + ScrollTrigger singleton bootstrap used elsewhere */
async function ensureSmoothScroll() {
  if (typeof window === "undefined") return;
  if ((window as any).__lenis_ready) return;

  const [{ default: Lenis }, gsapModule] = await Promise.all([
    import("@studio-freight/lenis"),
    import("gsap"),
  ]);
  const gsap = gsapModule.gsap || (gsapModule as any);

  if (!(gsap as any).plugins?.ScrollTrigger) {
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);
  }

  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 1.5,
  });
  (window as any).__lenis_ready = true;
  (window as any).__lenis = lenis;

  lenis.on("scroll", () => {
    (gsap as any).plugins.ScrollTrigger?.update?.();
  });

  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/** Item (unchanged) */
const FeatureItem = ({ src, alt, label }: { src: string; alt: string; label: string }) => (
  <div className="flex flex-col items-center text-center gap-y-4">
    <Image
      src={src}
      alt={alt}
      width={137}
      height={179}
      className="h-auto w-28 sm:w-32 md:w-36 object-contain"
      priority
    />
    <p className="font-satoshi text-black text-lg sm:text-xl font-medium leading-snug">
      {label}
    </p>
  </div>
);

export default function Hero3() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let gsap: any, ScrollTrigger: any;
    ensureSmoothScroll();

    (async () => {
      const mod = await import("gsap");
      gsap = mod.gsap || (mod as any);
      const st = await import("gsap/ScrollTrigger");
      ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // Deeper start + slower rise for clearer motion
      const riseDistance = "100vh";
      const riseDuration = 3.0;

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(textBlockRef.current, {
        y: riseDistance,
        opacity: 0,
        duration: riseDuration,
        clearProps: "transform,opacity",
      }, 0);

      tl.from(gridRef.current, {
        y: riseDistance,
        opacity: 0,
        duration: riseDuration,
        clearProps: "transform,opacity",
      }, 0);

      return () => {
        try {
          ScrollTrigger?.getAll().forEach((s: any) => s.kill());
        } catch {}
      };
    })();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen gradient3 isolate overflow-x-clip flex items-center py-20 sm:py-24"
      aria-label="Third section"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-y-16 md:gap-y-20">
          {/* TEXT CONTENT BLOCK */}
          <div ref={textBlockRef} className="max-w-4xl text-center">
            <h2 className="font-satoshi text-black font-medium leading-tight text-3xl sm:text-4xl lg:text-5xl">
              Empowering Business Growth
              <br className="hidden md:block" />
              with Scalable Enterprise AI Solutions
            </h2>
            <p className="mt-6 max-w-3xl mx-auto font-satoshi text-black/90 leading-relaxed text-lg sm:text-xl lg:text-2xl">
              We are an <span className="font-bold italic">AI Research Lab, not just a company</span>.
              Our work spans Finance AI, Consumer AI, and Enterprise AI Systems, delivering measurable business outcomes.
            </p>
          </div>

          {/* FEATURES GRID */}
          <div ref={gridRef} className="grid w-full grid-cols-1 md:grid-cols-3 gap-12 sm:gap-10">
            <FeatureItem src="/images/rings.svg" alt="Finance AI Icon" label="Finance AI" />
            <FeatureItem src="/images/stars.svg" alt="Consumer AI Icon" label="Consumer AI" />
            <FeatureItem src="/images/circles.svg" alt="Enterprise AI Solution Icon" label="Enterprise AI Solution" />
          </div>
        </div>
      </div>
    </section>
  );
}
