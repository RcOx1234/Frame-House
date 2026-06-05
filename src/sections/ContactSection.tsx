import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Mail, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '../firebase';
import { buildWhatsAppUrl, FRAMEHOUSE_EMAIL } from '../config/contact';
import { shouldUseLightAnimations } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

const INTERES_OPTIONS = [
  'Manejo de redes',
  'Videos/Reels/TikToks',
  'Diseño gráfico',
  'Branding',
  'Página web',
  'Portafolio profesional',
  'No estoy seguro/a todavía',
] as const;

type InteresOption = (typeof INTERES_OPTIONS)[number];

type FormState = {
  nombre: string;
  emailOrWhatsapp: string;
  empresa: string;
  interes: InteresOption;
  mensaje: string;
};

const initialForm: FormState = {
  nombre: '',
  emailOrWhatsapp: '',
  empresa: '',
  interes: 'No estoy seguro/a todavía',
  mensaje: '',
};

function buildContactWhatsAppMessage(data: FormState): string {
  const empresa = data.empresa.trim() || 'No especificada';
  return `Hola Frame House, soy ${data.nombre.trim()}.
Empresa/marca: ${empresa}
Estoy interesado/a en: ${data.interes}
Mensaje: ${data.mensaje.trim()}

Vengo desde la página web y quiero recibir más información.`;
}

type ContactFormProps = {
  formData: FormState;
  setFormData: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  compact?: boolean;
};

