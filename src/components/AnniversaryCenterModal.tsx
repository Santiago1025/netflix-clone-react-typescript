import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createSearchParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NetflixIconButton from "./NetflixIconButton";
import MaxLineTypography from "./MaxLineTypography";
import AgeLimitChip from "./AgeLimitChip";
import QualityChip from "./QualityChip";
import GenreBreadcrumbs from "./GenreBreadcrumbs";
import { Movie } from "src/types/Movie";
import { usePortal } from "src/providers/PortalProvider";
import { useDetailModal } from "src/providers/DetailModalProvider";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import { MEDIA_TYPE } from "src/types/Common";
import { useGetGenresQuery } from "src/store/slices/genre";
import { formatMinuteToReadable, getRandomNumber } from "src/utils/common";
import { MAIN_PATH } from "src/constant";

interface AnniversaryCenterModalProps {
  video: Movie;
  anchorRect?: DOMRect | null;
  widthFactor?: number; // factor multiplicador basado en el ancho de la card origen
  maxWidth?: number; // límite superior de ancho
}

/**
 * Modal flotante centrado especial para los items de anniversary.
 * Aparece en el centro de la ventana (fixed) y se cierra al salir con el puntero,
 * presionar Escape o al perder el hover.
 */
export default function AnniversaryCenterModal({ video, anchorRect, widthFactor = 1.8, maxWidth = 720 }: AnniversaryCenterModalProps) {
  const navigate = useNavigate();
  const setPortal = usePortal();
  const { setDetailType } = useDetailModal();
  const { data: configuration } = useGetConfigurationQuery(undefined);
  const { data: genres } = useGetGenresQuery(MEDIA_TYPE.Movie);
  const isLocal = !!video.backdrop_path && video.backdrop_path.startsWith("/anniversary/");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPortal(null, null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setPortal]);

  return (
    <Card
      onPointerLeave={() => setPortal(null, null)}
      sx={{
        // Ajuste dinámico según el ancho de la tarjeta original
        // Factor 1.8 para que sea más grande pero no desproporcionado
        width: anchorRect
          ? Math.min(anchorRect.width * widthFactor, maxWidth)
          : `min(80vw, ${maxWidth}px)`,
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
   >
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9
          backgroundColor: "#000",
        }}
      >
        <img
          src={
            isLocal
              ? video.backdrop_path || ""
              : `${configuration?.images.base_url}w780${video.backdrop_path}`
          }
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundPosition: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "8px 16px 8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <MaxLineTypography
            maxLine={2}
            sx={{ width: "80%", fontWeight: 700 }}
            variant="h5"
          >
            {video.title}
          </MaxLineTypography>
          <div style={{ flexGrow: 1 }} />
          <NetflixIconButton>
            <VolumeUpIcon />
          </NetflixIconButton>
        </div>
      </div>
      <CardContent sx={{ pt: 2 }}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <NetflixIconButton
              sx={{ p: 0 }}
              onClick={() => {
                // Detectar si es anniversary para pasar query param local
                if (isLocal) {
                  const annivId = video.title.match(/Año (\d+)/i)?.[1];
                  navigate({
                    pathname: `/${MAIN_PATH.watch}`,
                    search: createSearchParams({ anniv: annivId || "" }).toString(),
                  });
                  return;
                }
                navigate({ pathname: `/${MAIN_PATH.watch}`, search: createSearchParams({ movieId: String(video.id) }).toString() });
              }}
            >
              <PlayCircleIcon sx={{ width: 44, height: 44 }} />
            </NetflixIconButton>
            <NetflixIconButton>
              <AddIcon />
            </NetflixIconButton>
            <NetflixIconButton>
              <ThumbUpOffAltIcon />
            </NetflixIconButton>
            <div style={{ flexGrow: 1 }} />
            <NetflixIconButton
              onClick={() =>
                setDetailType({ mediaType: MEDIA_TYPE.Movie, id: video.id })
              }
            >
              <ExpandMoreIcon />
            </NetflixIconButton>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" sx={{ color: "success.main" }}>
              {`${getRandomNumber(100)}% Match`}
            </Typography>
            <AgeLimitChip label={`${getRandomNumber(20)}+`} />
            <Typography variant="subtitle2">
              {formatMinuteToReadable(getRandomNumber(180))}
            </Typography>
            <QualityChip label="HD" />
          </Stack>
          {genres && (
            <GenreBreadcrumbs
              genres={genres
                .filter((g) => video.genre_ids.includes(g.id))
                .map((g) => g.name)}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
