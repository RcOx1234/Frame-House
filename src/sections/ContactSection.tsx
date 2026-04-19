import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineMobileRef = useRef<HTMLDivElement>(null);
  const headlineDesktopRef = useRef<HTMLDivElement>(null);
  const formMobileRef = useRef<HTMLDivElement>(null);
  const formDesktopRef = useRef<HTMLDivElement>(null);
  const detailsMobileRef = useRef<HTMLDivElement>(null);
  const detailsDesktopRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mensaje enviado. Te contactaremos en 24h.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const animBlock = (
      headline: HTMLDivElement,
      formCard: HTMLDivElement,
      details: HTMLDivElement,
    ) => {
      gsap.fromTo(
        headline,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 60%', scrub: 1 },
        },
      );
      gsap.fromTo(
        formCard,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 55%', scrub: 1 },
        },
      );
      gsap.fromTo(
        details,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%', end: 'top 50%', scrub: 1 },
        },
      );
    };

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const h = headlineDesktopRef.current;
      const f = formDesktopRef.current;
      const d = detailsDesktopRef.current;
      if (!h || !f || !d) return () => {};
      const ctx = gsap.context(() => {
        animBlock(h, f, d);
        gsap.fromTo(
          bg,
          { y: 0 },
          {
            y: '-4vh',
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 2 },
          },
        );
      }, section);
      return () => ctx.revert();
    });

    mm.add('(max-width: 767px)', () => {
      const h = headlineMobileRef.current;
      const f = formMobileRef.current;
      const d = detailsMobileRef.current;
      if (!h || !f || !d) return () => {};
      const ctx = gsap.context(() => {
        animBlock(h, f, d);
        gsap.fromTo(
          bg,
          { y: 0 },
          {
            y: '-4vh',
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 2 },
          },
        );
      }, section);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-flowing relative z-80 flex min-h-[100dvh] flex-col overflow-x-hidden bg-charcoal"
    >
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/contact-background.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D10]/80 via-[#0B0D10]/90 to-[#0B0D10]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 py-12 md:px-[7vw] md:py-[10vh]">
        <div className="flex flex-1 flex-col gap-6 md:hidden">
          <div ref={headlineMobileRef}>
            <h2 className="headline-xl mb-3 text-3xl text-off-white">VAMOS A FILMAR.</h2>
            <p className="text-base text-muted-warm">
              Cuéntanos qué estás construyendo. Respondemos dentro de un día hábil.
            </p>
          </div>

          <div
            ref={formMobileRef}
            className="phone-frame shrink-0 bg-[#0B0D10]/90 p-5 backdrop-blur-xl sm:p-6"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-sm"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Empresa"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <textarea
                  placeholder="Detalles del proyecto"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[100px] w-full resize-y text-sm sm:min-h-[120px]"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary mt-1 flex w-full items-center justify-center gap-2 text-sm"
              >
                <Send className="h-4 w-4" />
                Enviar mensaje
              </button>
            </form>
          </div>

          <div ref={detailsMobileRef} className="pb-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-burnt-orange/20">
                  <Mail className="h-4 w-4 text-burnt-orange" />
                </div>
                <div>
                  <p className="label-mono mb-0.5 text-xs text-muted-warm">EMAIL</p>
                  <p className="break-all text-sm text-off-white">framehouselatam@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-burnt-orange/20">
                  <MapPin className="h-4 w-4 text-burnt-orange" />
                </div>
                <div>
                  <p className="label-mono mb-0.5 text-xs text-muted-warm">OFICINAS</p>
                  <p className="text-sm text-off-white">Manta, Ecuador</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-burnt-orange/20">
                  <Clock className="h-4 w-4 text-burnt-orange" />
                </div>
                <div>
                  <p className="label-mono mb-0.5 text-xs text-muted-warm">RESPUESTA</p>
                  <p className="text-sm text-off-white">~24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-between md:flex">
          <div ref={headlineDesktopRef} className="w-[34vw]">
            <h2 className="headline-xl mb-4 text-off-white">VAMOS A FILMAR.</h2>
            <p className="text-xl font-light text-muted-warm">
              Cuéntanos qué estás construyendo. Respondemos dentro de un día hábil.
            </p>
          </div>

          <div ref={formDesktopRef} className="phone-frame w-[30vw] bg-[#0B0D10]/90 p-8 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Empresa"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <textarea
                  placeholder="Detalles del proyecto"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="h-32 w-full resize-none"
                  required
                />
              </div>
              <button type="submit" className="btn-primary flex w-full items-center justify-center gap-2">
                <Send className="h-4 w-4" />
                Enviar mensaje
              </button>
            </form>
          </div>

          <div ref={detailsDesktopRef} className="w-[22vw]">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-burnt-orange/20">
                  <Mail className="h-5 w-5 text-burnt-orange" />
                </div>
                <div>
                  <p className="label-mono mb-1 text-muted-warm">EMAIL</p>
                  <p className="text-off-white">framehouselatam@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-burnt-orange/20">
                  <MapPin className="h-5 w-5 text-burnt-orange" />
                </div>
                <div>
                  <p className="label-mono mb-1 text-muted-warm">OFICINAS</p>
                  <p className="text-off-white">Manta, Ecuador</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-burnt-orange/20">
                  <Clock className="h-5 w-5 text-burnt-orange" />
                </div>
                <div>
                  <p className="label-mono mb-1 text-muted-warm">RESPUESTA</p>
                  <p className="text-off-white">~24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 mt-auto border-t border-white/10 bg-charcoal px-6 py-5 md:px-[7vw] md:py-6">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row md:gap-4">
          <div className="font-heading text-base font-bold tracking-wider text-off-white md:text-lg">
            FRAME HOUSE
          </div>
          <p className="text-center text-xs text-muted-warm md:text-left md:text-sm">
            © 2026 Frame House. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </section>
  );
}
