"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { TourOverlay } from "@/components/tour/TourOverlay";
import { useCondominiumTour } from "@/components/tour/useCondominiumTour";

export function CondominiumTour() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const {
    error,
    isLoaded,
    loadProgress,
    mode,
    mountRef,
    resetView,
    selectMode,
    updateWalkDirection,
  } = useCondominiumTour();

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === sectionRef.current);
    };

    document.addEventListener("fullscreenchange", updateFullscreenState);
    return () =>
      document.removeEventListener(
        "fullscreenchange",
        updateFullscreenState,
      );
  }, []);

  const toggleFullscreen = async () => {
    const tourElement = sectionRef.current;

    if (!tourElement) {
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await tourElement.requestFullscreen();
      }
    } catch {
      // Some mobile browsers expose the API but still reject the request.
    }
  };

  return (
    <section
      className="relative h-svh min-h-[480px] w-full overflow-hidden bg-sky-100"
      data-loaded={isLoaded}
      data-mode={mode}
      ref={sectionRef}
    >
      <Image
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        fill
        sizes="100vw"
        src="/uploads/condominium/084657bf-ecb2-4fd3-971b-4e7ff02a14fe.jpg"
      />
      <div className="absolute inset-0 bg-slate-950/18" />
      <div className="absolute inset-0 z-[1]" ref={mountRef} />
      <TourOverlay
        error={error}
        isFullscreen={isFullscreen}
        isLoaded={isLoaded}
        loadProgress={loadProgress}
        mode={mode}
        onModeChange={selectMode}
        onReset={resetView}
        onRetry={() => window.location.reload()}
        onToggleFullscreen={toggleFullscreen}
        onWalkDirectionChange={updateWalkDirection}
      />
    </section>
  );
}
