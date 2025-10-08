import { AnniversaryVideo } from 'src/types/Anniversary';
import { Movie, MovieDetail } from 'src/types/Movie';

// FASE 2: Data local (placeholder). Reemplaza descripcion y paths reales cuando agregues assets.
// NOTA: Actualmente tus assets reales están planos en public/anniversary con nombres en español.
// Reutilizamos la misma imagen como poster y backdrop hasta que tengas una horizontal dedicada.
export const anniversaryVideos: AnniversaryVideo[] = [
  {
    id: 'anniv-1',
    year: 1,
    title: 'Año 1 - Nuestro Comienzo',
    description: 'Descripción emotiva del primer año...',
    poster: '/anniversary/primer-ano.jpg',
    backdrop: '/anniversary/primer-ano.jpg',
    videoSrc: '/anniversary/primero.mp4',
    durationMinutes: 4,
    tags: ['Inicio', 'Recuerdos'],
    createdAt: '2019-10-05'
  },
  {
    id: 'anniv-2',
    year: 2,
    title: 'Año 2 - Creciendo Juntos',
    description: 'Segundo año y más aventuras...',
    poster: '/anniversary/segundo-ano.jpg',
    backdrop: '/anniversary/segundo-ano.jpg',
    videoSrc: '/anniversary/segundo.mp4',
    durationMinutes: 5,
    tags: ['Crecimiento'],
    createdAt: '2020-10-05'
  },
  {
    id: 'anniv-3',
    year: 3,
    title: 'Año 3 - Nuevos Horizontes',
    description: 'Tercer año lleno de logros...',
    poster: '/anniversary/tercer-ano.jpg',
    backdrop: '/anniversary/tercer-ano.jpg',
    videoSrc: '/anniversary/tercero.mp4',
    durationMinutes: 6,
    tags: ['Horizontes'],
    createdAt: '2021-10-05'
  },
  {
    id: 'anniv-4',
    year: 4,
    title: 'Año 4 - Fortaleza',
    description: 'Cuarto año consolidando nuestro vínculo...',
    poster: '/anniversary/cuarto-ano.jpg',
    backdrop: '/anniversary/cuarto-ano.jpg',
    videoSrc: '/anniversary/cuarto.mp4',
    durationMinutes: 7,
    tags: ['Fortaleza'],
    createdAt: '2022-10-05'
  },
  {
    id: 'anniv-5',
    year: 5,
    title: 'Año 5 - Celebración',
    description: 'Quinto año y una gran celebración...',
    poster: '/anniversary/quinto-ano.jpg',
    backdrop: '/anniversary/quinto-ano.jpg',
    videoSrc: '/anniversary/quinto.mp4',
    durationMinutes: 8,
    tags: ['Celebración'],
    createdAt: '2023-10-05'
  },
  {
    id: 'anniv-6',
    year: 6,
    title: 'Año 6 - Nuestro Presente',
    description: 'Sexto año y seguimos escribiendo la historia...',
    poster: '/anniversary/sexto-ano.jpg',
    backdrop: '/anniversary/sexto-ano.jpg',
    videoSrc: '/anniversary/sexto.mp4',
    durationMinutes: 9,
    tags: ['Presente'],
    createdAt: '2024-10-05'
  }
];

// Map a Movie (ids negativos para no colisionar con TMDB). Base -1000 - year.
export function mapAnniversaryToMovie(av: AnniversaryVideo): Movie {
  return {
    poster_path: av.poster,
    backdrop_path: av.backdrop,
    adult: false,
    overview: av.description,
    release_date: av.createdAt?.substring(0,10) || '2025-01-01',
    genre_ids: [],
    id: -1000 - av.year,
    original_title: av.title,
    original_language: 'es',
    title: av.title,
    popularity: 0,
    vote_count: 0,
    video: true,
    vote_average: 0
  };
}

export function mapAnniversaryToMovieDetail(av: AnniversaryVideo): MovieDetail & { __localVideoSrc: string } {
  return {
    adult: false,
    backdrop_path: av.backdrop,
    belongs_to_collection: null,
    budget: 0,
    genres: av.tags?.map((t, idx) => ({ id: -5000 - idx, name: t })) || [],
    homepage: '',
    id: -2000 - av.year,
    imdb_id: '',
    original_language: 'es',
    original_title: av.title,
    overview: av.description,
    popularity: 0,
    poster_path: av.poster,
    production_companies: [],
    production_countries: [],
    release_date: av.createdAt?.substring(0,10) || '2025-01-01',
    revenue: 0,
    runtime: av.durationMinutes,
    spoken_languages: [{ iso_639_1: 'es', english_name: 'Spanish', name: 'Español' }],
    status: 'Released',
    tagline: `Año ${av.year}`,
    title: av.title,
    video: true,
    videos: { results: [ {
      id: av.id,
      iso_639_1: 'es',
      iso_3166_1: 'ES',
      key: '', // se detectará como local
      name: av.title,
      official: true,
      published_at: av.createdAt || '',
      site: 'local',
      size: 1080,
      type: 'Trailer'
    } ] },
    vote_average: 0,
    vote_count: 0,
    __localVideoSrc: av.videoSrc
  } as MovieDetail & { __localVideoSrc: string };
}

export function getAnniversaryByMovieId(movieId: number): AnniversaryVideo | undefined {
  // movieId esperado = -1000 - year (Movie) o -2000 - year (Detail)
  const yearFromMovie = movieId < -1500 ? (-2000 - movieId) : (-1000 - movieId);
  return anniversaryVideos.find(v => v.year === yearFromMovie);
}
