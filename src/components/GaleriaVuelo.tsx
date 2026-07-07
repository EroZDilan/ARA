"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

const capitulos = [
  {
    id: "GAL-IMG-01",
    categoria: "Especie",
    titulo: "Tocororo",
    src: "/images/gallery/tocororo.jpg",
  },
  {
    id: "GAL-IMG-02",
    categoria: "Especie",
    titulo: "Zunzún",
    src: "/images/gallery/zunzun.jpg",
  },
  {
    id: "GAL-IMG-03",
    categoria: "Especie",
    titulo: "Cartacuba",
    src: "/images/gallery/cartacuba.jpg",
  },
  {
    id: "GAL-IMG-04",
    categoria: "Hábitat",
    titulo: "Bosque húmedo",
    src: "/images/gallery/bosque.jpg",
  },
  {
    id: "GAL-IMG-05",
    categoria: "Hábitat",
    titulo: "Humedal costero",
    src: "/images/gallery/humedal.jpg",
  },
  {
    id: "GAL-IMG-06",
    categoria: "Proyecto",
    titulo: "Monitoreo en campo",
    src: "/images/gallery/birdwatcher.jpg",
  },
  {
    id: "GAL-IMG-07",
    categoria: "Proyecto",
    titulo: "Observación y cuidado",
    src: "/images/gallery/observacion.jpg",
  },
];

const N = capitulos.length;
const STEP = 1 / N;

function clampRange(values: number[]): number[] {
  return values.map((v) => Math.min(1, Math.max(0, v)));
}

// Ruta de vuelo: N+1 puntos clave (uno por límite de capítulo) en zigzag.
const FLIGHT_T = Array.from({ length: N + 1 }, (_, i) => i / N);
const FLIGHT_X = [-18, 16, -12, 20, -16, 12, -15, 20];
const FLIGHT_Y = [6, -10, 9, -12, 11, -8, 8, -12];
const FLIGHT_ROTATE = [-7, 6, -9, 7, -10, 6, -8, 9];
const FLIGHT_SCALE = [0.85, 1.05, 0.88, 1.15, 0.88, 1.05, 0.9, 1.12];

