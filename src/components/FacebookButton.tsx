import { motion, useMotionValue, useSpring } from "framer-motion";
import { Facebook } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

export const FacebookButton = () => {
  const { dir } = useApp();
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.4 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 120;
      if (dist < radius) {
        const strength = (1 - dist / radius) * 18;
        mx.set((dx / dist) * strength);
        my.set((dy / dist) * strength);
      } else {
        mx.set(0);
        my.set(0);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <a
      ref={ref}
      href="https://web.facebook.com/Lalla.TeCh.khadija"
      target="_blank"
      rel="noopener noreferrer external"
      aria-label="Follow us on Facebook"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`fixed bottom-[5.75rem] z-50 ${dir === "rtl" ? "left-6" : "right-6"} group block h-14 w-14`}
    >
      <motion.span
        style={{ x, y }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="pointer-events-none relative block h-full w-full"
      >
        {/* Pulsing cyan glow */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[hsl(190_95%_55%)] blur-xl"
          animate={{
            opacity: hovered ? 0.85 : [0.35, 0.6, 0.35],
            scale: hovered ? 1.25 : [1, 1.08, 1],
          }}
          transition={{
            duration: hovered ? 0.3 : 2.4,
            repeat: hovered ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Ring */}
        <span className="absolute inset-0 rounded-full ring-1 ring-[hsl(190_95%_65%)]/40" />

        <motion.span
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-xl shadow-[0_0_30px_hsl(190_95%_55%/0.45)]"
        >
          <Facebook className="h-6 w-6 text-white" strokeWidth={2.2} />
        </motion.span>

        {/* Tooltip */}
        <motion.span
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 8 }}
          transition={{ duration: 0.18 }}
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
            dir === "rtl" ? "left-[4.25rem]" : "right-[4.25rem]"
          } whitespace-nowrap rounded-xl border border-white/15 bg-background/60 backdrop-blur-xl px-3 py-1.5 text-xs font-medium text-foreground shadow-lg`}
        >
          Follow us on Facebook
        </motion.span>
      </motion.span>
    </a>
  );
};
