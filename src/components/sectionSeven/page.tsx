"use client";

import Image from "next/image";
import React from "react";

// --- Data for Footer Links (No Changes) ---
const footerLinks = [
  {
    title: "Products",
    links: ["Insight Agent"],
  },
  {
    title: "Solutions",
    links: ["Finance", "Management", "Workflow", "Healthcare"],
  },
  {
    title: "Research",
    links: ["Overview", "Economic Index"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blogs", "Research", "News"],
  },
];

// --- Data for Social Media Icons (No Changes) ---
const socialIcons = [
  { name: "Instagram", src: "/icons/instagram.svg", href: "https://www.instagram.com/big.air.lab?igsh=Z3pqZ2hwbmhzbm1n"},
  { name: "LinkedIn", src: "/icons/linkedin.svg", href: "https://www.linkedin.com/company/iai-solution-in/"  },
  { name: "Reddit", src: "/icons/reddit.svg", href: "https://www.reddit.com/r/InsightTerminal/" },
  // { name: "Github", src: "/icons/github.svg" },
  { name: "Discord", src: "/icons/discord.svg", href: "https://discord.gg/zNTtyefu" },
  { name: "X", src: "/icons/x.svg", href: "https://x.com/BigAir_Lab" },
  // { name: "Facebook", src: "/icons/facebook.svg" },
  { name: "Youtube", src: "/icons/youtube.svg", href: "https://www.youtube.com/@Bigairlab" },
];

// --- Reusable Link Column Component (No Changes) ---
const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string;
  links: string[];
}) => (
  <div>
    <h4 className="mb-4 text-sm font-semibold tracking-wide text-white">
      {title}
    </h4>
    <ul className="space-y-3 text-sm text-gray-300">
      {links.map((link) => (
        <li key={link}>
          <a href="#" className="hover:text-white transition-colors">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// --- Main Footer Component ---
export default function App() {
  return (
    <footer className="w-full px-4 py-8 sm:px-6 lg:px-8 text-white bg-black/20 backdrop-blur-lg border-t border-white/20">
      <div className="mx-auto max-w-7xl">
        {/* Top Section */}
        {/* UPDATED: Changed default columns to 2 for mobile. */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-x-8">
          {/* Subscribe Form */}
          {/* UPDATED: Changed default column span to 2 for mobile. */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <p className="text-sm text-gray-300">
              AI is Fast to catch up. <br /> We’ll help you keep up with it!
            </p>
            <form
              className="mt-4 flex items-stretch gap-2 w-full max-w-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Your email
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email"
                className="w-full rounded-md bg-white/90 text-gray-900 placeholder:text-gray-500 px-4 py-2 text-sm outline-none ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              <button
                aria-label="Subscribe"
                className="shrink-0 rounded-md px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 transition-colors text-white"
              >
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

          {/* Dynamically generated link columns */}
          {footerLinks.map((column) => (
            <FooterLinkColumn
              key={column.title}
              title={column.title}
              links={column.links}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 md:my-8 h-px w-full bg-white/20" />

        {/* Bottom Bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-y-6 sm:gap-x-4">
          {/* Logo and Text Block */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/logoBottom.svg"
              alt="Big Air Lab Logo"
              width={35}
              height={35}
              className="shrink-0"
            />
            <p className="shrink-0 text-white font-spartan text-lg font-medium tracking-tight">
              Big AIR Lab
            </p>
          </div>

          {/* Social Icons */}
<div className="flex items-center gap-1 justify-center">
  {socialIcons.map((icon) => (
    <a
      key={icon.name}
      href={icon.href ?? "#"}
      aria-label={icon.name}
      title={icon.name}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full text-gray-300 hover:bg-white/10 transition-colors"
    >
      <Image src={icon.src} alt={icon.name} width={20} height={20} />
    </a>
  ))}
</div>

        </div>
      </div>
    </footer>
  );
}