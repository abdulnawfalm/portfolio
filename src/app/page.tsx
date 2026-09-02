import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Tools from "@/components/Tools";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <Hero />
      <Work />
      <About />
      <Experience />
      <Tools />
      <Contact />
      <Footer />
    </div>
  );
}