// app/sectionSix/page.tsx
"use client";

import Image from "next/image";

export default function Hero6() {
  return (
    <section className="relative w-full min-h-[100svh]">
      {/* Background image */}
      <Image
        src="/images/footerBgImage.svg"
        alt="Footer background"
        fill
        className="object-cover"
        priority
      />

      {/* Content on top of background */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {/* BIG AIR LAB — positioned left:196px, top:754px on desktop */}
        <div className="absolute left-4 top-16 sm:left-8 sm:top-32 md:left-16 md:top-52 lg:left-[10px] lg:top-[754px]">
          <div className="flex items-center">
            {/* Logo image */}
            <Image
              src="/images/bottomImage.svg"
              alt="Big Air Lab mark"
              width={115}
              height={115}
              className="-rotate-45 opacity-80 shrink-0 aspect-square"
              priority
            />

            {/* Title */}
            <h1
              className="
                text-[#333] uppercase
                font-semibold leading-[150%]
                text-[48px] sm:text-[64px] md:text-[80px] lg:text-[92px]
              "
            >
              BIG AIR LAB
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
