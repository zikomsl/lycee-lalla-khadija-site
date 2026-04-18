import { useRef, ReactNode, MouseEvent } from "react";
import { useFocus, FocusItem } from "@/contexts/FocusContext";

interface Props {
  id: string;
  img: string;
  title: string;
  label: string;
  index: string;
  borderRadius?: number;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps a card so clicking it dispatches the global focus event with its
 * bounding rect. The wrapper is what GSAP measures for the "fly" origin.
 */
export const FocusableCard = ({
  id,
  img,
  title,
  label,
  index,
  borderRadius = 32,
  children,
  className,
}: Props) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { open, active } = useFocus();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const item: FocusItem = {
      id,
      img,
      title,
      label,
      index,
      origin: { x: r.left, y: r.top, width: r.width, height: r.height, borderRadius },
    };
    open(item);
  };

  const isActive = active?.id === id;

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={className}
      style={{
        appearance: "none",
        background: "none",
        border: "none",
        padding: 0,
        textAlign: "inherit",
        cursor: "pointer",
        opacity: isActive ? 0 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {children}
    </button>
  );
};
