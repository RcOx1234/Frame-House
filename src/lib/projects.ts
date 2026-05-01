import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

type ProjectType = 'video' | 'web' | 'social' | 'branding' | 'fotografia' | 'otros';
type FilterType = 'Todos' | 'Videos' | 'Webs' | 'Contenido Social' | 'Branding / Diseño' | 'Fotografía' | 'Otros';

export type Project = {
  id: string;
  title: string;
  client: string;
  type: ProjectType;
  category: FilterType;
  thumbnail: string;
  previewVideo?: string;
  duration?: string;
  platform: string;
  description: string;
  tags: string[];
  format: string;
  siteUrl?: string;
  featured?: boolean;
};

export async function getProjects(): Promise<Project[]> {
  const snapshot = await getDocs(collection(db, 'projects'));

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Partial<Project>;
    return {
      id: doc.id,
      title: data.title ?? '',
      client: data.client ?? '',
      type: data.type ?? 'otros',
      category: data.category ?? 'Otros',
      thumbnail: data.thumbnail ?? '',
      previewVideo: data.previewVideo,
      duration: data.duration,
      platform: data.platform ?? '',
      description: data.description ?? '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      format: data.format ?? '',
      siteUrl: data.siteUrl,
      featured: Boolean(data.featured)
    };
  });
}
