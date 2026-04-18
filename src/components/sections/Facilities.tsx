import { motion } from "framer-motion";
import { TiltCard } from "../TiltCard";
import { StaggerText } from "../StaggerText";
import { FocusableCard } from "../FocusableCard";
import { useApp } from "@/contexts/AppContext";
import aiLab from "@/assets/ailab.jpg";
import library from "@/assets/library.jpg";
import sports from "@/assets/sport.jpg";

export const Facilities = () => {
  const { t } = useApp();

  const items = [
    { img: aiLab, key: "ai_lab", tag: "BTS AI", num: "01" },
    { img: library, key: "library", tag: "1200+ ouvrages", num: "02" },
    { img: sports, key: "sports", tag: "Indoor + Outdoor", num: "03" },
  ];

  return (
    <section id="facilities" className="relative py-32">
      <div className="container">
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4"
          >
            02 — {t("nav_facilities")}
          </motion.div>
          <StaggerText
            as="h2"
            text={t("facilities_title")}
            className="font-display font-bold text-4xl md:text-6xl text-grad mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            {t("facilities_sub")}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
          {items.map((it, i) => (
            <motion.div
              key={it.key}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative hover:z-[999] focus-within:z-[999]"
              style={{ pointerEvents: "auto" }}
            >
              <FocusableCard
                id={`facility-${it.key}`}
                img={it.img}
                title={t(it.key)}
                label={it.tag}
                index={it.num}
                borderRadius={24}
                className="block w-full"
              >
                <TiltCard className="group rounded-3xl overflow-hidden glass-strong cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.6),0_25px_70px_-10px_hsl(var(--primary)/0.5),0_0_100px_hsl(var(--primary)/0.3)]">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={it.img}
                      alt={t(it.key)}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                  </div>
                  <div className="p-5 -mt-12 relative">
                    <div className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1.5">{it.tag}</div>
                    <h3 className="font-display font-semibold text-xl">{t(it.key)}</h3>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-primary" />
                      Disponible
                    </div>
                  </div>
                </TiltCard>
              </FocusableCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
