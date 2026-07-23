"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import SplitText from "@/components/reactbits/SplitText";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

const equipo = [
  {
    id: "ABOUT-IMG-02",
    nombre: "Integrante 1",
    rol: "Investigación y seguimiento",
    bio: "Trabaja en el seguimiento de especies y en la articulación de procesos de observación y cuidado vinculados a la conservación de aves endémicas.",
  },
  {
    id: "ABOUT-IMG-03",
    nombre: "Integrante 2",
    rol: "Comunicación y sensibilización",
    bio: "Impulsa la manera en que ARA comparte su misión, conecta a la comunidad y acerca la conservación a nuevos públicos y aliados.",
  },
  {
    id: "ABOUT-IMG-04",
    nombre: "Integrante 3",
    rol: "Coordinación y trabajo territorial",
    bio: "Sostiene el trabajo en el territorio, articulando alianzas y procesos que permiten que la conservación sea continua y compartida.",
  },
];

export default function About() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: reduce ? 0 : 0.05 },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22, filter: reduce ? "none" : "blur(6px)" },
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
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.3 : 0.7, ease: EASE_REVEAL },
    },
  };

  return (
    <section
      id="equipo"
      className="relative bg-[#0a1624] px-6 py-24 md:px-10 md:py-32 lg:px-[72px] lg:py-40"
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
            Quiénes sostienen ARA
          </motion.p>

          <motion.div variants={fadeUp}>
            <SplitText
              tag="h2"
              text="Un proyecto impulsado por cuidado, conocimiento y compromiso"
              className="font-serif text-[36px] font-semibold leading-[1.05] text-text-primary sm:text-[44px] lg:text-[52px]"
              splitType="words"
              duration={0.7}
              delay={80}
              ease="power3.out"
            />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[640px] text-lg leading-relaxed text-text-secondary"
          >
            ARA es un proyecto construido desde la observación, la
            sensibilidad y el trabajo sostenido en torno a la conservación de
            aves endémicas de Cuba. Detrás de esa misión hay un equipo de
            tres personas que articula investigación, comunicación y cuidado
            del territorio para convertir la preocupación en acción.
          </motion.p>
        </motion.div>

        {/* Composición editorial del equipo */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 1.02, filter: reduce ? "none" : "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduce ? 0.3 : 1, ease: EASE_REVEAL }}
          className="mt-16 lg:mt-20"
        >
          <div
            className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-[32px] border border-dashed border-border-soft"
            style={{
              background:
                "linear-gradient(100deg, #112a22 0%, #0b2744 45%, #0a1624 75%, #071726 100%)",
            }}
          >
            <div className="flex flex-col items-center gap-2 p-8 text-center">
              <span className="text-xs uppercase tracking-[0.14em] text-text-disabled">
                ABOUT-IMG-01
              </span>
              <span className="max-w-[32ch] text-sm text-text-tertiary">
                Composición editorial del equipo — retrato conjunto de las
                tres integrantes
              </span>
            </div>
          </div>
        </motion.div>

        {/* Cards de perfil */}
        <motion.div
          variants={cardsContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:gap-6"
        >
          {equipo.map((persona) => (
            <motion.div
              key={persona.nombre}
              variants={cardItem}
              className="group relative rounded-[24px] border border-border-soft bg-surface-1/70 p-7 transition-colors duration-300 hover:border-text-secondary/30"
            >
              <SpotlightCard className="!absolute !inset-0 z-0" spotlightColor="rgba(74,143,216,0.12)" />
              <div className="mb-4 h-px w-8 bg-ara-gold-bright/60 transition-all duration-300 group-hover:w-12" />
              <h3 className="font-serif text-xl font-medium text-text-primary transition-colors duration-300 group-hover:text-white">
                {persona.nombre}
              </h3>
              <p className="mt-1 text-sm font-medium text-state-edu">
                {persona.rol}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-text-tertiary">
                {persona.bio}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <ScrollReveal
          containerClassName="mt-14 max-w-[680px] lg:mt-16"
          textClassName="text-lg leading-relaxed text-text-secondary"
        >
          Conocer a ARA también es ver de cerca las especies, los paisajes y
          los procesos de conservación que dan sentido al proyecto.
        </ScrollReveal>
      </div>
    </section>
  );
}
