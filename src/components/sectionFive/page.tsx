// app/sectionFive/page.tsx
"use client";

import Image from "next/image";

// A reusable component for the feature list items to keep the code clean.
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
  return (
    <section
      className="relative w-full min-h-screen gradient5 overflow-hidden flex flex-col"
      aria-label="Playground section"
    >
      {/* Top content area */}
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 md:pt-28 z-10">
        <div className="max-w-4xl">
          <h2 className="
            text-[#333] font-satoshi font-medium
            text-[28px] sm:text-[32px] md:text-[36px]
            leading-[1.4] tracking-[1px]
          ">
            A PLAYGROUND FOR CURIOSITY
          </h2>

          <p className="
            mt-5 text-black font-satoshi font-normal
            text-[18px] sm:text-[22px] md:text-[24px]
            leading-[1.5]
          ">
            We believe breakthroughs are born from bold questions. That’s why we provide:
          </p>

          {/* Features List */}
          <div className="mt-10 sm:mt-12 flex flex-col gap-y-8">
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

      {/* Bottom CTA and decorative elements */}
      <div className="relative w-full mt-auto pt-20">
        {/* Landscape pinned to bottom */}
        <div
          className="pointer-events-none select-none absolute inset-x-0 bottom-0 z-0"
          aria-hidden="true"
        >
          <Image
            src="/images/landscape.png"
            alt=""
            width={1442}
            height={444}
            priority
            className="w-full h-auto max-h-[85vh] object-cover"
          />
        </div>

        {/* Glass CTA card */}
        <div className="relative z-30 px-4 sm:px-5 pb-12 sm:pb-16 md:pb-20">
          <div className="
            max-w-6xl mx-auto
            flex flex-col items-center justify-center text-center
            p-4 sm:p-6 md:p-8
            gap-4
            rounded-xl
            bg-white/10 border border-white/40
            shadow-2xl shadow-black/10
            backdrop-blur-lg
          ">
            <p className="
              text-white font-satoshi font-medium uppercase
              text-[16px]/[1.2] xs:text-[18px] sm:text-[28px] md:text-[32px] lg:text-[36px]
              tracking-[1px]
            ">
              Let’s create the future of smart AI together
            </p>

            <div className="mt-1 flex items-center gap-2 sm:gap-4 md:gap-6">
              <a
                href="#"
                className="
                  flex items-center justify-center
                  w-32 h-11 xs:w-36 xs:h-12 sm:w-[180px] sm:h-[56px] md:w-[200px] md:h-[64px]
                  rounded-[40px] flex-shrink-0
                  bg-white text-[#333]
                  font-satoshi font-medium text-sm xs:text-base sm:text-[18px] md:text-[20px]
                  transition hover:bg-gray-100
                "
              >
                Careers
              </a>
              <a
                href="#"
                className="
                  flex items-center justify-center
                  w-32 h-11 xs:w-36 xs:h-12 sm:w-[180px] sm:h-[56px] md:w-[200px] md:h-[64px]
                  rounded-[40px] flex-shrink-0
                  bg-[#333] text-white
                  font-satoshi font-medium text-sm xs:text-base sm:text-[18px] md:text-[20px]
                  transition hover:bg-black
                "
              >
                Talk to us
              </a>
            </div>
          </div>
        </div>


        {/* White wave overlay pinned to bottom */}
        <div
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
