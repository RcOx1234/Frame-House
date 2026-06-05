export type GalleryPreviewItem = {
  title: string;
  category: string;
  image: string;
  rotate?: number;
};

const base = import.meta.env.BASE_URL;

export const galleryPreviewFallback: GalleryPreviewItem[] = [
  {
    title: 'Bolones Picapiedra',
    category: 'Promos',
    image: 'https://ik.imagekit.io/ObamaRS12/Frame%20House/Portafolio/Galeria/ese.jpg',
    rotate: -2,
  },
  {
    title: 'Portafolio Frame House',
    category: 'Campañas',
    image: `${base}images/portfolio-frame-house/page-003.png`,
    rotate: 1,
  },
  {
    title: 'Contenido social',
    category: 'Contenido social',
    image: `${base}images/portfolio-frame-house/page-005.png`,
    rotate: -1,
  },
  {
    title: 'Producción audiovisual',
    category: 'Reels',
    image: `${base}images/portfolio-frame-house/page-007.png`,
    rotate: 2,
  },
  {
    title: 'Diseño para redes',
    category: 'Diseño',
    image: `${base}images/portfolio-frame-house/page-009.png`,
    rotate: -1.5,
  },
  {
    title: 'Campaña visual',
    category: 'Campañas',
    image: `${base}images/portfolio-frame-house/page-011.png`,
    rotate: 1.5,
  },
  {
    title: 'Frame House',
    category: 'Contenido social',
    image: `${base}images/hero-camera.jpg`,
    rotate: 0,
  },
];
