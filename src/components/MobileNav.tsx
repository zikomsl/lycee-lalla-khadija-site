// src/components/MobileNav.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, BookOpen, Layers, Phone, Globe, Moon, Sun } from 'lucide-react';
import { useApp } from "@/contexts/AppContext";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, lang, t } = useApp();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const menuItems = [
    { name: t("nav_branches"), icon: <Layers size={22} />, href: '#branches' },
    { name: t("nav_facilities"), icon: <BookOpen size={22} />, href: '#facilities' },
    { name: t("nav_life"), icon: <Home size={22} />, href: '#life' },
    { name: t("nav_contact"), icon: <Phone size={22} />, href: '#contact' },
  ];

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-inner active:scale-90 transition-transform"
      >
        <Menu className="h-5 w-5 text-primary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[999] bg-background/98 backdrop-blur-2xl flex flex-col p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="font-display font-bold text-lg text-grad-primary uppercase tracking-widest">Navigation</div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-full bg-secondary/50 border border-white/10 active:rotate-90 transition-transform"
              >
                <X className="h-6 w-6 text-primary" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {menuItems.map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-5 rounded-2xl glass hover:bg-primary/10 transition-all border border-white/5 active:scale-[0.98]"
                >
                  <span className="text-lg font-medium">{item.name}</span>
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">{item.icon}</div>
                </motion.a>
              ))}
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
               <button onClick={toggleTheme} className="flex items-center justify-center gap-2 p-4 rounded-2xl glass-strong">
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} className="text-yellow-400" />}
                  <span className="text-xs font-bold">{theme === "light" ? "Dark" : "Light"}</span>
               </button>
               <div className="flex items-center justify-center gap-2 p-4 rounded-2xl glass-strong">
                  <Globe size={20} className="text-primary" />
                  <span className="text-xs font-bold uppercase">{lang}</span>
               </div>
            </div>
            
            <p className="text-center mt-6 text-[10px] text-muted-foreground uppercase tracking-[0.4em] opacity-50">Lalla Khadija Labs</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};