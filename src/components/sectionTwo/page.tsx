// app/sectionTwo/page.tsx
"use client";

import Image from "next/image";

export default function Hero2() {
  return (
    <section
      className="relative w-full min-h-screen gradient2 overflow-hidden py-20 sm:py-24 md:py-28"
      aria-label="Engineered for Impact section"
    >
      {/* Decorative Circle Group */}
      <div className="pointer-events-none select-none absolute top-[10vh] right-[5vw] md:top-[15vh] md:right-[10vw] lg:right-[15vw] z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 201 201"
          className="absolute w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52"
          style={{ filter: "blur(12px)" }}
        >
          <defs>
            <linearGradient id="grad1" x1="100.5" y1="0" x2="100.5" y2="201" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EEF9FF" offset="0.0012" />
              <stop stopColor="#D0E8FF" offset="0.7438" />
            </linearGradient>
          </defs>
          <circle cx="100.5" cy="100.5" r="100.5" fill="url(#grad1)" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 171 171"
          className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44"
        >
          <circle cx="85.5" cy="85.5" r="85.5" fill="#F7FFFF" />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-12 md:gap-16">
          
          {/* Top Text Content */}
          <div className="max-w-4xl">
            <h2 className="font-satoshi text-black font-medium text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Engineered for Real Impact
            </h2>
            <p className="mt-4 font-satoshi text-[#333] text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-4xl">
              Every solution we build flows seamlessly from research to enterprise deployment, designed for{" "}
              <span className="italic font-bold">
                scalability, security, and performance.
              </span>
            </p>
          </div>

          {/* Glass Card */}
          <div className="
            w-full rounded-2xl overflow-hidden
            bg-white/30 backdrop-blur-md border border-white/40 shadow-lg
            p-4 sm:p-5
          ">
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
              
              {/* Left Side: Prism Image Container */}
              <div className="w-full lg:w-3/5 rounded-lg overflow-hidden">
                <Image
                  src="/images/prism.svg"
                  alt="Prism AI"
                  width={597}
                  height={445}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              {/* Right Side: Content */}
              <div className="flex-1 flex flex-col items-start gap-4 sm:gap-5 w-full">
                <h3 className="
                  font-satoshi text-black
                  text-3xl sm:text-4xl
                  font-light leading-tight uppercase tracking-wide
                ">
                  PRISM AI
                </h3>
                <p className="text-black font-satoshi text-base sm:text-lg font-normal leading-normal max-w-md">
                  Your own personal assistant with spectrum of tasks.
                </p>
                <p className="text-[#08070D] font-satoshi text-base sm:text-lg font-normal leading-relaxed max-w-md">
                  A brief description about the product. How it helps the user. It’s advantage from the competitors.
                </p>
                <button
                  className="
                    self-start inline-flex items-center justify-center
                    px-5 py-2.5
                    rounded-full border border-[#333]
                    bg-white
                    font-satoshi text-black text-sm sm:text-base font-medium
                    hover:bg-gray-100 transition-colors
                  "
                  aria-label="View Prism AI beta version"
                >
                  View beta version
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
