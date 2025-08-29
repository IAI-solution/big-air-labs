// app/sectionFive/page.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* ----------------- Lenis + GSAP Bootstrap ----------------- */
async function ensureSmoothScroll() {
  if (typeof window === "undefined") return;
  if ((window as any).__lenis_ready) return;

  const [{ default: Lenis }, gsapModule] = await Promise.all([
    import("@studio-freight/lenis"),
    import("gsap"),
  ]);
  const gsap = gsapModule.gsap || (gsapModule as any);

  const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
  (window as any).__lenis_ready = true;
  (window as any).__lenis = lenis;

  lenis.on("scroll", () => {
    (gsap as any).plugins?.ScrollTrigger?.update?.();
  });

  gsap.ticker.add((t: number) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ----------------- Shared Components ----------------- */
const FeatureItem = ({ title, description }: { title: string; description: string }) => (
  <div>
    <h3 className="text-black font-satoshi font-medium text-[20px] sm:text-[22px] md:text-[24px] leading-[150%]">
      {title}
    </h3>
    <p className="mt-1 text-black font-satoshi font-normal text-[18px] sm:text-[20px] md:text-[24px] leading-[150%]">
      {description}
    </p>
  </div>
);

export default function Hero5() {
  const router = useRouter();

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingBlockRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const landscapeWrapRef = useRef<HTMLDivElement | null>(null);
  const bottomWaveRef = useRef<HTMLDivElement | null>(null);
  const cScreen4Ref = useRef<HTMLDivElement | null>(null);
  const cHalfScreen5Ref = useRef<HTMLDivElement | null>(null);

  const loadGsap = async () => {
    const mod = await import("gsap");
    return mod.gsap || (mod as any);
  };

  // ENTRANCE via IntersectionObserver -> then start cloud loop AFTER entrance completes
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let played = false;

    // cloud-loop state
    let resizeHandler: (() => void) | null = null;
    let cloudAnims: any[] = [];

    const teardownCloudLoop = (gsap: any) => {
      cloudAnims.forEach((a) => a?.kill?.());
      cloudAnims = [];
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
        resizeHandler = null;
      }
    };

    const startCloudLoop = (gsap: any) => {
      const clouds = [cScreen4Ref.current, cHalfScreen5Ref.current].filter(Boolean) as HTMLElement[];
      const speeds = [90, 60]; // px/sec for each cloud

      const startAll = () => {
        // kill old
        cloudAnims.forEach((a) => a?.kill?.());
        cloudAnims = [];

        clouds.forEach((el, i) => {
          const rect = el.getBoundingClientRect();
          const vw = window.innerWidth;
          const width = rect.width;
          const totalWidth = vw + width + 200; // extra buffer off-screen right
          const duration = totalWidth / (speeds[i] || 80);

          // Start where entrance left it (x: 0), then move right forever
          gsap.set(el, { x: 0 });

          const tween = gsap.to(el, {
            x: `+=${totalWidth}`,
            duration,
            ease: "none",
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize((x: string) => {
                const n = parseFloat(x);
                return (n % totalWidth) + "";
              }),
            },
          });

          cloudAnims.push(tween);
        });
      };

      startAll();
      resizeHandler = () => startAll();
      window.addEventListener("resize", resizeHandler);
    };

    (async () => {
      await ensureSmoothScroll();
      const gsap = await loadGsap();

      const targets = [
        headingBlockRef.current,
        featuresRef.current,
        cScreen4Ref.current,
        cHalfScreen5Ref.current,
        ctaRef.current,
        landscapeWrapRef.current,
        bottomWaveRef.current,
      ].filter(Boolean) as HTMLElement[];

      // Prepare entrance
      gsap.set(targets, { y: "60vh", opacity: 0 });

      const node = sectionRef.current;
      if (!node) return;

      observer = new IntersectionObserver(
        async (entries) => {
          const entry = entries[0];
          if (!entry) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.15 && !played) {
            played = true;

            // 1) Play entrance first
            await gsap.to(targets, {
              y: 0,
              opacity: 1,
              duration: 5,
              stagger: 0.2,
              ease: "power2.out",
              clearProps: "transform,opacity",
            });

            // 2) THEN start the endless horizontal cloud loop
            startCloudLoop(gsap);

            observer?.disconnect();
          }
        },
        { root: null, threshold: [0, 0.15, 0.5, 1] }
      );

      observer.observe(node);

      // Cleanup when leaving/unmounting
      return () => {
        teardownCloudLoop(gsap);
      };
    })();

    return () => {
      try {
        observer?.disconnect();
      } catch {}
    };
  }, []);

  const playExitAndNavigate = async (href: string) => {
    const gsap = await loadGsap();
    if ((sectionRef.current as any)?._leaving) return;
    (sectionRef.current as any)._leaving = true;

    if (sectionRef.current) sectionRef.current.style.pointerEvents = "none";

    await gsap.to(sectionRef.current, {
      y: "-25vh",
      opacity: 0,
      filter: "blur(6px)",
      duration: 1.8,
      ease: "power1.inOut",
    });

    router.push(href);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen gradient5 overflow-hidden flex flex-col"
      aria-label="Playground section"
    >
      {/* Decorative Clouds as background-like elements (reduced sizes) */}
      <div
        ref={cScreen4Ref}
        className="pointer-events-none select-none absolute z-0"
        style={{ top: "35%", left: "-5%" }}
      >
        <Image
          src="/images/cScreen4.svg"
          alt=""
          width={1600}
          height={800}
          priority
          className="h-auto w-[300px] sm:w-[450px] md:w-[600px] lg:w-[750px] opacity-80"
        />
      </div>

      <div
        ref={cHalfScreen5Ref}
        className="pointer-events-none select-none absolute z-0"
        style={{ top: "7%", right: "70%" }}
      >
        <Image
          src="/images/cHalfScreen5.svg"
          alt=""
          width={1600}
          height={800}
          priority
          className="h-auto w-[250px] sm:w-[400px] md:w-[550px] lg:w-[700px] opacity-80"
        />
      </div>

      {/* Top content */}
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 md:pt-28 z-10">
        <div ref={headingBlockRef} className="max-w-4xl">
          <h2 className="text-[#333] font-satoshi font-medium text-[28px] sm:text-[32px] md:text-[36px] leading-[1.4] tracking-[1px]">
            A PLAYGROUND FOR CURIOSITY
          </h2>
          <p className="mt-5 text-black font-satoshi font-normal text-[18px] sm:text-[22px] md:text-[24px] leading-[1.5]">
            We believe breakthroughs are born from bold questions. That’s why we provide:
          </p>

          <div ref={featuresRef} className="mt-10 sm:mt-12 flex flex-col gap-y-8">
            <FeatureItem
              title="Open experimentation"
              description="Sandbox environments & datasets for fearless prototyping."
            />
            <FeatureItem
              title="Guided Lift-Off:"
              description="Weekly mentor sessions, code reviews & architecture deep dives."
            />
            <FeatureItem
              title="Show & Tell Hangouts:"
              description="Monthly demos where prototypes evolve into products."
            />
          </div>
        </div>
      </div>

      {/* Bottom CTA + landscape */}
      <div className="relative w-full mt-auto pt-20">
        <div
          ref={landscapeWrapRef}
          className="pointer-events-none select-none absolute inset-x-0 bottom-0 z-0"
          aria-hidden="true"
        >
          <Image
            src="/images/landscape.png"
            alt=""
            width={2884}
            height={888}
            priority
            className="w-full h-auto max-h-[85vh] object-cover"
          />
        </div>

        <div
          ref={ctaRef}
          className="relative z-30 px-4 sm:px-5 pb-12 sm:pb-16 md:pb-20"
        >
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8 gap-4 rounded-xl bg-white/10 border border-white/40 shadow-2xl shadow-black/10 backdrop-blur-lg">
            <p className="text-white font-satoshi font-medium uppercase text-[16px]/[1.2] xs:text-[18px] sm:text-[28px] md:text-[32px] lg:text-[36px] tracking-[1px]">
              Let’s create the future of smart AI together
            </p>
            <div className="mt-1 flex items-center gap-2 sm:gap-4 md:gap-6">
              <a
                href="/careers"
                onClick={(e) => {
                  e.preventDefault();
                  playExitAndNavigate("/careers");
                }}
                className="flex items-center justify-center w-32 h-11 xs:w-36 xs:h-12 sm:w-[180px] sm:h-[56px] md:w-[200px] md:h-[64px] rounded-[40px] bg-white text-[#333] font-satoshi font-medium text-sm xs:text-base sm:text-[18px] md:text-[20px] transition hover:bg-gray-100"
              >
                Careers
              </a>
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  playExitAndNavigate("/contact");
                }}
                className="flex items-center justify-center w-32 h-11 xs:w-36 xs:h-12 sm:w-[180px] sm:h-[56px] md:w-[200px] md	h-[64px] rounded-[40px] bg-[#333] text-white font-satoshi font-medium text-sm xs:text-base sm:text-[18px] md:text-[20px] transition hover:bg-black"
              >
                Talk to us
              </a>
            </div>
          </div>
        </div>

        <div
          ref={bottomWaveRef}
          className="pointer-events-none select-none absolute inset-x-0 bottom-0 h-20 z-20"
          aria-hidden="true"
        >
          <Image
            src="/images/bottomWhite.svg"
            alt=""
            fill
            priority
            className="object-cover"
            style={{ filter: "blur(12px)" }}
          />
        </div>
      </div>
    </section>
  );
}
