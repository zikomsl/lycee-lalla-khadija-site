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
    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Soft glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-grad-primary opacity-20 blur-[120px] pointer-events-none" />

      <div className="container relative z-10 grid lg:grid-cols-2 gap-8 pt-32 pb-16 min-h-[100svh] items-center">
        <motion.div
          className="relative z-20"
          animate={{ opacity: isFocused ? 0 : 1, y: isFocused ? -10 : 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ pointerEvents: isFocused ? "none" : "auto" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium mb-6"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-grad-primary font-semibold">{t("hero_kicker")}</span>
          </motion.div>

          <StaggerText
            as="h1"
            text={t("hero_title")}
            className="font-display font-bold text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-grad mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed"
          >
            {t("hero_sub")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="#branches"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-grad-primary text-primary-foreground font-medium shadow-glow hover:shadow-elev transition-all hover:-translate-y-0.5"
            >
              {t("hero_cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </a>
            <a
              href="#facilities"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl glass-strong font-medium hover:bg-secondary transition-all hover:-translate-y-0.5"
            >
              {t("hero_cta2")}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.7 }}
            className="mt-12 grid grid-cols-3 gap-4 max-w-md"
          >
            {[
              { v: "5+", l: "Filières" },
              { v: "1200+", l: "Élèves" },
              { v: "60+", l: "Encadrants" },
            ].map((s, i) => (
              <div key={i} className="glass rounded-xl p-3">
                <div className="text-2xl font-display font-bold text-grad-primary">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 3D Robot */}
        <div className="relative h-[500px] lg:h-[700px] order-first lg:order-last z-[7]">
          <HeroScene />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isFocused ? 0 : 1 }}
            transition={{ delay: isFocused ? 0 : 0.8, duration: 1 }}
            style={{ pointerEvents: isFocused ? "none" : "auto" }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-full px-4 py-2 text-xs font-medium flex items-center gap-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            BTS Intelligence Artificielle
          </motion.div>
        </div>
      </div>
    </section>
  );
};