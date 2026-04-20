import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, BookOpen, Layers, Phone } from 'lucide-react';

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'الرئيسية', icon: <Home size={20} />, href: '#' },
    { name: 'الشعب', icon: <Layers size={20} />, href: '#branches' },
    { name: 'المرافق', icon: <BookOpen size={20} />, href: '#facilities' },
    { name: 'تواصل', icon: <Phone size={20} />, href: '#contact' },
  ];

  return (
    <div className="lg:hidden fixed top-4 right-4 z-[100]">
      {/* Button Menu - Glassmorphism */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-2xl glass-strong border border-white/20 shadow-xl active:scale-90 transition-transform"
      >
        {isOpen ? <X className="text-primary" /> : <Menu className="text-primary" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/40 backdrop-blur-md -z-10"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-[75%] glass-strong border-l border-white/10 p-8 pt-24 shadow-2xl"
            >
              <div className="flex flex-col gap-6">
                {menuItems.map((item, i) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/10 transition-colors group"
                  >
                    <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <span className="text-lg font-medium">{item.name}</span>
                  </motion.a>
                ))}
              </div>

              {/* Bottom Decoration */}
              <div className="absolute bottom-12 left-8 right-8">
                <div className="p-6 rounded-3xl bg-grad-primary/10 border border-primary/20 text-center">
                  <p className="text-xs text-muted-foreground mb-2">ثانوية للا خديجة</p>
                  <p className="text-sm font-bold text-grad-primary">مستقبل التقنية يبدأ هنا</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};