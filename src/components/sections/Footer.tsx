import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import { StaggerText } from "../StaggerText";
import { useApp } from "@/contexts/AppContext";
import logo from "@/assets/logo.png";
import ministryBanner from "@/assets/ministry-banner.png";

export const Footer = () => {
  const { t } = useApp();
  return (
    <footer id="contact" className="relative pt-28 pb-12 overflow-visible">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      {/* Top divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container relative">
        {/* Ministry banner — sits centered between the StudentLife bottom line and the footer top line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="mx-auto -mt-[7.5rem] mb-12 max-w-2xl relative z-20"
        >
          <div
            className="rounded-2xl px-8 py-5 flex items-center justify-center border border-[hsl(var(--glass-border))] shadow-[var(--shadow-elev)]"
            style={{
              background: "hsla(var(--glass-bg))",
              backdropFilter: "blur(48px) saturate(200%)",
              WebkitBackdropFilter: "blur(48px) saturate(200%)",
            }}
          >
            <img
              src={ministryBanner}
              alt="Royaume du Maroc — Ministère de l'Éducation Nationale, du Préscolaire et des Sports"
              loading="lazy"
              className="h-14 md:h-16 w-auto object-contain dark:invert dark:brightness-110"
            />
          </div>
        </motion.div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4">04 — {t("nav_contact")}</div>
          <StaggerText
            as="h2"
            text={t("contact_us")}
            className="font-display font-bold text-5xl md:text-7xl text-grad mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            Visitez notre campus, rencontrez nos équipes, et découvrez votre futur.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16">
          {[
            {
              icon: MapPin,
              label: "Adresse",
              labelAr: "العنوان",
              value: "Av. Prince Héritier Moulay El Hassan, Tan-Tan, Maroc",
              href: "https://maps.google.com/?q=Av.+Prince+Héritier+Moulay+El+Hassan,+Tan-Tan,+Maroc",
            },
            {
              icon: Phone,
              label: "Téléphone",
              labelAr: "الهاتف",
              value: "+212 528 877 155",
              href: "tel:+212528877155",
            },
            {
              icon: Mail,
              label: "Email",
              labelAr: "البريد الإلكتروني",
              value: "contact@lyceelallakhadija.ma",
              href: "mailto:contact@lyceelallakhadija.ma",
            },
          ].map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform group shadow-[var(--shadow-soft)]"
              style={{
                background: "hsla(var(--glass-bg))",
                backdropFilter: "blur(12px) saturate(160%)",
                WebkitBackdropFilter: "blur(12px) saturate(160%)",
                border: "0.5px solid hsla(var(--glass-border))",
              }}
            >
              <div className="h-12 w-12 mx-auto rounded-xl bg-grad-primary grid place-items-center mb-4 shadow-glow group-hover:scale-110 transition-transform">
                <c.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{c.label}</div>
              <div
                className="text-[11px] text-muted-foreground/80 mb-2"
                style={{ fontFamily: "'Tajawal', sans-serif", direction: "rtl" }}
              >
                {c.labelAr}
              </div>
              <div className="font-medium text-sm break-words">{c.value}</div>
            </motion.a>
          ))}
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Lalla Khadija logo" className="h-8 w-8 object-contain" />
            <span>{t("footer")}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Made by MSL ◆Morocco</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
