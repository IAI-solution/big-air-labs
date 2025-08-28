// app/animated-feature/page.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/** Lenis + ScrollTrigger bootstrap (singleton) */
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

const FeatureItem = ({ src, alt, label }: { src: string; alt: string; label: string }) => (
  <div className="flex flex-col items-center text-center gap-y-4">
    <Image src={src} alt={alt} width={137} height={179} className="h-auto w-28 sm:w-32 md:w-36 object-contain" priority />
    <p className="font-satoshi text-black text-lg sm:text-xl font-medium leading-snug">{label}</p>
  </div>
);

const NewsCard = ({ category, title, date }: { category: string; title: string; date: string }) => (
  <div className="flex flex-col relative w-full h-auto aspect-[360/520] max-w-sm mx-auto rounded-lg bg-black/5 border border-white/40 backdrop-blur-md shadow-2xl shadow-black/10 p-6">
    <div className="w-full h-[54%] rounded-xl bg-white" />
    <div className="flex flex-col flex-grow mt-4">
      <p className="text-[#333] font-satoshi italic font-normal text-base leading-5">{category}</p>
      <h3 className="mt-3 text-black font-satoshi text-lg md:text-xl font-medium leading-snug flex-grow">{title}</h3>
      <div className="flex items-baseline gap-2 mt-3">
        <span className="text-black font-satoshi text-sm font-medium">Published on</span>
        <span className="text-black/50 font-satoshi text-sm font-medium">{date}</span>
      </div>
    </div>
  </div>
);

