import { motion } from "framer-motion";

import { Sparkles, ChevronDown } from "lucide-react";

import { HeroScene } from "../three/HeroScene";

import { StaggerText } from "../StaggerText";

import { useApp } from "@/contexts/AppContext";

import { useFocus } from "@/contexts/FocusContext";



export const Hero = () => {

  const { t } = useApp();

  const { active } = useFocus();

  const isFocused = !!active;



  return (

    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden flex flex-col justify-center pt-24 pb-12">

      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

     

      <div className="container relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center px-6 mx-auto">

        <motion.div

          animate={{ opacity: isFocused ? 0 : 1, y: isFocused ? -20 : 0 }}

          className="flex flex-col items-center md:items-start text-center md:text-start w-full z-20"

        >

          <motion.div

            initial={{ opacity: 0, y: 10 }}

            animate={{ opacity: 1, y: 0 }}

            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-black mb-4 md:mb-6 border border-primary/20 shadow-sm"

          >

            <Sparkles className="h-3 w-3 text-primary" />

            <span className="text-grad-primary uppercase tracking-wider">{t("hero_kicker")}</span>

          </motion.div>



          <StaggerText

            as="h1"

            text={t("hero_title")}

            className="font-display font-black text-5xl md:text-6xl lg:text-8xl leading-[1.2] text-grad mb-5 md:mb-6"

          />



          <motion.p

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            className="text-xs md:text-lg text-muted-foreground max-w-[280px] md:max-w-md mx-auto md:mx-0 mb-8 md:mb-10 leading-relaxed opacity-90"

          >

            {t("hero_sub")}

          </motion.p>



          <div className="flex justify-center md:justify-start">

            <a href="#branches" className="px-10 py-4 rounded-2xl bg-grad-primary text-primary-foreground text-sm font-black shadow-glow active:scale-95 transition-transform uppercase tracking-widest">

              {t("hero_cta")}

            </a>

          </div>

        </motion.div>



        <div className="w-full flex flex-col items-center justify-center overflow-visible z-10 mt-4 md:mt-0">

          <div className="relative w-[250px] h-[250px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] flex items-center justify-center" dir="ltr">

            <div className="w-full h-full max-md:scale-[1.5] max-md:-translate-x-24 origin-center">

              <HeroScene />

            </div>

          </div>

         

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: isFocused ? 0 : 1, y: 0 }}

            className="mt-10 md:-mt-8 glass rounded-full px-6 py-2.5 text-[10px] font-black flex items-center gap-2 border border-primary/20 shadow-xl bg-background/60 backdrop-blur-xl z-20 whitespace-nowrap"

          >

            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />

            BTS Intelligence Artificielle

          </motion.div>

        </div>

      </div>



      <motion.div

        initial={{ opacity: 0 }}

        animate={{ opacity: 1 }}

        transition={{ delay: 1, duration: 1 }}

        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity z-20 cursor-pointer"

        onClick={() => document.getElementById('branches')?.scrollIntoView({ behavior: 'smooth' })}

      >

        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Découvrir</span>

        <motion.div

          animate={{ y: [0, 5, 0] }}

          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}

        >

          <ChevronDown className="w-4 h-4 text-primary" />

        </motion.div>

      </motion.div>

    </section>

  );

};