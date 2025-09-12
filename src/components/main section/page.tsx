"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { URLS } from "@/constants/referUrls";
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
  const circleRef = useRef<HTMLDivElement | null>(null);
  const section2Cloud = useRef<HTMLDivElement | null>(null)


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
        duration: 3,
        ease: "power3.out"
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
    if (!circleRef.current || !section1Ref.current || !section2Left.current) return;

    gsap.fromTo(
      circleRef.current,
      { y: 0 },
      {
        y: () => {
          const base = section1Ref.current!.getBoundingClientRect().bottom;
          // responsive offset
          if (window.innerWidth >= 1024) {
            return base + 200; // larger offset for desktop
          } else if (window.innerWidth >= 768) {
            return base + 150; // tablet
          }
          return base + 100; // mobile
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

  useEffect(() => {
    if (!section2Cloud.current) return;

    const el = section2Cloud.current;
    const speed = 100; // px/sec, adjust to match c1Ref speed
    let tween: gsap.core.Tween | null = null;

    const startDrift = () => {
      if (!el) return;
      if (tween) tween.kill();

      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const width = rect.width;
      const totalWidth = vw + width;
      const duration = totalWidth / speed;

      // Start off-screen left
      gsap.set(el, { x: -width });

      tween = gsap.to(el, {
        x: `+=${totalWidth}`,
        duration,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });
    };

    startDrift();
    window.addEventListener("resize", startDrift);

    return () => {
      window.removeEventListener("resize", startDrift);
      if (tween) tween.kill();
    };
  }, []);

async function ensureSmoothScroll() {
  if (typeof window === "undefined") return;
  if ((window as any).__lenis_ready) return;

  const [{ default: Lenis }, gsapModule] = await Promise.all([
    import("@studio-freight/lenis"),
    import("gsap"),
  ]);
  const gsap = gsapModule.gsap || (gsapModule as any);

  const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
  (window as any).__lenis_ready = true;
  (window as any).__lenis = lenis;

  lenis.on("scroll", () => {
    (gsap as any).plugins?.ScrollTrigger?.update?.();
  });

  gsap.ticker.add((t: number) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

const scrollToContact = async (e?: React.MouseEvent<HTMLAnchorElement>) => {
  e?.preventDefault();
  await ensureSmoothScroll();

  const el = document.getElementById("contact");
  if (!el) return;

  const lenis = (window as any).__lenis;
  const focusName = () => {
    const nameInput = document.querySelector<HTMLInputElement>(
      '#contact input[name="name"]'
    );
    nameInput?.focus();
  };

  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(el, { duration: 1.2, onComplete: focusName });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(focusName, 500);
  }
};

  return (
    <section
      ref={sectionRef}
      className="relative w-full isolate overflow-x-clip
             px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12
             min-h-[700px] sm:min-h-[800px] md:min-h-[80vh] lg:p-[10vh]  lg:pt-[25vh] xl:pt-[15vh] lg:min-h-screen
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
        {/* <div
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
        </div> */}



      </div>
      <div
        className="mx-auto w-full flex flex-col justify-center min-h-[80vh] relative"
        ref={section1Ref}
      >
        <div className="max-w-[1120px] relative z-10">
          {/* Text content */}
          <div className="relative z-20 text-center md:text-left">
<h1
  style={{ fontFamily: "spartan" }}
  className="font-spartan font-bold text-[#333] 
       text-[44px] md:text-[80px] leading-[1.2] 
       lg:leading-[120px] break-words text-left sm:text-center  md:text-left"
>
  <span className="inline-block align-middle">
    {/* Scales with font size: 44px on mobile, 80px on md+ */}
    <Image
      src="/images/bigAirText.svg"
      alt="Big Air Lab"
      width={800}   // arbitrary intrinsic; display size is controlled by CSS below
      height={120}
      className="h-[1em] w-auto"
      priority
    />
  </span>
</h1>


            <p
              className="font-satoshi font-bold uppercase text-[#333] 
                   text-[clamp(12px,2.4vw,28px)] leading-snug mt-2 text-left sm:text-center md:text-left"
            >
              WE BUILD{" "}
              <span className="font-[300] italic tracking-[1px]">AI</span> ABOVE THE CLOUDS
            </p>

            {/* Paragraph + Buttons */}
            <div className="mt-[70px] md:mt-8">
              <p className="font-satoshi text-[#333] 
                      text-[16px] md:text-[24px]
                     leading-relaxed max-w-prose mx-auto md:mx-0">
                Turning AI research into enterprise <br />systems that move{" "}
                <span className="font-bold">ideas into reality</span>
              </p>

              <div
                className="mt-6 flex flex-row gap-3 sm:gap-5 
                     items-center justify-center md:justify-start"
              >
                <Link
                   href="#contact"
  onClick={scrollToContact}
className="inline-flex items-center justify-center gap-1 
     rounded-[36px] bg-white text-[#333]  
     h-11 md:h-14 px-6 sm:w-auto w-[150px] sm:min-w-[140px] 
     font-satoshi font-medium text-[16px] md:text-[20px] leading-[1.75]"
                >
                  Contact us
                </Link> 

                <Link
                  href={URLS.careers}
                  referrerPolicy="no-referrer"
                  // target="_blank"
className="inline-flex items-center justify-center gap-1 
     rounded-[36px] bg-[#333] text-white 
     h-11 md:h-14 px-6 sm:w-auto w-[150px] sm:min-w-[140px] 
     font-satoshi font-medium text-[16px] md:text-[20px] leading-[1.75]"
                >
                  You code?
                </Link>
              </div>
            </div>
          </div>
        </div>
        <section className="flex flex-row items-center justify-center gap-2 text-white absolute bottom-10 left-1/2 w-full -translate-x-1/2 -translate-y-1/2">
<p className="text-[14px] md:text-[16px] tracking-[0.3em] font-medium uppercase">
  Scroll For More
</p>
          <span className="animate-bounce text-lg font-bold">↓</span>
        </section>

      </div>

<div className="flex flex-col gap-12 md:gap-16 invisible lg:max-w-[80vw] z-[100] relative bg-green mt-[100px] pb-20" ref={section2Ref}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-10%] left-0 w-full z-0"
        >
          <span ref={section2Cloud} className="block will-change-transform">
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
          className="relative top-16 sm:top-20 md:top-24 lg:top-28 max-w-4xl"
        >
          <h2 className="font-satoshi text-black font-medium text-[20px] lg:text-5xl leading-tight">
            Engineered for Real Impact
          </h2>
          <p className="mt-4 font-satoshi text-[#333] text-[16px] lg:text-2xl leading-relaxed max-w-4xl">
            Every solution we build flows seamlessly from research to enterprise deployment, designed for{" "}
            <span className="italic font-bold">scalability, security, and performance.</span>
          </p>
        </div>
        {/* Glass Card (wrapper opacity untouched; only its content fades on entry) */}
<div
  className="
    mt-16 sm:mt-20 md:mt-20 lg:mt-26
    rounded-lg overflow-hidden
    bg-[rgba(0, 0, 0, 0.00)] backdrop-blur-xl
    border-2 border-white/30 shadow-lg
    p-6 sm:p-8 md:px-8 md:py-10
    w-full
  "
  ref={section2Left}
  aria-label="Coming soon card"
>
  <div className="w-full min-h-[160px] sm:min-h-[200px] md:min-h-[240px] flex items-center">
    <div className="flex flex-col items-start gap-2" style={{ fontFamily: "spartan" }}>
      <span
        className="
          text-[#333] font-medium leading-none
          text-[22px] sm:text-[32px] md:text-[40px]
          tracking-[-0.05em] md:tracking-[-0.1em]
          max-w-full
        "
      >
        Our products are
      </span>

      {/* smaller at md, no-wrap to avoid line break at 1024px */}
      <span
        className="
          text-[#333] font-medium leading-none uppercase
          text-[32px] sm:text-[54px] md:text-[64px] lg:text-[80px]
          md:tracking-[-0.02em]
          md:whitespace-nowrap
          max-w-full
        "
      >
        COMING SOON
      </span>
    </div>
  </div>
</div>





      </div>


    </section>
  );
}

