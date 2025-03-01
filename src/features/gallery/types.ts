export type VideoCategory = 'lifestyle' | 'business' | 'professional';

export interface GalleryVideo {
  id: string;
  seed: number;
  promode: boolean;
  aspectRatio: string;
  resolution: string;
  prompt: string;
  thumbnailUrl: string;
  videoUrl: string;
  status: string;
  createdAt: string;
  error?: string;
  type: 'ugc' | 'lipsync';
}