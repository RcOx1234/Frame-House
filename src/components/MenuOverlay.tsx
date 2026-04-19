import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { LucideIcon } from 'lucide-react';
import { Briefcase, Film, Images, Layers, ListOrdered, Phone, X } from 'lucide-react';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: 'Servicios', href: '#services', Icon: Briefcase },
  { label: 'Portafolio', href: '#portfolio-spotlight', Icon: Images },
  { label: 'Proceso', href: '#process', Icon: ListOrdered },
  { label: 'Planes', href: '#plans', Icon: Layers },
  { label: 'Trabajos', href: '#portfolio', Icon: Film },
  { label: 'Contacto', href: '#contact', Icon: Phone },
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
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });

      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.2 },
      );

      gsap.fromTo(
        closeBtn,
        { opacity: 0, rotate: -90 },
        { opacity: 1, rotate: 0, duration: 0.4, ease: 'power2.out', delay: 0.3 },
      );
    } else {
      gsap.to(items, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
      });

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        delay: 0.2,
      });
    }
  }, [isOpen]);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();

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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto bg-[#0B0D10]/98 px-4 py-24 opacity-0 backdrop-blur-xl md:justify-center md:py-16"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#D12C3B]/25 md:right-8 md:top-8 md:h-12 md:w-12"
      >
        <X className="h-5 w-5 text-off-white md:h-6 md:w-6" />
      </button>

      <nav className="flex w-full max-w-5xl flex-col items-center gap-6 max-md:gap-8 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5">
        {menuItems.map((item, index) => {
          const Icon = item.Icon;
          return (
            <a
              key={item.label}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              href={item.href}
              onClick={(e) => handleItemClick(e, item.href)}
              className="group opacity-0 transition-colors max-md:font-heading max-md:text-3xl max-md:font-bold max-md:tracking-wider max-md:text-off-white max-md:hover:text-[#FF4D5C] md:flex md:w-full md:flex-col md:items-center md:gap-3 md:rounded-2xl md:border md:border-white/15 md:bg-white/[0.06] md:px-5 md:py-7 md:text-center md:backdrop-blur-md md:hover:border-[#D12C3B]/45 md:hover:bg-white/[0.1]"
            >
              <Icon className="hidden h-8 w-8 shrink-0 text-[#E85A66] transition-transform duration-300 group-hover:scale-105 md:block md:h-9 md:w-9" />
              <span className="font-heading font-bold tracking-wide text-off-white max-md:group-hover:text-[#FF4D5C] md:text-lg md:text-off-white md:group-hover:text-[#FF4D5C] lg:text-xl">
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="mt-10 max-md:absolute max-md:bottom-8 md:mt-12">
        <a
          href="mailto:hello@framehouse.studio"
          className="label-mono text-xs text-muted-warm transition-colors hover:text-[#FF4D5C] md:text-sm"
        >
          hello@framehouse.studio
        </a>
      </div>
    </div>
  );
}
