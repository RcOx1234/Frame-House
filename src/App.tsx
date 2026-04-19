import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from 'sonner';
import { Routes, Route } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import PortfolioShowcaseSection from './sections/PortfolioShowcaseSection';
import ProcessSection from './sections/ProcessSection';
import MetricsSection from './sections/MetricsSection';
import PlansSection from './sections/PlansSection';
import PortfolioSection from './sections/PortfolioSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';
import MenuOverlay from './components/MenuOverlay';
import PlanPersonalizado from './components/PlanPersonalizado';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Página principal (todo tu código original)
function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const toggleScrollTop = () => {
      const servicesSection = document.getElementById('services');
      const threshold = servicesSection?.offsetTop ?? window.innerHeight * 0.8;
      setShowScrollTop(window.scrollY >= threshold);
    };

    toggleScrollTop();
    window.addEventListener('scroll', toggleScrollTop, { passive: true });

    return () => window.removeEventListener('scroll', toggleScrollTop);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-charcoal min-h-screen">
      <div className="grain-overlay" />

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#0B0D10',
            border: '1px solid rgba(209, 44, 59, 0.35)',
            color: '#F3F1EA'
          }
        }}
      />

      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="relative">
        <HeroSection onMenuOpen={() => setMenuOpen(true)} />
        <div id="services">
          <ServicesSection />
        </div>
        <PortfolioShowcaseSection />
        <div id="process">
          <ProcessSection />
        </div>
        <MetricsSection />
        <div id="plans">
          <PlansSection />
        </div>
        <PortfolioSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <button
        onClick={scrollToTop}
        aria-label="Volver arriba"
        className={`fixed bottom-6 right-5 md:bottom-8 md:right-8 z-[90] w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/20 bg-[#0B0D10]/85 backdrop-blur text-off-white hover:text-[#FF4D5C] hover:border-[#D12C3B]/55 transition-all duration-500 ease-out flex items-center justify-center ${
          showScrollTop
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}

// App con rutas
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/plan-personalizado" element={<PlanPersonalizado />} />
    </Routes>
  );
}

export default App;