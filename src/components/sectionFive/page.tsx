// app/sectionFour/page.tsx
"use client";

import Image from "next/image";

export default function Hero5() {
  return (
    <section
      className="relative w-full min-h-[100svh] gradient5 overflow-hidden"
      aria-label="Fourth section"
    >
      {/* Content (normal flow) */}
      <div
        className="
          relative
          mt-[20px] sm:mt-[50px] md:mt-[100px] lg:mt-[160px]
          ml-4 sm:ml-10 md:ml-[80px] lg:ml-[120px]
          max-w-[90vw] md:max-w-[800px]
          flex flex-col
        "
      >
        <h2
          className="
            text-[#333] font-satoshi font-medium
            text-[20px] leading-[140%] tracking-[1px]
            sm:text-[28px] sm:leading-[140%]
            md:text-[32px] md:leading-[150%]
            lg:text-[36px] lg:leading-[150%]
          "
        >
          A PLAYGROUND FOR CURIOSITY
        </h2>

        <p
          className="
            text-black font-satoshi font-normal
            text-[16px] leading-[140%]
            sm:text-[20px] sm:leading-[150%]
            md:text-[22px]
            lg:text-[24px]
            whitespace-nowrap
          "
        >
          We believe breakthroughs are born from bold questions. That’s why we
          provide:
        </p>

        <h3 className="w-full whitespace-nowrap text-black font-satoshi font-medium text-[20px] sm:text-[22px] md:text-[24px] leading-[150%] mt-[20px]">
          Open experimentation
        </h3>
        <p className="w-full text-black font-satoshi font-normal text-[18px] sm:text-[20px] md:text-[24px] leading-[150%] mt-[8px]">
          Sandbox environments & datasets for fearless prototyping.
        </p>

        <h3 className="w-full whitespace-nowrap text-black font-satoshi font-medium text-[20px] sm:text-[22px] md:text-[24px] leading-[150%] mt-[31px]">
          Guided Lift-Off:
        </h3>
        <p className="w-full text-black font-satoshi font-normal text-[18px] sm:text-[20px] md:text-[24px] leading-[150%] mt-[8px]">
          Weekly mentor sessions, code reviews & architecture deep dives.
        </p>

        <h3 className="w-full whitespace-nowrap text-black font-satoshi font-medium text-[20px] sm:text-[22px] md:text-[24px] leading-[150%] mt-[31px]">
          Show & Tell Hangouts:
        </h3>
        <p className="w-full text-black font-satoshi font-normal text-[18px] sm:text-[20px] md:text-[24px] leading-[150%] mt-[15px]">
          Monthly demos where prototypes evolve into products.
        </p>
      </div>

      {/* Landscape pinned to bottom (behind the white wave) */}
      <div
        className="
          pointer-events-none select-none
          absolute inset-x-0 bottom-0 z-0
          flex justify-center
        "
        aria-hidden="true"
      >
        <Image
          src="/images/landscape.png"
          alt=""
          width={1442}
          height={444}
          priority
          className="w-full h-[700px] object-cover"
        />
      </div>

      {/* Glass CTA card */}
<div
  className="
    absolute left-1/2 bottom-[80px] -translate-x-1/2 z-30
    w-[calc(100%-40px)] max-w-[1120px]
    inline-flex flex-col items-center justify-center
    px-8 py-6 sm:px-10 sm:py-7 md:px-12 md:py-8
    gap-4
    rounded-xl
    bg-white/18 border border-white/40
    shadow-[0_10px_30px_rgba(0,0,0,0.15)]
    backdrop-blur-md
  "
>
  <p
    className="
      text-white font-satoshi font-medium uppercase
      text-[22px] sm:text-[28px] md:text-[32px] lg:text-[36px]
      leading-[1.2] tracking-[1px]
      text-center whitespace-nowrap
    "
  >
    Let’s create the future of smart ai together
  </p>

  <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
    {/* Careers */}
    <a
      href="#"
      className="
        flex items-center justify-center gap-1
        w-[180px] sm:w-[200px] h-[56px] sm:h-[64px]
        px-5 py-3
        rounded-[40px] flex-shrink-0
        bg-white text-[#333]
        font-satoshi font-medium text-[18px] sm:text-[20px] leading-[175%]
      "
    >
      Careers
    </a>

    {/* Talk to us */}
    <a
      href="#"
      className="
        flex items-center justify-center gap-1
        w-[180px] sm:w-[200px] h-[56px] sm:h-[64px]
        px-5 py-3
        rounded-[40px] flex-shrink-0
        bg-[#333] text-white
        font-satoshi font-medium text-[18px] sm:text-[20px] leading-[175%]
      "
    >
      Talk to us
    </a>
  </div>
</div>

      {/* White wave overlay pinned to bottom, full width */}
      <div
        className="
          pointer-events-none select-none
          absolute inset-x-0 bottom-0 h-[79px] z-20
        "
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
    </section>
  );
}
