import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: 'Servicios', href: '#services' },
  { label: 'Proceso', href: '#process' },
  { label: 'Planes', href: '#plans' },
  { label: 'Trabajos', href: '#portfolio' },
  { label: 'Contacto', href: '#contact' }
];

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const items = itemsRef.current.filter(Boolean);
    const closeBtn = closeRef.current;

    if (!overlay || !closeBtn) return;

    if (isOpen) {
      // Open animation
      gsap.fromTo(overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );

      gsap.fromTo(items,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
      );

      gsap.fromTo(closeBtn,
        { opacity: 0, rotate: -90 },
        { opacity: 1, rotate: 0, duration: 0.4, ease: 'power2.out', delay: 0.3 }
      );
    } else {
      // Close animation
      gsap.to(items, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in'
      });

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        delay: 0.2
      });
    }
  }, [isOpen]);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    
    // Smooth scroll to section after menu closes
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-[#0B0D10]/98 backdrop-blur-xl z-[100] flex flex-col items-center justify-center opacity-0"
    >
      {/* Close Button */}
      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-burnt-orange/20 transition-colors"
      >
        <X className="w-5 h-5 md:w-6 md:h-6 text-off-white" />
      </button>

      {/* Menu Items */}
      <nav className="flex flex-col items-center gap-6 md:gap-8">
        {menuItems.map((item, index) => (
          <a
            key={item.label}
            ref={el => { itemsRef.current[index] = el; }}
            href={item.href}
            onClick={(e) => handleItemClick(e, item.href)}
            className="font-heading font-bold text-3xl md:text-6xl text-off-white hover:text-burnt-orange transition-colors tracking-wider opacity-0"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <div className="absolute bottom-8 md:bottom-12">
        <a 
          href="mailto:hello@framehouse.studio"
          className="label-mono text-muted-warm hover:text-burnt-orange transition-colors text-xs md:text-sm"
        >
          hello@framehouse.studio
        </a>
      </div>
    </div>
  );
}
