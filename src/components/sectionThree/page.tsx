// app/sectionThree/page.tsx
"use client";

import Image from "next/image";

export default function Hero3() {
  return (
    <section
      className="relative w-full min-h-[100svh] gradient3 pt-[var(--nav-h,80px)] isolate overflow-x-clip"
      aria-label="Third section"
    >
 

      {/* DESKTOP (lg+): exact absolute positions — unchanged */}
      <div className="hidden lg:block">
        <div className="absolute flex-shrink-0" style={{ top: "593px", left: "182px" }}>
          <Image
            src="/images/rings.svg"
            alt="Finance AI"
            width={137}
            height={179}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div className="absolute" style={{ top: "761px", left: "216px" }}>
          <p className="font-satoshi text-black" style={{ fontSize: "24px", fontWeight: 400, lineHeight: "36px" }}>
            Finance AI
          </p>
        </div>

        <div className="absolute flex-shrink-0" style={{ top: "548px", left: "583px" }}>
          <Image
            src="/images/stars.svg"
            alt="Consumer AI"
            width={137}
            height={179}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div className="absolute" style={{ top: "761px", left: "607px" }}>
          <p className="font-satoshi text-black" style={{ fontSize: "24px", fontWeight: 400, lineHeight: "36px" }}>
            Consumer AI
          </p>
        </div>

        <div className="absolute flex-shrink-0" style={{ top: "548px", left: "946px" }}>
          <Image
            src="/images/circles.svg"
            alt="Enterprise AI Solution"
            width={137}
            height={179}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div className="absolute" style={{ top: "761px", left: "916px" }}>
          <p className="font-satoshi text-black" style={{ fontSize: "24px", fontWeight: 400, lineHeight: "36px" }}>
            Enterprise AI Solution
          </p>
        </div>
      </div>

      {/* TEXT CONTENT (rendered before mobile/tablet icons so icons appear below on small screens) */}
      <div
        className="
          relative mx-auto
          px-5 sm:px-8 pt-10 pb-12
          lg:px-0 lg:pt-0
          lg:absolute lg:top-[180px] lg:left-[120px] lg:right-[590px]
        "
      >
        <h2
          className="
            font-satoshi font-normal uppercase text-black
            leading-[1.5] text-[clamp(28px,4.5vw,36px)]
          "
        >
          Empowering Business Growth
          <br className="hidden md:block" />
          with Scalable Enterprise AI Solutions
        </h2>

        <p
          className="
            mt-[28px] max-w-[729px]
            font-satoshi font-normal text-black
            leading-[1.5] text-[clamp(16px,2.6vw,24px)]
          "
        >
          We are an <span className="font-bold italic">AI Research Lab, not just a company</span>.
          Our work spans Finance AI, Consumer AI, and Enterprise AI Systems, delivering measurable business outcomes.
        </p>
      </div>

      {/* MOBILE/TABLET (<lg): responsive icons + labels BELOW the text */}
      <div className="lg:hidden px-5 sm:px-8 mt-8 sm:mt-10 md:mt-12">
        {/* sm: stack; md: 3-up row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 place-items-center">
          {/* Rings */}
          <div className="flex flex-col items-center">
            <Image
              src="/images/rings.svg"
              alt="Finance AI"
              width={137}
              height={179}
              className="w-[88px] sm:w-[110px] md:w-[120px] object-contain"
              priority
            />
            <p className="mt-3 font-satoshi text-black text-[clamp(16px,2.4vw,20px)] leading-[150%] text-center">
              Finance AI
            </p>
          </div>

          {/* Stars */}
          <div className="flex flex-col items-center">
            <Image
              src="/images/stars.svg"
              alt="Consumer AI"
              width={137}
              height={179}
              className="w-[88px] sm:w-[110px] md:w-[120px] object-contain"
              priority
            />
            <p className="mt-3 font-satoshi text-black text-[clamp(16px,2.4vw,20px)] leading-[150%] text-center">
              Consumer AI
            </p>
          </div>

          {/* Circles */}
          <div className="flex flex-col items-center">
            <Image
              src="/images/circles.svg"
              alt="Enterprise AI Solution"
              width={137}
              height={179}
              className="w-[88px] sm:w-[110px] md:w-[120px] object-contain"
              priority
            />
            <p className="mt-3 font-satoshi text-black text-[clamp(16px,2.4vw,20px)] leading-[150%] text-center">
              Enterprise AI Solution
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
