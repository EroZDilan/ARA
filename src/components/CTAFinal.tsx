"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowIcon } from "@/components/icons";

const GuacamayoVolador = dynamic(
  () => import("@/components/GuacamayoVolador"),
  { ssr: false },
);

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

export default function CTAFinal() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: reduce ? 0 : 0.05 },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22, filter: reduce ? "none" : "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0.3 : 0.9, ease: EASE_REVEAL },
    },
  };

  return (
    <section
      id="ayudar"
      className="relative isolate overflow-hidden bg-bg-forest px-6 py-28 md:px-10 md:py-36 lg:px-[72px] lg:py-44"
    >
      {/* Fondo atmosférico CTA-BG-01 */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0, scale: reduce ? 1 : 1.02 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: reduce ? 0.3 : 1.2, ease: EASE_REVEAL }}
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(224,169,43,0.14) 0%, rgba(216,58,46,0.08) 35%, rgba(7,23,38,0) 70%), linear-gradient(180deg, #0b2744 0%, #071726 60%, #0a1624 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        animate={
          reduce
            ? undefined
            : { opacity: [0.92, 1, 0.92] }
        }
        transition={
          reduce ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          background:
            "radial-gradient(45% 45% at 50% 35%, rgba(242,182,49,0.12) 0%, rgba(7,23,38,0) 70%)",
        }}
      />

      {/* Guacamayo volando de fondo */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <GuacamayoVolador
          className="h-full w-full"
          modelPath="/models/dove-bird.glb"
          clipName="Fly"
          fov={34}
        />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto flex max-w-[760px] flex-col items-center text-center"
      >
        <motion.p
          variants={fadeUp}
          className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ara-gold-bright"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ara-gold-bright" />
          Sumarte también es una forma de proteger
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="font-serif text-[34px] font-semibold leading-[1.08] text-text-primary sm:text-[44px] lg:text-[52px]"
        >
          Proteger las aves endémicas de Cuba también es proteger el
          territorio que las hace posibles.
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-7 max-w-[560px] text-lg leading-relaxed text-text-secondary"
        >
          Si quieres apoyar la conservación de aves endémicas cubanas,
          colaborar con el proyecto o seguir de cerca el trabajo de ARA, este
          es un buen momento para hacerlo.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:items-center"
        >
          <a
            href="#apoyar"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-ara-red px-8 py-3.5 text-[15px] font-medium text-text-primary shadow-[0_10px_30px_-10px_rgba(216,58,46,0.6)] transition-all duration-200 hover:brightness-110"
          >
            Apoyar a ARA
            <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
          <a
            href="#contacto"
            className="inline-flex items-center justify-center rounded-full border border-border-soft bg-white/[0.02] px-8 py-3.5 text-[15px] font-medium text-text-primary backdrop-blur-sm transition-all duration-200 hover:border-text-secondary/40 hover:bg-white/[0.05]"
          >
            Contactar con el equipo
          </a>
        </motion.div>

        <motion.a
          variants={fadeUp}
          href="#proyecto"
          className="mt-7 text-sm text-text-tertiary underline-offset-4 transition-colors hover:text-text-secondary hover:underline"
        >
          Seguir el proyecto
        </motion.a>
      </motion.div>
    </section>
  );
}
