// app/sectionSeven/page.tsx
"use client";

import React from "react";
import Image from "next/image";

// --- Data for Footer Links ---
// This makes the component cleaner and easier to update.
const footerLinks = [
  {
    title: "Product",
    links: ["Overview", "Plans", "Enterprise plans", "Download apps", "Pricing plans", "Login"],
  },
  {
    title: "API Platform",
    links: ["Overview", "Dev docs", "Pricing", "Console login"],
  },
  {
    title: "Research",
    links: ["Overview", "Economic Index"],
  },
  {
    title: "Our Models",
    links: ["NZT/Blackticker 1.1", "Prism 1.0"],
  },
  {
    title: "Commitments",
    links: ["Transparency", "Scaling Policy", "Security and compliance"],
  },
  {
    title: "Solutions",
    links: ["AI Agents", "Coding", "Customer support", "Education", "Financial service", "Government"],
  },
  {
    title: "Learn",
    links: ["BigAir Academy", "Customer stories", "Our engineers", "MCP Integrations", "Partner directory"],
  },
  {
    title: "Explore",
    links: ["About us", "Careers", "Events", "News", "Blogs", "Case studies", "Research Papers", "Intern program"],
  },
  {
    title: "Help and security",
    links: ["Status", "Availability", "Support centre"],
  },
  {
    title: "Terms and policies",
    links: ["Privacy Choices", "Privacy policy", "Responsible disclosure policy", "Terms of service - consumer", "Terns of service - commercial", "Usage policy"],
  },
];

// --- Reusable Link Column Component ---
const FooterLinkColumn = ({ title, links }: { title: string; links: string[] }) => (
  <div>
    <h4 className="mb-4 text-sm font-semibold tracking-wide text-[#1d1d1f]">
      {title}
    </h4>
    <ul className="space-y-3 text-sm text-[#4b5563]">
      {links.map((link) => (
        <li key={link}>
          <a href="#" className="hover:text-[#1d1d1f] transition-colors">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// --- Main Footer Component ---
export default function Hero7() {
  return (
    <footer className="w-full bg-white text-[#1d1d1f]">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* Top Section */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12">
            
            {/* Subscribe Form */}
            <div className="col-span-2">
              <p className="text-sm text-[#6b7280]">
                AI is fast to catch up. <br /> We’ll help you keep up with it.
              </p>
              <form
                className="mt-4 flex items-stretch gap-2 w-full max-w-sm"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="footer-email" className="sr-only">Your email</label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-md bg-[#f5f5f7] text-[#1d1d1f] placeholder:text-[#6b7280] px-4 py-2.5 text-sm outline-none ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-black"
                />
                <button
                  aria-label="Subscribe"
                  className="shrink-0 rounded-md px-3 py-2 text-sm ring-1 ring-inset ring-black/10 hover:bg-[#f5f5f7] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Dynamically generated link columns */}
            {footerLinks.map((column) => (
              <FooterLinkColumn key={column.title} title={column.title} links={column.links} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-black/10" />

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-x-6 gap-y-4 flex-wrap justify-center">
            <div className="text-xs tracking-wider uppercase font-medium">
              BIG AIR LAB
            </div>
            <div className="text-xs text-[#6b7280]">© 2025 BigAirLab</div>
          </div>
          <div className="flex items-center gap-1">
            {["instagram", "linkedin", "reddit", "github", "discord", "x", "facebook", "youtube"].map((name) => (
              <a key={name} href="#" aria-label={name} className="p-1.5 rounded-md hover:bg-black/5 transition-colors">
                <Image src={`/icons/${name}.svg`} alt={name} width={20} height={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
