import { motion } from "framer-motion";
import { Cpu, Atom, Zap, Wrench, Settings2, CircleDollarSign, Book } from "lucide-react";
import { TiltCard } from "../TiltCard";
import { StaggerText } from "../StaggerText";
import { useApp } from "@/contexts/AppContext";

const branches = [
  { code: "STE", name: "Sciences & Tech. Électrique", icon: Zap, hue: "from-blue-500 to-cyan-400" },
  { code: "SM", name: "Sciences Mathématiques", icon: Atom, hue: "from-violet-500 to-blue-400" },
  { code: "SE", name: "Sciences Économiques", icon: CircleDollarSign, hue: "from-cyan-400 to-emerald-400" },
  { code: "TCT", name: "TCT- Tronc Commun Technologique ", icon: Book, hue: "from-amber-400 to-orange-500" },
  { code: "STM", name: "Sciences & Tech. Mécanique", icon: Wrench, hue: "from-rose-500 to-orange-400" },
];

export const Branches = () => {
  const { t } = useApp();
  return (
    <section id="branches" className="relative py-32">
      <div className="container">
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4"
          >
            01 — Filières
          </motion.div>
          <StaggerText
            as="h2"
            text={t("branches_title")}
            className="font-display font-bold text-4xl md:text-6xl text-grad mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            {t("branches_sub")}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 perspective-1000">
          {branches.map((b, i) => (
            <motion.div
              key={b.code}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <TiltCard className="group glass-strong rounded-3xl p-6 h-56 flex flex-col justify-between cursor-pointer overflow-hidden relative">
                <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${b.hue} opacity-30 blur-2xl group-hover:opacity-60 transition-opacity duration-500`} />
                <div className={`relative h-12 w-12 rounded-2xl bg-gradient-to-br ${b.hue} grid place-items-center shadow-glow`}>
                  <b.icon className="h-6 w-6 text-white" />
                </div>
                <div className="relative">
                  <div className="text-xs font-semibold text-primary mb-1 tracking-wider">{b.code}</div>
                  <div className="font-display font-semibold text-sm leading-tight">{b.name}</div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
