import Stack from "@mui/material/Stack";
import { COMMON_TITLES } from "src/constant";
import HeroSection from "src/components/HeroSection";
import AnniversaryTopRow from "src/components/AnniversaryTopRow";
import { genreSliceEndpoints, useGetGenresQuery } from "src/store/slices/genre";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import SliderRowForGenre from "src/components/VideoSlider";
import store from "src/store";

export async function loader() {
  await store.dispatch(
    genreSliceEndpoints.getGenres.initiate(MEDIA_TYPE.Movie)
  );
  return null;
}
export function Component() {
  const { data: genres, isSuccess } = useGetGenresQuery(MEDIA_TYPE.Movie);

  if (isSuccess && genres) {
    // Mostrar el orden original de los géneros de la API
    // Solo nombres para mayor claridad
    // eslint-disable-next-line no-console
    console.log('Orden original de géneros de la API:', genres.map(g => g.name));
  }

  if (isSuccess && genres && genres.length > 0) {
    // Creamos una copia de los géneros de la API para manipular
    const genresCopy = [...genres];
    // Buscamos el índice de 'Animation' y lo extraemos
    const animationIdx = genresCopy.findIndex(g => g.name === 'Animation');
    let animationGenre = null;
    if (animationIdx !== -1) {
      animationGenre = genresCopy.splice(animationIdx, 1)[0];
    }
    // Buscamos el índice de 'Now Playing' en COMMON_TITLES
    const nowPlayingIdx = COMMON_TITLES.findIndex(t => t.name === 'Now Playing');
    // Armamos el array combinado
    let combinedGenres = [...COMMON_TITLES, ...genresCopy];
    // Reemplazamos 'Now Playing' por 'Animation' si ambos existen
    if (nowPlayingIdx !== -1 && animationGenre) {
      combinedGenres[nowPlayingIdx] = animationGenre;
    }
    return (
      <Stack spacing={2}>
        <HeroSection mediaType={MEDIA_TYPE.Movie} />
        {combinedGenres.map((genre: Genre | CustomGenre, index) => {
          const element = (
            <SliderRowForGenre
              key={genre.id || genre.name}
              genre={genre}
              mediaType={MEDIA_TYPE.Movie}
            />
          );
          // Insertamos la AnniversaryTopRow justo después de "Top Rated" si existe en COMMON_TITLES
          if (
            index === COMMON_TITLES.findIndex((t) => t.name === "Top Rated") + 1
          ) {
            return (
              <>
                {element}
                <AnniversaryTopRow />
              </>
            );
          }
          return element;
        })}
      </Stack>
    );
  }
  return null;
}

Component.displayName = "HomePage";
