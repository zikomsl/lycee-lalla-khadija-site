import { useState, useRef, MouseEvent } from "react";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { useApp } from "@/contexts/AppContext";

import { StaggerText } from "../StaggerText";

import { 

  Zap, 

  Binary, 

  LineChart, 

  Settings, 

  Cpu, 

  BrainCircuit 

} from "lucide-react";



export const Branches = () => {

  const { t, lang } = useApp();

  const [hovered, setHovered] = useState<number | null>(null);



  const items = [

    { code: "BTS", title: "Intelligence Artificielle", key: "branch_bts", icon: BrainCircuit, color: "text-cyan-500", iconBg: "bg-cyan-500/10", glowColor: "rgba(6, 182, 212, 0.15)" },

    { code: "STE", title: "Sciences & Tech. Électrique", key: "branch_ste", icon: Zap, color: "text-blue-500", iconBg: "bg-blue-500/10", glowColor: "rgba(59, 130, 246, 0.15)" },

    { code: "SM", title: "Sciences Mathématiques", key: "branch_sm", icon: Binary, color: "text-purple-500", iconBg: "bg-purple-500/10", glowColor: "rgba(168, 85, 247, 0.15)" },

    { code: "SE", title: "Sciences Économiques", key: "branch_se", icon: LineChart, color: "text-emerald-500", iconBg: "bg-emerald-500/10", glowColor: "rgba(16, 185, 129, 0.15)" },

    { code: "TCT", title: "Tronc Commun Tech.", key: "branch_tct", icon: Settings, color: "text-orange-500", iconBg: "bg-orange-500/10", glowColor: "rgba(249, 115, 22, 0.15)" },

    { code: "STM", title: "Sciences & Tech. Mécanique", key: "branch_stm", icon: Cpu, color: "text-rose-500", iconBg: "bg-rose-500/10", glowColor: "rgba(244, 63, 94, 0.15)", comingSoon: true },

  ];



  const getComingSoonText = () => {

    const translation = t("coming_soon");

    if (translation !== "coming_soon") return translation;

    return lang === 'ar' ? 'قريباً' : lang === 'fr' ? 'Bientôt' : 'Coming Soon';

  };



  return (

    <section id="branches" className="py-16 md:py-32 relative overflow-hidden">

      <div className="container px-6" onMouseLeave={() => setHovered(null)}>

        <div className="max-w-2xl mb-12 md:mb-16 text-start">

          <motion.div

            initial={{ opacity: 0, y: 10 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] text-primary font-bold mb-3 md:mb-4"

          >

            01 — {t("branches_kicker")}

          </motion.div>

          <StaggerText

            as="h2"

            text={t("branches_title")}

            className="font-display font-black text-3xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white mb-3"

          />

        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

          {items.map((item, i) => (

            <BranchCard 

              key={item.code} 

              item={item} 

              index={i} 

              hovered={hovered} 

              setHovered={setHovered} 

              comingSoonText={getComingSoonText()}

            />

          ))}

        </div>

      </div>

    </section>

  );

};



const BranchCard = ({ item, index, hovered, setHovered, comingSoonText }: any) => {

  const { t } = useApp();

  const mouseX = useMotionValue(0);

  const mouseY = useMotionValue(0);



  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {

    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);

    mouseY.set(clientY - top);

  }



  const isFocused = hovered === null || hovered === index;

  const isHovered = hovered === index;



  return (

    <motion.div

      onMouseEnter={() => setHovered(index)}

      onMouseMove={handleMouseMove}

      initial={{ opacity: 0, y: 20 }}

      whileInView={{ opacity: 1, y: 0 }}

      viewport={{ once: true }}

      transition={{ delay: index * 0.1 }}

      animate={{

        scale: isHovered ? 1.03 : 1,

        opacity: !isFocused ? 0.7 : 1,

      }}

      className="relative cursor-pointer"

      style={{ zIndex: isHovered ? 20 : 10 }}

    >

      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[1.75rem] md:rounded-[2.2rem] p-5 md:p-8 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 md:h-[260px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-black/5 dark:border-white/5 group transition-all duration-300">

        

        <motion.div

          className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"

          style={{

            background: useTransform(

              [mouseX, mouseY],

              ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, ${item.glowColor}, transparent 80%)`

            ),

          }}

        />



        <div className={`relative z-10 h-14 w-14 md:h-16 md:w-16 shrink-0 rounded-[1.2rem] md:rounded-2xl flex items-center justify-center ${item.iconBg} transition-transform duration-500 group-hover:scale-110`}>

          <item.icon className={`h-7 w-7 md:h-8 md:w-8 ${item.color}`} />

        </div>

        

        <div className="relative z-10 flex flex-col flex-1 text-start min-w-0 w-full mt-0 md:mt-auto">

          <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${item.color} mb-1`}>

            {item.code}

          </span>

          <h3 className="text-base md:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight md:leading-snug truncate md:whitespace-normal">

            {t(item.key) !== item.key ? t(item.key) : item.title}

          </h3>

          {item.comingSoon && (

            <span className="text-[8px] md:text-[10px] font-bold text-rose-500 uppercase tracking-tighter mt-1 md:mt-2 animate-pulse">

              — {comingSoonText}

            </span>

          )}

        </div>

      </div>

    </motion.div>

  );

};