function ChapterBackground({
  progress,
  index,
  src,
  alt,
}: {
  progress: MotionValue<number>;
  index: number;
  src: string;
  alt: string;
}) {
  const center = (index + 0.5) * STEP;
  const bounds = clampRange([
    center - STEP * 0.55,
    center - STEP * 0.25,
    center + STEP * 0.25,
    center + STEP * 0.55,
  ]);
  const opacity = useTransform(progress, bounds, [0, 1, 1, 0]);
  const scale = useTransform(
    progress,
    clampRange([center - STEP * 0.55, center + STEP * 0.55]),
    [1.06, 1.12],
  );

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          priority={index === 0}
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

function ChapterCaption({
  progress,
  index,
  categoria,
  titulo,
  id,
}: {
  progress: MotionValue<number>;
  index: number;
  categoria: string;
  titulo: string;
  id: string;
}) {
  const center = (index + 0.5) * STEP;
  const bounds = clampRange([
    center - STEP * 0.55,
    center - STEP * 0.25,
    center + STEP * 0.25,
    center + STEP * 0.55,
  ]);
  const opacity = useTransform(progress, bounds, [0, 1, 1, 0]);
  const y = useTransform(progress, bounds, [24, 0, 0, -24]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 bottom-[14%] flex flex-col items-center text-center px-6"
    >
      <span className="text-xs uppercase tracking-[0.14em] text-white/40">
        {id}
      </span>
      <span className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-ara-gold-bright">
        {categoria}
      </span>
      <p className="mt-2 font-serif text-3xl font-medium text-white sm:text-4xl">
        {titulo}
      </p>
    </motion.div>
  );
}

function ChapterDot({
  progress,
  index,
}: {
  progress: MotionValue<number>;
  index: number;
}) {
  const center = (index + 0.5) * STEP;
  const bounds = clampRange([
    center - STEP,
    center - STEP * 0.4,
    center + STEP * 0.4,
    center + STEP,
  ]);
  const activeWidth = useTransform(progress, bounds, [8, 28, 28, 8]);
  const activeOpacity = useTransform(progress, bounds, [0.35, 1, 1, 0.35]);

  return (
    <motion.span
      style={{ width: activeWidth, opacity: activeOpacity }}
      className="h-[3px] rounded-full bg-ara-gold-bright"
    />
  );
}

export default function GaleriaVuelo() {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const birdX = useTransform(scrollYProgress, FLIGHT_T, FLIGHT_X.map((v) => `${v}vw`));
  const birdY = useTransform(scrollYProgress, FLIGHT_T, FLIGHT_Y.map((v) => `${v}vh`));
  const birdRotate = useTransform(scrollYProgress, FLIGHT_T, FLIGHT_ROTATE);
  const birdScale = useTransform(scrollYProgress, FLIGHT_T, FLIGHT_SCALE);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: reduce ? 0 : 0.05 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: reduce ? 0 : 22, filter: reduce ? "none" : "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0.3 : 0.85, ease: EASE_REVEAL },
    },
  };

  return (
    <>
      <section
        id="especies"
        className="relative bg-[#081521] px-6 pt-24 md:px-10 md:pt-32 lg:px-[72px] lg:pt-40"
      >
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-[720px]"
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
            de una misma red de cuidado. Sigue el vuelo del tocororo mientras
            haces scroll para recorrerlos.
          </motion.p>
        </motion.div>
      </section>

      <section
        ref={wrapperRef}
        style={{ height: `${N * 100}vh` }}
        className="relative bg-[#081521]"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {capitulos.map((cap, i) => (
            <ChapterBackground
              key={cap.id}
              progress={scrollYProgress}
              index={i}
              src={cap.src}
              alt={`${cap.categoria}: ${cap.titulo}`}
            />
          ))}

          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/15 to-black/75"
          />

          {/* Ave voladora 2.5D */}
          <motion.div
            style={{
              x: reduce ? 0 : birdX,
              y: reduce ? 0 : birdY,
              rotate: reduce ? 0 : birdRotate,
              scale: reduce ? 1 : birdScale,
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[300px] w-[195px] -translate-x-1/2 -translate-y-1/2 sm:h-[370px] sm:w-[240px] lg:h-[460px] lg:w-[300px]"
          >
            <motion.div
              animate={
                reduce
                  ? undefined
                  : { y: [0, -10, 0, 6, 0], rotate: [0, 2, 0, -2, 0] }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
              }
              className="relative h-full w-full"
              style={{
                filter:
                  "drop-shadow(0 25px 35px rgba(0,0,0,0.5)) drop-shadow(0 0 40px rgba(224,169,43,0.12))",
              }}
            >
              <Image
                src="/images/gallery/tocororo-flying.png"
                alt="Tocororo en vuelo"
                fill
                sizes="(max-width: 640px) 195px, (max-width: 1024px) 240px, 300px"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>

          {capitulos.map((cap, i) => (
            <ChapterCaption
              key={cap.id}
              progress={scrollYProgress}
              index={i}
              categoria={cap.categoria}
              titulo={cap.titulo}
              id={cap.id}
            />
          ))}

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {capitulos.map((cap, i) => (
              <ChapterDot key={cap.id} progress={scrollYProgress} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-[#081521] px-6 pb-24 pt-16 md:px-10 md:pb-32 lg:px-[72px] lg:pb-40">
        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE_REVEAL }}
          className="mx-auto max-w-[680px] text-lg leading-relaxed text-text-secondary"
        >
          Conservar no es solo evitar una pérdida: es sostener la posibilidad
          de que estas especies, estos paisajes y estas relaciones sigan
          existiendo.
        </motion.p>
      </section>
    </>
  );
}
