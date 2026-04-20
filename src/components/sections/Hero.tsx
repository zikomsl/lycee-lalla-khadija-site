import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroScene } from "../three/HeroScene";
import { StaggerText } from "../StaggerText";
import { useApp } from "@/contexts/AppContext";
import { useFocus } from "@/contexts/FocusContext";

export const Hero = () => {
  const { t } = useApp();
  const { active } = useFocus();
  const isFocused = !!active;

  return (
    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden flex flex-col justify-center">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      
      <div className="container relative z-10 grid lg:grid-cols-2 gap-4 md:gap-8 pt-20 pb-10 items-center">
        <motion.div
          className="relative z-20"
          animate={{ opacity: isFocused ? 0 : 1, y: isFocused ? -10 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ pointerEvents: isFocused ? "none" : "auto" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-medium mb-4"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-grad-primary font-semibold">{t("hero_kicker")}</span>
          </motion.div>

          <StaggerText
            as="h1"
            text={t("hero_title")}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-tight text-grad mb-4"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-xl text-muted-foreground max-w-md mb-6 leading-relaxed"
          >
            {t("hero_sub")}
          </motion.p>

          <div className="flex flex-wrap gap-3">
            <a href="#branches" className="px-5 py-3 rounded-xl bg-grad-primary text-primary-foreground text-sm font-medium shadow-glow">
              {t("hero_cta")}
            </a>
          </div>
        </motion.div>

        <div className="relative h-[350px] md:h-[500px] lg:h-[600px] w-full mt-4 lg:mt-0 z-[7]">
          <HeroScene />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isFocused ? 0 : 1, y: 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 glass rounded-full px-4 py-2 text-[10px] font-medium flex items-center gap-2 border border-primary/20 whitespace-nowrap shadow-xl"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            BTS Intelligence Artificielle
          </motion.div>
        </div>
      </div>
    </section>
  );
};