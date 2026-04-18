import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

type Theme = "light" | "dark";
type Lang = "fr" | "ar" | "en";

interface AppCtx {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const Ctx = createContext<AppCtx | null>(null);

const dict: Record<Lang, Record<string, string>> = {
  fr: {
    nav_branches: "Filières",
    nav_facilities: "Installations",
    nav_life: "Vie scolaire",
    nav_contact: "Contact",
    hero_kicker: "Lycée Technique",
    hero_title: "Lalla Khadija",
    hero_sub: "Façonner les ingénieurs, techniciens et innovateurs de demain.",
    hero_cta: "Explorer le campus",
    hero_cta2: "Découvrir BTS IA",
    branches_title: "Nos Filières",
    branches_sub: "De la science à l'industrie 4.0.",
    facilities_title: "Installations",
    facilities_sub: "Des espaces conçus pour exceller.",
    life_title: "Vie Scolaire",
    life_sub: "Bien plus qu'une école — une communauté.",
    ai_lab: "Laboratoire IA",
    library: "Bibliothèque",
    science_lab: "Labo Sciences",
    sports: "Complexe Sportif",
    dakhilia: "Internat",
    restaurant: "Restaurant",
    bus: "Transport Scolaire",
    infirmerie: "Infirmerie",
    dakhilia_desc: "Un foyer hors du foyer. Chambres modernes, espaces d'étude calmes, surveillance attentive 24/7.",
    restaurant_desc: "Cuisine fraîche préparée chaque jour. Menus équilibrés pensés par des nutritionnistes.",
    bus_desc: "Un réseau de bus desservant la ville entière. Confort, sécurité et ponctualité garantis.",
    infirmerie_desc: "Personnel médical qualifié sur place. Réactivité, soins et écoute pour chaque élève.",
    life_scene: "Scène",
    contact_us: "Contactez-nous",
    whatsapp: "Discuter sur WhatsApp",
    footer: "© 2026 Lycée Technique Lalla Khadija. Tous droits réservés.",
  },
  ar: {
    nav_branches: "الشعب",
    nav_facilities: "المرافق",
    nav_life: "الحياة المدرسية",
    nav_contact: "تواصل",
    hero_kicker: "الثانوية التقنية",
    hero_title: "لالة خديجة",
    hero_sub: "نصنع مهندسي وتقنيي ومبتكري الغد.",
    hero_cta: "استكشف الحرم",
    hero_cta2: "اكتشف BTS الذكاء الاصطناعي",
    branches_title: "شعبنا",
    branches_sub: "من العلوم إلى الصناعة 4.0.",
    facilities_title: "المرافق",
    facilities_sub: "فضاءات مصممة للتميز.",
    life_title: "الحياة المدرسية",
    life_sub: "أكثر من مجرد مدرسة — مجتمع.",
    ai_lab: "مختبر الذكاء الاصطناعي",
    library: "المكتبة",
    science_lab: "مختبر العلوم",
    sports: "المركب الرياضي",
    dakhilia: "الداخلية",
    restaurant: "المطعم",
    bus: "النقل المدرسي",
    infirmerie: "العيادة",
    dakhilia_desc: "بيت بعيداً عن البيت. غرف عصرية، فضاءات دراسة هادئة، وإشراف دقيق على مدار الساعة.",
    restaurant_desc: "طبخ طازج يومياً. قوائم متوازنة من إعداد أخصائيي تغذية.",
    bus_desc: "شبكة حافلات تغطي المدينة بأكملها. راحة وأمان والتزام بالمواعيد.",
    infirmerie_desc: "طاقم طبي مؤهل في عين المكان. استجابة سريعة وعناية لكل تلميذ.",
    life_scene: "مشهد",
    contact_us: "تواصل معنا",
    whatsapp: "تحدث على واتساب",
    footer: "© 2026 الثانوية التقنية لالة خديجة. جميع الحقوق محفوظة.",
  },
  en: {
    nav_branches: "Branches",
    nav_facilities: "Facilities",
    nav_life: "Student Life",
    nav_contact: "Contact",
    hero_kicker: "Technical High School",
    hero_title: "Lalla Khadija",
    hero_sub: "Shaping tomorrow's engineers, technicians and innovators.",
    hero_cta: "Explore Campus",
    hero_cta2: "Discover AI BTS",
    branches_title: "Our Branches",
    branches_sub: "From science to industry 4.0.",
    facilities_title: "Facilities",
    facilities_sub: "Spaces designed to excel.",
    life_title: "Student Life",
    life_sub: "More than a school — a community.",
    ai_lab: "AI Laboratory",
    library: "Library",
    science_lab: "Science Lab",
    sports: "Sports Complex",
    dakhilia: "Boarding House",
    restaurant: "Restaurant",
    bus: "School Bus",
    infirmerie: "Infirmary",
    dakhilia_desc: "A home away from home. Modern rooms, quiet study lounges, attentive 24/7 supervision.",
    restaurant_desc: "Fresh cuisine prepared every day. Balanced menus designed by nutritionists.",
    bus_desc: "A bus network covering the entire city. Comfort, safety and punctuality guaranteed.",
    infirmerie_desc: "Qualified medical staff on-site. Responsive care and attentive listening for every student.",
    life_scene: "Scene",
    contact_us: "Contact Us",
    whatsapp: "Chat on WhatsApp",
    footer: "© 2026 Lycée Technique Lalla Khadija. All rights reserved.",
  },
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
    const sl = (localStorage.getItem("lang") as Lang) || "fr";
    setLangState(sl);
    document.documentElement.lang = sl;
    document.documentElement.dir = sl === "ar" ? "rtl" : "ltr";
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    setTheme(next);
    localStorage.setItem("theme", next);
  }, []);

  const toggleTheme = useCallback(
    (e?: React.MouseEvent) => {
      const next: Theme = theme === "light" ? "dark" : "light";
      const cx = e ? `${e.clientX}px` : "50%";
      const cy = e ? `${e.clientY}px` : "50%";
      const root = document.documentElement;
      // @ts-ignore
      if (document.startViewTransition) {
        root.style.setProperty("--cx", cx);
        root.style.setProperty("--cy", cy);
        // @ts-ignore
        const tr = document.startViewTransition(() => applyTheme(next));
        tr.ready.then(() => {
          document.documentElement.animate(
            [
              { clipPath: `circle(0% at ${cx} ${cy})` },
              { clipPath: `circle(150% at ${cx} ${cy})` },
            ],
            { duration: 700, easing: "cubic-bezier(0.7,0,0.3,1)", pseudoElement: "::view-transition-new(root)" }
          );
        });
      } else {
        applyTheme(next);
      }
    },
    [theme, applyTheme]
  );

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  }, []);

  const t = useCallback((key: string) => dict[lang][key] ?? key, [lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return <Ctx.Provider value={{ theme, toggleTheme, lang, setLang, t, dir }}>{children}</Ctx.Provider>;
};

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
};
