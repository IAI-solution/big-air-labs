// app/components/Hero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      className="
        relative w-full gradient isolate overflow-x-clip
        /* mobile/tablet padding */
        px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12
        /* keep your exact desktop spacing */
        lg:p-[10vh] lg:min-h-[calc(100svh-20vh)]
        /* reasonable min-height on small screens */
        min-h-[70svh]
      "
      aria-label="Big Air Lab hero"
    >
      {/* background gradient layer (below everything) */}
      <div aria-hidden="true" className="absolute inset-0 gradient -z-10" />

      {/* Content container */}
      <div className="mx-auto w-full">
        <div className="max-w-[1120px] relative z-10">

          {/*
            === CIRCLE ===
            - On mobile/tablet: IN FLOW (centred), so text naturally sits below it.
            - On desktop (lg+): ABSOLUTE at your original spot (unchanged).
          */}
          <div
            aria-hidden="true"
            className={`
              /* mobile/tablet: in normal flow */
              pointer-events-none relative z-10 mx-auto mb-6 sm:mb-8
              w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] md:w-[210px] md:h-[210px]

              /* desktop: match your exact position & layering */
              lg:pointer-events-none lg:absolute lg:mx-0 lg:mb-0 lg:right-[10%] lg:top-[57px] lg:z-0
              lg:w-[241px] lg:h-[242px]
            `}
          >
            {/* Blurred gradient rim */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 241 242"
              fill="none"
              className="absolute inset-0 w-full h-full"
            >
              <g filter="url(#filter0_f_1_137)">
                <circle cx="120.5" cy="121" r="100.5" fill="url(#paint0_linear_1_137)" />
              </g>
              <defs>
                <filter
                  id="filter0_f_1_137"
                  x="0"
                  y="0.5"
                  width="241"
                  height="241"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_1_137" />
                </filter>
                <linearGradient
                  id="paint0_linear_1_137"
                  x1="120.5"
                  y1="20.5"
                  x2="120"
                  y2="227.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#EEF9FF" />
                  <stop offset="0.722767" stopColor="#D0E8FF" />
                </linearGradient>
              </defs>
            </svg>

            {/* Four soft glow arms (sizes scaled with container) */}
            <div
              className="
                absolute right-1/2 top-1/2 -translate-y-1/2
                w-[70%] h-[50%] opacity-40 pointer-events-none -z-10
              "
              style={{
                background:
                  "linear-gradient(270deg, #C0EAFB 9.4%, rgba(255, 255, 255, 0) 88.66%)",
                filter: "blur(10px)",
              }}
            />
            <div
              className="
                absolute left-1/2 top-1/2 -translate-x-1/2
                w-[50%] h-[70%] opacity-40 pointer-events-none -z-10
              "
              style={{
                background:
                  "linear-gradient(180deg, #C0EAFB 9.4%, rgba(255, 255, 255, 0) 88.66%)",
                filter: "blur(10px)",
              }}
            />
            <div
              className="
                absolute left-1/2 top-1/2 -translate-y-1/2
                w-[70%] h-[50%] opacity-40 pointer-events-none -z-10
              "
              style={{
                background:
                  "linear-gradient(90deg, #C0EAFB 9.4%, rgba(255, 255, 255, 0) 88.66%)",
                filter: "blur(10px)",
              }}
            />
            <div
              className="
                absolute left-1/2 bottom-1/2 -translate-x-1/2
                w-[50%] h-[58%] opacity-40 pointer-events-none -z-10
              "
              style={{
                background:
                  "linear-gradient(0deg, #C0EAFB 9.4%, rgba(255, 255, 255, 0) 88.66%)",
                filter: "blur(10px)",
              }}
            />

            {/* Main circle */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 171 172"
              fill="none"
              className="
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0
                w-[71%] h-[71%]
              "
            >
              <circle cx="85.5" cy="86" r="85.5" fill="#F7FFFF" />
            </svg>
          </div>
          {/* === /CIRCLE === */}

          {/* wrap all readable content above decorative clouds */}
          <div className="relative z-20">
            {/* Title: BIG AIR LAB */}
            <h1
              className="
                font-satoshi font-bold uppercase text-[#333]
                text-[clamp(36px,6.8vw,80px)]
                leading-[1.5] lg:leading-[120px]
                break-words
              "
            >
              BIG AIR LAB
            </h1>

            {/* Subhead: WE BUILD AI ABOVE THE CLOUDS */}
            <p
              className="
                mt-2 font-satoshi font-medium uppercase text-[#333]
                text-[clamp(16px,2.4vw,28px)]
                leading-[1.5]
              "
            >
              WE BUILD{" "}
              <span
                className="
                  font-[300] italic
                  tracking-[1px] leading-[1.5]
                "
              >
                AI
              </span>{" "}
              ABOVE THE CLOUDS
            </p>

            {/* Body copy */}
            <p
              className="
                mt-8 lg:mt-10
                font-satoshi text-[#333]
                text-[clamp(16px,2.2vw,24px)] leading-[1.5]
                max-w-[527px]
              "
            >
              Turning AI research into enterprise systems that move{" "}
              <span className="font-bold">ideas into reality</span>
            </p>

            {/* CTA row */}
            <div className="mt-8 lg:mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
              {/* Contact us (white pill) */}
              <Link
                href="/contact"
                className="
                  inline-flex items-center justify-center gap-1
                  rounded-[40px] bg-white text-[#333]
                  border border-[#333]/80
                  px-5 md:px-6
                  h-14 md:h-16
                  min-w-[160px] md:min-w-[200px]
                  font-satoshi text-[clamp(16px,2vw,20px)] font-medium leading-[1.5]
                  shadow-[0_1px_0_rgba(0,0,0,0.04)]
                  hover:bg-gray-50 active:bg-gray-100
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#333]
                  transition-[background-color,opacity,transform]
                  motion-reduce:transition-none
                "
              >
                Contact us
              </Link>

              {/* You code? (black pill) */}
              <Link
                href="/cta"
                className="
                  inline-flex items-center justify-center gap-1
                  rounded-[40px] bg-[#333] text-white
                  px-5 md:px-6
                  h-14 md:h-16
                  min-w-[160px] md:min-w-[200px]
                  font-satoshi text-[clamp(16px,2vw,20px)] font-medium leading-[1.5]
                  hover:opacity-90 active:opacity-80
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#333]/60
                  transition-opacity motion-reduce:transition-none
                "
              >
                You code?
              </Link>
            </div>
          </div>

          {/* === Decorative clouds (behind text, above gradient) === */}
          {/* top cloud */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute z-0
              left-1/2 -translate-x-1/2 -top-24
              sm:-top-28
              md:left-0 md:-translate-x-0 md:-left-1/4 md:-top-40
              lg:-left-1/3 lg:-top-[200px]
            "
          >
            <Image
              src="/images/cloudTop.png"
              alt=""
              width={903}
              height={376}
              className="w-[700px] sm:w-[820px] md:w-[903px] max-w-[90vw] h-auto aspect-[293/122] flex-shrink-0"
              priority
            />
          </div>

          {/* bottom cloud */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute z-0
              left-1/2 -translate-x-1/2 bottom-[-100px]
              sm:bottom-[-120px]
              md:left-0 md:-translate-x-0 md:-left-1/4 md:bottom-[-120px]
              lg:-left-1/3 lg:bottom-[-160px]
            "
          >
            <Image
              src="/images/cloudBottom.png"
              alt=""
              width={903}
              height={376}
              className="w-[700px] sm:w-[820px] md:w-[903px] max-w-[90vw] h-auto aspect-[293/122] flex-shrink-0"
              priority
            />
          </div>

          {/* distant lower-left cloud (hidden on small) */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute z-0
              hidden md:block
              -left-[55%] md:bottom-[-340px] lg:-left-[70%] lg:bottom-[-320px]
            "
          >
            <Image
              src="/images/cloudBottom.png"
              alt=""
              width={903}
              height={376}
              className="w-[903px] max-w-[88vw] h-auto aspect-[293/122] flex-shrink-0"
              priority
            />
          </div>
          {/* === /Decorative clouds === */}
        </div>
      </div>
    </section>
  );
}
