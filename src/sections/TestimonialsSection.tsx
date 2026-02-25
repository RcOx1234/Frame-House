import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: 'Convirtieron nuestros lanzamientos de producto en un sistema de contenido.',
    author: 'A. R.',
    role: 'CMO',
    avatar: '/images/avatar-1.jpg'
  },
  {
    quote: 'El turnaround más rápido que hemos tenido—sin sacrificar calidad.',
    author: 'M. T.',
    role: 'Founder',
    avatar: '/images/avatar-2.jpg'
  },
  {
    quote: 'Nuestros anuncios finalmente se ven como la marca que queremos ser.',
    author: 'S. L.',
    role: 'Head of Growth',
    avatar: '/images/avatar-3.jpg'
  }
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !heading || cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(heading,
        { y: 30, opacity: 0 },
        {
          y: 0,
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

      // Cards animation with stagger
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: `top ${70 - index * 8}%`,
              end: `top ${50 - index * 8}%`,
              scrub: 1
            }
          }
        );

        // Subtle parallax: as user scrolls past, cards drift
        gsap.to(card, {
          y: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2
          }
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="section-flowing bg-charcoal z-70 py-16 md:py-[12vh]"
    >
      <div className="px-6 md:px-[7vw]">
        {/* Heading */}
        <h2 
          ref={headingRef}
          className="headline-lg text-off-white mb-10 md:mb-16 text-center opacity-0 text-2xl md:text-inherit"
        >
          Lo que dicen los founders.
        </h2>

        {/* Testimonial Cards - Mobile: Stack, Desktop: Row */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-6 md:justify-between">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              ref={el => { cardsRef.current[index] = el; }}
              className="testimonial-card w-full md:w-[26vw] md:h-[46vh] flex flex-col opacity-0 p-6 md:p-8"
            >
              <Quote className="w-8 h-8 md:w-10 md:h-10 text-burnt-orange/40 mb-4 md:mb-6" />
              
              <p className="text-off-white text-base md:text-lg leading-relaxed flex-1">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-3 md:gap-4 mt-4 md:mt-6">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-heading font-bold text-off-white text-sm md:text-base">
                    {testimonial.author}
                  </p>
                  <p className="text-muted-warm text-xs md:text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
