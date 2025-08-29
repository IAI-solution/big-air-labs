"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const c1Ref = useRef<HTMLSpanElement | null>(null);
  const c2Ref = useRef<HTMLSpanElement | null>(null);
  const c3Ref = useRef<HTMLSpanElement | null>(null);
  const c4Ref = useRef<HTMLDivElement | null>(null);
  const section1Ref = useRef<HTMLDivElement | null>(null);
  const section2Ref = useRef<HTMLDivElement | null>(null);
  const section2Left = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null)


  useEffect(() => {
    if (!section1Ref.current || !section2Ref.current || !section2Left.current) return;

    // Initially hide section 2
    gsap.set(section2Ref.current, { opacity: 0, visibility: "hidden" });
    gsap.set(section2Left.current, {
      x: -200, // start 200px to the left
      opacity: 0
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section1Ref.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        // markers: true, // Enable for debugging
      },
    });

    tl.to(section1Ref.current, { opacity: 0, visibility: "hidden", ease: "none" }, 0)
      .to(section2Ref.current, { opacity: 1, visibility: "visible", ease: "none" }, 0)
      .to(section2Left.current, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out"
      }, 0)

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const elements = [c1Ref.current, c2Ref.current, c3Ref.current];
    const speeds = [180, 100, 80]; // px/sec for c1, c2, c3
    const anims: gsap.core.Tween[] = [];

    const startAll = () => {
      anims.forEach((a) => a.kill());
      anims.length = 0;

      elements.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vw = window.innerWidth;
        const width = rect.width;
        const totalWidth = vw + width;
        const duration = totalWidth / speeds[i];

        // Start off-screen left
        gsap.set(el, { x: -width });

        // Infinite drift
        anims.push(
          gsap.to(el, {
            x: `+=${totalWidth}`,
            duration,
            ease: "none",
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
            },
          })
        );
      });
    };

    startAll();
    window.addEventListener("resize", startAll);

    return () => {
      window.removeEventListener("resize", startAll);
      anims.forEach((a) => a.kill());
    };
  }, []);


  useEffect(() => {
    if (!c4Ref.current) return;

    // const el = c4Ref.current;
    const el = c4Ref.current;
    const vw = window.innerWidth;
    const width = el.getBoundingClientRect().width;
    const totalWidth = vw + width;
    const durationMove = totalWidth / 120;

    gsap.set(el, {
      opacity: 0,
      visibility: "hidden",
    });


    const tl = gsap.timeline({ repeat: -1 });

    tl.set(el, { visibility: "visible" })
      .to(el, { opacity: 1, duration: 1.5 })
      .to(el, { x: `+=${totalWidth}`, duration: durationMove, ease: "none" })
      .to(el, { opacity: 0, duration: 1 })
      .set(el, { x: 0 }); // reset to center position (x:0 means no offset from left 50%)
  }, []);


  // useEffect(() => {
  //   if (!c4Ref.current) return;

  //   const el = c4Ref.current;
  //   const vw = window.innerWidth;
  //   const width = el.getBoundingClientRect().width;
  //   const totalWidth = vw + width;
  //   const durationMove = totalWidth / 120;

  //   // Setup: position center of viewport with offset by half element size
  //   gsap.set(el, {
  //     position: "fixed",
  //     left: "50%",
  //     top: "50%",
  //     xPercent: -50,
  //     yPercent: -50,
  //     opacity: 0,
  //     visibility: "hidden",
  //   });


  //   const tl = gsap.timeline({ repeat: -1 });

  //   tl.set(el, { visibility: "visible" })
  //     .to(el, { opacity: 1, duration: 1.5 })
  //     .to(el, { x: `+=${totalWidth}`, duration: durationMove, ease: "none" })
  //     .to(el, { opacity: 0, duration: 1 })
  //     .set(el, { x: 0 }); // reset to center position (x:0 means no offset from left 50%)
  // }, []);



  useEffect(() => {
    if (!circleRef.current || !section2Ref.current || !section2Left.current) return;

    gsap.fromTo(
      circleRef.current,
      { y: 0 },
      {
        y: () => {
          const circleY = circleRef.current!.getBoundingClientRect().top;
          const targetY = section2Left.current!.getBoundingClientRect().top;
          return targetY - circleY;
        },
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          endTrigger: section2Left.current,
          end: "top center",
          scrub: true,
        },
      }
    );
  }, []);


  return (
    <section
      ref={sectionRef}
      className="relative w-full isolate overflow-x-clip
             px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12
             min-h-[700px] sm:min-h-[800px] md:min-h-[80vh] lg:p-[10vh]  lg:pt-[25vh] lg:min-h-screen
             [background:linear-gradient(180deg,#FFFFFF_0%,#E3F7FF_20%,#B1CCFF_100%)]
             bg-repeat bg-cover"
      aria-label="Big Air Lab hero"
    >
      <div
        ref={circleRef}
        className="pointer-events-none select-none absolute top-[10vh] right-[5vw] md:top-[15vh] md:right-[10vw] lg:right-[15vw] z-0"
      >
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
      {/* <div
        ref={circleRef}
        className="absolute right-[20%] top-[10%] w-[200px] h-[200px] rounded-full"
      >
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
      </div> */}

      <div aria-hidden="true" className=" relative z-10" >

        {/* Clouds */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-0 left-0 top-[-120px]"
        >
          <span
            ref={c1Ref}
            className="block will-change-transform [transform:translate3d(-1000px,0px,0)]"
          >
            <Image
              src="/images/cTop.svg"
              alt=""
              width={903}
              height={376}
              priority
              role="presentation"
              className="w-[700px] sm:w-[820px] md:w-[903px] max-w-full h-auto aspect-[293/122] select-none"
              draggable={false}
            />
          </span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-0 left-0 top-[120px]"
        >
          <span
            ref={c2Ref}
            className="block will-change-transform [transform:translate3d(-1200px,0,0)]"
          >
            <Image
              src="/images/cBottom.svg"
              alt=""
              width={903}
              height={376}
              priority
              role="presentation"
              className="w-[700px] sm:w-[820px] md:w-[903px] max-w-full h-auto aspect-[293/122] select-none"
              draggable={false}
            />
          </span>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-0 left-0 top-[420px]"
        >
          <span
            ref={c3Ref}
            className="block will-change-transform [transform:translate3d(-2000px,0,0)]"
          >
            <Image
              src="/images/cInverted.svg"
              alt=""
              width={903}
              height={376}
              priority
              role="presentation"
              className="w-[700px] sm:w-[820px] md:w-[903px] max-w-full h-auto aspect-[293/122] select-none"
              draggable={false}
            />
          </span>
        </div>
        <div
          ref={c4Ref}
          aria-hidden="true"
          className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 invisible"
        >
          <Image
            src="/images/cBottom.svg"
            alt=""
            width={903}
            height={376}
            priority
            role="presentation"
            className="w-[700px] sm:w-[820px] md:w-[903px] max-w-full h-auto select-none"
            draggable={false}
          />
        </div>



      </div>
      <div className="mx-auto w-full" ref={section1Ref}>
        <div className="max-w-[1120px] relative z-10">


          {/* Text content */}
          <div className="relative z-20">
            <h1 className="font-satoshi font-bold uppercase text-[#333] text-[clamp(36px,6.8vw,80px)] leading-[1.2] lg:leading-[120px] break-words">
              BIG AIR LAB
            </h1>

            <p className="mt-2 font-satoshi font-bold uppercase text-[#333] text-[clamp(14px,2.4vw,28px)] leading-snug">
              WE BUILD{" "}
              <span className="font-[300] italic tracking-[1px] leading-snug">
                AI
              </span>{" "}
              ABOVE THE CLOUDS
            </p>

            <p className="mt-6 lg:mt-8 font-satoshi text-[#333] text-[clamp(14px,2.2vw,22px)] leading-relaxed max-w-prose">
              Turning AI research into enterprise systems that move{" "}
              <span className="font-bold">ideas into reality</span>
            </p>

            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-wrap items-center gap-3 sm:gap-5">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1 rounded-[36px] bg-white text-[#333] border border-[#333]/80 h-11 px-4 min-w-[128px] text-[clamp(14px,1.5vw,18px)]
                           sm:h-12 sm:px-5 sm:min-w-[140px] md:h-14 md:px-6 md:min-w-[180px]
                           font-satoshi font-medium leading-[1.5] shadow-[0_1px_0_rgba(0,0,0,0.04)]
                           hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#333]
                           transition-[background-color,opacity,transform] whitespace-nowrap shrink"
              >
                Contact us
              </Link>

              <Link
                href="/cta"
                className="inline-flex items-center justify-center gap-1 rounded-[36px] bg-[#333] text-white h-11 px-4 min-w-[128px] text-[clamp(14px,1.5vw,18px)]
                           sm:h-12 sm:px-5 sm:min-w-[140px] md:h-14 md:px-6 md:min-w-[180px]
                           font-satoshi font-medium leading-[1.5] hover:opacity-90 active:opacity-80
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#333]/60 transition-opacity motion-reduce:transition-none
                           whitespace-nowrap shrink"
              >
                You code?
              </Link>
            </div>
          </div>
        </div>

      </div>
      <div className="flex flex-col gap-12 md:gap-16 invisible  max-w-[60vw] z-[100] relative bg-green mt-[100px]" ref={section2Ref}>
        <div
          className="relative top-16 sm:top-20 md:top-24 lg:top-28 max-w-4xl"
        >
          <h2 className="font-satoshi text-black font-medium text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Engineered for Real Impact
          </h2>
          <p className="mt-4 font-satoshi text-[#333] text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-4xl">
            Every solution we build flows seamlessly from research to enterprise deployment, designed for{" "}
            <span className="italic font-bold">scalability, security, and performance.</span>
          </p>
        </div>
        {/* Glass Card (wrapper opacity untouched; only its content fades on entry) */}
        <div
          className="
          mt-16 sm:mt-20 md:mt-24 lg:mt-32
           rounded-2xl overflow-hidden
          bg-white/30  border border-white/40 shadow-lg
          p-4 sm:p-5 
        "
          ref={section2Left}
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
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

            <div className="flex-1 flex flex-col items-start gap-4 sm:gap-5 w-full">
              <h3
                className="
                            font-satoshi text-black
                            text-3xl sm:text-4xl
                            font-light leading-tight uppercase tracking-wide
                          "
              >
                PRISM AI
              </h3>
              <p className="text-black font-satoshi text-base sm:text-lg font-normal leading-normal max-w-md">
                Your own personal assistant with spectrum of tasks.
              </p>
              <p className="text-[#08070D] font-satoshi text-base sm:text-lg font-normal leading-relaxed max-w-md">
                A brief description about the product. How it helps the user. It's advantage from the competitors.
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


    </section>
  );
}

