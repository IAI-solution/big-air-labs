// app/sectionFour/page.tsx
"use client";

import Image from "next/image";

export default function Hero4() {
  return (
    <section
      className="
        relative w-full min-h-[100svh] isolate overflow-x-clip gradient4"
      aria-label="News & Updates section"
    >
      {/* Content block — positioned from top/left, responsive */}
      <div
        className="absolute left-5 top-8 sm:left-8 sm:top-16 md:left-16 md:top-20 lg:left-[120px] lg:top-[100px]"
      >
        {/* Title */}
        <h2
          className="
            text-[#333] font-satoshi uppercase tracking-[1px] leading-[150%]
            text-[28px] sm:text-[32px] md:text-[36px]
            flex flex-wrap gap-x-2
          "
        >
          <span className="italic font-light">Winds of Change</span>
          <span className="normal-case">:</span>
          <span className="not-italic font-normal">News &amp; Updates</span>
        </h2>

        {/* Spacing of 20px */}
        <div className="mt-5" />

        {/* Description */}
        <p
          className="
            text-black font-satoshi leading-[150%]
            text-[16px] sm:text-[18px] md:text-[24px]
          "
        >
          From lab discoveries to real-world impact.<br className="hidden sm:block" />
          Curated news, insights, and research that help you see what’s next.
        </p>
      </div>

      {/* Glass Card 1 */}
      <div
        className="
          absolute
          left-[120px] top-[calc(220px+36px+20px)]
          w-[320px] h-[452px]
          sm:w-[360px] sm:h-[508px]
          md:w-[380px] md:h-[536px]
          flex flex-col items-center justify-center
          rounded-[8px]
          bg-[rgba(0,0,0,0.00)]
          border border-white/40
          backdrop-blur-md
          shadow-[0_20px_60px_rgba(0,0,0,0.12),inset_0_0_1px_rgba(255,255,255,0.4)]
        "
      >
        {/* White media box */}
        <div
          className="
            absolute top-[25px] left-[28px] right-[28px]
            h-[240px] sm:h-[272px] md:h-[290px]
            rounded-[12px] bg-white
          "
        />

        {/* Pill */}
<p
  className="
    absolute
    left-[28px]
    top-[calc(25px+240px+16px)]
    sm:top-[calc(25px+272px+16px)]
    md:top-[calc(25px+290px+16px)]
    text-[#333] font-satoshi italic font-normal
    text-[16px] leading-5
  "
>
  Big AI Research
</p>

        {/* Title */}
        <h3
          className="
            absolute left-[28px]
            top-[calc(25px+240px+16px+44px+12px)]
            sm:top-[calc(25px+272px+16px+44px+12px)]
            md:top-[calc(25px+290px+16px+44px+12px)]
            text-[#000] font-satoshi
            text-[18px] sm:text-[19px] md:text-[20px]
            font-medium leading-[175%]
          "
        >
          Main title for the nes/ research
        </h3>

        {/* Published on */}
        <div
          className="
            absolute left-[28px] bottom-[24px] flex items-baseline gap-2
          "
        >
          <span
            className="
              text-[#000] font-satoshi
              text-[13px] sm:text-[13.5px] md:text-[14px]
              font-medium leading-[175%]
            "
          >
            Published on
          </span>
          <span
            className="
              text-[#000] font-satoshi
              text-[13px] sm:text-[13.5px] md:text-[14px]
              font-medium leading-[175%] opacity-50
            "
          >
            Aug 13, 2025
          </span>
        </div>
      </div>

      {/* Glass Card 2 */}
      <div
        className="
          absolute
          left-[540px] top-[calc(220px+36px+20px)]
          w-[320px] h-[452px]
          sm:w-[360px] sm:h-[508px]
          md:w-[380px] md:h-[536px]
          flex flex-col items-center justify-center
          rounded-[8px]
          bg-[rgba(0,0,0,0.00)]
          border border-white/40
          backdrop-blur-md
          shadow-[0_20px_60px_rgba(0,0,0,0.12),inset_0_0_1px_rgba(255,255,255,0.4)]
        "
      >
        {/* White media box */}
        <div
          className="
            absolute top-[25px] left-[28px] right-[28px]
            h-[240px] sm:h-[272px] md:h-[290px]
            rounded-[12px] bg-white
          "
        />

        {/* Pill */}
<p
  className="
    absolute
    left-[28px]
    top-[calc(25px+240px+16px)]
    sm:top-[calc(25px+272px+16px)]
    md:top-[calc(25px+290px+16px)]
    text-[#333] font-satoshi italic font-normal
    text-[16px] leading-5
  "
>
  Big AI Research
</p>

        {/* Title */}
        <h3
          className="
            absolute left-[28px]
            top-[calc(25px+240px+16px+44px+12px)]
            sm:top-[calc(25px+272px+16px+44px+12px)]
            md:top-[calc(25px+290px+16px+44px+12px)]
            text-[#000] font-satoshi
            text-[18px] sm:text-[19px] md:text-[20px]
            font-medium leading-[175%]
          "
        >
          Main title for the nes/ research
        </h3>

        {/* Published on */}
        <div
          className="
            absolute left-[28px] bottom-[24px] flex items-baseline gap-2
          "
        >
          <span
            className="
              text-[#000] font-satoshi
              text-[13px] sm:text-[13.5px] md:text-[14px]
              font-medium leading-[175%]
            "
          >
            Published on
          </span>
          <span
            className="
              text-[#000] font-satoshi
              text-[13px] sm:text-[13.5px] md:text-[14px]
              font-medium leading-[175%] opacity-50
            "
          >
            Aug 13, 2025
          </span>
        </div>
      </div>

      {/* Glass Card 3 */}
      <div
        className="
          absolute
          left-[960px] top-[calc(220px+36px+20px)]
          w-[320px] h-[452px]
          sm:w-[360px] sm:h-[508px]
          md:w-[380px] md:h-[536px]
          flex flex-col items-center justify-center
          rounded-[8px]
          bg-[rgba(0,0,0,0.00)]
          border border-white/40
          backdrop-blur-md
          shadow-[0_20px_60px_rgba(0,0,0,0.12),inset_0_0_1px_rgba(255,255,255,0.4)]
        "
      >
        {/* White media box */}
        <div
          className="
            absolute top-[25px] left-[28px] right-[28px]
            h-[240px] sm:h-[272px] md:h-[290px]
            rounded-[12px] bg-white
          "
        />

        {/* Pill */}
<p
  className="
    absolute
    left-[28px]
    top-[calc(25px+240px+16px)]
    sm:top-[calc(25px+272px+16px)]
    md:top-[calc(25px+290px+16px)]
    text-[#333] font-satoshi italic font-normal
    text-[16px] leading-5
  "
>
  Big AI Research
</p>

        {/* Title */}
        <h3
          className="
            absolute left-[28px]
            top-[calc(25px+240px+16px+44px+12px)]
            sm:top-[calc(25px+272px+16px+44px+12px)]
            md:top-[calc(25px+290px+16px+44px+12px)]
            text-[#000] font-satoshi
            text-[18px] sm:text-[19px] md:text-[20px]
            font-medium leading-[175%]
          "
        >
          Main title for the nes/ research
        </h3>

        {/* Published on */}
        <div
          className="
            absolute left-[28px] bottom-[24px] flex items-baseline gap-2
          "
        >
          <span
            className="
              text-[#000] font-satoshi
              text-[13px] sm:text-[13.5px] md:text-[14px]
              font-medium leading-[175%]
            "
          >
            Published on
          </span>
          <span
            className="
              text-[#000] font-satoshi
              text-[13px] sm:text-[13.5px] md:text-[14px]
              font-medium leading-[175%] opacity-50
            "
          >
            Aug 13, 2025
          </span>
        </div>
      </div>

      {/* Glass Card 4 */}
      <div
        className="
          absolute
          left-[1380px] top-[calc(220px+36px+20px)]
          w-[320px] h-[452px]
          sm:w-[360px] sm:h-[508px]
          md:w-[380px] md:h-[536px]
          flex flex-col items-center justify-center
          rounded-[8px]
          bg-[rgba(0,0,0,0.00)]
          border border-white/40
          backdrop-blur-md
          shadow-[0_20px_60px_rgba(0,0,0,0.12),inset_0_0_1px_rgba(255,255,255,0.4)]
        "
      >
        {/* White media box */}
        <div
          className="
            absolute top-[25px] left-[28px] right-[28px]
            h-[240px] sm:h-[272px] md:h-[290px]
            rounded-[12px] bg-white
          "
        />

        {/* Pill */}
<p
  className="
    absolute
    left-[28px]
    top-[calc(25px+240px+16px)]
    sm:top-[calc(25px+272px+16px)]
    md:top-[calc(25px+290px+16px)]
    text-[#333] font-satoshi italic font-normal
    text-[16px] leading-5
  "
>
  Big AI Research
</p>

        {/* Title */}
        <h3
          className="
            absolute left-[28px]
            top-[calc(25px+240px+16px+44px+12px)]
            sm:top-[calc(25px+272px+16px+44px+12px)]
            md:top-[calc(25px+290px+16px+44px+12px)]
            text-[#000] font-satoshi
            text-[18px] sm:text-[19px] md:text-[20px]
            font-medium leading-[175%]
          "
        >
          Main title for the nes/ research
        </h3>

        {/* Published on */}
        <div
          className="
            absolute left-[28px] bottom-[24px] flex items-baseline gap-2
          "
        >
          <span
            className="
              text-[#000] font-satoshi
              text-[13px] sm:text-[13.5px] md:text-[14px]
              font-medium leading-[175%]
            "
          >
            Published on
          </span>
          <span
            className="
              text-[#000] font-satoshi
              text-[13px] sm:text-[13.5px] md:text-[14px]
              font-medium leading-[175%] opacity-50
            "
          >
            Aug 13, 2025
          </span>
        </div>
      </div>

      {/* Bottom pager controls */}
      <div
        className="
          absolute bottom-12 left-1/2 -translate-x-1/2
          flex items-center gap-3 z-50
        "
      >
        {/* Prev button (gray, 80% opacity) */}
        <button
          type="button"
          aria-label="Previous"
          className="
            inline-flex items-center justify-center
            w-[44px] h-[44px] p-0 rounded-full
            bg-[#A3A3A3]/80
            shadow-sm
            hover:opacity-100 transition
          "
        >
          <Image
            src="/icons/arrowRightIcon.svg"
            alt=""
            width={11}
            height={16}
            className="rotate-180"
            priority
          />
        </button>

        {/* Page indicator */}
        <span className="text-[#333] font-satoshi text-sm md:text-base select-none">
          1/2
        </span>

        {/* Next button (white) */}
        <button
          type="button"
          aria-label="Next"
          className="
            inline-flex items-center justify-center
            w-[44px] h-[44px] p-0 rounded-full
            bg-white
            shadow-sm
            hover:opacity-90 transition
          "
        >
          <Image
            src="/icons/arrowRightIcon.svg"
            alt=""
            width={11}
            height={16}
            priority
          />
        </button>
      </div>
    </section>
  );
}
