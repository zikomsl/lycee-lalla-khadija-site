import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Branches } from "@/components/sections/Branches";
import { Facilities } from "@/components/sections/Facilities";
import { StudentLife } from "@/components/sections/StudentLife";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FacebookButton } from "@/components/FacebookButton";

gsap.registerPlugin(ScrollTrigger);

const SiteContent = () => {
  const main = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Lycée Technique Lalla Khadija — L'école de l'innovation";
    const meta =
      document.querySelector('meta[name="description"]') ||
      Object.assign(document.createElement("meta"), { name: "description" });
    (meta as HTMLMetaElement).content =
      "Lycée Technique Lalla Khadija : filières STE, SM, SE, Mécanique, BTS Intelligence Artificielle. Internat, restaurant, transport, infirmerie.";
    if (!meta.parentElement) document.head.appendChild(meta);

    const ctx = gsap.context(() => {
      // Cinematic section dives
      gsap.utils.toArray<HTMLElement>("[data-cinema]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 80, scale: 0.96, opacity: 0.6 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", end: "top 35%", scrub: 1 },
          }
        );
      });
    }, main);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={main} className="relative">
      <Navbar />
      <main>
        <Hero />
        <div data-cinema><Branches /></div>
        <div data-cinema><Facilities /></div>
        <div data-cinema><StudentLife /></div>
        <Footer />
      </main>
      <WhatsAppButton />
      <FacebookButton />
    </div>
  );
};

const Index = () => <SiteContent />;

export default Index;
