"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedFeature() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>(".panel");

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => "+=" + containerRef.current!.offsetWidth,
      },
    });

    // Handle grid scroll handoff
    if (gridRef.current) {
      const gridEl = gridRef.current;

      ScrollTrigger.create({
        trigger: gridEl,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          ScrollTrigger.getAll().forEach((s) => {
            if (s.vars.trigger !== gridEl) s.disable();
          });
        },
        onLeave: () => {
          ScrollTrigger.getAll().forEach((s) => s.enable());
        },
        onLeaveBack: () => {
          ScrollTrigger.getAll().forEach((s) => s.enable());
        },
      });

      // Detect manual scroll inside grid
      gridEl.addEventListener("scroll", () => {
        if (
          gridEl.scrollLeft + gridEl.clientWidth >= gridEl.scrollWidth - 5
        ) {
          ScrollTrigger.getAll().forEach((s) => s.enable());
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden" ref={containerRef}>
      <div className="flex h-full">
        {/* Hero1 */}
        <section className="panel w-screen h-screen flex items-center justify-center bg-blue-500">
          <h1 className="text-4xl font-bold text-white">Hero 1</h1>
        </section>

        {/* Hero2 */}
        <section className="panel w-screen h-screen flex items-center justify-center bg-green-500">
          <h1 className="text-4xl font-bold text-white">Hero 2</h1>
        </section>

        {/* Hero3 - Grid Cards */}
        <section className="panel w-screen h-screen flex items-center justify-center bg-yellow-500">
          <div
            ref={gridRef}
            className="flex flex-col md:flex-row gap-4 overflow-y-auto md:overflow-x-auto w-full h-full p-4"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full md:w-80 h-60 bg-white shadow-lg rounded-xl flex items-center justify-center"
              >
                <span className="text-xl font-bold text-black">Card {i}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Hero4 - News Cards */}
        <section className="panel w-screen h-screen flex items-center justify-center bg-red-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-center items-center"
              >
                <Image
                  src="/placeholder.png"
                  alt={`News ${n}`}
                  width={200}
                  height={120}
                  className="rounded-md object-cover"
                />
                <p className="mt-2 text-black font-semibold">
                  News card {n}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
