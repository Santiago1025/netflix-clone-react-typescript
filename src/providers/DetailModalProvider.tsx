import { ReactNode, useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { INITIAL_DETAIL_STATE } from "src/constant";
import createSafeContext from "src/lib/createSafeContext";
import { useLazyGetAppendedVideosQuery } from "src/store/slices/discover";
import { getAnniversaryByMovieId, mapAnniversaryToMovieDetail } from "src/data/anniversaryVideos";
import { MEDIA_TYPE } from "src/types/Common";
import { MovieDetail } from "src/types/Movie";

interface DetailType {
  id?: number;
  mediaType?: MEDIA_TYPE;
}
export interface DetailModalConsumerProps {
  detail: { mediaDetail?: MovieDetail } & DetailType;
  setDetailType: (newDetailType: DetailType) => void;
}

export const [useDetailModal, Provider] =
  createSafeContext<DetailModalConsumerProps>();

export default function DetailModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const location = useLocation();
  const [detail, setDetail] = useState<
    { mediaDetail?: MovieDetail } & DetailType
  >(INITIAL_DETAIL_STATE);

  const [getAppendedVideos] = useLazyGetAppendedVideosQuery();

  const handleChangeDetail = useCallback(
    async (newDetailType: { mediaType?: MEDIA_TYPE; id?: number }) => {
      if (!!newDetailType.id && newDetailType.mediaType) {
        // Detectar contenido local (nuestro rango ids negativos: -1000 - year para Movie, -2000 - year para Detail)
        if (newDetailType.id < 0) {
          // Convertimos a year según convención
            const probableYear = newDetailType.id <= -2000 ? (-2000 - newDetailType.id) : (-1000 - newDetailType.id);
            const anniversary = getAnniversaryByMovieId(newDetailType.id <= -2000 ? newDetailType.id : newDetailType.id - 1000);
            // Ajustamos búsqueda con helper existente (creamos directo del listado por year).
            const found = anniversary || getAnniversaryByMovieId(newDetailType.id);
            // fallback: derivar year del id
            const year = probableYear;
            const fromYear = getAnniversaryByMovieId(-1000 - year) || getAnniversaryByMovieId(-2000 - year);
            const target = found || fromYear;
            if (target) {
              const localDetail = mapAnniversaryToMovieDetail(target);
              setDetail({ ...newDetailType, mediaDetail: localDetail });
              return;
            }
        }
        // Fallback a flujo TMDB normal
        const response = await getAppendedVideos({
          mediaType: newDetailType.mediaType,
          id: newDetailType.id as number,
        }).unwrap();
        setDetail({ ...newDetailType, mediaDetail: response });
      } else {
        setDetail(INITIAL_DETAIL_STATE);
      }
    },
    []
  );

  useEffect(() => {
    setDetail(INITIAL_DETAIL_STATE);
  }, [location.pathname, setDetail]);

  return (
    <Provider value={{ detail, setDetailType: handleChangeDetail }}>
      {children}
    </Provider>
  );
}
