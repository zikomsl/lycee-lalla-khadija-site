import { useRef, useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { StaggerText } from "../StaggerText";
import { useApp } from "@/contexts/AppContext";
import { useFocus } from "@/contexts/FocusContext";
import { cn } from "@/lib/utils";
import dakhilia from "@/assets/dakhilia.png";
import restaurant from "@/assets/restaurant.png";
import bus from "@/assets/bus.jpg";
import infirmerie from "@/assets/infirmier.jpg";

interface Scene {
  img: string;
  key: string;
  index: string;
  depth: number;
  offsetY: number;
}

const scenes: Scene[] = [
  { img: dakhilia, key: "dakhilia", index: "01", depth: 0, offsetY: 0 },
  { img: restaurant, key: "restaurant", index: "02", depth: 0, offsetY: 60 },
  { img: bus, key: "bus", index: "03", depth: 0, offsetY: 30 },
  { img: infirmerie, key: "infirmerie", index: "04", depth: 0, offsetY: 90 },
];

const LifeCard = ({ scene, i, hovered, setHovered }: {
  scene: Scene;
  i: number;
  hovered: number | null;
  setHovered: (n: number | null) => void;
}) => {
  const { t } = useApp();
  const { open, active } = useFocus();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const ref = useRef<HTMLDivElement>(null);
  
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 180, damping: 18 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-15, 15]), { stiffness: 180, damping: 18 });
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 220, damping: 22 });
  const ty = useSpring(useTransform(my, [-0.5, 0.5], [-12, 12]), { stiffness: 220, damping: 22 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const focusId = `life-${scene.key}`;
  const isActive = active?.id === focusId;
  const isFocused = hovered === null || hovered === i;

  const tiltStyles = isMobile ? {} : { rotateX: rotX, rotateY: rotY, x: tx, y: ty };

  return (
    <motion.article
      initial={{ opacity: 0, y: isMobile ? 20 : 120 }}
      whileInView={{ opacity: 1, y: isMobile ? 0 : scene.offsetY }}
      viewport={{ once: true, amount: 0.1 }}
      animate={{
        filter: isMobile ? "none" : (isFocused ? "blur(0px) saturate(1)" : "blur(6px) saturate(0.7)"),
        opacity: isActive ? 0 : (isFocused ? 1 : 0.45),
        scale: isFocused ? 1 : 0.96,
      }}
      className="relative"
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => !isMobile && setHovered(i)}
        onMouseLeave={() => { mx.set(0); my.set(0); setHovered(null); }}
        onClick={() => {
          const r = ref.current!.getBoundingClientRect();
          open({
            id: focusId,
            img: scene.img,
            title: t(scene.key),
            label: t(scene.key),
            index: scene.index,
            origin: { x: r.left, y: r.top, width: r.width, height: r.height, borderRadius: 32 },
          });
        }}
        style={{
          ...tiltStyles,
          transformStyle: isMobile ? "flat" : "preserve-3d",
          pointerEvents: "auto",
        }}
        className={cn(
          "group relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] cursor-pointer",
          !isMobile && "hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.6),0_30px_80px_-10px_hsl(var(--primary)/0.55)]"
        )}
      >
        <motion.img 
          src={scene.img} 
          alt={t(scene.key)} 
          className="absolute inset-0 h-full w-full object-cover"
          animate={isMobile ? { scale: 1, x: 0, y: 0 } : {
            scale: [1.15, 1.25, 1.15],
            x: [-10, 10, -10],
            y: [-10, 5, -10],
          }}
          transition={isMobile ? { duration: 0 } : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
        
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/90 font-semibold">{scene.index} — {t(scene.key).toUpperCase()}</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-8 z-20 text-start">
          <h3 className="font-display text-3xl font-bold text-white mb-2">{t(scene.key)}</h3>
          <p className="text-xs text-white/80 leading-relaxed line-clamp-3">{t(`${scene.key}_desc`)}</p>
        </div>
      </div>
    </motion.article>
  );
};

export const StudentLife = () => {
  const { t } = useApp();
  const [hovered, setHovered] = useState<number | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [80, -80]);

  return (
    <section id="life" ref={sectionRef} className="relative py-24 md:py-40 overflow-hidden">
      {!isMobile && (
        <>
          <motion.div style={{ y: parallaxY }} className="absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px] bg-primary" />
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        </>
      )}
      
      <div className="container relative z-10">
        <div className="max-w-3xl mb-16 md:mb-24 text-start">
          <div className="font-mono text-[11px] uppercase tracking-[0.5em] text-primary font-semibold mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-primary" /> 03 — {t("nav_life")}
          </div>
          {isMobile ? (
             <h2 className="font-display font-bold text-4xl text-grad">{t("life_title")}</h2>
          ) : (
            <StaggerText as="h2" text={t("life_title")} className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-grad mb-6 leading-[0.9]" />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10" onMouseLeave={() => setHovered(null)}>
          {scenes.map((scene, i) => (
            <LifeCard key={scene.key} scene={scene} i={i} hovered={hovered} setHovered={setHovered} />
          ))}
        </div>
      </div>
    </section>
  );
};