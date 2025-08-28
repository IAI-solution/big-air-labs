import Image from "next/image";
import Hero from "../main section/page";
import Hero2 from "../sectionTwo/page";
import Hero3 from "../sectionThree/page";
import Hero4 from "../sectionFour/page";
import Hero5 from "../sectionFive/page";
import Hero6 from "../sectionSix/page";
import Hero7 from "../sectionSeven/page";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Hero2 />
      <Hero3 />
      {/* <Hero4 /> */}
      <Hero5 />
      <Hero6 />
      <Hero7 />
    </>
  );
}

