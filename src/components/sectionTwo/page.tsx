// app/sectionTwo/page.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * Same singleton init used across the app (Lenis + ScrollTrigger).
 */
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

export default function Hero2() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Wrap the whole scene so exit motion is perfectly smooth (no clipping)
  const sceneRef = useRef<HTMLDivElement | null>(null);

  // Targets to animate (entrance)
  const textBlockRef = useRef<HTMLDivElement | null>(null); // heading + paragraph
  const cardRef = useRef<HTMLDivElement | null>(null);
  const cardContentRef = useRef<HTMLDivElement | null>(null); // fades while card slides (wrapper opacity untouched)

  const cEdgeRRef = useRef<HTMLDivElement | null>(null);
  const cEdgeLRef = useRef<HTMLDivElement | null>(null);

  // c4 + cBottom rise from below
  const c4aRef = useRef<HTMLDivElement | null>(null);
  const c4bRef = useRef<HTMLDivElement | null>(null);
  const cBottomRef = useRef<HTMLDivElement | null>(null);

  // circle group (top-right) exits upward too
  const circleGroupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let gsap: any;
    let ScrollTrigger: any;

    ensureSmoothScroll();

    (async () => {
      const mod = await import("gsap");
      gsap = mod.gsap || (mod as any);
      const st = await import("gsap/ScrollTrigger");
      ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // -------------------
      // ENTRANCE TIMELINE (unchanged logic)
      // -------------------
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      const slideDuration = 3.6; // card + cEdge slide-in
      const riseDuration  = 3.6; // text + c4 + cBottom vertical rise

      // 1) cEdge slide from LEFT
      tl.from([cEdgeLRef.current, cEdgeRRef.current], {
        x: "-120vw",
        duration: slideDuration,
        ease: "power3.out",
        stagger: 0,
        clearProps: "transform",
      }, 0);

      // 2) Card slides from LEFT (wrapper opacity untouched)
      tl.from(cardRef.current, {
        x: "-120vw",
        duration: slideDuration,
        ease: "power3.out",
        clearProps: "transform",
      }, 0);

      //    Card inner content fades 0 -> 1 alongside the slide
      tl.fromTo(
        cardContentRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: slideDuration,
          ease: "none",
          clearProps: "opacity",
        },
        0
      );

      // 3) Text block rises from 50vh below
      tl.from(textBlockRef.current, {
        y: "50vh",
        opacity: 0,
        duration: riseDuration,
        ease: "power2.out",
        clearProps: "transform,opacity",
      }, 0.05);

      // 4) c4 + cBottom also rise vertically
      tl.from([c4aRef.current, c4bRef.current, cBottomRef.current], {
        y: "50vh",
        duration: riseDuration,
        ease: "power2.out",
        clearProps: "transform",
      }, 0.05);

      // -------------------
      // VERTICAL EXIT (smooth, no pin, no blank)
      // Entire scene slides upward together so nothing "vanishes" early.
      // -------------------
      if (sceneRef.current) {
        gsap.to(sceneRef.current, {
          y: "-120vh",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom bottom",  // when you begin to reach the next screen
            end:   "bottom top",     // completes by the time this section leaves
            scrub: 1.2,              // smooth & slow
            invalidateOnRefresh: true,
          },
        });
      }

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
      className="relative w-full min-h-screen gradient2 overflow-x-clip overflow-y-visible py-20 sm:py-24 md:py-28"
      aria-label="Engineered for Impact section"
    >
      {/* SCENE WRAPPER – everything inside moves together on exit */}
      <div ref={sceneRef} className="relative w-full min-h-[inherit] will-change-transform">
        {/* Decorative Circle Group */}
        <div
          ref={circleGroupRef}
          className="pointer-events-none select-none absolute top-[10vh] right-[5vw] md:top-[15vh] md:right-[10vw] lg:right-[15vw] z-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 201 201"
            className="absolute w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52"
            style={{ filter: "blur(12px)" }}
          >
            <defs>
              <linearGradient id="grad1" x1="100.5" y1="0" x2="100.5" y2="201" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EEF9FF" offset="0.0012" />
                <stop stopColor="#D0E8FF" offset="0.7438" />
              </linearGradient>
            </defs>
            <circle cx="100.5" cy="100.5" r="100.5" fill="url(#grad1)" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 171 171"
            className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44"
          >
            <circle cx="85.5" cy="85.5" r="85.5" fill="#F7FFFF" />
          </svg>
        </div>

        {/* cEdge.svg */}
        <div
          ref={cEdgeRRef}
          className="pointer-events-none select-none absolute z-20"
          style={{ top: "720px", right: "532px" }}
        >
          <Image
            src="/images/cEdge.svg"
            alt="Decorative bottom element"
            width={100}
            height={100}
            className="w-auto h-auto"
          />
        </div>

        <div
          ref={cEdgeLRef}
          className="pointer-events-none select-none absolute z-20"
          style={{ top: "720px", left: "642px" }}
        >
          <Image
            src="/images/cEdge.svg"
            alt="Decorative bottom element"
            width={100}
            height={100}
            className="w-auto h-auto"
          />
        </div>

        {/* c4 + cBottom */}
        <div
          ref={c4aRef}
          className="pointer-events-none select-none absolute z-0"
          style={{ top: "120px", left: "180px" }}
        >
          <Image src="/images/c4.svg" alt="Decorative bottom element" width={226} height={94} className="w-auto h-auto" />
        </div>

        <div
          ref={c4bRef}
          className="pointer-events-none select-none absolute z-0"
          style={{ top: "100px", left: "120px" }}
        >
          <Image src="/images/c4.svg" alt="Decorative bottom element" width={100} height={100} className="w-auto h-auto" />
        </div>

        <div
          ref={cBottomRef}
          className="pointer-events-none select-none absolute z-0"
          style={{ top: "320px", left: "-120px" }}
        >
          <Image src="/images/cBottom.svg" alt="Decorative bottom element" width={100} height={100} className="w-auto h-auto" />
        </div>

        {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
  <div className="flex flex-col gap-12 md:gap-16">
    <div
      ref={textBlockRef}
      className="relative top-16 sm:top-20 md:top-24 lg:top-28 max-w-4xl"
    >
      <h2 className="font-satoshi text-black font-medium text-3xl sm:text-4xl lg:text-5xl leading-tight">
        Engineered for Real Impact
      </h2>
      <p className="mt-4 font-satoshi text-[#333] text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-4xl">
        Every solution we build flows seamlessly from research to enterprise deployment, designed for{" "}
        <span className="italic font-bold">scalability, security, and performance.</span>
      </p>
    </div>


            {/* Glass Card (wrapper opacity untouched; only its content fades on entry) */}
<div
  ref={cardRef}
  className="
    mt-16 sm:mt-20 md:mt-24 lg:mt-32
    w-full rounded-2xl overflow-hidden
    bg-white/30 backdrop-blur-md border border-white/40 shadow-lg
    p-4 sm:p-5
  "
>


              <div ref={cardContentRef} className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                <div className="w-full lg:w-3/5 rounded-lg overflow-hidden">
                  <Image
                    src="/images/prism.svg"
                    alt="Prism AI"
                    width={597}
                    height={445}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>

                <div className="flex-1 flex flex-col items-start gap-4 sm:gap-5 w-full">
                  <h3
                    className="
                      font-satoshi text-black
                      text-3xl sm:text-4xl
                      font-light leading-tight uppercase tracking-wide
                    "
                  >
                    PRISM AI
                  </h3>
                  <p className="text-black font-satoshi text-base sm:text-lg font-normal leading-normal max-w-md">
                    Your own personal assistant with spectrum of tasks.
                  </p>
                  <p className="text-[#08070D] font-satoshi text-base sm:text-lg font-normal leading-relaxed max-w-md">
                    A brief description about the product. How it helps the user. It's advantage from the competitors.
                  </p>
                  <button
                    className="
                      self-start inline-flex items-center justify-center
                      px-5 py-2.5
                      rounded-full border border-[#333]
                      bg-white
                      font-satoshi text-black text-sm sm:text-base font-medium
                      hover:bg-gray-100 transition-colors
                    "
                    aria-label="View Prism AI beta version"
                  >
                    View beta version
                  </button>
                </div>
              </div>
            </div>
            {/* /Glass Card */}
          </div>
        </div>
      </div>
      {/* /SCENE WRAPPER */}
    </section>
  );
}


