import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mensaje enviado. Te contactaremos en 24h.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const formCard = formCardRef.current;
    const details = detailsRef.current;
    const bg = bgRef.current;

    if (!section || !headline || !formCard || !details || !bg) return;

    const ctx = gsap.context(() => {
      // Headline animation
      gsap.fromTo(headline,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 1
          }
        }
      );

      // Form card animation
      gsap.fromTo(formCard,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 55%',
            scrub: 1
          }
        }
      );

      // Details animation
      gsap.fromTo(details,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 50%',
            scrub: 1
          }
        }
      );

      // Background parallax
      gsap.fromTo(bg,
        { y: 0 },
        {
          y: '-4vh',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="contact"
      className="section-flowing bg-charcoal z-80 py-16 md:py-[12vh] relative overflow-hidden"
    >
      {/* Background Image */}
      <div 
        ref={bgRef}
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/contact-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D10]/80 via-[#0B0D10]/90 to-[#0B0D10]" />
      </div>

      <div className="px-6 md:px-[7vw] relative z-10">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-8">
          {/* Headline */}
          <div ref={headlineRef}>
            <h2 className="headline-xl text-off-white mb-3 text-3xl">
              VAMOS A FILMAR.
            </h2>
            <p className="text-base text-muted-warm">
              Cuéntanos qué estás construyendo. Respondemos dentro de un día hábil.
            </p>
          </div>

          {/* Form Card */}
          <div 
            ref={formCardRef}
            className="phone-frame bg-[#0B0D10]/90 backdrop-blur-xl p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full h-28 resize-none text-sm"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                <Send className="w-4 h-4" />
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Details */}
          <div ref={detailsRef}>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-burnt-orange/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-burnt-orange" />
                </div>
                <div>
                  <p className="label-mono text-muted-warm mb-0.5 text-xs">EMAIL</p>
                  <p className="text-off-white text-sm">framehouselatam@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-burnt-orange/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-burnt-orange" />
                </div>
                <div>
                  <p className="label-mono text-muted-warm mb-0.5 text-xs">OFICINAS</p>
                  <p className="text-off-white text-sm">Manta, Ecuador</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-burnt-orange/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-burnt-orange" />
                </div>
                <div>
                  <p className="label-mono text-muted-warm mb-0.5 text-xs">RESPUESTA</p>
                  <p className="text-off-white text-sm">~24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left Headline */}
          <div 
            ref={headlineRef}
            className="w-[34vw]"
          >
            <h2 className="headline-xl text-off-white mb-4">
              VAMOS A FILMAR.
            </h2>
            <p className="text-xl text-muted-warm font-light">
              Cuéntanos qué estás construyendo. Respondemos dentro de un día hábil.
            </p>
          </div>

          {/* Center Form Card */}
          <div 
            ref={formCardRef}
            className="w-[30vw] phone-frame bg-[#0B0D10]/90 backdrop-blur-xl p-8"
          >
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
                  className="w-full h-32 resize-none"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Right Details */}
          <div 
            ref={detailsRef}
            className="w-[22vw]"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-burnt-orange/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-burnt-orange" />
                </div>
                <div>
                  <p className="label-mono text-muted-warm mb-1">EMAIL</p>
                  <p className="text-off-white">framehouselatam@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-burnt-orange/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-burnt-orange" />
                </div>
                <div>
                  <p className="label-mono text-muted-warm mb-1">OFICINAS</p>
                  <p className="text-off-white">Manta, Ecuador</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-burnt-orange/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-burnt-orange" />
                </div>
                <div>
                  <p className="label-mono text-muted-warm mb-1">RESPUESTA</p>
                  <p className="text-off-white">~24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 py-6 md:py-8 px-6 md:px-[7vw] border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-heading font-bold text-off-white text-base md:text-lg tracking-wider">
            FRAME HOUSE
          </div>
          <p className="text-muted-warm text-xs md:text-sm text-center md:text-left">
            © 2026 Frame House. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </section>
  );
}
