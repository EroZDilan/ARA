"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import PillNav from "@/components/reactbits/PillNav";
import StaggeredMenu from "@/components/reactbits/StaggeredMenu";

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

const navLinks = [
  { label: "Proyecto", href: "#proyecto" },
  { label: "Especies", href: "#especies" },
  { label: "Impacto", href: "#impacto" },
  { label: "Cómo ayudar", href: "#ayudar" },
];

export default function SiteNav() {
  const reduce = useReducedMotion();
  const [activeHref, setActiveHref] = useState<string>("");
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Hide the nav while scrolling down, reveal it again on any upward scroll,
  // and always keep it visible near the top of the page.
  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        if (y < 80) {
          setHidden(false);
        } else if (delta > 4) {
          setHidden(true);
        } else if (delta < -4) {
          setHidden(false);
        }

        lastY.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const effectiveHidden = hidden && !mobileMenuOpen;

  return (
    <>
      <motion.div
        animate={{ y: effectiveHidden ? "-130%" : "0%" }}
        transition={{ duration: reduce ? 0.15 : 0.4, ease: EASE_REVEAL }}
        className="fixed inset-x-0 top-0 z-50 hidden px-6 py-5 md:block md:px-10 lg:px-[72px]"
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <PillNav
            logoText="ARA"
            homeHref="#"
            items={navLinks}
            activeHref={activeHref}
            baseColor="#0E2F57"
            pillColor="rgba(245,241,232,0.05)"
            pillTextColor="#C9D1D9"
            hoveredPillTextColor="#F5F1E8"
          />
          <a
            href="#ayudar"
            className="rounded-full bg-ara-red px-5 py-2.5 text-sm font-medium text-text-primary shadow-[0_8px_24px_-8px_rgba(216,58,46,0.55)] transition-all duration-200 hover:brightness-110"
          >
            Apoyar ahora
          </a>
        </div>
      </motion.div>

      <div
        className="md:hidden"
        style={{
          opacity: effectiveHidden ? 0 : 1,
          pointerEvents: effectiveHidden ? "none" : "auto",
          transition: `opacity ${reduce ? 150 : 300}ms ease`,
        }}
      >
        <StaggeredMenu
          isFixed
          position="right"
          items={navLinks.map((link) => ({
            label: link.label,
            ariaLabel: link.label,
            link: link.href,
          }))}
          socialItems={[]}
          displaySocials={false}
          displayItemNumbering
          logoText="ARA"
          colors={["#0E2F57", "#081B33"]}
          accentColor="#F2B631"
          menuButtonColor="#F5F1E8"
          openMenuButtonColor="#F5F1E8"
          onMenuOpen={() => setMobileMenuOpen(true)}
          onMenuClose={() => setMobileMenuOpen(false)}
        />
      </div>
    </>
  );
}
