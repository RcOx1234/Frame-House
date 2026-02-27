import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from 'sonner';
import { Routes, Route } from 'react-router-dom';

import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
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

  useEffect(() => {
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.05 && value <= r.end + 0.05
            );
            
            if (!inPinned) return value;

            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );

            const distance = Math.abs(target - value);
            if (distance > 0.15) return value;

            return target;
          },
          duration: { min: 0.15, max: 0.4 },
          delay: 0,
          ease: 'power2.out'
        }
      });
    }, 800);

    return () => {
      clearTimeout(timer);
    };
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

  return (
    <div className="relative bg-charcoal min-h-screen">
      <div className="grain-overlay" />

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#0B0D10',
            border: '1px solid rgba(184, 92, 56, 0.3)',
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