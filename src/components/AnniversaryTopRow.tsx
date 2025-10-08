import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { anniversaryVideos, mapAnniversaryToMovie } from 'src/data/anniversaryVideos';
import { Movie } from 'src/types/Movie';
import VideoItemWithHover from './VideoItemWithHover';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Wrapper que fija la relación de aspecto 2:3 para los pósters y aplica efecto hover similar a top 10 de Netflix
// Tamaños base de poster (mantener congruencia a través de breakpoints)
const POSTER_WIDTH = {
  xs: 105,
  sm: 130,
  md: 148,
  lg: 160,
};

// Espacio reservado para el número (porcentaje relativo del ancho total del item)
const NUMBER_WIDTH = {
  xs: 70,
  sm: 100,
  md: 130,
  lg: 160,
};

// Animaciones sutiles
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

// Item contenedor: reserva espacio a la izquierda para el número (padding-left)
const RankItem = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  width: `calc(${POSTER_WIDTH.lg}px + ${NUMBER_WIDTH.lg * 0.7}px)`,
  paddingLeft: `${NUMBER_WIDTH.lg * 0.7}px`, // deja espacio para el número
  [theme.breakpoints.down('lg')]: {
    width: `calc(${POSTER_WIDTH.md}px + ${NUMBER_WIDTH.md * 0.7}px)`,
    paddingLeft: `${NUMBER_WIDTH.md * 0.7}px`,
  },
  [theme.breakpoints.down('md')]: {
    width: `calc(${POSTER_WIDTH.sm}px + ${NUMBER_WIDTH.sm * 0.7}px)`,
    paddingLeft: `${NUMBER_WIDTH.sm * 0.7}px`,
  },
  [theme.breakpoints.down('sm')]: {
    width: `calc(${POSTER_WIDTH.xs}px + ${NUMBER_WIDTH.xs * 0.7}px)`,
    paddingLeft: `${NUMBER_WIDTH.xs * 0.7}px`,
  },
  zIndex: 0,
}));

const RankNumberImg = styled('img')(({ theme }) => ({
  marginLeft: -130,
  position: 'absolute',
  left: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  width: `${NUMBER_WIDTH.lg * 2.5}px`,
  height: 'auto',
  zIndex: 1,
  opacity: 0.85,
  filter: 'drop-shadow(0 0 24px rgba(0,0,0,0.8))',
  pointerEvents: 'none',
  userSelect: 'none',
  [theme.breakpoints.down('lg')]: { width: `${NUMBER_WIDTH.md}px` },
  [theme.breakpoints.down('md')]: { width: `${NUMBER_WIDTH.sm}px` },
  [theme.breakpoints.down('sm')]: { width: `${NUMBER_WIDTH.xs}px` },
}));

const PosterShell = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  aspectRatio: '2 / 3',
  borderRadius: 4,
  overflow: 'hidden',
  background: '#000',
  boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
  transition: 'transform .25s ease',
  zIndex: 3,
  '&:hover': { transform: 'scale(1.02)' },
  [theme.breakpoints.down('sm')]: {
    '&:hover': { transform: 'scale(1.01)' },
  },
}));

const Overlay = styled('div')(() => ({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,0.42) 100%)',
  pointerEvents: 'none',
}));

const FadeEdge = styled('div')<{ side: 'left' | 'right' }>(({ side }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: 60,
  pointerEvents: 'none',
  zIndex: 3,
  [side === 'left' ? 'left' : 'right']: 0,
  background:
    side === 'left'
      ? 'linear-gradient(90deg,#141414 0%,rgba(20,20,20,0) 100%)'
      : 'linear-gradient(270deg,#141414 0%,rgba(20,20,20,0) 100%)',
}));

// Estilo inspirado en la fila Top 10 de Netflix
// Muestra números grandes outline detrás de cada póster.
export default function AnniversaryTopRow() {
  const movies: Movie[] = useMemo(() => anniversaryVideos.map(mapAnniversaryToMovie), []);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const recomputeFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;
    setShowLeftFade(scrollLeft > 8);
    setShowRightFade(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useEffect(() => {
    recomputeFades();
  }, [recomputeFades, movies.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => recomputeFades();
    el.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      el.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [recomputeFades]);

  return (
    <Box sx={{ mt: 4, position: 'relative' }}>
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          fontWeight: 700,
          mb: 2,
          pl: { xs: '30px', sm: '60px' },
        }}
      >
        Anniversary Collection (Años 1–6)
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          pl: { xs: '30px', sm: '60px' },
          pr: { xs: '30px', sm: '60px' },
          overflowX: 'auto',
          pb: 2,
          position: 'relative',
          scrollbarWidth: 'none',
          '::-webkit-scrollbar': { display: 'none' },
          // Fondo ligero para simular sección destacada
          background: 'linear-gradient(180deg,#141414 0%, #141414 60%, rgba(20,20,20,0.6) 100%)',
        }}
        ref={scrollRef}
      >
        {showLeftFade && <FadeEdge side="left" />}
        {showRightFade && <FadeEdge side="right" />}
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            // Aumenta el gap entre posters:
            gap: { xs: 3, sm: 4, md: 5, lg: 10 },
          }}
        >
          {movies.map((m, idx) => (
            <RankItem key={m.id} variants={itemVariants} aria-label={`Año ${idx + 1} - ranking #${idx + 1}`} style={{ position: 'relative' }}>
              <RankNumberImg
                src={`/anniversary/numbers/${idx + 1}.${idx + 1 === 5 ? 'png' : 'webp'}`}
                alt={`Número ${idx + 1}`}
                aria-hidden
                draggable={false}
              />
              <PosterShell whileHover={{ scale: 1.02 }} style={{ position: 'relative', zIndex: 2 }}>
                <VideoItemWithHover video={m} aspectRatio="2 / 3" /> {/* Solo aquí */}
                <Overlay />
              </PosterShell>
            </RankItem>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
