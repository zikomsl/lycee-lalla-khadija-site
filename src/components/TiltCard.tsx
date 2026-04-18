import { useRef, ReactNode, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glow?: boolean;
}

/**
 * Magnetic-pull + 3D tilt card. Tracks mouse, applies elastic spring transforms.
 */
export const TiltCard = ({ children, className, intensity = 1, glow = true }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rx = useSpring(useTransform(y, [-0.5, 0.5], [10 * intensity, -10 * intensity]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-10 * intensity, 10 * intensity]), { stiffness: 200, damping: 20 });
  const tx = useSpring(useTransform(x, [-0.5, 0.5], [-8 * intensity, 8 * intensity]), { stiffness: 250, damping: 25 });
  const ty = useSpring(useTransform(y, [-0.5, 0.5], [-8 * intensity, 8 * intensity]), { stiffness: 250, damping: 25 });

  const glowX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rx, rotateY: ry, x: tx, y: ty, transformStyle: "preserve-3d" }}
      className={cn("relative will-change-transform", className)}
    >
      {glow && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glowX, glowY] as any,
              ([gx, gy]: any) => `radial-gradient(400px circle at ${gx} ${gy}, hsl(var(--primary) / 0.18), transparent 60%)`
            ),
          }}
        />
      )}
      <div style={{ transform: "translateZ(40px)" }}>{children}</div>
    </motion.div>
  );
};
