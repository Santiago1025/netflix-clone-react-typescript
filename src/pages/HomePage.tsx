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

  if (isSuccess && genres && genres.length > 0) {
    return (
      <Stack spacing={2}>
        <HeroSection mediaType={MEDIA_TYPE.Movie} />
        {[...COMMON_TITLES, ...genres].map((genre: Genre | CustomGenre, index) => {
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
