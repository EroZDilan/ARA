"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import LazyMount from "@/components/LazyMount";
import SplitText from "@/components/reactbits/SplitText";
import ScrollFloat from "@/components/reactbits/ScrollFloat";

const Aurora = dynamic(() => import("@/components/Aurora"), { ssr: false });

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

const stats = [
  {
    id: "IMPACTO-01",
    value: "12",
    label: "Especies monitoreadas",
    description: "Seguimiento activo de aves endémicas en distintas regiones de Cuba.",
  },
  {
    id: "IMPACTO-02",
    value: "3",
    label: "Hábitats protegidos",
    description: "Bosques, humedales y zonas de refugio bajo acciones de conservación.",
  },
  {
    id: "IMPACTO-03",
    value: "150+",
    label: "Horas de observación",
    description: "Trabajo de campo dedicado a la observación y el cuidado del territorio.",
  },
];

export default function Impacto() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: reduce ? 0 : 0.05 },
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
      transition: { staggerChildren: reduce ? 0 : 0.1 },
    },
  };

  const cardItem: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.3 : 0.7, ease: EASE_REVEAL },
    },
  };

  return (
    <section id="impacto" className="relative isolate overflow-hidden bg-bg-forest px-6 py-24 md:px-10 md:py-32 lg:px-[72px] lg:py-40">
      <LazyMount
        rootMargin="400px"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
      >
        <div aria-hidden className="h-full w-full">
          <Aurora colorStops={["#112a22", "#e0a92b", "#0e2f57"]} amplitude={0.8} blend={0.55} speed={0.4} />
        </div>
      </LazyMount>

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
            El impacto hasta ahora
          </motion.p>

          <motion.div variants={fadeUp}>
            <SplitText
              tag="h2"
              text="Resultados que sostienen la conservación"
              className="font-serif text-[36px] font-semibold leading-[1.05] text-text-primary sm:text-[44px] lg:text-[52px]"
              splitType="words"
              duration={0.7}
              delay={80}
              ease="power3.out"
            />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[620px] text-lg leading-relaxed text-text-secondary"
          >
            Cada acción de monitoreo, protección y educación deja huella medible.
            Estas son algunas de las cifras que reflejan el trabajo sostenido de ARA.
          </motion.p>
        </motion.div>

        <motion.div
          variants={cardsContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-24 lg:gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={cardItem}
              className="rounded-[26px] border border-border-soft bg-[rgba(10,24,40,0.5)] p-8 backdrop-blur-sm"
            >
              <ScrollFloat
                containerClassName="mb-3"
                textClassName="font-serif text-[52px] font-semibold leading-none text-ara-gold-bright lg:text-[60px]"
              >
                {stat.value}
              </ScrollFloat>
              <p className="text-[15px] font-semibold text-text-primary">{stat.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-tertiary">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
