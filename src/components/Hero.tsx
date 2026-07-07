"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowIcon,
  BirdIcon,
  ChevronDownIcon,
  CommunityIcon,
  HabitatIcon,
} from "@/components/icons";

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

const navLinks = [
  { label: "Proyecto", href: "#proyecto" },
  { label: "Especies", href: "#especies" },
  { label: "Impacto", href: "#impacto" },
  { label: "Cómo ayudar", href: "#ayudar" },
];

const pilares = [
  {
    icon: BirdIcon,
    title: "Especies endémicas",
    description: "Monitoreo, cuidado y conservación de aves únicas de Cuba.",
  },
  {
    icon: HabitatIcon,
    title: "Hábitats clave",
    description:
      "Protección de bosques, humedales y zonas de refugio y anidación.",
  },
  {
    icon: CommunityIcon,
    title: "Educación y comunidad",
    description:
      "Acciones para sensibilizar, conectar y movilizar a personas y aliados.",
  },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const copyOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -12]);

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: reduce ? 0 : 0.15 },
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

  const pillarsContainer: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: reduce ? 0 : 0.05 },
    },
  };

  const pillarItem: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.3 : 0.65, ease: EASE_REVEAL },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden bg-bg-forest"
    >
      {/* Capa de fondo atmosférico */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          y: reduce ? 0 : bgY,
          background:
            "radial-gradient(120% 90% at 82% 30%, rgba(11,39,68,0.9) 0%, rgba(7,23,38,1) 55%), linear-gradient(90deg, rgba(7,23,38,0.95) 0%, rgba(7,23,38,0.55) 45%, rgba(7,23,38,0) 75%)",
        }}
      />

      <div className="mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-6 pb-12 pt-7 md:px-10 md:pt-8 lg:px-[72px]">
        {/* Header / navegación */}
        <motion.header
          initial={{ opacity: 0, y: reduce ? 0 : -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: EASE_REVEAL }}
          className="flex items-center justify-between gap-6"
        >
          <a href="#" className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-semibold tracking-tight text-text-primary">
              ARA
            </span>
          </a>

          <div className="flex items-center gap-8">
            <nav className="hidden items-center gap-8 lg:flex">
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

            <a
              href="#ayudar"
              className="rounded-full bg-ara-red px-5 py-2.5 text-sm font-medium text-text-primary shadow-[0_8px_24px_-8px_rgba(216,58,46,0.55)] transition-all duration-200 hover:brightness-110"
            >
              Apoyar ahora
            </a>
          </div>
        </motion.header>

        {/* Cuerpo del hero */}
        <div className="grid flex-1 grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-0">
          {/* Columna editorial izquierda */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            style={{ opacity: reduce ? 1 : copyOpacity, y: reduce ? 0 : copyY }}
            className="lg:col-span-7"
          >
            <motion.p
              variants={fadeUp}
              className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ara-gold-bright"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ara-gold-bright" />
              Conservación de aves endémicas de Cuba
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="max-w-[11ch] font-serif text-[42px] font-semibold leading-[0.98] text-text-primary sm:text-[56px] lg:text-[80px] xl:text-[88px]"
            >
              Protegemos las aves que solo existen en Cuba.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-[600px] text-lg leading-relaxed text-text-secondary sm:text-xl"
            >
              ARA impulsa acciones de cuidado, educación y conservación para
              proteger especies endémicas cubanas y los ecosistemas que hacen
              posible su supervivencia.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <a
                href="#proyecto"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ara-red px-7 py-3.5 text-[15px] font-medium text-text-primary shadow-[0_10px_30px_-10px_rgba(216,58,46,0.6)] transition-all duration-200 hover:brightness-110"
              >
                Conoce el proyecto
                <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <a
                href="#ayudar"
                className="inline-flex items-center justify-center rounded-full border border-border-soft bg-white/[0.02] px-7 py-3.5 text-[15px] font-medium text-text-primary backdrop-blur-sm transition-all duration-200 hover:border-text-secondary/40 hover:bg-white/[0.05]"
              >
                Cómo ayudar
              </a>
            </motion.div>

            <motion.div
              variants={pillarsContainer}
              className="mt-14 grid grid-cols-1 gap-4 rounded-3xl border border-border-soft bg-[rgba(10,24,40,0.42)] p-6 backdrop-blur-sm sm:grid-cols-3 sm:gap-6"
            >
              {pilares.map((pilar) => (
                <motion.div key={pilar.title} variants={pillarItem}>
                  <pilar.icon className="mb-3 h-6 w-6 text-ara-gold-bright" />
                  <h3 className="text-[15px] font-semibold text-text-primary">
                    {pilar.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-tertiary">
                    {pilar.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Columna visual derecha */}
          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : 34, scale: reduce ? 1 : 1.05 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: reduce ? 0.4 : 1.4, delay: 0.3, ease: EASE_REVEAL }}
            style={{ y: reduce ? 0 : visualY }}
            className="lg:col-span-5"
          >
            <motion.div
              animate={reduce ? undefined : { scale: [1, 1.035, 1] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 26, repeat: Infinity, ease: "linear" }
              }
              className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-dashed border-border-soft sm:aspect-[3/4] lg:aspect-[4/5]"
              style={{
                background:
                  "radial-gradient(120% 100% at 70% 20%, rgba(224,169,43,0.16) 0%, rgba(11,39,68,0.4) 45%, rgba(7,23,38,0.95) 80%), linear-gradient(160deg, #112a22 0%, #0b2744 55%, #071726 100%)",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-8 text-center">
                <span className="text-xs uppercase tracking-[0.14em] text-text-disabled">
                  HERO-IMG-01
                </span>
                <span className="max-w-[24ch] text-sm text-text-tertiary">
                  Tocororo hero dark — reemplazar con foto editorial final
                </span>
              </div>
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-bg-forest/70 via-transparent to-transparent"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-6 flex justify-center lg:justify-start"
        >
          <a
            href="#retos"
            className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.14em] text-text-tertiary transition-colors hover:text-text-secondary"
          >
            Descubre por qué es urgente actuar
            <motion.span
              animate={reduce ? undefined : { y: [0, 6, 0] }}
              transition={
                reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <ChevronDownIcon className="h-4 w-4" />
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
