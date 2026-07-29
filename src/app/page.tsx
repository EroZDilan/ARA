import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import Retos from "@/components/Retos";
import Proteccion from "@/components/Proteccion";
import Impacto from "@/components/Impacto";
import About from "@/components/About";
import Galeria from "@/components/Galeria";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import SectionIndicator from "@/components/SectionIndicator";
import GuacamayoScene from "@/components/GuacamayoScene";

export default function Home() {
  return (
    <>
      <GuacamayoScene />
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
