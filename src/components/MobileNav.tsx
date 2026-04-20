import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, BookOpen, Layers, Phone, Globe, Moon, Sun, Sparkles } from 'lucide-react';
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
    { name: t("nav_branches"), icon: <Layers size={22} />, href: '#branches' },
    { name: t("nav_facilities"), icon: <BookOpen size={22} />, href: '#facilities' },
    { name: t("nav_life"), icon: <Home size={22} />, href: '#life' },
    { name: t("nav_contact"), icon: <Phone size={22} />, href: '#contact' },
  ];

  const handleLangToggle = () => {
    const nextLang = lang === 'fr' ? 'ar' : lang === 'ar' ? 'en' : 'fr';
    setLang(nextLang);
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-primary/10 shadow-lg active:scale-90 transition-all"
      >
        <Menu className="h-6 w-6 text-primary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white/95 dark:bg-slate-950/98 backdrop-blur-2xl p-6 flex flex-col h-[100dvh] w-screen overflow-y-auto scrollbar-hide"
            style={{ zIndex: 99999 }}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex justify-between items-center mb-8 pt-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <span className="font-sans font-black text-xl tracking-tighter uppercase text-slate-900 dark:text-white">
                  Menu
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-4 rounded-full bg-slate-100 dark:bg-white/5 border border-primary/10 active:scale-90 transition-all"
              >
                <X className="h-6 w-6 text-primary" />
              </button>
            </div>

            <nav className="flex flex-col gap-3 mb-8">
              {menuItems.map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-primary/5 active:scale-[0.98] transition-all group"
                >
                  <span className="text-xl font-sans font-black tracking-tight text-slate-800 dark:text-slate-100">
                    {item.name}
                  </span>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 text-primary shadow-sm">
                    {item.icon}
                  </div>
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto pt-8 border-t border-primary/10 grid grid-cols-2 gap-4 shrink-0">
               <button 
                 onClick={toggleTheme} 
                 className="flex flex-col items-center justify-center gap-2 p-5 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-primary/5 active:scale-95 transition-all"
               >
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                    {theme === "light" ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-yellow-400" />}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">{theme === "light" ? "Dark" : "Light"}</span>
               </button>
               
               <button 
                 onClick={handleLangToggle}
                 className="flex flex-col items-center justify-center gap-2 p-5 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-primary/5 active:scale-95 transition-all"
               >
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                    <Globe size={20} className="text-primary" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">{lang === 'ar' ? 'العربية' : lang === 'fr' ? 'Français' : 'English'}</span>
               </button>
            </div>

            <div className="py-6 shrink-0">
              <div className="h-1 w-8 bg-primary/20 rounded-full mx-auto mb-4" />
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em] opacity-60">lt-lallakhadija.ma</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};