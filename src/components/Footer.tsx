"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

const navLinks = [
  { label: "Proyecto", href: "#proyecto" },
  { label: "Especies", href: "#especies" },
  { label: "Impacto", href: "#impacto" },
  { label: "Cómo ayudar", href: "#ayudar" },
];

export default function Footer() {
  const reduce = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.3 : 0.7, ease: EASE_REVEAL },
    },
  };

  return (
    <motion.footer
      id="contacto"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeUp}
      className="border-t border-border-soft bg-bg-charcoal px-6 py-16 md:px-10 lg:px-[72px]"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-[320px]">
          <span className="font-serif text-2xl font-semibold tracking-tight text-text-primary">
            ARA
          </span>
          <p className="mt-3 text-sm leading-relaxed text-text-tertiary">
            Conservación de aves endémicas de Cuba a través del cuidado, la
            educación y el trabajo colaborativo.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="text-sm text-text-tertiary">
          <p className="uppercase tracking-[0.14em] text-xs text-text-disabled">Contacto</p>
          <a
            href="mailto:contacto@ara-cuba.org"
            className="mt-2 inline-block text-text-secondary transition-colors duration-200 hover:text-text-primary"
          >
            contacto@ara-cuba.org
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1440px] flex-col gap-2 border-t border-border-soft pt-6 text-xs text-text-disabled sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 ARA. Todos los derechos reservados.</p>
        <p>Cuba</p>
      </div>
    </motion.footer>
  );
}
