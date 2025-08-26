// app/sectionThree/page.tsx
"use client";

import Image from "next/image";

/**
 * A reusable component for the feature items to keep the code DRY (Don't Repeat Yourself).
 * This makes the main component cleaner and easier to read.
 * @param {string} src - The source URL for the image.
 * @param {string} alt - The alt text for the image for accessibility.
 * @param {string} label - The text label displayed below the image.
 */
const FeatureItem = ({ src, alt, label }: { src: string; alt: string; label: string }) => (
  <div className="flex flex-col items-center text-center gap-y-4">
    <Image
      src={src}
      alt={alt}
      width={137}
      height={179}
      // Use responsive width classes and h-auto to maintain aspect ratio
      className="h-auto w-28 sm:w-32 md:w-36 object-contain"
      priority // Keep priority for LCP (Largest Contentful Paint) optimization
    />
    <p className="font-satoshi text-black text-lg sm:text-xl font-medium leading-snug">
      {label}
    </p>
  </div>
);

export default function Hero3() {
  return (
    <section
      className="relative w-full min-h-screen gradient3 isolate overflow-x-clip flex items-center py-20 sm:py-24"
      aria-label="Third section"
    >
      {/* Main container using Tailwind CSS for centering and max-width.
        This provides a consistent, centered layout on larger screens
        while allowing content to be fluid on smaller screens.
        Responsive padding (px-5 sm:px-8) ensures content doesn't touch screen edges.
      */}
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-y-16 md:gap-y-20">
          
          {/* TEXT CONTENT BLOCK
            Centered text with a max-width to ensure readability on wide screens.
            Typography is responsive, adjusting font size smoothly across breakpoints.
          */}
          <div className="max-w-4xl text-center">
            <h2 className="font-satoshi text-black font-medium leading-tight text-3xl sm:text-4xl lg:text-5xl">
              Empowering Business Growth
              <br className="hidden md:block" />
              with Scalable Enterprise AI Solutions
            </h2>
            <p className="mt-6 max-w-3xl mx-auto font-satoshi text-black/90 leading-relaxed text-lg sm:text-xl lg:text-2xl">
              We are an <span className="font-bold italic">AI Research Lab, not just a company</span>.
              Our work spans Finance AI, Consumer AI, and Enterprise AI Systems, delivering measurable business outcomes.
            </p>
          </div>

          {/* FEATURES GRID
            A responsive grid that stacks to a single column on small screens (`grid-cols-1`)
            and expands to a three-column layout on medium screens and up (`md:grid-cols-3`).
            The gap between items is also responsive.
          */}
          <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-12 sm:gap-10">
            <FeatureItem
              src="/images/rings.svg"
              alt="Finance AI Icon"
              label="Finance AI"
            />
            <FeatureItem
              src="/images/stars.svg"
              alt="Consumer AI Icon"
              label="Consumer AI"
            />
            <FeatureItem
              src="/images/circles.svg"
              alt="Enterprise AI Solution Icon"
              label="Enterprise AI Solution"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
}
