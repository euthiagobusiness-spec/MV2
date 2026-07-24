"use client";

import { useEffect, useRef, useState } from "react";

import { TourOverlay } from "@/components/tour/TourOverlay";
import { useCondominiumTour } from "@/components/tour/useCondominiumTour";

type TourOrientation = "landscape" | "portrait";

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: TourOrientation) => Promise<void>;
  unlock?: () => void;
};

type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
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
    updateVisualSettings,
    updateVerticalDirection,
    visualSettings,
  } = useCondominiumTour();

  useEffect(() => {
    const updateFullscreenState = () => {
      const fullscreenDocument = document as FullscreenDocument;
      const fullscreenElement =
        document.fullscreenElement ??
        fullscreenDocument.webkitFullscreenElement ??
        null;
      const tourIsFullscreen = fullscreenElement === sectionRef.current;

      setIsFullscreen(tourIsFullscreen);
      if (!fullscreenElement) {
        setIsMobileTourStarted(false);
      }
    };

    document.addEventListener("fullscreenchange", updateFullscreenState);
    document.addEventListener(
      "webkitfullscreenchange",
      updateFullscreenState,
    );
    return () => {
      document.removeEventListener(
        "fullscreenchange",
        updateFullscreenState,
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        updateFullscreenState,
      );
    };
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

  const lockOrientation = async (value: TourOrientation) => {
    const orientation = screen.orientation as
      | LockableOrientation
      | undefined;

    try {
      await orientation?.lock?.(value);
    } catch {
      // Orientation locking is best-effort outside installed web apps.
    }
  };

  const requestTourFullscreen = async () => {
    const tourElement = sectionRef.current as FullscreenElement | null;

    if (!tourElement) {
      return;
    }

    if (tourElement.requestFullscreen) {
      await tourElement.requestFullscreen({
        navigationUI: "hide",
      });
      return;
    }

    await tourElement.webkitRequestFullscreen?.();
  };

  const startMobileTour = async () => {
    selectMode("walk");
    setIsMobileTourStarted(true);

    const fullscreenDocument = document as FullscreenDocument;
    const fullscreenElement =
      document.fullscreenElement ??
      fullscreenDocument.webkitFullscreenElement;

    if (!fullscreenElement) {
      try {
        await requestTourFullscreen();
      } catch {
        // iPhone Safari can reject element fullscreen for regular sites.
      }
    }

    await lockOrientation("landscape");
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
        await requestTourFullscreen();
        if (isMobile) {
          await lockOrientation("landscape");
        }
      }
    } catch {
      // Some mobile browsers expose the API but still reject the request.
    }
  };

  const exitMobileTour = async () => {
    updateMobileMovement(0, 0);
    setIsMobileTourStarted(false);
    selectMode("overview");
    await lockOrientation("portrait");

    const fullscreenDocument = document as FullscreenDocument;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (fullscreenDocument.webkitFullscreenElement) {
        await fullscreenDocument.webkitExitFullscreen?.();
      }
    } catch {
      // The interface still returns to its initial state.
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
        className={`pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage:
            "url('/uploads/condominium/084657bf-ecb2-4fd3-971b-4e7ff02a14fe.jpg')",
        }}
      />
      <div
        className={`absolute inset-0 bg-slate-950/18 transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />
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
        onExitMobileTour={exitMobileTour}
        onReset={resetView}
        onRetry={() => window.location.reload()}
        onRunToggle={toggleRunning}
        onStartMobileTour={startMobileTour}
        onToggleFullscreen={toggleFullscreen}
        onVisualSettingsChange={updateVisualSettings}
        onVerticalDirectionChange={updateVerticalDirection}
        visualSettings={visualSettings}
      />
    </section>
  );
}
