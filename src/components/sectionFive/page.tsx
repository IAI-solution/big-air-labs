"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Hero7 from "../sectionSeven/page";
import RotatingSemiCircles from "../RotatingCircle/page";
import { toast } from "sonner";

/* ----------------- Lenis + GSAP Bootstrap ----------------- */
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

/* ----------------- Shared Components ----------------- */
const FeatureItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div>
    <h3 className="text-black font-satoshi font-medium text-[18px] sm:text-[20px] md:text-[24px] leading-[150%]">
      {title}
    </h3>
    <p className="mt-1 text-black font-satoshi font-normal text-[16px] sm:text-[18px] md:text-[20px] leading-[150%]">
      {description}
    </p>
  </div>
);

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  how_did_you_hear?: string;
  message: string;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Submission failed");
  }

  return await res.json();
}

function ContactPanel() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    how_did_you_hear: "",
    message: "",
    newsletter: false,
    checked: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const target =
      e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value } = target;
    const checked = (target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: target.type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitContactForm({
        name: form.name,
        email: form.email,
        phone: form.phone,
        how_did_you_hear: form.how_did_you_hear,
        message: form.message,
      });
      console.log("✅ Enquiry submitted successfully!");
      toast.success("Successfully Submitted");

      setForm({
        name: "",
        email: "",
        phone: "",
        how_did_you_hear: "",
        message: "",
        newsletter: false,
        checked: false,
      });
    } catch (err: any) {
      console.log("❌ " + err.message);
      toast.error("Failed to Submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="contact"
      className="
        w-full flex items-center justify-center
        mt-16 sm:mt-20 md:mt-28 lg:mt-32
        translate-y-4 md:translate-y-6 lg:translate-y-8
        scroll-mt-20 sm:scroll-mt-24 md:scroll-mt-[100px]
      "
    >
      {/* Footprint keeper: keeps the original section height so siblings don't move */}
      <div className="relative w-full md:min-h-[680px] lg:min-h-[720px] flex items-center justify-center mb-16 md:mb-0">
        <div
          className="
            relative w-full
            max-w-[92vw] sm:max-w-[640px] md:max-w-[920px] lg:max-w-[1100px] xl:max-w-[1200px]
            rounded-2xl shadow-2xl border border-white/10
            bg-[rgba(51,51,51,0.60)] backdrop-blur-md overflow-hidden
            "
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* left: title */}
            <div className="md:col-span-5 h-full">
              <div className="h-full flex flex-col justify-start px-6 sm:px-8 lg:px-10 pt-8 pb-6 md:pt-10 lg:pt-12 text-white">
                <h3 className="font-satoshi font-medium text-[24px] sm:text-[28px] md:text-[34px] lg:text-[36px] leading-tight">
                  Have a project in mind?
                  <br />
                  Let’s turn it into
                  <br />
                  tomorrow’s advantage.
                </h3>
                <hr className="mt-6 w-[85%] sm:w-[420px] max-w-full border-t border-white/50" />
              </div>
            </div>

            {/* right: form */}
            <div className="md:col-span-7 h-full w-full">
              <form
                className="
                  h-full w-full
                  px-6 sm:px-8 lg:px-12
                  py-8 lg:py-12
                  flex flex-col
                  "
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name*"
                    required
                    className="h-12 rounded-md bg-white text-[#333] px-3 outline-none w-full"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address*"
                    required
                    className="h-12 rounded-md bg-white text-[#333] px-3 outline-none w-full"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={15}
                    placeholder="Phone number*"
                    className="h-12 rounded-md bg-white text-[#333] px-3 outline-none w-full"
                  />
                  <select
                    name="how_did_you_hear"
                    value={form.how_did_you_hear}
                    onChange={handleChange}
                    className="h-12 rounded-md bg-white text-[#333] px-3 outline-none w-full"
                  >
                    <option value="" disabled>
                      How did you hear of us?
                    </option>
                    <option>Google Search</option>
                    <option>LinkedIn</option>
                    <option>X (Twitter)</option>
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>Reddit</option>
                    <option>YouTube</option>
                    <option>Discord</option>
                    <option>GitHub</option>
                    <option>Others</option>
                  </select>
                </div>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Type your message here"
                  required
                  className="mt-4 min-h-[160px] lg:min-h-[180px] rounded-md bg-white text-[#333] px-3 py-3 outline-none"
                />

                <label className="mt-4 inline-flex items-center gap-3 text-white/90 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={form.newsletter}
                    onChange={handleChange}
                    className="h-5 w-5 rounded-[4px] border border-white/60 bg-transparent accent-white"
                  />
                  I am happy to receive newsletters from BigAir.
                </label>

                <p className="mt-3 text-white/80 text-xs leading-relaxed" id="policy">
                  By submitting this form I accept BigAir’s Privacy Policy &amp; T&amp;C’s
                </p>

                {/* push CTA to bottom while preserving generous padding */}
                <div className="mt-auto pt-6">
                  <div className="mx-auto w-[min(560px,100%)]">
                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        w-full h-[56px] rounded-[999px] px-6
                        bg-[#3B61F6] text-white font-satoshi
                        hover:brightness-95 transition
                        disabled:opacity-50
                      "
                      aria-describedby="policy"
                    >
                      {loading ? "Sending..." : "Submit your enquiry"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* end card */}
      </div>
    </div>
  );
}

