import { useEffect, useState, useRef } from "react";
import { Movie } from "src/types/Movie";
import { usePortal } from "src/providers/PortalProvider";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import VideoItemWithHoverPure from "./VideoItemWithHoverPure";
interface VideoItemWithHoverProps {
  video: Movie;
  aspectRatio?: string; // Nuevo: permite especificar el ratio
}

export default function VideoItemWithHover({ video, aspectRatio }: VideoItemWithHoverProps) {
  const setPortal = usePortal();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { data: configuration } = useGetConfigurationQuery(undefined);
  // Detección simple: si el path comienza con /anniversary/ asumimos recurso local.
  const isLocal = !!video.backdrop_path && video.backdrop_path.startsWith("/anniversary/");

  useEffect(() => {
    if (isHovered) {
      setPortal(elementRef.current, video);
    }
  }, [isHovered]);

  return (
    <VideoItemWithHoverPure
      ref={elementRef}
      handleHover={setIsHovered}
      src={
        isLocal
          ? video.backdrop_path || ""
          : `${configuration?.images.base_url}w300${video.backdrop_path}`
      }
      aspectRatio={aspectRatio} // Nuevo: pasa el ratio
    />
  );
}
