import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import Retos from "@/components/Retos";
import Proteccion from "@/components/Proteccion";
import Impacto from "@/components/Impacto";
import About from "@/components/About";
import Galeria from "@/components/Galeria";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import Noise from "@/components/reactbits/Noise";
import SectionIndicator from "@/components/SectionIndicator";

export default function Home() {
  return (
    <>
      <Noise />
      <SiteNav />
      <SectionIndicator />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Retos />
        <Proteccion />
        <Impacto />
        <About />
        <Galeria />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
