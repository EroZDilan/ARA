import Hero from "@/components/Hero";
import Retos from "@/components/Retos";
import Proteccion from "@/components/Proteccion";
import About from "@/components/About";
import Galeria from "@/components/Galeria";
import CTAFinal from "@/components/CTAFinal";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Retos />
      <Proteccion />
      <About />
      <Galeria />
      <CTAFinal />
    </main>
  );
}
