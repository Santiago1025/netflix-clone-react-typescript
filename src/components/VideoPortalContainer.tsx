import { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Portal from "@mui/material/Portal";

import AnniversaryCenterModal from "./AnniversaryCenterModal";
import MotionContainer from "./animate/MotionContainer";
import {
  varZoomIn,
  varZoomInLeft,
  varZoomInRight,
} from "./animate/variants/zoom/ZoomIn";
import { usePortalData } from "src/providers/PortalProvider";
import { useDetailModal } from "src/providers/DetailModalProvider";

export default function VideoPortalContainer() {
  const { miniModalMediaData, anchorElement } = usePortalData();
  const { detail } = useDetailModal();
  const container = useRef<HTMLDivElement | null>(null);
  const portalMeasureRef = useRef<HTMLDivElement | null>(null);
  const [portalH, setPortalH] = useState<number | null>(null);
  const rect = anchorElement?.getBoundingClientRect();

  const hasToRender = !!miniModalMediaData && !!anchorElement && !detail.mediaDetail; // si hay modal de detalle abierto, ocultar portal
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

  // Modal general (reemplaza el anterior) con diferente factor para anniversary
  if (hasToRender && miniModalMediaData && anchorElement && rect) {
    const anniversary = isAnniversary;
    const factor = anniversary ? 1.6 : 1.2;
    const maxWidth = anniversary ? 720 : 640;
    const verticalFactor = anniversary ? 0.55 : 0.65;
    const top = rect.top + window.pageYOffset - rect.height * verticalFactor * -0.001 ;
    const left = rect.left + window.pageXOffset + rect.width * -0.1;
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
            zIndex: 1200, // menor que el dialog de detalle
            pointerEvents: "auto",
          }}
        >
          <AnniversaryCenterModal
            video={miniModalMediaData}
            anchorRect={rect}
            widthFactor={factor}
            maxWidth={maxWidth}
          />
        </motion.div>
      </Portal>
    );
  }

  return (
    <>
      {shouldShowPortal && (
        <Portal container={container.current}>
          {null}
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
