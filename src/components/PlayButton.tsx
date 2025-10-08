import Button, { ButtonProps } from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate, createSearchParams } from "react-router-dom";
import { MAIN_PATH } from "src/constant";
import { Movie } from "src/types/Movie";

interface PlayButtonProps extends ButtonProps {
  video?: Movie; // opcional para saber a qué reproducir
}

export default function PlayButton({ sx, video, ...others }: PlayButtonProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (video?.backdrop_path?.startsWith("/anniversary/")) {
      // Deducimos año leyendo id negativo si sigue nuestro mapeo (-1000 - year)
      let year: string | undefined;
      if (video.id < -1000) {
        const recovered = -1000 - video.id; // 1..n
        if (recovered > 0 && recovered < 20) year = String(recovered);
      }
      navigate({
        pathname: `/${MAIN_PATH.watch}`,
        search: createSearchParams({ anniv: year || "" }).toString(),
      });
      return;
    }
    if (video) {
      navigate({
        pathname: `/${MAIN_PATH.watch}`,
        search: createSearchParams({ movieId: String(video.id) }).toString(),
      });
      return;
    }
    navigate(`/${MAIN_PATH.watch}`);
  };
  return (
    <Button
      color="inherit"
      variant="contained"
      startIcon={
        <PlayArrowIcon
          sx={{
            fontSize: {
              xs: "24px !important",
              sm: "32px !important",
              md: "40px !important",
            },
          }}
        />
      }
      {...others}
      sx={{
        px: { xs: 1, sm: 2 },
        py: { xs: 0.5, sm: 1 },
        fontSize: { xs: 18, sm: 24, md: 28 },
        lineHeight: 1.5,
        fontWeight: "bold",
        whiteSpace: "nowrap",
        textTransform: "capitalize",
        ...sx,
      }}
      onClick={handleClick}
    >
      Play
    </Button>
  );
}
