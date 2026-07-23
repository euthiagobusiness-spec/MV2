"use client";

import { useEffect, useRef, useState } from "react";

import { TourOverlay } from "@/components/tour/TourOverlay";
import { useCondominiumTour } from "@/components/tour/useCondominiumTour";

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: "landscape") => Promise<void>;
};

export function CondominiumTour() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileTourStarted, setIsMobileTourStarted] =
    useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const {
    activeRoute,
    error,
    isLoaded,
    isPointerLocked,
    isRunning,
    loadProgress,
    mode,
    mountRef,
    navigateTo,
    resetView,
    selectMode,
    toggleRunning,
    updateMobileMovement,
    updateVerticalDirection,
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

  useEffect(() => {
    const mobileQuery = window.matchMedia(
      "(max-width: 767px), (pointer: coarse)",
    );
    const portraitQuery = window.matchMedia(
      "(orientation: portrait)",
    );
    const updateDeviceState = () => {
      setIsMobile(mobileQuery.matches);
      setIsPortrait(portraitQuery.matches);
    };

    updateDeviceState();
    mobileQuery.addEventListener("change", updateDeviceState);
    portraitQuery.addEventListener("change", updateDeviceState);
    window.addEventListener("orientationchange", updateDeviceState);
    window.addEventListener("resize", updateDeviceState);

    return () => {
      mobileQuery.removeEventListener("change", updateDeviceState);
      portraitQuery.removeEventListener("change", updateDeviceState);
      window.removeEventListener(
        "orientationchange",
        updateDeviceState,
      );
      window.removeEventListener("resize", updateDeviceState);
    };
  }, []);

  const lockLandscape = async () => {
    const orientation = screen.orientation as
      | LockableOrientation
      | undefined;

    try {
      await orientation?.lock?.("landscape");
    } catch {
      // Browsers without orientation locking keep the rotate-device gate.
    }
  };

  const startMobileTour = async () => {
    const tourElement = sectionRef.current;

    selectMode("walk");

    if (tourElement && !document.fullscreenElement) {
      try {
        await tourElement.requestFullscreen({
          navigationUI: "hide",
        });
      } catch {
        // iOS Safari can reject element fullscreen; landscape still works.
      }
    }

    await lockLandscape();
    setIsMobileTourStarted(true);
  };

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
        if (isMobile) {
          await lockLandscape();
        }
      }
    } catch {
      // Some mobile browsers expose the API but still reject the request.
    }
  };

  return (
    <section
      className="relative h-dvh w-full touch-none overflow-hidden overscroll-none bg-sky-100"
      data-loaded={isLoaded}
      data-mobile={isMobile}
      data-mode={mode}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      ref={sectionRef}
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/uploads/condominium/084657bf-ecb2-4fd3-971b-4e7ff02a14fe.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-slate-950/18" />
      <div className="absolute inset-0 z-[1]" ref={mountRef} />
      <TourOverlay
        activeRoute={activeRoute}
        error={error}
        isFullscreen={isFullscreen}
        isLoaded={isLoaded}
        isMobile={isMobile}
        isMobileTourStarted={isMobileTourStarted}
        isPointerLocked={isPointerLocked}
        isPortrait={isPortrait}
        isRunning={isRunning}
        loadProgress={loadProgress}
        mode={mode}
        onModeChange={selectMode}
        onMobileMovementChange={updateMobileMovement}
        onNavigate={navigateTo}
        onReset={resetView}
        onRetry={() => window.location.reload()}
        onRunToggle={toggleRunning}
        onStartMobileTour={startMobileTour}
        onToggleFullscreen={toggleFullscreen}
        onVerticalDirectionChange={updateVerticalDirection}
      />
    </section>
  );
}
