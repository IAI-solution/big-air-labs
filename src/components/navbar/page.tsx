// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import RotatingSemiCircles from "../RotatingCircle/page";
import { URLS } from "@/constants/referUrls";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);

    if (pathname !== "/") {
      router.push("/#contact");
      return;
    }

    const el = document.getElementById("contact");
    if (!el) return;

    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: -100, duration: 1.1 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy({ top: -100, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed w-full top-0 z-50">
    <nav className="relative w-full supports-[backdrop-filter]:bg-white/10 bg-white/20 backdrop-blur-xl backdrop-saturate-150 border-b border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.0)]">
        <div
          className="
            w-full
            px-4 sm:px-6 lg:px-[70px]
            h-16 sm:h-20 md:h-20
            flex items-center justify-between gap-4
          "
        >
          {/* Brand (left) */}
          <div id="logo" className="flex items-center justify-center gap-2">

            <RotatingSemiCircles className=" w-[24px] h-[24px] lg:w-[40px] lg:h-[40px]" />


    <Link
      href="/"
      aria-label="Big Air Labs Home"
      className="whitespace-nowrap flex items-center"
    >
      <span className="text-[18px] sm:text-[20px] lg:text-[22px] leading-[1.75] font-medium text-[#333]" style={{ fontFamily: "spartan" }}>
        {/* scales with font size */}
        <Image
          src="/images/bigAirText.svg"
          alt="Big Air Labs"
          width={200}
          height={60}
          className="w-auto h-[1em]"
          priority
        />
      </span>
    </Link>

          </div>

          {/* Mobile toggle */}
          <button
            className="inline-flex items-center justify-center rounded-full p-2 md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#333]"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#333]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          {/* Right group (nav + CTAs) */}
          <div className="hidden md:flex items-center gap-6">
            {/* <ul
              className="
                flex items-center
                gap-4 md:gap-6 lg:gap-8
                font-satoshi text-[18px] lg:text-[20px] leading-[1.75]
                font-medium text-[#333]
              "
            >
              <li>
                <Link
                  href="/products"
                  className="hover:opacity-70 transition-opacity"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions"
                  className="hover:opacity-70 transition-opacity"
                >
                  Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/company"
                  className="hover:opacity-70 transition-opacity"
                >
                  Company
                </Link>
              </li>
            </ul> */}

            {/* Contact us button */}
            <Link
              href="/#contact"
              onClick={handleContactClick}
className="
  inline-flex items-center justify-center gap-1
  rounded-full bg-white px-6 h-14
  font-satoshi text-[20px] leading-[1.75] font-medium
  text-[#333] border border-[#333]
  hover:bg-gray-100 active:bg-gray-200 transition
  whitespace-nowrap
"
            >
              Contact us
            </Link>

            {/* You code button */}
            <Link
              href={URLS.careers}
              referrerPolicy="no-referrer"
              target="_blank"
className="
  inline-flex items-center justify-center gap-1
  rounded-full bg-[#333] px-6 h-14
  font-satoshi text-[20px] leading-[1.75] font-medium
  text-white
  hover:opacity-90 active:opacity-80 transition
  whitespace-nowrap
"
            >
              You code?
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden border-t border-black/5 ${open ? "block" : "hidden"
            }`}
        >
          <div className="px-4 py-3 sm:px-6">
            <ul className="flex flex-col gap-3 font-satoshi text-[18px] leading-[1.75] font-medium text-[#333]">
              {/* <li>
                <Link href="/products" className="block py-2">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="block py-2">
                  Solutions
                </Link>
              </li>
              <li>
                <Link href="/company" className="block py-2">
                  Company
                </Link>
              </li> */}
              <li>
                {/* Contact us pill in mobile too */}
<Link
  href="/#contact"
  onClick={handleContactClick}
  className="
    inline-flex items-center justify-center gap-1
    rounded-[36px] bg-white
    h-11 sm:h-12 px-6
    w-full text-center
    font-satoshi font-medium text-[clamp(14px,1.5vw,18px)] leading-[1.75]
    text-[#333] border border-[#333]
    hover:bg-gray-100 active:bg-gray-200 transition
  "
>
  Contact us
</Link>


              </li>
              <li>
  <Link
    href={URLS.careers}
    target="_blank"
    rel="noopener noreferrer"
    referrerPolicy="no-referrer"
    onClick={() => setOpen(false)}
    aria-label="Careers — You code?"
    className="
      inline-flex items-center justify-center gap-1
      rounded-[36px] bg-[#333]
      h-11 sm:h-12 px-6
      w-full text-center
      font-satoshi font-medium text-[clamp(14px,1.5vw,18px)] leading-[1.75]
      text-white border border-[#333]
      hover:opacity-90 active:opacity-80 transition
    "
  >
    You code?
  </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
