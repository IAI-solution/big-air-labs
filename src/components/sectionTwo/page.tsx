import Image from "next/image";

export default function Hero2() {
  return (
    <section
      className="relative w-full min-h-[100svh] gradient2"
      aria-label="Big Air Lab hero"
    >
      {/* Circle Group (blur behind main) */}
      <div
        className="
          pointer-events-none select-none absolute
          top-24 right-6
          sm:top-28 sm:right-10
          md:top-[150px] md:right-[160px]
          lg:top-[187.5px] lg:right-[300px]
          flex items-center justify-center
        "
      >
        {/* Blur Gradient Circle (behind) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 201 201"
          className="
            absolute z-0
            w-[140px] h-[140px]
            sm:w-[160px] sm:h-[160px]
            md:w-[180px] md:h-[180px]
            lg:w-[201px] lg:h-[201px]
          "
          style={{ filter: "blur(12px)" }}
        >
          <defs>
            <linearGradient
              id="grad1"
              x1="100.5"
              y1="0"
              x2="100.5"
              y2="201"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#EEF9FF" offset="0.0012" />
              <stop stopColor="#D0E8FF" offset="0.7438" />
            </linearGradient>
          </defs>
          <circle cx="100.5" cy="100.5" r="100.5" fill="url(#grad1)" />
        </svg>

        {/* Solid Circle (front) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 171 171"
          className="
            relative z-10
            w-[120px] h-[120px]
            sm:w-[140px] sm:h-[140px]
            md:w-[156px] md:h-[156px]
            lg:w-[171px] lg:h-[171px]
          "
        >
          <circle cx="85.5" cy="85.5" r="85.5" fill="#F7FFFF" />
        </svg>
      </div>

      {/* Engineer Text */}
      <div
        className="
          absolute z-20
          left-6 top-24
          sm:left-10 sm:top-28
          md:left-16 md:top-36
          lg:left-[120px] lg:top-[180px]
          max-w-[1120px]
        "
      >
        <h2
          className="
            font-satoshi text-[#000] font-medium leading-[150%]
            text-[clamp(24px,6vw,36px)]
          "
        >
          Engineered for Real Impact
        </h2>

        <p
          className="
            mt-3 sm:mt-4 font-satoshi text-[#333] font-normal leading-[150%]
            text-[clamp(16px,3.5vw,24px)]
            max-w-[856px]
          "
        >
          Every solution we build flows seamlessly from research to enterprise
          deployment, designed for{" "}
          <span className="italic font-bold">
            scalability, security, and performance.
          </span>
        </p>
      </div>

      {/* Prism Glass Card — original position/size base, height increased */}
      <div
        className="
          absolute z-30
          top-[417px] left-[120px] right-[303px] bottom-[70px]
          rounded-lg overflow-hidden
          bg-white/30 backdrop-blur-md border border-white/40 shadow-lg

          /* Outer padding (unchanged visually) */
          px-3 md:px-4 lg:px-5
          py-3 md:py-4 lg:py-5
        "
      >
        <div
          className="
            h-full w-full
            flex
            /* tight gap between left image and right content */
            gap-3 sm:gap-4 md:gap-5
          "
        >
          {/* Prism Image (left) — keep size, add 28px top/bottom padding */}
          <div
            className="
              w-[56%] md:w-[58%] lg:w-[60%]
              pl-[28px] pr-[28px] py-[28px]
              flex items-center
            "
          >
            <Image
              src="/images/prism.svg"
              alt="Prism AI"
              width={597}
              height={445}
              className="w-full h-auto object-contain block"
              priority
            />
          </div>

          {/* Content (right) — tighter layout */}
          <div
            className="
              flex-1
              flex flex-col justify-center
              gap-2.5 sm:gap-3 md:gap-4
              pr-1 sm:pr-2 md:pr-3
            "
          >
            <h3
              className="
                font-satoshi text-[#000]
                text-[22px] sm:text-[26px] md:text-[30px] lg:text-[36px]
                font-light leading-[150%] uppercase tracking-wide
              "
            >
              PRISM AI
            </h3>

            <p
              className="
                text-[#000] font-satoshi
                text-[14px] sm:text-[16px] md:text-[18px]
                font-normal leading-[150%]
                max-w-[360px]
              "
            >
              Your own personal assistant with spectrum of tasks.
            </p>

            <p
              className="
                text-[#08070D] font-satoshi
                text-[14px] sm:text-[15px] md:text-[16px]
                font-normal leading-[160%]
                max-w-[420px]
              "
            >
              A brief description about the product. How it helps the user. It’s
              advantage from the competitors
            </p>

            <button
              className="
                self-start inline-flex items-center justify-center gap-1
                px-3 py-1.5
                rounded-full border border-[#333]
                bg-white
                font-satoshi text-[#000] text-[14px] font-medium
                hover:bg-white/85 transition
              "
              aria-label="View Prism AI beta version"
            >
              View beta version
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