export default function Hero5() {
  const router = useRouter();

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingBlockRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const landscapeWrapRef = useRef<HTMLDivElement | null>(null);
  const bottomWaveRef = useRef<HTMLDivElement | null>(null);
  const cScreen4Ref = useRef<HTMLDivElement | null>(null);
  const cHalfScreen5Ref = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  const loadGsap = async () => {
    const mod = await import("gsap");
    return mod.gsap || (mod as any);
  };

  /* ----------------- Animations ----------------- */
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let played = false;

    // cloud-loop state
    let resizeHandler: (() => void) | null = null;
    let cloudAnims: any[] = [];

    const teardownCloudLoop = (gsap: any) => {
      cloudAnims.forEach((a) => a?.kill?.());
      cloudAnims = [];
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
        resizeHandler = null;
      }
    };

    const startCloudLoop = (gsap: any) => {
      const clouds = [cScreen4Ref.current, cHalfScreen5Ref.current].filter(
        Boolean
      ) as HTMLElement[];
      const speeds = [90, 60]; // px/sec

      const startAll = () => {
        cloudAnims.forEach((a) => a?.kill?.());
        cloudAnims = [];

        clouds.forEach((el, i) => {
          const rect = el.getBoundingClientRect();
          const vw = window.innerWidth;
          const width = rect.width;
          const totalWidth = vw + width + 200;
          const duration = totalWidth / (speeds[i] || 80);

          gsap.set(el, { x: 0 });

          const tween = gsap.to(el, {
            x: `+=${totalWidth}`,
            duration,
            ease: "none",
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize((x: string) => {
                const n = parseFloat(x);
                return (n % totalWidth) + "";
              }),
            },
          });

          cloudAnims.push(tween);
        });
      };

      startAll();
      resizeHandler = () => startAll();
      window.addEventListener("resize", resizeHandler);
    };

    (async () => {
      await ensureSmoothScroll();
      const gsap = await loadGsap();

      // 👉 Do NOT animate the landscape layer so its position stays intact
      const targets = [
        headingBlockRef.current,
        featuresRef.current,
        cScreen4Ref.current,
        cHalfScreen5Ref.current,
        logoRef.current,
        ctaRef.current,
        // landscapeWrapRef.current,  // removed on purpose
        bottomWaveRef.current,
      ].filter(Boolean) as HTMLElement[];

      gsap.set(targets, { y: "60vh", opacity: 0 });

      const node = sectionRef.current;
      if (!node) return;

      observer = new IntersectionObserver(
        async (entries) => {
          const entry = entries[0];
          if (!entry) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.15 && !played) {
            played = true;

            await gsap.to(targets, {
              y: 0,
              opacity: 1,
              duration: 5,
              stagger: 0.2,
              ease: "power2.out",
              clearProps: "transform,opacity",
            });

            startCloudLoop(gsap);

            observer?.disconnect();
          }
        },
        { root: null, threshold: [0, 0.15, 0.5, 1] }
      );

      observer.observe(node);

      return () => {
        teardownCloudLoop(gsap);
      };
    })();

    return () => {
      try {
        observer?.disconnect();
      } catch { }
    };
  }, []);

  const playExitAndNavigate = async (href: string) => {
    const gsap = await loadGsap();
    if ((sectionRef.current as any)?._leaving) return;
    (sectionRef.current as any)._leaving = true;

    if (sectionRef.current) sectionRef.current.style.pointerEvents = "none";

    await gsap.to(sectionRef.current, {
      y: "-25vh",
      opacity: 0,
      filter: "blur(6px)",
      duration: 1.8,
      ease: "power1.inOut",
    });

    router.push(href);
  };

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
    <>
      {/* ===== HERO ===== */}
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen overflow-hidden flex flex-col"
        aria-label="Playground section"
      >
        {/* GRADIENT BACKGROUND */}
        <div className="absolute inset-0 gradient5 -z-10" />

        {/* FLOATING CLOUDS */}
        {/* <div
          ref={cScreen4Ref}
          className="pointer-events-none select-none absolute z-20"
          style={{ top: "35%", left: "-5%" }}
          aria-hidden="true"
        >
          <Image
            src="/images/cScreen4.svg"
            alt=""
            width={1600}
            height={800}
            priority
            className="h-auto w-[240px] sm:w-[420px] md:w-[600px] lg:w-[750px] opacity-80"
          />
        </div> */}
        <div
          ref={cHalfScreen5Ref}
          className="pointer-events-none select-none absolute z-40"
          style={{ top: "7%", left: "5%" }}
          aria-hidden="true"
        >
          <Image
            src="/images/cHalfScreen5.svg"
            alt=""
            width={1600}
            height={800}
            priority
            className="h-auto w-[220px] sm:w-[380px] md:w-[550px] lg:w-[700px] opacity-80"
          />
        </div>

        {/* LANDSCAPE BACKGROUND */}
        <div
          ref={landscapeWrapRef}
          className="
    pointer-events-none select-none absolute inset-x-0 bottom-0 z-10
    top-[32vh] sm:top-[36vh] md:top-[40vh] lg:top-[44vh] xl:top-[48vh]
  "
          aria-hidden="true"
        >
          <Image
            src="/images/newlandscape.png"
            alt=""
            fill
            priority
            className="object-cover object-top"
          />
        </div>

        {/* CONTENT */}
        <div className="relative z-30 flex flex-col h-full">
          <div className="flex-grow flex flex-col">
            {/* Heading + Features */}
            <div className="w-full max-w-7xl px-4 sm:px-6 md:px-8 pt-[120px] sm:pt-[160px] md:pt-[200px] ml-0 sm:ml-[10px] md:ml-[20px]">
              <div
                ref={headingBlockRef}
                className="max-w-4xl ml-3 sm:ml-5 md:ml-10 lg:ml-8"
              >
                <h2 className="text-[#333] font-satoshi font-medium text-[20px] sm:text-[26px] md:text-[36px] leading-[1.4] tracking-[1px]">
                  A playground for curiosity
                </h2>
                <p className="mt-5 text-black font-satoshi font-normal text-[15px] sm:text-[18px] md:text-[22px] leading-[1.5]">
                  We believe breakthroughs are born from bold questions. That’s
                  why we provide:
                </p>
                <div
                  ref={featuresRef}
                  className="mt-8 sm:mt-10 md:mt-12 flex flex-col gap-y-6 sm:gap-y-8"
                >
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

            {/* CTA cards */}
            <div className="mt-auto flex flex-col items-center justify-end px-4 sm:px-5 pb-16 sm:pb-20 md:pb-24 lg:pb-28">
              <div
                ref={ctaRef}
                className="w-full max-w-6xl flex flex-col items-center justify-center text-center 
                           p-4 sm:p-6 md:p-8 gap-4 rounded-xl bg-white/10 border border-white/40 
                           shadow-2xl shadow-black/10 backdrop-blur-lg mt-24"
              >
                <p className="text-white font-satoshi font-medium uppercase text-[16px]/[1.2] xs:text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] tracking-[1px]">
                  Let’s create the future of smart AI together
                </p>
                <div className="mt-1 flex items-center gap-2 sm:gap-4 md:gap-6">
                  <a
                    href="https://www.iaisolution.com/career?tool=bigairlab"
                    // target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="flex items-center justify-center w-32 h-11 sm:w-[180px] sm:h-[56px] md:w-[180px] md:h-[56px] rounded-[40px] bg-white text-[#333] font-satoshi font-medium text-[16px] md:text-[20px] transition hover:bg-gray-100"
                  >
                    Careers
                  </a>

                  <a
                    href="#contact"
                    onClick={scrollToContact}
                    className="flex items-center justify-center w-32 h-11 sm:w-[180px] sm:h-[56px] md:w-[180px] md:h-[56px] rounded-[40px] bg-[#333] text-[white] font-satoshi font-medium text-[16px] md:text-[20px] transition hover:bg-black"
                  >
                    Talk to us
                  </a>
                </div>
              </div>

              <div ref={logoRef} className="flex flex-col items-center mb-6 md:mb-8">
                <RotatingSemiCircles color="#ffffff" />
                <h1 className="mt-2 text-white font-spartan font-medium text-[40px] tracking-[-1px] md:text-[72px] md:tracking-[-4px] lg:text-[105.3px] lg:tracking-[-8.1px] leading-[150%] xl:mt-[-70px]">
                  Big AIR Lab
                </h1>
              </div>
            </div>

            {/* Contact Panel (now in normal flow, responsive) */}
            <ContactPanel />
          </div>

          {/* Footer remains inside section */}
          <Hero7 />
        </div>
      </section>
    </>
  );
}
