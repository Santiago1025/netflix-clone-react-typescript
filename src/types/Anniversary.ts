export type AnniversaryVideo = {
  id: string; // e.g. 'anniv-1'
  year: number; // 1..6
  title: string;
  description: string;
  poster: string; // public path to poster image (vertical)
  backdrop: string; // public path to backdrop image (horizontal)
  videoSrc: string; // public path to mp4
  durationMinutes: number;
  tags?: string[];
  createdAt?: string; // ISO date string
};
