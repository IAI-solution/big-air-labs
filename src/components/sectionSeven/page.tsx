// app/sectionSeven/page.tsx
"use client";

import React from "react";
import Image from "next/image";

export default function Hero7() {
  return (
    <footer className="relative w-full bg-white text-[#1d1d1f]">
      {/* Top */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Subscribe */}
          <div className="sm:col-span-2">
            <p
              className="text-sm text-[#6b7280] font-roboto"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              AI is fast to catch up. <br /> We’ll help you keep up with it.
            </p>

            <form
              className="mt-4 flex items-stretch gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Your email
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email"
                className="w-full rounded-md bg-[#1d1d1f] text-white placeholder:text-white/60 px-3 py-2 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-black/30"
              />
              <button
                aria-label="Subscribe"
                className="shrink-0 rounded-md px-3 py-2 text-sm ring-1 ring-black/10 hover:ring-black/20 transition"
              >
                {/* Arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li>Overview</li>
              <li>Plans</li>
              <li>Enterprise plans</li>
              <li>Download apps</li>
              <li>Pricing plans</li>
              <li>Login</li>
            </ul>
          </div>

          {/* API Platform */}
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide">
              API Platform
            </h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li>Overview</li>
              <li>Dev docs</li>
              <li>Pricing</li>
              <li>Console login</li>
            </ul>
          </div>

          {/* Research */}
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide">
              Research
            </h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li>Overview</li>
              <li>Economic Index</li>
            </ul>
          </div>

          {/* Our Models */}
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide">
              Our Models
            </h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li>NZT/Blackticker 1.1</li>
              <li>Prism 1.0</li>
            </ul>
          </div>

          {/* Commitments */}
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide">
              Commitments
            </h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li>Transparency</li>
              <li>Scaling Policy</li>
              <li>Security and compliance</li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide">
              Solutions
            </h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li>AI Agents</li>
              <li>Coding</li>
              <li>Customer support</li>
              <li>Education</li>
              <li>Financial service</li>
              <li>Government</li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide">Learn</h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li>BigAir Academy</li>
              <li>Customer stories</li>
              <li>Our engineers</li>
              <li>MCP Integrations</li>
              <li>Partner directory</li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li>About us</li>
              <li>Careers</li>
              <li>Events</li>
              <li>News</li>
              <li>Blogs</li>
              <li>Case studies</li>
              <li>Research Papers</li>
              <li>Intern program</li>
            </ul>
          </div>

          {/* Help and security */}
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide">
              Help and security
            </h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li>Status</li>
              <li>Availability</li>
              <li>Support centre</li>
            </ul>
          </div>

          {/* Terms and policies */}
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide">
              Terms and policies
            </h4>
            <ul className="space-y-2 text-sm text-[#4b5563]">
              <li>Privacy Choices</li>
              <li>Privacy policy</li>
              <li>Responsible disclosure policy</li>
              <li>Terms of service - consumer</li>
              <li>Terns of service - commercial</li>
              <li>Usage policy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-black/10" />

      {/* Bottom bar */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo text */}
        <div className="text-xs tracking-wider uppercase font-medium">
          BIG AIR LAB
        </div>

        {/* Social icons (Next/Image from /public/icons/*.svg) */}
        <div className="flex items-center gap-4">
          {[
            "instagram",
            "linkedin",
            "reddit",
            "github",
            "discord",
            "x",
            "facebook",
            "youtube",
          ].map((name) => (
            <a
              key={name}
              href="#"
              aria-label={name}
              className="p-1.5 rounded hover:bg-black/5 transition"
            >
              <Image src={`/icons/${name}.svg`} alt={name} width={20} height={20} />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-xs text-[#6b7280]">© 2025 BigAirLab</div>
      </div>
    </footer>
  );
}
