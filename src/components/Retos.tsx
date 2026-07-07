"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

const retos = [
  {
    id: "RETOS-ILL-01",
    tag: "Impacto en hábitat",
    title: "Cambio climático",
    description:
      "El aumento de temperaturas, la alteración de lluvias y los eventos extremos transforman hábitats y reducen las condiciones necesarias para la alimentación, reproducción y refugio de muchas especies.",
    accent: "#F2B631",
    gradient:
      "linear-gradient(160deg, rgba(242,182,49,0.16) 0%, rgba(11,39,68,0.35) 50%, rgba(8,21,33,0.95) 100%)",
  },
  {
    id: "RETOS-ILL-02",
    tag: "Impacto en reproducción",
    title: "Pérdida de hábitat",
    description:
      "La transformación y fragmentación de bosques, humedales y zonas de anidación reduce el espacio disponible para especies que dependen de ecosistemas muy concretos para sobrevivir.",
    accent: "#E53B2D",
    gradient:
      "linear-gradient(160deg, rgba(229,59,45,0.16) 0%, rgba(11,39,68,0.35) 50%, rgba(8,21,33,0.95) 100%)",
  },
  {
    id: "RETOS-ILL-03",
    tag: "Impacto en protección",
    title: "Presión humana y protección insuficiente",
    description:
      "La conservación necesita más que refugios naturales: requiere educación, apoyo, seguimiento y redes de protección capaces de reducir impactos humanos y sostener el cuidado de las especies a largo plazo.",
    accent: "#4A8FD8",
    gradient:
      "linear-gradient(160deg, rgba(74,143,216,0.18) 0%, rgba(11,39,68,0.35) 50%, rgba(8,21,33,0.95) 100%)",
  },
];

export default function Retos() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: reduce ? 0 : 0.05 },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24, filter: reduce ? "none" : "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0.3 : 0.85, ease: EASE_REVEAL },
    },
  };

  const cardsContainer: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.12 },
    },
  };

  const cardItem: Variants = {
    hidden: {
      opacity: 0,
      y: reduce ? 0 : 34,
      scale: reduce ? 1 : 0.98,
      filter: reduce ? "none" : "blur(8px)",
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0.3 : 0.9, ease: EASE_REVEAL },
    },
  };

  return (
    <section
      id="retos"
      className="relative bg-[#081521] px-6 py-24 md:px-10 md:py-32 lg:px-[72px] lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-[720px]"
        >
          <motion.p
            variants={fadeUp}
            className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ara-gold-bright"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ara-gold-bright" />
            Por qué es urgente actuar
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-[36px] font-semibold leading-[1.05] text-text-primary sm:text-[44px] lg:text-[52px]"
          >
            Lo que enfrentan hoy las aves de Cuba
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[620px] text-lg leading-relaxed text-text-secondary"
          >
            El cambio climático, la pérdida de hábitat y la presión humana
            están alterando los ecosistemas de los que dependen muchas
            especies endémicas cubanas. Entender estos retos es el primer
            paso para protegerlas de forma efectiva.
          </motion.p>
        </motion.div>

        <motion.div
          variants={cardsContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7"
        >
          {retos.map((reto) => (
            <motion.article
              key={reto.id}
              variants={cardItem}
              className="group overflow-hidden rounded-[28px] border border-border-soft bg-surface-1/60 transition-colors duration-300 hover:border-text-secondary/30"
            >
              <div
                className="relative flex aspect-[4/3] items-center justify-center border-b border-border-soft p-6 text-center"
                style={{ background: reto.gradient }}
              >
                <div
                  className="absolute inset-x-6 top-6 h-px opacity-40"
                  style={{ background: reto.accent }}
                />
                <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                  <span className="text-xs uppercase tracking-[0.14em] text-text-disabled">
                    {reto.id}
                  </span>
                </div>
              </div>

              <div className="p-7">
                <h3 className="text-xl font-semibold text-text-primary transition-colors duration-300 group-hover:text-white">
                  {reto.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-text-tertiary">
                  {reto.description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-text-disabled">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: reto.accent }}
                  />
                  {reto.tag}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE_REVEAL }}
          className="mt-16 max-w-[680px] text-lg leading-relaxed text-text-secondary lg:mt-20"
        >
          Proteger a las aves endémicas de Cuba exige entender estas amenazas
          y responder a ellas con acciones sostenidas, colaboración y cuidado
          del territorio.
        </motion.p>
      </div>
    </section>
  );
}
