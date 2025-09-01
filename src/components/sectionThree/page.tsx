// app/animated-feature/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
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

  const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
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
  <div className="flex flex-col items-center justify-center text-center gap-y-3 sm:gap-y-4 snap-center bg-[#84adeb]">
    <Image
      src={src}
      alt={alt}
      width={160}
      height={200}
      className="h-auto w-32 sm:w-36 md:w-40 lg:w-[224px] object-contain mix-blend-screen"
      priority
    />

    <p className="font-satoshi text-black text-base sm:text-lg md:text-xl font-medium leading-snug">
      {label}
    </p>
  </div>
);

const NewsCard = ({ category, title, date }: { category: string; title: string; date: string }) => (
  <div className="flex flex-col relative w-full h-[clamp(360px,65vh,500px)] max-w-sm mx-auto rounded-lg bg-black/5 border border-white/40 backdrop-blur-md shadow-2xl shadow-black/10 p-6 snap-center z-2">
    <div className="w-full h-[54%] rounded-xl bg-white" />
    <div className="flex flex-col flex-grow mt-4 overflow-hidden min-h-0">
      <p className="text-[#333] font-satoshi italic font-normal text-base leading-5">{category}</p>
      <h3 className="mt-3 text-black font-satoshi text-lg md:text-xl font-medium leading-snug flex-grow line-clamp-2">
        {title}
      </h3>
      <div className="flex items-baseline gap-2 mt-3">
        <span className="text-black font-satoshi text-xs sm:text-sm font-medium whitespace-nowrap">
          Published on
        </span>
        <span className="text-black/50 font-satoshi text-xs sm:text-sm font-medium">
          {date}
        </span>
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

  // Moving cEdge
  const cEdgeRef = useRef<HTMLDivElement | null>(null);

  // Hero4
  const sectionFourRef = useRef<HTMLElement | null>(null);
  const newsTextRef = useRef<HTMLDivElement | null>(null);
  const newsGridRef = useRef<HTMLDivElement | null>(null);
  const newsControlsRef = useRef<HTMLDivElement | null>(null);

  // Hero4 decorative refs (cScreen4)
  const decoARef = useRef<HTMLDivElement | null>(null);
  const decoBRef = useRef<HTMLDivElement | null>(null);
  const decoCRef = useRef<HTMLDivElement | null>(null);
  const decoDRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const cloudyRef = useRef<HTMLDivElement | null>(null);

  const checkScroll = () => {
    if (newsGridRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = newsGridRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    ensureSmoothScroll();

    const setupAnimations = async () => {
      const mod = await import("gsap");
      const gsap = mod.gsap || (mod as any);
      const st = await import("gsap/ScrollTrigger");
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // HERO3 entry — start slightly below but within viewport so it doesn't "pop in" off-screen
      const riseTargets = [
        textBlockRef.current,
        gridRef.current,
        edgeRightRef.current,
        edgeLeftRef.current,
      ].filter(Boolean) as HTMLElement[];

      gsap.set(riseTargets, { y: "14vh", opacity: 0 });

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
        duration: 1.2,
        stagger: 0.12,
        clearProps: "transform,opacity",
      });

      // Horizontal slide (snap between screens)
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
            snapTo: (v: number) => Math.round(v),
            duration: 0.4,
            delay: 0.06,
            ease: "power1.inOut",
            directional: true,
          },
        },
      });

      tlHorizontal.to(trackRef.current, { xPercent: 0, ease: "none", duration: 1 });
      if (cloudyRef.current) {
        gsap.fromTo(
          cloudyRef.current,
          { y: "20vh", autoAlpha: 0 }, // start slightly below + hidden
          {
            y: "0vh",                  // settle at bottom (no extra offset)
            autoAlpha: 1,
            ease: "power2.out",
            duration: 1.5,
            scrollTrigger: {
              containerAnimation: tlHorizontal,
              trigger: sectionFourRef.current,
              start: "bottom center",  // when sectionFour bottom reaches viewport center
              toggleActions: "play none none reverse",
            },
          }
        );
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

      // HERO3 content exit
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

      // HERO4 entry (text/cards/controls)
      const hero4Targets = [newsTextRef.current, newsGridRef.current, newsControlsRef.current].filter(Boolean) as HTMLElement[];
      gsap.set(hero4Targets, { autoAlpha: 0 });

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

      // HERO4 decorative slow drift
      const hero4Decos = [decoARef.current, decoBRef.current, decoCRef.current, decoDRef.current].filter(Boolean) as HTMLElement[];
      gsap.set(hero4Decos, { autoAlpha: 0 });

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
        } catch { }
      };
    };

    const timeoutId = setTimeout(setupAnimations, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  /** cEdge: continuous horizontal motion from its CSS start position (desktop unchanged) */
  useEffect(() => {
    let tween: any;
    let resizeHandler: any;

    const start = async () => {
      const mod = await import("gsap");
      const gsap = mod.gsap || (mod as any);
      const el = cEdgeRef.current;
      if (!el) return;

      const play = () => {
        if (!el) return;
        const vw = window.innerWidth;
        const rect = el.getBoundingClientRect();
        const width = rect.width || 0;
        const total = vw + width;

        tween?.kill();
        gsap.set(el, { x: 0 });

        const speedPxPerSec = 100;
        const duration = total / speedPxPerSec;

        tween = gsap.to(el, {
          x: `+=${total}`,
          duration,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x: string) => {
              const v = parseFloat(x);
              return (v % total).toString();
            }),
          },
        });
      };

      play();
      resizeHandler = () => play();
      window.addEventListener("resize", resizeHandler);
    };




    start();

    return () => {
      try {
        tween?.kill();
      } catch { }
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    const grid = newsGridRef.current;
    if (!grid) return;

    grid.addEventListener("scroll", checkScroll);
    checkScroll();

    return () => {
      grid.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const scrollNews = (direction: "left" | "right") => {
    if (newsGridRef.current) {
      const scrollAmount = 320; // px per click (tweak to card width)
      newsGridRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <main>
      <style jsx global>{`
        .no-scrollbar { scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
      `}</style>

      <div ref={pinContainerRef} className="relative  w-full overflow-hidden ">
        <div ref={trackRef} className="relative w-[200vw] flex will-change-transform">
          {/* === HERO4 (first in track) === */}
          <section
            ref={sectionFourRef}
            className="relative w-screen flex-shrink-0 gradient3 isolate overflow-hidden px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-24 sh-pad"
            aria-label="News & Updates section"
          >
            <div
              ref={cloudyRef}
              className="absolute bottom-0 left-0 w-full pointer-events-none select-none z-0"
            >
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
              ref={cEdgeRef}
              className="pointer-events-none select-none absolute z-0 w-full flex justify-center"
              style={{ bottom: "-200px" }} // start off-screen at bottom
            >
              <Image
                src="/images/cInverted.svg"
                alt=""
                width={900}
                height={400}
                priority
                className="object-contain max-w-[90%] h-auto"
              />
            </div> */}


            <div className="mx-auto w-full px-5 sm:px-14">
              <div className="flex flex-col items-center gap-y-8 md:gap-y-14">
                <div ref={newsTextRef} className="w-full text-left">
                  <h2 className="font-satoshi text-black font-medium leading-tight text-[20px] sm:text-4xl lg:text-5xl">
                    <span className="italic">Winds of Change</span>
                    <span className="normal-case">: </span><br />
                    <span className="not-italic font-normal">News & Updates</span>
                  </h2>
                  <p className="mt-3 sm:mt-4 text-black font-satoshi text-[16px] sm:text-lg leading-relaxed">
                    From lab discoveries to real-world impact.<br className="hidden sm:block" />
                    Curated news, insights, and research that help you see what's next.
                  </p>
                </div>

                {/* NEWS: mobile horizontal scroller; md+/lg+ = grid */}
                <div
                  ref={newsGridRef}
                  className="grid gap-5 w-full grid-flow-col auto-cols-[80%] sm:auto-cols-[50%] md:auto-cols-[32%] overflow-x-auto snap-x snap-mandatory no-scrollbar"
                >
                  <NewsCard category="Big AI Research" title="Main title for the news/research" date="Aug 13, 2025" />
                  <NewsCard category="News & Updates" title="Another important update from the lab" date="Aug 11, 2025" />
                  <NewsCard category="Deep Learning" title="Breakthrough in neural network efficiency" date="Aug 09, 2025" />
                  <NewsCard category="News & Updates" title="Another important update from the lab" date="Aug 11, 2025" />
                  <NewsCard category="Deep Learning" title="Breakthrough in neural network efficiency" date="Aug 09, 2025" />
                </div>

                <div ref={newsControlsRef} className="flex items-center gap-3 z-10 -mt-2 sm:-mt-3 md:-mt-4 lg:-mt-6">
                  <button
                    onClick={() => scrollNews('left')}
                    type="button"
                    aria-label="Previous"
                    className={`inline-flex items-center justify-center w-10 h-10 p-0 rounded-full bg-[#A3A3A3]/80 shadow-sm hover:bg-[#A3A3A3] transition ${canScrollLeft ? "bg-white " : "bg-gray-300"
                      }`}
                    disabled={!canScrollLeft}
                  >
                    <Image src="/icons/arrowRightIcon.svg" alt="Previous" width={11} height={16} className="rotate-180" priority />
                  </button>
                  <span className="text-[#333] font-satoshi text-sm md:text-base font-medium select-none">1/2</span>
                  <button
                    onClick={() => scrollNews('right')}
                    type="button"
                    aria-label="Next"
                    className={`inline-flex items-center justify-center w-10 h-10 p-0 rounded-full bg-[#A3A3A3]/80 shadow-sm hover:bg-[#A3A3A3] transition ${canScrollRight ? "bg-white " : "bg-gray-300"
                      }`}
                    disabled={!canScrollRight}
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
            className="relative w-screen flex-shrink-0 gradient3 isolate overflow-hidden px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-24 sh-pad"
            aria-label="Third section"
          >
            {/* Desktop cloud positions preserved */}


            <div
              ref={cEdgeRef}
              className="pointer-events-none select-none absolute z-0 w-full"
              style={{ top: "700px", right: "1427px" }}
            >
              <Image src="/images/cInverted.svg" alt="" fill priority className="object-contain" />
            </div>

            <div className="mx-auto w-full px-5 sm:px-14">
              <div className="flex flex-col gap-y-2  md:gap-y-16 min-h-0">
                <div ref={textBlockRef} className="max-w-4xl text-left lg:ml-[0px]">
                  <h2 className="font-satoshi mx-auto text-black font-medium leading-tight text-[20px] sm:text-4xl lg:text-5xl">
                    Empowering Business Growth
                    <br className="hidden md:block" />
                    with Scalable Enterprise AI Solutions
                  </h2>
                  <p className="mt-5 max-w-3xl font-satoshi text-black/90 leading-relaxed text-lg sm:text-xl lg:text-2xl">
                    We are an <span className="font-bold italic">AI Research Lab, not just a company</span>. Our work spans Finance AI, Consumer AI, and Enterprise AI Systems, delivering measurable business outcomes.
                  </p>
                </div>

                {/* FEATURES */}
                <div
                  ref={gridRef}
                  className={`
                    flex flex-wrap justify-center gap-x-10 md:gap-x-20 lg:gap-x-[20%] xl:pt-[5%]
                  `}
                >
                  <div className="">
                    <FeatureItem src="/images/finance_ai.gif" alt="Finance AI Icon" label="Finance AI" />
                  </div>

                  <div >
                    <FeatureItem src="/images/consumer_ai.gif" alt="Consumer AI Icon" label="Consumer AI" />
                  </div>

                  <div className="">
                    <FeatureItem src="/images/enterprise_ai.gif" alt="Enterprise AI Icon" label="Enterprise AI Solution" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
