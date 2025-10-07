// // app/sectionSix/page.tsx
// "use client";

// import Image from "next/image";

// export default function Hero6() {
//   return (
//     <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
//       {/* Background image */}
//       <Image
//         src="/images/footerBgImage.svg"
//         alt="Footer background"
//         fill
//         className="object-cover"
//         priority
//       />

//       {/* Content Container - Positioned absolutely at the bottom-left */}
//       <div className="absolute bottom-0 left-0 z-10 p-5 sm:p-8 md:p-12 lg:p-16 xl:p-20">
//          <div className="flex items-center justify-start gap-3 sm:gap-4 md:gap-6">
//           {/* Logo image */}
//           <Image
//             src="/images/bottomImage.svg"
//             alt="Big Air Lab mark"
//             width={140} // Increased base width for better scaling reference
//             height={140} // Increased base height
//             className="
//               opacity-80 shrink-0 aspect-square
//               w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36
//             "
//             priority
//           />

//           {/* Title */}
//           <h1 className="
//             text-[#333] uppercase
//             font-medium leading-none whitespace-nowrap
//             text-[32px] xs:text-[40px] sm:text-[56px] md:text-[72px] lg:text-[92px]
//           ">
//             BIG AIR LAB
//           </h1>
//         </div>
//       </div>
//     </section>
//   );
// }
