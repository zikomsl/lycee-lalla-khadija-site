import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, lang, setLang, t } = useApp();

  const links = [
    { href: "#branches", label: t("nav_branches") },
    { href: "#facilities", label: t("nav_facilities") },
    { href: "#life", label: t("nav_life") },
    { href: "#contact", label: t("nav_contact") },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary active:scale-90 transition-transform"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]" 
            />
            <motion.div
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] bg-background border-l border-white/5 p-6 z-[101] flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-display font-bold text-lg text-grad-primary">Menu</span>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg bg-secondary">
                  <X size={20}/>
                </button>
              </div>

              <div className="flex flex-col gap-4 mb-auto">
                {links.map((link) => (
                  <a 
                    key={link.href} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)} 
                    className="text-2xl font-display font-semibold border-b border-white/5 pb-4 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="mt-auto pt-6 flex flex-col gap-4">
                <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-2xl">
                  <span className="text-sm font-medium">Mode {theme === 'light' ? 'Nuit' : 'Jour'}</span>
                  <button onClick={toggleTheme} className="p-2 rounded-xl bg-background shadow-sm active:scale-90 transition-transform">
                    {theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}
                  </button>
                </div>
                
                <div className="flex gap-2">
                  {['fr', 'ar', 'en'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l as any)}
                      className={cn("flex-1 py-3 rounded-xl text-xs font-bold transition-all active:scale-95", 
                        lang === l ? "bg-grad-primary text-white" : "bg-secondary text-muted-foreground")}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};