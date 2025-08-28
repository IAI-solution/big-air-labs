"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const c1Ref = useRef<HTMLSpanElement | null>(null);
  const c2Ref = useRef<HTMLSpanElement | null>(null);
  const c3Ref = useRef<HTMLSpanElement | null>(null);
  const c4Ref = useRef<HTMLSpanElement | null>(null);


  useEffect(() => {
    const elements = [c1Ref.current, c2Ref.current, c3Ref.current];
    const speeds = [180, 100, 80, 120]; // new cloud speed, adjust as desired
    const anims: gsap.core.Tween[] = [];

    const startAll = () => {
      anims.forEach((a) => a.kill());
      anims.length = 0;

      elements.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vw = window.innerWidth;
        const width = rect.width;
        const totalWidth = vw + width;
        const duration = totalWidth / speeds[i];

        gsap.set(el, { x: -width }); // fully off-screen left

        // For the 4th cloud, fade in opacity delayed
        if (i === 3) {
          gsap.to(el, { opacity: 1, duration: 2, delay: 3 });
        }

        anims.push(
          gsap.to(el, {
            x: `+=${totalWidth}`,
            duration,
            ease: "none",
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
            },
          })
        );
      });
    };

    startAll();

    window.addEventListener("resize", startAll);

    return () => {
      window.removeEventListener("resize", startAll);
      anims.forEach((a) => a.kill());
    };
  }, []);

  useEffect(() => {
    if (!c4Ref.current) return;

    const el = c4Ref.current.parentElement!;
    const vw = window.innerWidth;
    const width = el.getBoundingClientRect().width;
    const totalWidth = vw + width;
    const durationMove = totalWidth / 120; // Adjust scroll speed

    const tl = gsap.timeline({ repeat: -1 });

    // Start fully off-screen left
    gsap.set(el, { x: -width, opacity: 0 });

    tl.to(el, { opacity: 1, duration: 1 }) // fade in
      .to(el, { x: `+=${totalWidth}`, duration: durationMove, ease: "none" }) // move across screen
      .to(el, { opacity: 0, duration: 1 }) // fade out
      .set(el, { x: -width }); // reset position instantly to off-screen left to start again
  }, []);


  return (
    <section
      ref={sectionRef}
      className="relative w-full isolate overflow-x-clip
             px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12
             min-h-[700px] sm:min-h-[800px] md:min-h-[80vh] lg:p-[10vh]  lg:pt-[25vh] lg:min-h-screen
             [background:linear-gradient(180deg,#FFFFFF_0%,#E3F7FF_20%,#B1CCFF_100%)]
             bg-repeat bg-cover"
      aria-label="Big Air Lab hero"
    >
      <div aria-hidden="true" className="absolute inset-0 gradient -z-10" />

      <div className="mx-auto w-full">
        <div className="max-w-[1120px] relative z-10">
          {/* Clouds */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0 left-0 top-[-120px]"
          >
            <span
              ref={c1Ref}
              className="block will-change-transform [transform:translate3d(-1000px,-50px,0)]"
            >
              <Image
                src="/images/cTop.svg"
                alt=""
                width={903}
                height={376}
                priority
                role="presentation"
                className="w-[700px] sm:w-[820px] md:w-[903px] max-w-full h-auto aspect-[293/122] select-none"
                draggable={false}
              />
            </span>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0 left-0 top-[120px]"
          >
            <span
              ref={c2Ref}
              className="block will-change-transform [transform:translate3d(-1000px,0,0)]"
            >
              <Image
                src="/images/cBottom.svg"
                alt=""
                width={903}
                height={376}
                priority
                role="presentation"
                className="w-[700px] sm:w-[820px] md:w-[903px] max-w-full h-auto aspect-[293/122] select-none"
                draggable={false}
              />
            </span>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0 left-0 top-[420px]"
          >
            <span
              ref={c3Ref}
              className="block will-change-transform [transform:translate3d(-1000px,0,0)]"
            >
              <Image
                src="/images/cInverted.svg"
                alt=""
                width={903}
                height={376}
                priority
                role="presentation"
                className="w-[700px] sm:w-[820px] md:w-[903px] max-w-full h-auto aspect-[293/122] select-none"
                draggable={false}
              />
            </span>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 z-20"
          >
            <span ref={c4Ref} className="block will-change-transform [transform:translate3d(100%,30%,0)]">
              <Image
                src="/images/cBottom.svg"
                alt=""
                width={903}
                height={376}
                priority
                role="presentation"
                className="w-[700px] sm:w-[820px] md:w-[903px] max-w-full h-auto aspect-[293/122] select-none"
                draggable={false}
              />
            </span>
          </div>

          {/* Text content */}
          <div className="relative z-20">
            <h1 className="font-satoshi font-bold uppercase text-[#333] text-[clamp(36px,6.8vw,80px)] leading-[1.2] lg:leading-[120px] break-words">
              BIG AIR LAB
            </h1>

            <p className="mt-2 font-satoshi font-bold uppercase text-[#333] text-[clamp(14px,2.4vw,28px)] leading-snug">
              WE BUILD{" "}
              <span className="font-[300] italic tracking-[1px] leading-snug">
                AI
              </span>{" "}
              ABOVE THE CLOUDS
            </p>

            <p className="mt-6 lg:mt-8 font-satoshi text-[#333] text-[clamp(14px,2.2vw,22px)] leading-relaxed max-w-prose">
              Turning AI research into enterprise systems that move{" "}
              <span className="font-bold">ideas into reality</span>
            </p>

            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-wrap items-center gap-3 sm:gap-5">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1 rounded-[36px] bg-white text-[#333] border border-[#333]/80 h-11 px-4 min-w-[128px] text-[clamp(14px,1.5vw,18px)]
                           sm:h-12 sm:px-5 sm:min-w-[140px] md:h-14 md:px-6 md:min-w-[180px]
                           font-satoshi font-medium leading-[1.5] shadow-[0_1px_0_rgba(0,0,0,0.04)]
                           hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#333]
                           transition-[background-color,opacity,transform] whitespace-nowrap shrink"
              >
                Contact us
              </Link>

              <Link
                href="/cta"
                className="inline-flex items-center justify-center gap-1 rounded-[36px] bg-[#333] text-white h-11 px-4 min-w-[128px] text-[clamp(14px,1.5vw,18px)]
                           sm:h-12 sm:px-5 sm:min-w-[140px] md:h-14 md:px-6 md:min-w-[180px]
                           font-satoshi font-medium leading-[1.5] hover:opacity-90 active:opacity-80
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#333]/60 transition-opacity motion-reduce:transition-none
                           whitespace-nowrap shrink"
              >
                You code?
              </Link>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className={`
              pointer-events-none relative z-10 mx-auto mb-6 sm:mb-8
              w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] md:w-[210px] md:h-[210px]
              lg:pointer-events-none lg:absolute lg:mx-0 lg:mb-0 lg:right-[20%] lg:top-[20%] lg:z-0
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
      </div>
    </section>
  );
}

