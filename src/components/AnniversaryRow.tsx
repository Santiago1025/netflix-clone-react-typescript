import { useMemo } from 'react';
import SlickSlider from 'src/components/slick-slider/SlickSlider';
import { anniversaryVideos, mapAnniversaryToMovie } from 'src/data/anniversaryVideos';
import { PaginatedMovieResult } from 'src/types/Common';
import { CustomGenre } from 'src/types/Genre';

// Genre-like descriptor to reuse existing slider header UI.
const anniversaryGenre: CustomGenre = {
  name: 'Anniversary Collection (Años 1–6)',
  apiString: 'anniversary'
};

export default function AnniversaryRow() {
  const paginated: PaginatedMovieResult = useMemo(() => {
    const results = anniversaryVideos.map(mapAnniversaryToMovie);
    return {
      page: 1,
      total_pages: 1,
      total_results: results.length,
      results
    };
  }, []);

  return (
    <SlickSlider
      data={paginated}
      genre={anniversaryGenre}
      // dummy handleNext to satisfy props; no pagination needed
      handleNext={() => {}}
    />
  );
}
