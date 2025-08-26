// app/sectionFour/page.tsx
"use client";

import Image from "next/image";

/**
 * A reusable NewsCard component to replicate your original design.
 * This keeps the main component clean and avoids repeating complex styling.
 */
const NewsCard = ({ category, title, date }: { category: string; title:string; date: string; }) => (
  <div className="
    flex flex-col relative
    w-full h-auto aspect-[380/536] max-w-sm mx-auto
    rounded-lg
    bg-black/5
    border border-white/40
    backdrop-blur-md
    shadow-2xl shadow-black/10
    p-7
  ">
    {/* White media box */}
    <div className="w-full h-[55%] rounded-xl bg-white" />

    {/* Content below media box */}
    <div className="flex flex-col flex-grow mt-4">
      {/* Pill */}
      <p className="text-[#333] font-satoshi italic font-normal text-base leading-5">
        {category}
      </p>

      {/* Title */}
      <h3 className="mt-3 text-black font-satoshi text-xl font-medium leading-snug flex-grow">
        {title}
      </h3>

      {/* Published on */}
      <div className="flex items-baseline gap-2 mt-3">
        <span className="text-black font-satoshi text-sm font-medium">
          Published on
        </span>
        <span className="text-black/50 font-satoshi text-sm font-medium">
          {date}
        </span>
      </div>
    </div>
  </div>
);


export default function Hero4() {
  return (
    <section
      className="relative w-full min-h-screen gradient4 isolate overflow-hidden py-20 sm:py-24"
      aria-label="News & Updates section"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-y-16">
          
          {/* TEXT CONTENT BLOCK */}
          <div className="w-full max-w-5xl text-center lg:text-left">
            <h2 className="text-[#333] font-satoshi uppercase tracking-wide text-3xl md:text-4xl">
              <span className="italic font-light">Winds of Change</span>
              <span className="normal-case">: </span>
              <span className="not-italic font-normal">News & Updates</span>
            </h2>
            <p className="mt-5 text-black font-satoshi text-lg md:text-xl leading-relaxed">
              From lab discoveries to real-world impact.<br className="hidden sm:block" />
              Curated news, insights, and research that help you see what’s next.
            </p>
          </div>

          {/* RESPONSIVE CARDS GRID */}
          <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <NewsCard
              category="Big AI Research"
              title="Main title for the news/research"
              date="Aug 13, 2025"
            />
            <NewsCard
              category="News & Updates"
              title="Another important update from the lab"
              date="Aug 11, 2025"
            />
            <NewsCard
              category="Deep Learning"
              title="Breakthrough in neural network efficiency"
              date="Aug 09, 2025"
            />
          </div>

          {/* Bottom pager controls */}
          <div className="flex items-center gap-3 z-10">
            {/* Prev button */}
            <button
              type="button"
              aria-label="Previous"
              className="inline-flex items-center justify-center w-11 h-11 p-0 rounded-full bg-[#A3A3A3]/80 shadow-sm hover:bg-[#A3A3A3] transition"
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

            {/* Page indicator */}
            <span className="text-[#333] font-satoshi text-base font-medium select-none">
              1/2
            </span>

            {/* Next button */}
            <button
              type="button"
              aria-label="Next"
              className="inline-flex items-center justify-center w-11 h-11 p-0 rounded-full bg-white shadow-sm hover:bg-gray-100 transition"
            >
              <Image
                src="/icons/arrowRightIcon.svg"
                alt="Next"
                width={11}
                height={16}
                priority
              />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
