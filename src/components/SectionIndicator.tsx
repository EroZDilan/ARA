"use client";

import { useEffect, useState } from "react";
import LineSidebar from "@/components/reactbits/LineSidebar";

const sections = [
  { id: "retos", label: "Retos" },
  { id: "proyecto", label: "Proyecto" },
  { id: "impacto", label: "Impacto" },
  { id: "equipo", label: "Equipo" },
  { id: "especies", label: "Especies" },
  { id: "ayudar", label: "Ayudar" },
];

export default function SectionIndicator() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const els = sections
      .map((s, i) => ({ i, el: document.getElementById(s.id) }))
      .filter((s): s is { i: number; el: HTMLElement } => s.el !== null);

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = els.find((s) => s.el === entry.target);
            if (match) setActiveIndex(match.i);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    els.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <LineSidebar
        items={sections.map((s) => s.label)}
        activeIndex={activeIndex}
        showIndex
        showMarker
        fontSize={0.78}
        itemGap={14}
        markerLength={22}
        proximityRadius={70}
        maxShift={6}
        onItemClick={(index) => {
          document.getElementById(sections[index].id)?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}
