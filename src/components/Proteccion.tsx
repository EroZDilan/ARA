"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { BirdIcon, BookIcon, HabitatIcon, NetworkIcon } from "@/components/icons";

const GuacamayoVolador = dynamic(
  () => import("@/components/GuacamayoVolador"),
  { ssr: false },
);

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

const pilares = [
  {
    icon: BirdIcon,
    title: "Conservación de especies",
    description:
      "Seguimiento, cuidado y acciones enfocadas en aves endémicas con necesidades de protección específicas.",
  },
  {
    icon: HabitatIcon,
    title: "Protección de hábitats",
    description:
      "Defensa de bosques, humedales y zonas clave para refugio, alimentación y reproducción.",
  },
  {
    icon: BookIcon,
    title: "Educación y sensibilización",
    description:
      "Programas, contenidos y acciones para acercar la conservación a escuelas, comunidades y nuevos aliados.",
  },
  {
    icon: NetworkIcon,
    title: "Colaboración y seguimiento",
    description:
      "Trabajo con personas, instituciones y redes que permiten sostener la conservación en el tiempo.",
  },
];

export default function Proteccion() {
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

  const pillarsContainer: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.1 },
    },
  };

  const pillarItem: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.3 : 0.7, ease: EASE_REVEAL },
    },
  };

  return (
    <section
      id="proyecto"
      className="relative bg-bg-habitat px-6 py-24 md:px-10 md:py-32 lg:px-[72px] lg:py-40"
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
            Cómo actúa ARA
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-[36px] font-semibold leading-[1.05] text-text-primary sm:text-[44px] lg:text-[52px]"
          >
            Protección integral para aves y hábitats
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[620px] text-lg leading-relaxed text-text-secondary"
          >
            Trabajamos desde una mirada integral que combina cuidado de
            especies, protección de hábitats, educación ambiental y
            colaboración con personas e instituciones para sostener la
            conservación en el tiempo.
          </motion.p>
        </motion.div>

        {/* Bloque central: imagen + texto */}
        <div className="relative mt-16 grid grid-cols-1 items-center gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          {/* El guacamayo llega y se posa entre la imagen y el texto */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduce ? 0.3 : 0.8, delay: reduce ? 0 : 0.2 }}
            className="pointer-events-none absolute left-[52%] top-[40%] z-10 hidden h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <GuacamayoVolador
              className="h-full w-full"
              modelPath="/models/scourger.glb"
              clipName="Idle"
              fov={30}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : -24, scale: reduce ? 1 : 1.04 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduce ? 0.3 : 1.1, ease: EASE_REVEAL }}
            className="lg:col-span-7"
          >
            <div
              className="relative flex aspect-[16/11] w-full items-center justify-center overflow-hidden rounded-[32px] border border-dashed border-border-soft"
              style={{
                background:
                  "linear-gradient(150deg, #112a22 0%, #0b2744 55%, #071726 100%)",
              }}
            >
              <div className="flex flex-col items-center gap-2 p-8 text-center">
                <span className="text-xs uppercase tracking-[0.14em] text-text-disabled">
                  PROT-IMG-01
                </span>
                <span className="max-w-[28ch] text-sm text-text-tertiary">
                  Conservación en acción — trabajo de campo, observación y
                  cuidado del territorio
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : 24, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduce ? 0.3 : 0.95, ease: EASE_REVEAL }}
            className="lg:col-span-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-state-edu">
              Nuestra forma de cuidar
            </p>
            <p className="mt-4 font-serif text-2xl font-medium leading-snug text-text-primary sm:text-[28px]">
              Conservar una especie también implica proteger el lugar donde
              vive, entender sus amenazas y construir redes que hagan posible
              su cuidado a largo plazo.
            </p>
            <p className="mt-6 leading-relaxed text-text-secondary">
              En ARA desarrollamos acciones que conectan la observación y el
              seguimiento de aves con el cuidado de los ecosistemas que
              necesitan para vivir.
            </p>
            <p className="mt-4 leading-relaxed text-text-secondary">
              Esa mirada une conservación, educación y trabajo colaborativo
              para que la protección no sea puntual, sino sostenida y
              compartida.
            </p>
          </motion.div>
        </div>

        {/* Pilares de acción */}
        <motion.div
          variants={pillarsContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-6"
        >
          {pilares.map((pilar) => (
            <motion.div
              key={pilar.title}
              variants={pillarItem}
              className="group rounded-[26px] border border-border-soft bg-[rgba(13,33,52,0.65)] p-7 transition-all duration-300 hover:bg-[rgba(13,33,52,0.85)]"
            >
              <pilar.icon className="mb-4 h-6 w-6 text-ara-gold-bright transition-transform duration-300 group-hover:scale-110" />
              <h3 className="text-lg font-semibold text-text-primary">
                {pilar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
                {pilar.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
