"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import TiltCard from "@/components/TiltCard";

const AveInteractiva3D = dynamic(
  () => import("@/components/AveInteractiva3D"),
  { ssr: false },
);

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

const piezas = [
  {
    id: "GAL-IMG-01",
    categoria: "Especie",
    titulo: "Tocororo",
    src: "/images/gallery/tocororo.jpg",
    span: "col-span-2 row-span-2",
  },
  {
    id: "GAL-IMG-04",
    categoria: "Hábitat",
    titulo: "Bosque húmedo",
    src: "/images/gallery/bosque.jpg",
    span: "col-span-2 row-span-1",
  },
  {
    id: "GAL-IMG-02",
    categoria: "Especie",
    titulo: "Zunzún",
    src: "/images/gallery/zunzun.jpg",
    span: "col-span-1 row-span-1",
  },
  {
    id: "GAL-IMG-06",
    categoria: "Proyecto",
    titulo: "Monitoreo en campo",
    src: "/images/gallery/birdwatcher.jpg",
    span: "col-span-1 row-span-1",
  },
  {
    id: "GAL-IMG-03",
    categoria: "Especie",
    titulo: "Cartacuba",
    src: "/images/gallery/cartacuba.jpg",
    span: "col-span-1 sm:col-span-2 lg:col-span-1 row-span-2",
  },
  {
    id: "GAL-IMG-05",
    categoria: "Hábitat",
    titulo: "Humedal costero",
    src: "/images/gallery/humedal.jpg",
    span: "col-span-1 row-span-1",
  },
  {
    id: "GAL-IMG-07",
    categoria: "Proyecto",
    titulo: "Observación y cuidado",
    src: "/images/gallery/observacion.jpg",
    span: "col-span-2 row-span-1",
  },
];

export default function Galeria() {
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

  const gridContainer: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.09 },
    },
  };

  const tileItem: Variants = {
    hidden: {
      opacity: 0,
      y: reduce ? 0 : 28,
      scale: reduce ? 1 : 0.985,
      filter: reduce ? "none" : "blur(10px)",
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0.3 : 0.85, ease: EASE_REVEAL },
    },
  };

  return (
    <section
      id="especies"
      className="relative overflow-hidden bg-[#081521] px-6 py-24 md:px-10 md:py-32 lg:px-[72px] lg:py-40"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="max-w-[720px] lg:col-span-7"
          >
            <motion.p
              variants={fadeUp}
              className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ara-gold-bright"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ara-gold-bright" />
              Aves, hábitats y trabajo en marcha
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="font-serif text-[36px] font-semibold leading-[1.05] text-text-primary sm:text-[44px] lg:text-[52px]"
            >
              Una galería del territorio que buscamos proteger
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-[640px] text-lg leading-relaxed text-text-secondary"
            >
              Cada ave, cada paisaje y cada proceso de observación forman parte
              de una misma red de cuidado. Esta galería reúne especies,
              hábitats y momentos del proyecto para mostrar el mundo que ARA
              trabaja por proteger.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0.3 : 0.9, ease: EASE_REVEAL }}
            className="relative lg:col-span-5"
          >
            <div className="relative mx-auto h-[220px] w-full max-w-[320px] sm:h-[280px] lg:h-[340px]">
              <AveInteractiva3D className="h-full w-full" />
            </div>
            <p className="mt-2 text-center text-xs uppercase tracking-[0.14em] text-text-disabled">
              Arrastra para girar al tocororo
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 grid auto-rows-[160px] grid-cols-2 gap-4 sm:grid-cols-2 sm:auto-rows-[190px] lg:mt-20 lg:grid-cols-4 lg:auto-rows-[220px] lg:gap-5"
          style={{ perspective: 1200 }}
        >
          {piezas.map((pieza) => (
            <motion.figure
              key={pieza.id}
              variants={tileItem}
              className={`relative ${pieza.span}`}
            >
              <TiltCard className="group relative h-full w-full overflow-hidden rounded-[22px] border border-border-soft">
                <Image
                  src={pieza.src}
                  alt={`${pieza.categoria}: ${pieza.titulo}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5 transition-opacity duration-400 group-hover:from-black/60"
                />
                <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.12em] text-white/50">
                  {pieza.id}
                </span>
                <figcaption className="absolute inset-x-4 bottom-4 translate-y-1 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ara-gold-bright">
                    {pieza.categoria}
                  </span>
                  <p className="text-[15px] font-medium text-white">
                    {pieza.titulo}
                  </p>
                </figcaption>
              </TiltCard>
            </motion.figure>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE_REVEAL }}
          className="mt-16 max-w-[680px] text-lg leading-relaxed text-text-secondary lg:mt-20"
        >
          Conservar no es solo evitar una pérdida: es sostener la posibilidad
          de que estas especies, estos paisajes y estas relaciones sigan
          existiendo.
        </motion.p>
      </div>
    </section>
  );
}
