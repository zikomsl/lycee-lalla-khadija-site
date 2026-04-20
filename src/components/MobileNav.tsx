import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, BookOpen, Layers, Phone, Globe, Moon, Sun } from 'lucide-react';
import { useApp } from "@/contexts/AppContext";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, lang, t } = useApp();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const menuItems = [
    { name: t("nav_branches"), icon: <Layers size={24} />, href: '#branches' },
    { name: t("nav_facilities"), icon: <BookOpen size={24} />, href: '#facilities' },
    { name: t("nav_life"), icon: <Home size={24} />, href: '#life' },
    { name: t("nav_contact"), icon: <Phone size={24} />, href: '#contact' },
  ];

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2.5 rounded-xl bg-secondary border border-primary/10 shadow-sm active:scale-90 transition-transform"
      >
        <Menu className="h-5 w-5 text-primary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[10000] bg-background flex flex-col p-6 h-screen w-screen overflow-hidden"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="font-display font-bold text-xl text-primary tracking-widest uppercase">Menu</div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-full bg-secondary border border-primary/10"
              >
                <X className="h-6 w-6 text-primary" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {menuItems.map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-6 rounded-3xl bg-secondary hover:bg-primary/10 transition-all border border-white/5 shadow-sm"
                >
                  <span className="text-xl font-bold">{item.name}</span>
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto grid grid-cols-2 gap-4 pt-8 border-t border-primary/10">
               <button 
                 onClick={toggleTheme} 
                 className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-secondary font-bold text-sm border border-primary/5"
               >
                  {theme === "light" ? <Moon size={22} className="text-primary" /> : <Sun size={22} className="text-yellow-400" />}
                  {theme === "light" ? "Dark" : "Light"}
               </button>
               <div className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-secondary font-bold text-sm border border-primary/5 uppercase">
                  <Globe size={22} className="text-primary" />
                  {lang}
               </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.5em] opacity-40">Lalla Khadija Labs</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};