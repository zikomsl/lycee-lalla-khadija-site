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
  depth: number; // -1 back, 0 mid, 1 front
  offsetY: number;
}

const scenes: Scene[] = [
  { img: dakhilia, key: "dakhilia", index: "01", depth: 0, offsetY: 0 },
  { img: restaurant, key: "restaurant", index: "02", depth: 0, offsetY: 60 },
  { img: bus, key: "bus", index: "03", depth: 0, offsetY: 30 },
  { img: infirmerie, key: "infirmerie", index: "04", depth: 0, offsetY: 90 },
];

/* ──────────────────────────────────────────────────────────
   LifeCard — magnetic tilt + Ken Burns + depth-of-field
   ────────────────────────────────────────────────────────── */
const LifeCard = ({ scene, i, hovered, setHovered }: {
  scene: Scene;
  i: number;
  hovered: number | null;
  setHovered: (n: number | null) => void;
}) => {
  const { t } = useApp();
  const { open, active } = useFocus();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 180, damping: 18 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-15, 15]), { stiffness: 180, damping: 18 });
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 220, damping: 22 });
  const ty = useSpring(useTransform(my, [-0.5, 0.5], [-12, 12]), { stiffness: 220, damping: 22 });
  const glowX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => { mx.set(0); my.set(0); setHovered(null); };

  const focusId = `life-${scene.key}`;
  const isActive = active?.id === focusId;

  const handleClick = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    open({
      id: focusId,
      img: scene.img,
      title: t(scene.key),
      label: t(scene.key),
      index: scene.index,
      origin: { x: r.left, y: r.top, width: r.width, height: r.height, borderRadius: 32 },
    });
  };

  // Depth-of-field: cards lose focus when another is hovered
  const isFocused = hovered === null || hovered === i;
  const baseZ = scene.depth * 80;

  return (
    <motion.article
      initial={{ opacity: 0, y: 120, z: -400, rotateX: -25 }}
      whileInView={{ opacity: 1, y: scene.offsetY, z: baseZ, rotateX: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        delay: i * 0.18,
        duration: 1.1,
        ease: [0.16, 1.2, 0.3, 1],
      }}
      animate={{
        filter: isFocused ? "blur(0px) saturate(1)" : "blur(6px) saturate(0.7)",
        opacity: isActive ? 0 : isFocused ? 1 : 0.45,
        scale: isFocused ? 1 : 0.96,
      }}
      style={{
        transformStyle: "preserve-3d",
        // Hovered card jumps to the absolute top layer to win all hit tests
        zIndex: hovered === i ? 999 : 1,
      }}
      className="relative"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(i)}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          x: tx,
          y: ty,
          transformStyle: "preserve-3d",
          transformPerspective: 1200,
          // Card surface owns the click; explicit auto guards against parent overrides
          pointerEvents: "auto",
        }}
        className={cn(
          "group relative aspect-[4/5] w-full overflow-hidden rounded-[2rem]",
          "will-change-transform cursor-pointer transition-shadow duration-300",
          // Intense glow ring on hover confirms the active, clickable target
          "hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.6),0_30px_80px_-10px_hsl(var(--primary)/0.55),0_0_120px_hsl(var(--primary)/0.35)]"
        )}
      >
        {/* Glass shell — ultra-thin border + inner glow */}
        <div
          className="absolute inset-0 rounded-[2rem] z-30 pointer-events-none"
          style={{
            border: "0.5px solid hsl(var(--border) / 0.5)",
            boxShadow:
              "inset 0 1px 0 hsl(var(--foreground) / 0.08), inset 0 0 60px hsl(var(--primary) / 0.06), 0 30px 80px -20px hsl(var(--primary) / 0.25)",
          }}
        />

        {/* Ken Burns image */}
        <motion.img
          src={scene.img}
          alt={t(scene.key)}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.15, x: -10, y: -10 }}
          animate={{
            scale: [1.15, 1.25, 1.15],
            x: [-10, 10, -10],
            y: [-10, 5, -10],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Cinematic gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 mix-blend-overlay" />

        {/* Glass tint */}
        <div
          className="absolute inset-0 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-700"
          style={{ background: "hsla(var(--glass-bg))" }}
        />

        {/* Cursor-follow glow */}
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: useTransform(
              [glowX, glowY] as any,
              ([gx, gy]: any) =>
                `radial-gradient(500px circle at ${gx} ${gy}, hsl(var(--primary) / 0.35), transparent 55%)`
            ),
          }}
        />

        {/* Top label — wide mono */}
        <div
          className="absolute top-6 left-6 right-6 flex items-center justify-between z-20"
          style={{ transform: "translateZ(60px)" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/90 font-semibold">
            {scene.index} — {t(scene.key).toUpperCase()}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))] animate-pulse" />
        </div>

        {/* Bottom content */}
        <div
          className="absolute inset-x-0 bottom-0 p-8 z-20"
          style={{ transform: "translateZ(80px)" }}
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.5em] text-muted-foreground mb-3">
            {t("life_scene")} · {scene.index}
          </div>
          <h3
            className="font-display text-4xl md:text-5xl font-bold leading-[0.95] mb-4 text-grad"
            style={{ fontFamily: "'Space Grotesk', serif" }}
          >
            {t(scene.key)}
          </h3>
          <motion.p
            className="text-sm text-muted-foreground/90 leading-relaxed max-w-[90%]"
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
          >
            {t(`${scene.key}_desc`)}
          </motion.p>

          {/* Animated underline */}
          <motion.div
            className="mt-5 h-px bg-gradient-to-r from-primary via-accent to-transparent origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.18 + 0.6, duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
          />
        </div>

        {/* Floating index numeral — deep z */}
        <div
          className="absolute -top-4 -right-2 text-[10rem] font-display font-black leading-none text-foreground/5 select-none pointer-events-none z-10"
          style={{ transform: "translateZ(20px)" }}
        >
          {scene.index}
        </div>
      </motion.div>
    </motion.article>
  );
};

