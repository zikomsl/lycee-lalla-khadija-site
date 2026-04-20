import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, BookOpen, Layers, Phone, Globe, Moon, Sun } from 'lucide-react';
import { useApp } from "@/contexts/AppContext";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, lang, setLang, t } = useApp();

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

  const handleLangToggle = () => {
    const nextLang = lang === 'fr' ? 'ar' : lang === 'ar' ? 'en' : 'fr';
    setLang(nextLang);
  };

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col bg-background p-6 h-screen w-screen overflow-hidden"
            style={{ zIndex: 999999 }} 
          >
            <div className="flex justify-between items-center mb-10 pt-2">
              <div className="font-display font-bold text-2xl text-primary tracking-tighter uppercase">Menu</div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-full bg-secondary border border-primary/10 active:scale-95 transition-transform"
              >
                <X className="h-6 w-6 text-primary" />
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              {menuItems.map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-6 rounded-[2rem] bg-secondary/80 border border-primary/5 active:scale-[0.97] transition-all"
                >
                  <span className="text-xl font-bold tracking-tight">{item.name}</span>
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
                    {item.icon}
                  </div>
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto grid grid-cols-2 gap-4 pb-8 border-t border-primary/10 pt-8">
               <button 
                 onClick={toggleTheme} 
                 className="flex flex-col items-center justify-center gap-2 p-5 rounded-3xl bg-secondary border border-primary/5 active:scale-95 transition-all"
               >
                  {theme === "light" ? <Moon size={24} className="text-primary" /> : <Sun size={24} className="text-yellow-400" />}
                  <span className="text-xs font-bold uppercase">{theme === "light" ? "Dark" : "Light"}</span>
               </button>
               
               <button 
                 onClick={handleLangToggle}
                 className="flex flex-col items-center justify-center gap-2 p-5 rounded-3xl bg-secondary border border-primary/5 active:scale-95 transition-all"
               >
                  <Globe size={24} className="text-primary" />
                  <span className="text-xs font-bold uppercase">{lang}</span>
               </button>
            </div>

            <div className="pb-4 text-center">
              <div className="h-1 w-12 bg-primary/20 rounded-full mx-auto mb-4" />
              <p className="text-[9px] text-muted-foreground uppercase tracking-[0.5em] font-medium opacity-50">Lalla Khadija Labs</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};