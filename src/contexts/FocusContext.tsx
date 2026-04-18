import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";

export interface FocusOrigin {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
}

export interface FocusItem {
  id: string;
  img: string;
  title: string;
  label: string;
  index: string;
  origin: FocusOrigin;
}

interface FocusCtx {
  active: FocusItem | null;
  open: (item: FocusItem) => void;
  close: () => void;
}

const Ctx = createContext<FocusCtx | null>(null);

/* ──────────────────────────────────────────────
   Tiny synth "whoosh" via Web Audio (no asset)
   ────────────────────────────────────────────── */
const playWhoosh = (direction: "in" | "out" = "in") => {
  try {
    // @ts-ignore
    const AC: typeof AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;

    // Noise burst
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.5;
    if (direction === "in") {
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(3500, now + 0.45);
    } else {
      filter.frequency.setValueAtTime(3500, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.4);
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.55);
    noise.onended = () => ctx.close();
  } catch {
    /* silent */
  }
};

export const FocusProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState<FocusItem | null>(null);
  const originalScrollY = useRef(0);
  const focusAnchorY = useRef(0);
  const programmaticScroll = useRef(false);

  const open = useCallback((item: FocusItem) => {
    originalScrollY.current = window.scrollY;
    setActive(() => {
      playWhoosh("in");
      return item;
    });
    // After the fly-out begins, scroll back to hero so the robot is visible
    // behind the image overlay.
    setTimeout(() => {
      const hero = document.getElementById("hero");
      if (!hero) return;
      programmaticScroll.current = true;
      hero.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        focusAnchorY.current = window.scrollY;
        programmaticScroll.current = false;
      }, 900);
    }, 500);
  }, []);

  const close = useCallback(() => {
    setActive((prev) => {
      if (prev) playWhoosh("out");
      return null;
    });
    if (originalScrollY.current > 0) {
      programmaticScroll.current = true;
      window.scrollTo({ top: originalScrollY.current, behavior: "smooth" });
      setTimeout(() => { programmaticScroll.current = false; }, 900);
    }
  }, []);

  // Lock body scroll while a card is focused (manual close only)
  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    // Compensate for scrollbar removal to prevent layout shift
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [active]);

  // ESC to close
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close]);

  return <Ctx.Provider value={{ active, open, close }}>{children}</Ctx.Provider>;
};

export const useFocus = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useFocus must be used inside FocusProvider");
  return c;
};