/* ──────────────────────────────────────────────────────────
   StudentLife — Floating 3D Stack
   ────────────────────────────────────────────────────────── */
export const StudentLife = () => {
  const { t } = useApp();
  const [hovered, setHovered] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={sectionRef}
      id="life"
      className="relative py-40 overflow-hidden"
      style={{ perspective: "2000px" }}
    >
      {/* Atmospheric backdrop */}
      <motion.div
        style={{ y: parallaxY }}
        className="absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
      >
        <div className="h-full w-full rounded-full bg-gradient-to-br from-primary to-accent" />
      </motion.div>
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-80, 80]) }}
        className="absolute bottom-1/4 -right-40 h-[400px] w-[400px] rounded-full opacity-15 blur-[100px]"
      >
        <div className="h-full w-full rounded-full bg-gradient-to-tl from-accent to-primary" />
      </motion.div>

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[11px] uppercase tracking-[0.5em] text-primary font-semibold mb-6 flex items-center gap-3"
          >
            <span className="h-px w-12 bg-primary" />
            03 — {t("nav_life")}
          </motion.div>
          <StaggerText
            as="h2"
            text={t("life_title")}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-grad mb-6 leading-[0.9]"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg md:text-xl max-w-xl leading-relaxed"
          >
            {t("life_sub")}
          </motion.p>
        </div>

        {/* Floating 3D Stack */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
          style={{ perspective: "1800px", transformStyle: "preserve-3d" }}
          onMouseLeave={() => setHovered(null)}
        >
          {scenes.map((scene, i) => (
            <LifeCard
              key={scene.key}
              scene={scene}
              i={i}
              hovered={hovered}
              setHovered={setHovered}
            />
          ))}
        </div>

        {/* Footer accent line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1.4, ease: [0.7, 0, 0.3, 1] }}
          className="mt-32 h-px origin-left bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
      </div>
    </section>
  );
};
