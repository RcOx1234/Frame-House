import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoModal from '../components/VideoModal';
import { shouldUseLightAnimations } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'Ojos asi',
    tag: 'Shakira',
    image: 'https://billboard.com.co/wp-content/uploads/2025/07/ojos-asi-770x470.png',
    videoUrl: 'https://res.cloudinary.com/dolxglacq/video/upload/q_auto/f_auto/v1776644599/Ojos-asi_avh7b2.mp4'
  },
  {
    title: 'Bolones Picapiedra',
    tag: 'Video Prom',
    image: 'https://ik.imagekit.io/ObamaRS12/Frame%20House/Portafolio/Galeria/ese.jpg',
    videoUrl: 'https://res.cloudinary.com/dolxglacq/video/upload/q_auto/f_auto/v1776649769/Video_Prom_2_cdxhzd.mp4'
  }
];

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !heading || cards.length === 0) return;
    const lightAnimations = shouldUseLightAnimations();

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(heading,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: lightAnimations ? 0.5 : 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: lightAnimations ? undefined : 'top 60%',
            scrub: lightAnimations ? false : 1,
            once: lightAnimations
          }
        }
      );

      // Cards animation
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: lightAnimations ? 0.55 : 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: `top ${70 - index * 10}%`,
              end: lightAnimations ? undefined : `top ${50 - index * 10}%`,
              scrub: lightAnimations ? false : 1,
              once: lightAnimations
            }
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const openVideo = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setVideoModalOpen(true);
  };

  return (
    <>
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={selectedProject?.videoUrl}
        title={selectedProject?.title}
      />
      
      <section 
        ref={sectionRef} 
        id="portfolio"
        className="section-flowing bg-charcoal z-60 py-16 md:py-[12vh]"
      >
        <div className="px-6 md:px-[7vw]">
          {/* Heading */}
          <h2 
            ref={headingRef}
            className="headline-lg text-off-white mb-8 md:mb-12 text-2xl md:text-inherit"
          >
            Trabajos seleccionados.
          </h2>

          {/* Portfolio Cards - Mobile: Stack, Desktop: Row */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                ref={el => { cardsRef.current[index] = el; }}
                className="portfolio-card w-full md:w-[40vw] h-[40vh] md:h-[56vh] group cursor-pointer"
                onClick={() => openVideo(project)}
              >
                <img 
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-8">
                  {/* Tag */}
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-sm text-off-white text-xs md:text-sm font-mono tracking-wider">
                      {project.tag}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openVideo(project);
                      }}
                      aria-label={`Reproducir ${project.title}`}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-burnt-orange flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-off-white ml-0.5" />
                    </button>
                  </div>
                  
                  {/* Title */}
                  <div className="flex justify-between items-end">
                    <h3 className="font-heading font-bold text-xl md:text-2xl text-off-white tracking-wide">
                      {project.title}
                    </h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openVideo(project);
                      }}
                      aria-label={`Abrir ${project.title}`}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-off-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Link */}
          <div className="mt-8 md:mt-12">
            <Link 
              to="/trabajos"
              className="inline-flex items-center gap-2 text-burnt-orange hover:text-off-white transition-colors font-medium group text-sm md:text-base"
            >
              Ver Galeria
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