export default function AnimatedPage() {
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Hero3
  const sectionThreeRef = useRef<HTMLElement | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const edgeRightRef = useRef<HTMLDivElement | null>(null);
  const edgeLeftRef = useRef<HTMLDivElement | null>(null);

  // Hero4
  const sectionFourRef = useRef<HTMLElement | null>(null);
  const newsTextRef = useRef<HTMLDivElement | null>(null);
  const newsGridRef = useRef<HTMLDivElement | null>(null);
  const newsControlsRef = useRef<HTMLDivElement | null>(null);

  // Hero4 decorative refs (cScreen4)
  const decoARef = useRef<HTMLDivElement | null>(null); // top:600 left:200
  const decoBRef = useRef<HTMLDivElement | null>(null); // top:620 left:515
  const decoCRef = useRef<HTMLDivElement | null>(null); // top:620 left:815
  const decoDRef = useRef<HTMLDivElement | null>(null); // top:620 left:1015

  useEffect(() => {
    ensureSmoothScroll();

    const setupAnimations = async () => {
      const mod = await import("gsap");
      const gsap = mod.gsap || (mod as any);
      const st = await import("gsap/ScrollTrigger");
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // --- HERO3 entry (slower, deeper rise) ---
      const riseTargets = [
        textBlockRef.current,
        gridRef.current,
        edgeRightRef.current,
        edgeLeftRef.current,
      ].filter(Boolean) as HTMLElement[];

      gsap.set(riseTargets, { y: "60vh", opacity: 0 });

      const tlRise = gsap.timeline({
        scrollTrigger: {
          trigger: sectionThreeRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power2.out" },
      });

      tlRise.to(riseTargets, {
        y: 0,
        opacity: 1,
        duration: 2.2,
        stagger: 0.12,
        clearProps: "transform,opacity",
      });

      // --- Horizontal slide (snap to either screen) ---
      gsap.set(trackRef.current, { xPercent: -50 }); // Hero3 visible on load

      const tlHorizontal = gsap.timeline({
        scrollTrigger: {
          trigger: pinContainerRef.current,
          pin: true,
          scrub: 1.05,
          start: "top top",
          end: "+=160%",
          anticipatePin: 1,
          snap: {
            snapTo: (v: number) => Math.round(v), // 0 or 1
            duration: 0.4,
            delay: 0.06,
            ease: "power1.inOut",
            directional: true,
          },
        },
      });

      tlHorizontal.to(trackRef.current, { xPercent: 0, ease: "none", duration: 1 });

      // --- HERO3 clouds parallax during handoff ---
      if (edgeRightRef.current) {
        gsap.to(edgeRightRef.current, {
          x: "22vw",
          y: "-4vh",
          ease: "none",
          scrollTrigger: {
            containerAnimation: tlHorizontal,
            trigger: sectionThreeRef.current,
            start: "center center",
            end: "right center",
            scrub: 1,
          },
        });
      }
      if (edgeLeftRef.current) {
        gsap.to(edgeLeftRef.current, {
          x: "18vw",
          y: "3vh",
          ease: "none",
          scrollTrigger: {
            containerAnimation: tlHorizontal,
            trigger: sectionThreeRef.current,
            start: "center center",
            end: "right center",
            scrub: 1,
          },
        });
      }

      // --- HERO3 content exit
      const hero3ExitTargets = [textBlockRef.current, gridRef.current].filter(Boolean) as HTMLElement[];
      gsap.to(hero3ExitTargets, {
        x: "40vw",
        ease: "power2.inOut",
        scrollTrigger: {
          containerAnimation: tlHorizontal,
          trigger: sectionThreeRef.current,
          start: "center center",
          end: "right center",
          scrub: 1,
        },
      });

      // --- HERO4 entry: text/cards/controls (HIDE initially, then slide-in) ---
      const hero4Targets = [newsTextRef.current, newsGridRef.current, newsControlsRef.current].filter(Boolean) as HTMLElement[];
      gsap.set(hero4Targets, { autoAlpha: 0 }); // <-- hide until triggered

      gsap.fromTo(
        hero4Targets,
        { x: "-60vw", autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          ease: "power2.out",
          clearProps: "transform,opacity,visibility",
          immediateRender: false,
          scrollTrigger: {
            containerAnimation: tlHorizontal,
            trigger: sectionFourRef.current,
            start: "right center",
            end: "center center",
            scrub: 1.1,
          },
        }
      );

      // --- HERO4 decorative cScreen4 (HIDE initially, then slow parallax in) ---
      const hero4Decos = [
        decoARef.current,
        decoBRef.current,
        decoCRef.current,
        decoDRef.current,
      ].filter(Boolean) as HTMLElement[];

      gsap.set(hero4Decos, { autoAlpha: 0 }); // <-- hide until start

      gsap.fromTo(
        hero4Decos,
        { x: "-35vw", autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          ease: "power1.out",
          stagger: 0.08,
          clearProps: "transform,opacity,visibility",
          immediateRender: false,
          scrollTrigger: {
            containerAnimation: tlHorizontal,
            trigger: sectionFourRef.current,
            start: "right center",
            end: "center center",
            scrub: 1.1,
          },
        }
      );

      // slight drift while you linger on Hero4
      hero4Decos.forEach((el, i) => {
        gsap.to(el, {
          x: `${(i + 1) * 2}vw`,
          y: i % 2 === 0 ? "-2vh" : "2vh",
          ease: "none",
          scrollTrigger: {
            containerAnimation: tlHorizontal,
            trigger: sectionFourRef.current,
            start: "center center",
            end: "left center",
            scrub: 1,
          },
        });
      });

      return () => {
        try {
          ScrollTrigger?.getAll().forEach((s: any) => s.kill());
        } catch {}
      };
    };

    const timeoutId = setTimeout(setupAnimations, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <main>
      {/* Hide x-scrollbar globally while this page is mounted */}
      <style jsx global>{`
        html, body { overflow-x: hidden; }
      `}</style>

      <div ref={pinContainerRef} className="relative h-screen w-full overflow-hidden">
        <div ref={trackRef} className="relative h-full w-[200vw] flex will-change-transform">
          {/* === HERO4 (first in track) === */}
          <section
            ref={sectionFourRef}
            className="relative w-screen h-screen flex-shrink-0 gradient3 isolate overflow-hidden pt-24 sm:pt-28 pb-24 "
            aria-label="News & Updates section"
          >
            {/* cScreen4 decorative — exact desktop positions preserved */}
            {/* <div
              ref={decoBRef}
              className="pointer-events-none select-none absolute z-0"
              style={{ top: "600px", left: "200px" }}
            >
              <Image src="/images/cloudy.svg" alt="" width={100} height={100} className="w-auto h-auto" priority />
            </div> */}
             <div className="absolute bottom-0 left-0 w-full pointer-events-none select-none">
    <Image
      src="/images/cloudy.svg"
      alt=""
      width={1920}
      height={400}
      priority
      className="w-full h-auto object-cover"
    />
  </div>

            {/* <div
              ref={decoCRef}
              className="pointer-events-none select-none absolute z-0"
              style={{ top: "620px", left: "815px" }}
            >
              <Image src="/images/cScreen4.svg" alt="" width={100} height={100} className="w-auto h-auto" priority />
            </div>

            <div
              ref={decoDRef}
              className="pointer-events-none select-none absolute z-0"
              style={{ top: "620px", left: "1015px" }}
            >
              <Image src="/images/cScreen4.svg" alt="" width={100} height={100} className="w-auto h-auto" priority />
            </div>

            <div
              ref={decoARef}
              className="pointer-events-none select-none absolute z-0"
              style={{ top: "600px", left: "200px" }}
            >
              <Image src="/images/cScreen4.svg" alt="" width={100} height={100} className="w-auto h-auto" priority />
            </div> */}

            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
              <div className="flex flex-col items-center gap-y-10 md:gap-y-14">
                <div ref={newsTextRef} className="w-full max-w-5xl text-center lg:text-left">
                  <h2 className="text-[#333] font-satoshi uppercase tracking-wide text-3xl md:text-4xl">
                    <span className="italic font-light">Winds of Change</span>
                    <span className="normal-case">: </span>
                    <span className="not-italic font-normal">News & Updates</span>
                  </h2>
                  <p className="mt-4 text-black font-satoshi text-base md:text-lg leading-relaxed">
                    From lab discoveries to real-world impact.<br className="hidden sm:block" />
                    Curated news, insights, and research that help you see what's next.
                  </p>
                </div>

                <div ref={newsGridRef} className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <NewsCard category="Big AI Research" title="Main title for the news/research" date="Aug 13, 2025" />
                  <NewsCard category="News & Updates" title="Another important update from the lab" date="Aug 11, 2025" />
                  <NewsCard category="Deep Learning" title="Breakthrough in neural network efficiency" date="Aug 09, 2025" />
                </div>

                <div ref={newsControlsRef} className="flex items-center gap-3 z-10 -mt-2 sm:-mt-3 md:-mt-4 lg:-mt-6">
                  <button
                    type="button"
                    aria-label="Previous"
                    className="inline-flex items-center justify-center w-10 h-10 p-0 rounded-full bg-[#A3A3A3]/80 shadow-sm hover:bg-[#A3A3A3] transition"
                  >
                    <Image src="/icons/arrowRightIcon.svg" alt="Previous" width={11} height={16} className="rotate-180" priority />
                  </button>
                  <span className="text-[#333] font-satoshi text-sm md:text-base font-medium select-none">1/2</span>
                  <button
                    type="button"
                    aria-label="Next"
                    className="inline-flex items-center justify-center w-10 h-10 p-0 rounded-full bg-white shadow-sm hover:bg-gray-100 transition"
                  >
                    <Image src="/icons/arrowRightIcon.svg" alt="Next" width={11} height={16} priority />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* === HERO3 (second in track; visible on load) === */}
          <section
            ref={sectionThreeRef}
            className="relative w-screen h-screen flex-shrink-0 flex items-center py-12 sm:py-16 gradient3 isolate overflow-hidden"
            aria-label="Third section"
          >
            {/* Clouds (kept at your exact desktop positions) */}
            <div
              ref={edgeRightRef}
              className="pointer-events-none select-none absolute z-0"
              style={{ top: "350px", left: "1427px" }}
            >
              <Image src="/images/cEdgeRightScreen3.svg" alt="" width={100} height={100} className="w-auto h-auto" priority />
            </div>
            <div
              ref={edgeLeftRef}
              className="pointer-events-none select-none absolute z-0"
              style={{ top: "640px", right: "1550px" }}
            >

            </div>

            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
              <div className="flex flex-col items-center gap-y-12 md:gap-y-16">
                <div ref={textBlockRef} className="max-w-4xl text-center">
                  <h2 className="font-satoshi text-black font-medium leading-tight text-3xl sm:text-4xl lg:text-5xl">
                    Empowering Business Growth
                    <br className="hidden md:block" />
                    with Scalable Enterprise AI Solutions
                  </h2>
                  <p className="mt-5 max-w-3xl mx-auto font-satoshi text-black/90 leading-relaxed text-lg sm:text-xl lg:text-2xl">
                    We are an <span className="font-bold italic">AI Research Lab, not just a company</span>. Our work spans Finance AI, Consumer AI, and Enterprise AI Systems, delivering measurable business outcomes.
                  </p>
                </div>

                <div ref={gridRef} className="grid w-full grid-cols-1 md:grid-cols-3 gap-10 sm:gap-8">
                  <FeatureItem src="/images/rings.svg" alt="Finance AI Icon" label="Finance AI" />
                  <FeatureItem src="/images/stars.svg" alt="Consumer AI Icon" label="Consumer AI" />
                  <FeatureItem src="/images/circles.svg" alt="Enterprise AI Solution Icon" label="Enterprise AI Solution" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
