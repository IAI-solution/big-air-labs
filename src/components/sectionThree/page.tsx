// app/animated-feature/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

/** Lenis + ScrollTrigger bootstrap (singleton) */
async function ensureSmoothScroll() {
  if (typeof window === "undefined") return;
  if ((window as any).__lenis_ready) return;

  gsap.registerPlugin(ScrollTrigger);

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

/* ---------------- API Types (minimal) ---------------- */
type Blog = {
  id: string;
  title: string;
  description: string;
  category: string;
  hero_image?: string | null;
  created_at: string; // ISO
};

type BlogsResponse = {
  status: "success";
  data: {
    blogs: Blog[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      limit: number;
      has_next: boolean;
      has_prev: boolean;
    };
    filters: { category: string | null };
  };
};

/* ---------------- Small helpers ---------------- */
function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

const FeatureItem = ({
  src,
  alt,
  label,
  duplicates = 1,
  size = 304,
  boxHeight = 304,
}: {
  src: string;
  alt: string;
  label: string;
  duplicates?: number;
  size?: number;
  boxHeight?: number;
}) => (
  <div className="flex flex-col items-center justify-start text-center gap-y-3 sm:gap-y-4 snap-center bg-[#83afee0e] rounded-2xl shrink-0">
    <div className="relative flex items-center justify-center w-full" style={{ height: boxHeight }}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="h-auto object-contain mix-blend-screen"
        priority
      />
      {Array.from({ length: Math.max(0, duplicates - 1) }).map((_, i) => (
        <Image
          key={i}
          src={src}
          alt=""
          aria-hidden="true"
          width={size}
          height={size}
          className="absolute inset-0 m-auto h-auto object-contain mix-blend-screen pointer-events-none"
          priority
        />
      ))}
    </div>

    <p className="font-satoshi text-black text-base sm:text-lg md:text-xl font-medium leading-snug">
      {label}
    </p>
  </div>
);

/* ---------- NewsCard (now supports hero image) ---------- */
const NewsCard = ({
  href,
  category,
  title,
  date,
  hero,
}: {
  href: string;
  category: string;
  title: string;
  date: string;
  hero?: string | null;
}) => (
  <Link
    href={href}
    aria-label={`Read: ${title}`}
    className="group block snap-center focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-lg"
  >
    <article
      className="
        flex flex-col relative w-full h-auto max-w-sm mx-auto rounded-lg
        bg-[rgba(255,255,255,0.20)] border border-white/40 backdrop-blur-md
        shadow-2xl shadow-black/10 py-4 px-3 sm:px-4 md:px-5 z-2
        transition hover:bg-[rgba(255,255,255,0.40)]
      "
    >
      {/* keep exact wrapper sizing; place hero image inside */}
      <div className="w-full h-48 sm:h-56 md:h-64 rounded-xl bg-white overflow-hidden relative">
        {hero ? (
          <Image
            src={hero}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority
          />
        ) : null}
      </div>

      <div className="flex flex-col mt-3 gap-2">
        <p className="text-[#333] font-satoshi italic font-normal text-base leading-5">
          {category}
        </p>
        <h3 className="mt-1 text-black font-satoshi text-lg md:text-xl font-medium leading-snug line-clamp-2">
          {title}
        </h3>
        <div className="flex items-baseline justify-between gap-2 mt-2">
          {/* keep the right label the same */}
<div className="flex items-baseline gap-2 whitespace-nowrap">
  <span className="text-black font-satoshi text-xs sm:text-sm font-medium">
    Published on&nbsp;
  </span>
  <span className="text-black/50 font-satoshi text-xs sm:text-sm font-medium">
    {date}
  </span>
</div>

          <span
            className="
              opacity-0 group-hover:opacity-100 transition
              text-[#333] font-satoshi text-sm font-medium inline-flex items-center gap-1
            "
          >
            Read this <span aria-hidden>›</span>
          </span>
        </div>
      </div>
    </article>
  </Link>
);


export default function AnimatedPage() {
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Hero3
  const sectionThreeRef = useRef<HTMLElement | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);

  // Moving cEdge
  const cEdgeRef = useRef<HTMLDivElement | null>(null);

  // Hero4
  const sectionFourRef = useRef<HTMLElement | null>(null);
  const newsTextRef = useRef<HTMLDivElement | null>(null);
  const newsGridRef = useRef<HTMLDivElement | null>(null);
  const newsControlsRef = useRef<HTMLDivElement | null>(null);

  const marqueeWindowRef = useRef<HTMLDivElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /* ---------------- NEW: API state ---------------- */
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [blogError, setBlogError] = useState<string | null>(null);

  const checkScroll = () => {
    if (newsGridRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = newsGridRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    ensureSmoothScroll();

    const setupAnimations = async () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(trackRef.current, { xPercent: -50 });

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

      const hero4Targets = [newsTextRef.current, newsGridRef.current, newsControlsRef.current].filter(
        Boolean
      ) as HTMLElement[];
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

      return () => {
        try {
          ScrollTrigger?.getAll().forEach((s: any) => s.kill());
        } catch {}
      };
    };

    const timeoutId = setTimeout(setupAnimations, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let tween: any;
    let resizeHandler: any;

    const start = async () => {
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
      } catch {}
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

  // Mobile marquee auto-scroll (below 767px)
  useEffect(() => {
    const win = marqueeWindowRef.current;
    const track = marqueeTrackRef.current;
    if (!win || !track) return;

    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;

    let rafId = 0;
    let half = track.scrollWidth / 2;

    win.scrollLeft = half;

    const SPEED = 0.8; // px per frame

    const step = () => {
      win.scrollLeft -= SPEED; // move right
      if (win.scrollLeft <= 0) {
        half = track.scrollWidth / 2;
        win.scrollLeft += half; // seamless loop
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    const onResize = () => {
      if (!window.matchMedia("(max-width: 767px)").matches) {
        cancelAnimationFrame(rafId);
        return;
      }
      half = track.scrollWidth / 2;
      win.scrollLeft = Math.min(win.scrollLeft, half);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scrollNews = (direction: "left" | "right") => {
    if (newsGridRef.current) {
      const scrollAmount = 320;
      newsGridRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // NEW: Fetch blogs for the News & Updates scroller
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingBlogs(true);
        setBlogError(null);
        const res = await fetch("http://127.0.0.1:8000/blogs?page=1&limit=6", {
          headers: { accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BlogsResponse = await res.json();

        // sort newest first by created_at
        const sorted = [...(data?.data?.blogs || [])].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        if (!cancelled) {
          setBlogs(sorted);
          // ensure arrows reflect availability after content renders
          setTimeout(checkScroll, 0);
        }
      } catch (e: any) {
        if (!cancelled) setBlogError(e?.message || "Failed to load blogs");
      } finally {
        if (!cancelled) setLoadingBlogs(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Display utilities removed (no inline-flex here)
  const blogCtaClasses =
    "h-16 px-10 py-3 justify-center items-center gap-1 shrink-0 rounded-[40px] bg-[#242323] " +
    "text-white text-center font-satoshi font-medium leading-[1.5] md:text-[24px] text-[18px] hover:opacity-90 transition";

  return (
    <main>
      <style jsx global>{`
        .no-scrollbar {
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        html,
        body {
          overflow-x: hidden;
        }
        @media (max-width: 767px) {
        }
      `}</style>

      <div ref={pinContainerRef} className="relative w-full overflow-hidden">
        <div ref={trackRef} className="relative w-[200vw] flex will-change-transform">
          {/* === HERO4 (first in track) === */}
          <section
            ref={sectionFourRef}
            className="relative w-screen flex-shrink-0 gradient3 isolate overflow-hidden px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-24 sh-pad"
            aria-label="News & Updates section"
          >
            <div className="mx-auto w-full">
              <div className="flex flex-col items-center gap-y-8 md:gap-y-14">
                <div ref={newsTextRef} className="w-full text-left">
                  <h2 className="font-satoshi text-black font-medium leading-tight text-[20px] sm:text-4xl lg:text-5xl">
                    <span className="italic">Winds of Change</span>
                    <span className="normal-case">: </span>
                    <br />
                    <span className="not-italic font-normal">News & Updates</span>
                  </h2>

                  {/* Paragraph + Desktop CTA aligned in one row on md+ */}
                  <div className="mt-3 sm:mt-4 md:mt-5 md:flex md:items-end md:justify-start md:gap-6">
                    <p className="text-black font-satoshi text-[16px] sm:text-lg leading-relaxed md:mt-0 max-w-3xl">
                      From lab discoveries to real-world impact.
                      <br className="hidden sm:block" />
                      Curated news, insights, and research that help you see what's next.
                    </p>

                    {/* Desktop / tablet: CTA sits parallel to the text, pulled left */}
                    <Link
                      href="/blog"
                      aria-label="Go to Blog"
                      className={`hidden md:inline-flex md:ml-6 lg:ml-10 ${blogCtaClasses}`}
                    >
                      Go to Blog
                    </Link>
                  </div>
                </div>

                <div
                  ref={newsGridRef}
                  className="grid gap-5 w-full grid-flow-col auto-cols-[80%] sm:auto-cols-[50%] md:auto-cols-[32%] overflow-x-auto snap-x snap-mandatory no-scrollbar"
                >
                  {/* === REPLACED: Hard-coded cards -> API-driven === */}
                  {loadingBlogs && (
                    <>
                      <NewsCard href="#" category="Loading…" title="Loading…" date="—" />
                      <NewsCard href="#" category="Loading…" title="Loading…" date="—" />
                      <NewsCard href="#" category="Loading…" title="Loading…" date="—" />
                    </>
                  )}

                  {!loadingBlogs && blogError && (
                    <>
                      <NewsCard href="/blog" category="Error" title={blogError} date="" />
                    </>
                  )}

                  {!loadingBlogs &&
                    !blogError &&
blogs.map((b) => (
  <NewsCard
    key={b.id}
    href={`/blog/${b.id}`}
    category={b.category || "—"}
    title={b.title}
    date={formatDate(b.created_at)}
    hero={b.hero_image}
  />
))
}
                </div>

                <div
                  ref={newsControlsRef}
                  className="flex flex-col items-center gap-4 z-10 -mt-2 sm:-mt-3 md:-mt-4 lg:-mt-6 w-full"
                >
                  {/* Arrow controls (unchanged) */}
                  {/* <div className="flex items-center gap-3">
                    <button
                      onClick={() => scrollNews("left")}
                      type="button"
                      aria-label="Previous"
                      className={`inline-flex items-center justify-center w-10 h-10 p-0 rounded-full bg-[#A3A3A3]/80 shadow-sm hover:bg-[#A3A3A3] transition ${
                        canScrollLeft ? "bg-white " : "bg-gray-300"
                      }`}
                      disabled={!canScrollLeft}
                    >
                      <Image
                        src="/icons/arrowRightIcon.svg"
                        alt="Previous"
                        width={11}
                        height={16}
                        className="rotate-180"
                        priority
                      />
                    </button>
                    <span className="text-[#333] font-satoshi text-sm md:text-base font-medium select-none">
                      1/2
                    </span>
                    <button
                      onClick={() => scrollNews("right")}
                      type="button"
                      aria-label="Next"
                      className={`inline-flex items-center justify-center w-10 h-10 p-0 rounded-full bg-[#A3A3A3]/80 shadow-sm hover:bg-[#A3A3A3] transition ${
                        canScrollRight ? "bg-white " : "bg-gray-300"
                      }`}
                      disabled={!canScrollRight}
                    >
                      <Image
                        src="/icons/arrowRightIcon.svg"
                        alt="Next"
                        width={11}
                        height={16}
                        priority
                      />
                    </button>
                  </div> */}

                  {/* Mobile-only: CTA appears directly below the arrows */}
                  <div className="w-full md:hidden px-1">
                    <Link
                      href="/blog"
                      aria-label="Go to Blog"
                      className={`inline-flex w-full ${blogCtaClasses}`}
                    >
                      Go to Blog
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* === HERO3 (second in track; visible on load) === */}
          <section
            ref={sectionThreeRef}
            className="relative w-screen flex-shrink-0 gradient3 isolate overflow-hidden pt-20 sm:pt-24 pb-16 sm:pb-24 sh-pad"
            aria-label="Third section"
          >
            <div
              ref={cEdgeRef}
              className="pointer-events-none select-none absolute z-0 w-full"
              style={{ top: "700px", right: "1427px" }}
            >
              <Image src="/images/cInverted.svg" alt="" fill priority className="object-contain" />
            </div>

            <div className="mx-auto w-full">
              <div className="flex flex-col gap-y-8 md:gap-y-12 min-h-0">
                <div ref={textBlockRef} className="max-w-4xl text-left lg:ml-[0px] px-4 sm:px-6">
                  <h2 className="font-satoshi mx-auto text-black font-medium leading-tight text-[20px] sm:text-4xl lg:text-5xl">
                    Empowering Business Growth
                    <br className="hidden md:block" />
                    with Scalable Enterprise AI Solutions
                  </h2>
                  <p className="mt-5 max-w-3xl font-satoshi text-black/90 leading-relaxed text-lg sm:text-xl lg:text-2xl">
                    We are an <span className="font-bold italic">AI Research Lab, not just a company</span>. Our work spans Finance AI,
                    Consumer AI, and Enterprise AI Systems, delivering measurable business outcomes.
                  </p>
                </div>

                {/* Small-screen marquee row (below 767px) */}
                <div ref={marqueeWindowRef} className="relative w-full overflow-hidden block md:hidden">
                  <div ref={marqueeTrackRef} className="flex items-stretch gap-4">
                    {/* ... FeatureItem components ... */}
                    <FeatureItem
                      src="/images/finance_ai.gif"
                      alt="Finance AI Icon"
                      label="Finance AI"
                      size={240}
                      boxHeight={304}
                      duplicates={1}
                    />
                    <FeatureItem
                      src="/images/consumer_ai.gif"
                      alt="Consumer AI Icon"
                      label="Consumer AI"
                      size={304}
                      boxHeight={304}
                      duplicates={4}
                    />
                    <FeatureItem
                      src="/images/enterprise_ai.gif"
                      alt="Enterprise AI Icon"
                      label="Enterprise AI Solution"
                      size={304}
                      boxHeight={304}
                      duplicates={2}
                    />
                    {/* duplicate set for seamless loop */}
                    <FeatureItem
                      src="/images/finance_ai.gif"
                      alt="Finance AI Icon"
                      label="Finance AI"
                      size={240}
                      boxHeight={304}
                      duplicates={1}
                    />
                    <FeatureItem
                      src="/images/consumer_ai.gif"
                      alt="Consumer AI Icon"
                      label="Consumer AI"
                      size={304}
                      boxHeight={304}
                      duplicates={4}
                    />
                    <FeatureItem
                      src="/images/enterprise_ai.gif"
                      alt="Enterprise AI Icon"
                      label="Enterprise AI Solution"
                      size={304}
                      boxHeight={304}
                      duplicates={2}
                    />
                  </div>
                </div>

                {/* Original grid for md+ */}
                <div className="hidden md:grid md:grid-cols-3 md:gap-y-10 md:gap-x-10 justify-items-center md:justify-items-stretch">
                  {/* ... FeatureItem components ... */}
                  <FeatureItem
                    src="/images/finance_ai.gif"
                    alt="Finance AI Icon"
                    label="Finance AI"
                    size={240}
                    boxHeight={304}
                    duplicates={1}
                  />

                  <FeatureItem
                    src="/images/consumer_ai.gif"
                    alt="Consumer AI Icon"
                    label="Consumer AI"
                    size={304}
                    boxHeight={304}
                    duplicates={4}
                  />

                  <FeatureItem
                    src="/images/enterprise_ai.gif"
                    alt="Enterprise AI Icon"
                    label="Enterprise AI Solution"
                    size={304}
                    boxHeight={304}
                    duplicates={2}
                  />
                </div>

                <div className="w-full flex justify-center mt-8 md:-mt-8 lg:-mt-4">
                  <Link
                    href="/#contact"
                    onClick={scrollToContact}
                    className="
                      inline-flex items-center justify-center
                      rounded-[40px] bg-[#242323] text-white
                      font-satoshi font-medium leading-[1.5]
                      min-w-[264px] h-11 text-[16px]
                      md:min-w-0 md:h-16 md:text-[20px]
                      px-6 md:px-[49px]
                      whitespace-nowrap
                    "
                  >
                    Book private strategy session
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
