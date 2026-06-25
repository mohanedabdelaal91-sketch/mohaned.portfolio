import Navbar from '@/components/Navbar';
import ScrollProgress from '@/components/ScrollProgress';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import WhoAmI from '@/sections/WhoAmI';
import Skills from '@/sections/Skills';
import Projects from '@/sections/Projects';
import Clients from '@/sections/Clients';
import Contact from '@/sections/Contact';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <Navbar />
      <ScrollProgress />

      <main>
        <Hero />
        <About />
        <WhoAmI />
        <Skills />
        <Projects />
        <Clients />
        <Contact />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
