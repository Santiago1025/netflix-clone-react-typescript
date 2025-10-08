import { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Portal from "@mui/material/Portal";

import VideoCardPortal from "./VideoCardPortal";
import AnniversaryCenterModal from "./AnniversaryCenterModal";
import MotionContainer from "./animate/MotionContainer";
import {
  varZoomIn,
  varZoomInLeft,
  varZoomInRight,
} from "./animate/variants/zoom/ZoomIn";
import { usePortalData } from "src/providers/PortalProvider";

export default function VideoPortalContainer() {
  const { miniModalMediaData, anchorElement } = usePortalData();
  const container = useRef<HTMLDivElement | null>(null);
  const portalMeasureRef = useRef<HTMLDivElement | null>(null);
  const [portalH, setPortalH] = useState<number | null>(null);
  const rect = anchorElement?.getBoundingClientRect();

  const hasToRender = !!miniModalMediaData && !!anchorElement;
  let isFirstElement = false;
  let isLastElement = false;
  let variant = varZoomIn;
  if (hasToRender) {
    const parentElement = anchorElement.closest(".slick-active");
    const nextSiblingOfParentElement = parentElement?.nextElementSibling;
    const previousSiblingOfParentElement =
      parentElement?.previousElementSibling;
    if (!previousSiblingOfParentElement?.classList.contains("slick-active")) {
      isFirstElement = true;
      variant = varZoomInLeft;
    } else if (
      !nextSiblingOfParentElement?.classList.contains("slick-active")
    ) {
      isLastElement = true;
      variant = varZoomInRight;
    }
  }

  // Detectar si es un item "anniversary" (backdrop local en /anniversary/)
  const isAnniversary = !!miniModalMediaData?.backdrop_path && miniModalMediaData.backdrop_path.startsWith("/anniversary/");

  // Ajuste fino (px) para el modo inline (no se usa en el modal centrado global).
  const FINE_TUNE_PX = -12;

  // Medir la altura real del portal para centrar con precisión
  useLayoutEffect(() => {
    if (isAnniversary && hasToRender && container.current) {
      // Medimos inmediatamente (sin RAF) para evitar flash visual
      const h = container.current.getBoundingClientRect().height;
      if (h && h > 0) {
        setPortalH(h);
      } else {
        // Si aún no tiene altura, esperamos al siguiente frame
        const id = requestAnimationFrame(() => {
          if (container.current) {
            const height = container.current.getBoundingClientRect().height;
            if (height && height > 0) setPortalH(height);
          }
        });
        return () => cancelAnimationFrame(id);
      }
    } else if (!isAnniversary || !hasToRender) {
      setPortalH(null);
    }
  }, [isAnniversary, hasToRender, miniModalMediaData, anchorElement]);

  // Solo mostramos el portal si: no es anniversary O si ya tenemos la altura medida
  const shouldShowPortal = hasToRender && (!isAnniversary || portalH !== null);

  // Si es anniversary, renderizamos un modal relativo a la tarjeta pero centrado respecto a ella
  if (hasToRender && isAnniversary && miniModalMediaData && anchorElement && rect) {
    const top = rect.top + window.pageYOffset - rect.height * -0; // ligeramente encima del centro
    const left = rect.left + window.pageXOffset + rect.width * -0.5 ; // centro horizontal
    return (
      <Portal>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            position: "absolute",
            top,
            left,
            transform: "translate(-50%, 0)",
            zIndex: 1400,
            pointerEvents: "auto",
          }}
        >
          <AnniversaryCenterModal video={miniModalMediaData} anchorRect={rect} />
        </motion.div>
      </Portal>
    );
  }

  return (
    <>
      {shouldShowPortal && (
        <Portal container={container.current}>
          <VideoCardPortal
            video={miniModalMediaData}
            anchorElement={anchorElement}
          />
        </Portal>
      )}
      <MotionContainer open={shouldShowPortal} initial="initial">
        <motion.div
          ref={(el) => {
            container.current = el;
            portalMeasureRef.current = el;
          }}
          variants={variant}
          style={{
            zIndex: 1,
            position: "absolute",
            display: "inline-block",
            ...(rect && {
              top: isAnniversary
                ? rect.top + window.pageYOffset + rect.height / 2 + FINE_TUNE_PX
                : rect.top + window.pageYOffset - 0.75 * rect.height,
              // Usamos "y" (prop de framer-motion) para desplazar la mitad de la altura medida sin sobrescribir scale.
              // Si aún no la tenemos medida, no aplicamos corrección (aparecerá muy levemente desfasado el primer frame).
              ...(isAnniversary && portalH
                ? { y: -portalH / 2 }
                : {}),
              ...(isLastElement
                ? {
                    right: document.documentElement.clientWidth - rect.right,
                  }
                : {
                    left: isFirstElement
                      ? rect.left
                      : rect.left - 0.25 * rect.width,
                  }),
            }),
          }}
        />
      </MotionContainer>
    </>
  );
}
