// app/components/Hero.tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Inner wrappers so Tailwind's initial left offsets stay intact on the outer
  const c1Ref = useRef<HTMLSpanElement | null>(null);
  const c2Ref = useRef<HTMLSpanElement | null>(null);
  const c3Ref = useRef<HTMLSpanElement | null>(null);

  const firstScrollDoneRef = useRef(false);

  const isAtTop = () =>
    (typeof window !== "undefined"
      ? (window.scrollY || document.documentElement.scrollTop || 0)
      : 0) < 2;

  useEffect(() => {
    let cleanupFns: Array<() => void> = [];
    let gsap: any;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    // Lock viewport completely (no page movement)
    const lockDocumentScroll = () => {
      const html = document.documentElement;
      const body = document.body;

      const prevHtmlOverflow = html.style.overflow;
      const prevBodyOverflow = body.style.overflow;
      const prevOverscroll = html.style.overscrollBehavior;

      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";

      cleanupFns.push(() => {
        html.style.overflow = prevHtmlOverflow;
        body.style.overflow = prevBodyOverflow;
        html.style.overscrollBehavior = prevOverscroll;
      });
    };

    // Also block scroll-causing events (wheel/touch/keys) during the intro
    const addScrollBlocker = () => {
      const onWheel = (e: WheelEvent) => e.preventDefault();
      const onTouchMove = (e: TouchEvent) => e.preventDefault();
      const onKeyDown = (e: KeyboardEvent) => {
        const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
        if (keys.includes(e.key)) e.preventDefault();
      };
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("keydown", onKeyDown);
      cleanupFns.push(() => {
        window.removeEventListener("wheel", onWheel as any);
        window.removeEventListener("touchmove", onTouchMove as any);
        window.removeEventListener("keydown", onKeyDown as any);
      });
    };

    const removeAllCleanups = () => {
      cleanupFns.forEach((fn) => fn());
      cleanupFns = [];
    };

    // === distance helpers ===

    // Cloud 1: move until fully visible (if it fits) or center if wider than viewport
    const deltaUntilFullyVisible = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth || 0;
      const width = rect.width || 0;

      const desiredLeft = width <= vw ? 0 : (vw - width) / 2;
      return desiredLeft - rect.left; // translateX needed
    };

    // Cloud 2/3: keep a right-side peek equal to their initial left overhang %
    const targetDeltaX = (el: HTMLElement, overhangFraction: number) => {
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth || 0;
      const width = rect.width || 0;
      const desiredRight = vw + width * overhangFraction; // final right edge (keeps slice visible)
      return desiredRight - rect.right;
    };

    const setupFirstScroll = async () => {
      if (prefersReduced) return;
      if (!(c1Ref.current && c2Ref.current && c3Ref.current)) return;

      // only arm the intro if user is already at the very top on mount
      if (!isAtTop()) return;

      const mod = await import("gsap");
      gsap = mod.gsap || mod.default || (mod as any);

      const playFirstScroll = () => {
        if (firstScrollDoneRef.current) return;
        firstScrollDoneRef.current = true;

        // Freeze page during the animation
        lockDocumentScroll();
        addScrollBlocker();

        // Baseline (no Y motion)
        gsap.set([c1Ref.current, c2Ref.current, c3Ref.current], {
          x: 0,
          y: 0,
          force3D: true,
        });

        // Distances based on current layout
        const dx1 = deltaUntilFullyVisible(c1Ref.current!); // Cloud 1 fully visible/centered
        const dx2 = targetDeltaX(c2Ref.current!, 0.40);     // Cloud 2 keeps 40% right peek
        const dx3 = targetDeltaX(c3Ref.current!, 0.70);     // Cloud 3 keeps 70% right peek

        // Control the speed here (px/sec)
        const baseSpeed = 100; // slower; increase to speed up
        const dur1 = Math.max(0.9, Math.min(2.2, Math.abs(dx1) / baseSpeed));
        const dur2 = Math.max(0.9, Math.min(2.2, Math.abs(dx2) / baseSpeed));
        const dur3 = Math.max(0.9, Math.min(2.2, Math.abs(dx3) / baseSpeed));

        const tl = gsap.timeline({
          onComplete: () => {
            removeAllCleanups(); // hand control back to the browser
          },
        });

        // Start all together at time 0
        tl.to(c1Ref.current, { x: dx1, ease: "power2.inOut", duration: dur1 }, 0.0)
          .to(c2Ref.current, { x: dx2, ease: "power2.inOut", duration: dur2 }, 0.0)
          .to(c3Ref.current, { x: dx3, ease: "power2.inOut", duration: dur3 }, 0.0);
      };

      // First user scroll intent = trigger, but ONLY if still at top at that moment.
      const onFirstWheel = (e: Event) => {
        if (!isAtTop()) return; // not at top -> let page scroll normally
        e.preventDefault();
        window.removeEventListener("wheel", onFirstWheel as any, true);
        window.removeEventListener("touchstart", onFirstTouch as any, true);
        playFirstScroll();
      };
      const onFirstTouch = (e: Event) => {
        if (!isAtTop()) return;
        e.preventDefault();
        window.removeEventListener("wheel", onFirstWheel as any, true);
        window.removeEventListener("touchstart", onFirstTouch as any, true);
        playFirstScroll();
      };

      window.addEventListener("wheel", onFirstWheel, { capture: true, passive: false });
      window.addEventListener("touchstart", onFirstTouch, { capture: true, passive: false });
      cleanupFns.push(() => {
        window.removeEventListener("wheel", onFirstWheel as any, true);
        window.removeEventListener("touchstart", onFirstTouch as any, true);
      });
    };

    setupFirstScroll();

    return () => {
      removeAllCleanups();
      if (gsap) {
        gsap.killTweensOf(c1Ref.current);
        gsap.killTweensOf(c2Ref.current);
        gsap.killTweensOf(c3Ref.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative w-full gradient isolate
        overflow-x-clip
        px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12
        lg:p-[10vh] lg:min-h-[calc(100svh-20vh)]
        min-h-[70svh]
      "
      aria-label="Big Air Lab hero"
    >
      {/* background gradient layer (below everything) */}
      <div aria-hidden="true" className="absolute inset-0 gradient -z-10" />

      {/* Content container */}
      <div className="mx-auto w-full">
        <div className="max-w-[1120px] relative z-10">
          {/* === Clouds (animate inner spans horizontally only) === */}

          {/* Cloud 1 — starts far left (-translate-x-[80%]); stops when fully visible / centered if too wide */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute z-0
              left-0 -translate-x-[80%] top-[-120px]
            "
          >
            <span className="block will-change-transform [transform:translate3d(0,0,0)]" ref={c1Ref}>
              <Image
                src="/images/cTop.svg"
                alt=""
                width={903}
                height={376}
                priority
                className="w-[700px] sm:w-[820px] md:w-[903px] max-w-none h-auto aspect-[293/122] select-none"
                draggable={false}
              />
            </span>
          </div>

          {/* Cloud 2 — keeps right-side peek equal to initial overhang (40%) */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute z-0
              left-0 -translate-x-[40%] top-[120px]
            "
          >
            <span className="block will-change-transform [transform:translate3d(0,0,0)]" ref={c2Ref}>
              <Image
                src="/images/cBottom.svg"
                alt=""
                width={903}
                height={376}
                priority
                className="w-[700px] sm:w-[820px] md:w-[903px] max-w-none h-auto aspect-[293/122] select-none"
                draggable={false}
              />
            </span>
          </div>

          {/* Cloud 3 — keeps right-side peek equal to initial overhang (70%) */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute z-0
              left-0 -translate-x-[70%] top-[420px]
            "
          >
            <span className="block will-change-transform [transform:translate3d(0,0,0)]" ref={c3Ref}>
              <Image
                src="/images/cEdge.svg"
                alt=""
                width={903}
                height={376}
                priority
                className="w-[700px] sm:w-[820px] md:w-[903px] max-w-none h-auto aspect-[293/122] select-none"
                draggable={false}
              />
            </span>
          </div>
          {/* === /Clouds === */}

          {/* === CIRCLE (unchanged) === */}
          <div
            aria-hidden="true"
            className={`
              pointer-events-none relative z-10 mx-auto mb-6 sm:mb-8
              w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] md:w-[210px] md:h-[210px]
              lg:pointer-events-none lg:absolute lg:mx-0 lg:mb-0 lg:right-[10%] lg:top-[57px] lg:z-0
              lg:w-[241px] lg:h-[242px]
            `}
          >
            {/* Blurred gradient rim */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 241 242" fill="none" className="absolute inset-0 w-full h-full">
              <g filter="url(#filter0_f_1_137)">
                <circle cx="120.5" cy="121" r="100.5" fill="url(#paint0_linear_1_137)" />
              </g>
              <defs>
                <filter id="filter0_f_1_137" x="0" y="0.5" width="241" height="241" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_1_137" />
                </filter>
                <linearGradient id="paint0_linear_1_137" x1="120.5" y1="20.5" x2="120" y2="227.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EEF9FF" />
                  <stop offset="0.722767" stopColor="#D0E8FF" />
                </linearGradient>
              </defs>
            </svg>

            {/* Four soft glow arms */}
            <div
              className="absolute right-1/2 top-1/2 -translate-y-1/2 w-[70%] h-[50%] opacity-40 pointer-events-none -z-10"
              style={{ background: "linear-gradient(270deg, #C0EAFB 9.4%, rgba(255, 255, 255, 0) 88.66%)", filter: "blur(10px)" }}
            />
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 w-[50%] h-[70%] opacity-40 pointer-events-none -z-10"
              style={{ background: "linear-gradient(180deg, #C0EAFB 9.4%, rgba(255, 255, 255, 0) 88.66%)", filter: "blur(10px)" }}
            />
            <div
              className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[70%] h-[50%] opacity-40 pointer-events-none -z-10"
              style={{ background: "linear-gradient(90deg, #C0EAFB 9.4%, rgba(255, 255, 255, 0) 88.66%)", filter: "blur(10px)" }}
            />
            <div
              className="absolute left-1/2 bottom-1/2 -translate-x-1/2 w-[50%] h-[58%] opacity-40 pointer-events-none -z-10"
              style={{ background: "linear-gradient(0deg, #C0EAFB 9.4%, rgba(255, 255, 255, 0) 88.66%)", filter: "blur(10px)" }}
            />

            {/* Main circle */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 171 172" fill="none" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[71%] h-[71%]">
              <circle cx="85.5" cy="86" r="85.5" fill="#F7FFFF" />
            </svg>
          </div>
          {/* === /CIRCLE === */}

          {/* Content */}
          <div className="relative z-20">
            <h1 className="font-satoshi font-bold uppercase text-[#333] text-[clamp(36px,6.8vw,80px)] leading-[1.5] lg:leading-[120px] break-words">
              BIG AIR LAB
            </h1>

            <p className="mt-2 font-satoshi font-bold uppercase text-[#333] text-[clamp(16px,2.4vw,28px)] leading-[1.5]">
              WE BUILD <span className="font-[300] italic tracking-[1px] leading-[1.5]">AI</span> ABOVE THE CLOUDS
            </p>

            <p className="mt-8 lg:mt-10 font-satoshi text-[#333] text-[clamp(16px,2.2vw,24px)] leading-[1.5] max-w-[527px]">
              Turning AI research into enterprise systems that move <span className="font-bold">ideas into reality</span>
            </p>

            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-nowrap items-center gap-3 sm:gap-5">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1 rounded-[36px] bg-white text-[#333] border border-[#333]/80 h-11 px-4 min-w-[128px] text-[15px]
                           sm:h-12 sm:px-5 sm:min-w-[140px] sm:text-[16px] md:h-14 md:px-6 md:min-w-[180px] md:text-[18px]
                           font-satoshi font-medium leading-[1.5] shadow-[0_1px_0_rgba(0,0,0,0.04)]
                           hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#333]
                           transition-[background-color,opacity,transform] motion-reduce:transition-none whitespace-nowrap shrink"
              >
                Contact us
              </Link>

              <Link
                href="/cta"
                className="inline-flex items-center justify-center gap-1 rounded-[36px] bg-[#333] text-white h-11 px-4 min-w-[128px] text-[15px]
                           sm:h-12 sm:px-5 sm:min-w-[140px] sm:text-[16px] md:h-14 md:px-6 md:min-w-[180px] md:text-[18px]
                           font-satoshi font-medium leading-[1.5] hover:opacity-90 active:opacity-80
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#333]/60 transition-opacity motion-reduce:transition-none
                           whitespace-nowrap shrink"
              >
                You code?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}