function ContactForm({ formData, setFormData, onSubmit, submitting, compact }: ContactFormProps) {
  const inputClass = compact ? 'w-full text-sm' : 'w-full';
  const textareaClass = compact
    ? 'min-h-[82px] w-full resize-y text-sm'
    : 'h-28 w-full resize-none';
  const selectClass = compact
    ? `${inputClass} cursor-pointer appearance-none rounded-xl border border-white/15 bg-[#141210] px-4 py-2.5 text-off-white`
    : `${inputClass} cursor-pointer appearance-none rounded-xl border border-white/15 bg-[#141210] px-4 py-3 text-off-white`;

  return (
    <form onSubmit={onSubmit} className={compact ? 'flex flex-col gap-3' : 'space-y-4'}>
      <div>
        <input
          type="text"
          placeholder="Nombre *"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className={inputClass}
          required
          autoComplete="name"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Email o WhatsApp *"
          value={formData.emailOrWhatsapp}
          onChange={(e) => setFormData({ ...formData, emailOrWhatsapp: e.target.value })}
          className={inputClass}
          required
          autoComplete="email tel"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Empresa / Marca"
          value={formData.empresa}
          onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
          className={inputClass}
          autoComplete="organization"
        />
      </div>
      <div>
        <select
          value={formData.interes}
          onChange={(e) =>
            setFormData({ ...formData, interes: e.target.value as InteresOption })
          }
          className={selectClass}
          required
        >
          {INTERES_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <textarea
          placeholder="Mensaje *"
          value={formData.mensaje}
          onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
          className={textareaClass}
          required
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className={`btn-primary flex w-full items-center justify-center gap-2 ${compact ? 'mt-1 text-sm' : ''} disabled:opacity-60`}
      >
        <Send className="h-4 w-4" aria-hidden />
        {submitting ? 'Enviando…' : 'Contactar'}
      </button>
      <p className="text-center text-xs text-muted-warm">Respuesta aproximada: 24h hábiles.</p>
    </form>
  );
}

function ContactDetails({ compact }: { compact?: boolean }) {
  const iconBox = compact ? 'h-9 w-9' : 'h-10 w-10';
  const icon = compact ? 'h-4 w-4' : 'h-5 w-5';
  const gap = compact ? 'gap-3' : 'gap-4';
  const space = compact ? 'space-y-4' : 'space-y-6';

  return (
    <div className={space}>
      <div className={`flex items-start ${gap}`}>
        <div
          className={`flex ${iconBox} flex-shrink-0 items-center justify-center rounded-full bg-burnt-orange/20`}
        >
          <Mail className={`${icon} text-burnt-orange`} aria-hidden />
        </div>
        <div>
          <p className={`label-mono mb-0.5 text-muted-warm ${compact ? 'text-xs' : ''}`}>EMAIL</p>
          <a
            href={`mailto:${FRAMEHOUSE_EMAIL}`}
            className={`break-words text-off-white hover:text-[#E85A66] ${compact ? 'text-sm' : ''}`}
          >
            {FRAMEHOUSE_EMAIL}
          </a>
        </div>
      </div>

      <div className={`flex items-start ${gap}`}>
        <div
          className={`flex ${iconBox} flex-shrink-0 items-center justify-center rounded-full bg-burnt-orange/20`}
        >
          <MapPin className={`${icon} text-burnt-orange`} aria-hidden />
        </div>
        <div>
          <p className={`label-mono mb-0.5 text-muted-warm ${compact ? 'text-xs' : ''}`}>UBICACIÓN</p>
          <p className={`text-off-white ${compact ? 'text-sm' : ''}`}>Manta, Ecuador</p>
        </div>
      </div>

      <div className={`flex items-start ${gap}`}>
        <div
          className={`flex ${iconBox} flex-shrink-0 items-center justify-center rounded-full bg-burnt-orange/20`}
        >
          <Clock className={`${icon} text-burnt-orange`} aria-hidden />
        </div>
        <div>
          <p className={`label-mono mb-0.5 text-muted-warm ${compact ? 'text-xs' : ''}`}>RESPUESTA</p>
          <p className={`text-off-white ${compact ? 'text-sm' : ''}`}>~24h hábiles</p>
        </div>
      </div>
    </div>
  );
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineMobileRef = useRef<HTMLDivElement>(null);
  const headlineDesktopRef = useRef<HTMLDivElement>(null);
  const formMobileRef = useRef<HTMLDivElement>(null);
  const formDesktopRef = useRef<HTMLDivElement>(null);
  const detailsMobileRef = useRef<HTMLDivElement>(null);
  const detailsDesktopRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    let firebaseOk = false;

    try {
      await addDoc(collection(db, 'contactos'), {
        nombre: formData.nombre.trim(),
        emailOrWhatsapp: formData.emailOrWhatsapp.trim(),
        empresa: formData.empresa.trim(),
        interes: formData.interes,
        mensaje: formData.mensaje.trim(),
        source: 'contact_section',
        status: 'nuevo',
        createdAt: serverTimestamp(),
      });
      firebaseOk = true;
    } catch (err) {
      console.error('Error al guardar contacto:', err);
    }

    const waUrl = buildWhatsAppUrl(buildContactWhatsAppMessage(formData));
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    if (firebaseOk) {
      toast.success('Consulta registrada. Te llevamos a WhatsApp para terminar el contacto.');
    } else {
      toast.message(
        'No pudimos guardar el contacto, pero puedes continuar por WhatsApp.',
      );
    }

    setFormData(initialForm);
    setSubmitting(false);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;
    const lightAnimations = shouldUseLightAnimations();

    const animBlock = (
      headline: HTMLDivElement,
      formCard: HTMLDivElement,
      details: HTMLDivElement,
    ) => {
      gsap.fromTo(
        headline,
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: lightAnimations ? 0.5 : 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: lightAnimations,
          },
        },
      );
      gsap.fromTo(
        formCard,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: lightAnimations ? 0.55 : 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: lightAnimations,
          },
        },
      );
      gsap.fromTo(
        details,
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: lightAnimations ? 0.6 : 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            once: lightAnimations,
          },
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
        if (!lightAnimations) {
          gsap.fromTo(
            bg,
            { y: 0 },
            {
              y: '-4vh',
              ease: 'none',
              scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 2 },
            },
          );
        }
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
        if (!lightAnimations) {
          gsap.fromTo(
            bg,
            { y: 0 },
            {
              y: '-4vh',
              ease: 'none',
              scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 2 },
            },
          );
        }
      }, section);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const headlineMobileCopy = (
    <>
      <h2 className="headline-xl mb-3 text-3xl text-off-white">
        ¿Listo para crear contenido con intención?
      </h2>
      <p className="text-base font-light text-muted-warm">
        Cuéntanos qué necesita tu marca y te responderemos con una ruta clara para empezar.
      </p>
    </>
  );

  const headlineDesktopCopy = (
    <>
      <h2 className="headline-xl mb-4 text-off-white">VAMOS A FILMAR.</h2>
      <p className="max-w-[34ch] text-xl font-light leading-relaxed text-muted-warm">
        Cuéntanos qué estás construyendo. Respondemos dentro de un día hábil.
      </p>
    </>
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-30 flex min-h-[92svh] flex-col overflow-hidden bg-charcoal"
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

      <div className="relative z-10 flex flex-1 flex-col px-6 py-12 md:px-[7vw] md:py-14 lg:py-16">
        <div className="flex flex-1 flex-col gap-6 md:hidden">
          <div ref={headlineMobileRef}>{headlineMobileCopy}</div>

          <div
            ref={formMobileRef}
            className="phone-frame shrink-0 bg-[#0B0D10]/90 p-5 backdrop-blur-xl sm:p-6"
          >
            <ContactForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              submitting={submitting}
              compact
            />
          </div>

          <div ref={detailsMobileRef} className="pb-2">
            <ContactDetails compact />
          </div>
        </div>

        <div className="hidden flex-1 items-center gap-8 md:grid md:grid-cols-[minmax(280px,0.95fr)_minmax(340px,420px)_minmax(220px,0.72fr)] lg:gap-10 xl:grid-cols-[minmax(320px,1fr)_minmax(360px,430px)_minmax(240px,0.72fr)]">
          <div ref={headlineDesktopRef} className="max-w-[430px]">
            {headlineDesktopCopy}
          </div>

          <div
            ref={formDesktopRef}
            className="phone-frame w-full max-w-[420px] justify-self-center bg-[#0B0D10]/90 p-5 backdrop-blur-xl xl:p-6"
          >
            <ContactForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              submitting={submitting}
              compact
            />
          </div>

          <div ref={detailsDesktopRef} className="w-full max-w-[260px] justify-self-end">
            <ContactDetails />
          </div>
        </div>
      </div>

      <footer className="relative z-10 shrink-0 border-t border-white/10 bg-[#07090B] px-6 py-5 md:px-[7vw] md:py-5">
        <div className="mx-auto flex max-w-[1220px] flex-col items-center justify-between gap-3 md:flex-row md:gap-4">
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
