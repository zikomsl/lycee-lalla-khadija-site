import { useEffect, useRef } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import { useFocus } from "@/contexts/FocusContext";

/**
 * CinematicOverlay
 * - Renders a fixed-position "flying" image driven by GSAP Power4 easing.
 * - Animates from origin card rect → full-screen background behind robot.
 * - Cross-fades when switching between active items.
 * - Includes vignette + blur veil so the robot stays the focal subject.
 */
export const CinematicOverlay = () => {
  const { active, close } = useFocus();
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const prevIdRef = useRef<string | null>(null);

  useEffect(() => {
    const wrap = imgWrapRef.current;
    const veil = veilRef.current;
    const closeBtn = closeRef.current;
    if (!wrap || !veil) return;

    // Kill prior timeline
    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    if (active) {
      const o = active.origin;
      const isCrossFade = prevIdRef.current && prevIdRef.current !== active.id;

      if (!isCrossFade) {
        // Set initial state at the card's rect
        gsap.set(wrap, {
          top: o.y,
          left: o.x,
          width: o.width,
          height: o.height,
          borderRadius: o.borderRadius,
          opacity: 1,
          scale: 1,
          rotateZ: 0,
          force3D: true,
        });
        gsap.set(veil, { opacity: 0 });
        if (closeBtn) gsap.set(closeBtn, { opacity: 0, y: -8, pointerEvents: "none" });

        tl.to(veil, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
          .to(
            wrap,
            {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
              borderRadius: 0,
              duration: 1.1,
              ease: "power4.out",
            },
            0
          )
          .to(closeBtn, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.4, ease: "power2.out" }, 0.4);
      } else {
        // Cross-fade between two items: keep position, swap content with quick dip
        tl.to(wrap, { opacity: 0.15, duration: 0.18, ease: "power2.in" })
          .add(() => {
            // Force layout to fullscreen in case prior was partial
            gsap.set(wrap, {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
              borderRadius: 0,
            });
          })
          .to(wrap, { opacity: 1, duration: 0.45, ease: "power3.out" });
      }

      prevIdRef.current = active.id;
    } else if (prevIdRef.current) {
      // Fly back to last known origin
      const o = (window as any).__lastFocusOrigin as ReturnType<typeof Object> | undefined;
      const target = o ?? { top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0, borderRadius: 32 };

      tl.to(closeBtn, { opacity: 0, y: -8, pointerEvents: "none", duration: 0.25, ease: "power2.in" }, 0)
        .to(
          wrap,
          {
            top: target.top,
            left: target.left,
            width: target.width,
            height: target.height,
            borderRadius: target.borderRadius,
            duration: 0.95,
            ease: "power4.inOut",
          },
          0
        )
        .to(veil, { opacity: 0, duration: 0.6, ease: "power2.in" }, 0.1)
        .to(wrap, { opacity: 0, duration: 0.3, ease: "power2.in" }, ">-0.2");

      prevIdRef.current = null;
    }

    return () => {
      tl.kill();
    };
  }, [active]);

  // Stash latest origin so close animation knows where to fly back to
  useEffect(() => {
    if (active) (window as any).__lastFocusOrigin = active.origin;
  }, [active]);

  // Note: scroll-to-close intentionally disabled. Body scroll is locked
  // in FocusContext while a card is focused; exit only via X or ESC.

  return (
    <>
      {/* Veil — vignette + blur backdrop, sits BEHIND the hero canvas via z-index trickery */}
      <div
        ref={veilRef}
        aria-hidden
        className="fixed inset-0 z-[5] pointer-events-none opacity-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, hsl(var(--background) / 0.85) 80%), hsl(var(--background) / 0.5)",
          backdropFilter: "blur(8px) saturate(140%)",
          WebkitBackdropFilter: "blur(8px) saturate(140%)",
        }}
      />

      {/* Flying image — fixed positioned, GSAP-controlled */}
      <div
        ref={imgWrapRef}
        aria-hidden={!active}
        className="fixed z-[6] overflow-hidden pointer-events-none will-change-transform"
        style={{ top: 0, left: 0, width: 0, height: 0, opacity: 0 }}
      >
        {active && (
          <>
            <img
              src={active.img}
              alt={active.title}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "saturate(1.05) contrast(1.05)" }}
            />
            {/* Cinematic darken + tint */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--background) / 0.35) 0%, hsl(var(--background) / 0.15) 40%, hsl(var(--background) / 0.7) 100%)",
              }}
            />
            <div
              className="absolute inset-0 mix-blend-overlay"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.18), transparent 60%)" }}
            />
            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 35%, hsl(var(--background) / 0.55) 90%)",
              }}
            />
            {/* Left readability gradient — keeps focused title legible */}
<div
  className="absolute inset-0 rtl:-scale-x-100"
  style={{
    background:
      "linear-gradient(90deg, hsl(var(--background) / 0.85) 0%, hsl(var(--background) / 0.55) 25%, transparent 55%)",
  }}
/>
          </>
        )}
      </div>

      {/* Title strip — appears with the focus, sits below robot but above veil */}
      {active && (
        <div className="fixed top-1/2 left-12 rtl:left-auto rtl:right-12 -translate-y-1/2 z-[6] pointer-events-none max-w-md">
          <div key={active.id} className="animate-fade-in">
            <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-primary mb-3">
              {active.index} — {active.label}
            </div>
            <h2 className="font-display font-bold text-5xl md:text-7xl text-grad leading-[0.9]">
              {active.title}
            </h2>
          </div>
        </div>
      )}

      {/* Close button — large, prominent, primary-glowing */}
      <button
        ref={closeRef}
        onClick={close}
        aria-label="Close focused view"
        className="group fixed top-6 right-6 md:top-8 md:right-8 z-[100] h-16 w-16 md:h-20 md:w-20 rounded-full glass-strong grid place-items-center hover:scale-110 active:scale-95 transition-all duration-300 border border-primary/40 hover:border-primary"
        style={{
          opacity: 0,
          pointerEvents: "none",
          boxShadow:
            "0 0 0 1px hsl(var(--primary) / 0.25), 0 8px 40px hsl(var(--primary) / 0.35), inset 0 1px 0 hsl(var(--foreground) / 0.1)",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors"
        />
        <X
          className="relative h-7 w-7 md:h-8 md:w-8 text-primary group-hover:rotate-90 transition-transform duration-300"
          strokeWidth={2.5}
        />
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          ESC
        </span>
      </button>
    </>
  );
};
