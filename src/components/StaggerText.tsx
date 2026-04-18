import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

/**
 * Stagger entrance text.
 * - Latin scripts: animate per-character for granular flair.
 * - Arabic: animate per-WORD only — splitting characters destroys
 *   ligatures and renders letters in their isolated form.
 */
export const StaggerText = ({ text, className = "", delay = 0, as: As = "h1" }: Props) => {
  const { lang, dir } = useApp();
  const isArabic = lang === "ar";
  const words = text.split(" ");

  if (isArabic) {
    return (
      <As className={`${className} arabic-heading`} aria-label={text} dir="rtl">
        {words.map((word, wi) => (
          <motion.span
            key={wi}
            className="inline-block"
            style={{ marginInlineEnd: "0.28em" }}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              delay: delay + wi * 0.08,
              duration: 0.8,
              ease: [0.34, 1.4, 0.64, 1],
            }}
          >
            {word}
          </motion.span>
        ))}
      </As>
    );
  }

  return (
    <As className={className} aria-label={text} dir={dir}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" style={{ marginRight: "0.25em" }}>
          {word.split("").map((ch, i) => (
            <motion.span
              key={`${wi}-${i}`}
              className="inline-block"
              initial={{ y: 60, opacity: 0, rotateX: -90 }}
              whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                delay: delay + wi * 0.05 + i * 0.025,
                duration: 0.7,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{ transformOrigin: "50% 100%" }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </As>
  );
};
