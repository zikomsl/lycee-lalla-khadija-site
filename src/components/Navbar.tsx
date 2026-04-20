import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Globe } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { MobileNav } from "./MobileNav";

const langs: { code: "fr" | "ar" | "en"; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
];

export const Navbar = () => {
  const { theme, toggleTheme, lang, setLang, t } = useApp();
  const [langOpen, setLangOpen] = useState(false);

  const links = [
    { href: "#branches", label: t("nav_branches") },
    { href: "#facilities", label: t("nav_facilities") },
    { href: "#life", label: t("nav_life") },
    { href: "#contact", label: t("nav_contact") },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
      className="fixed top-4 inset-x-4 z-50 mx-auto max-w-6xl"
    >
      <div className="glass-strong rounded-2xl px-4 py-2.5 flex items-center justify-between gap-4 border border-white/10">
        <a href="#hero" className="flex items-center gap-2 group shrink-0">
          <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
          <div className="hidden sm:block leading-tight">
            <div className="font-display font-semibold text-sm">Lalla Khadija</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-tighter">Lycée Technique</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 border-r border-white/10 pr-2">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="h-9 px-3 rounded-xl bg-secondary/50 text-xs flex items-center gap-1.5 transition-colors">
                <Globe className="h-3.5 w-3.5" />
                {langs.find((l) => l.code === lang)?.label}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-28 glass-strong rounded-xl p-1 origin-top-right"
                    onMouseLeave={() => setLangOpen(false)}
                  >
                    {langs.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setLangOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors",
                          lang === l.code ? "bg-grad-primary text-primary-foreground" : "hover:bg-secondary"
                        )}
                      >
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={toggleTheme} className="h-9 w-9 rounded-xl bg-secondary/50 grid place-items-center transition-colors">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>

          <MobileNav />
        </div>
      </div>
    </motion.header>
  );
};