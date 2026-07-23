"use client";

import {
  FastForward,
  MoveDown,
  MoveUp,
} from "lucide-react";
import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";

import type { VerticalDirection } from "@/components/tour/tour-types";

type MobileTourControlsProps = {
  isRunning: boolean;
  onMovementChange: (right: number, forward: number) => void;
  onRunToggle: () => void;
  onVerticalDirectionChange: (
    direction: VerticalDirection,
    active: boolean,
  ) => void;
};

type JoystickPosition = {
  x: number;
  y: number;
};

function HoldAction({
  children,
  label,
  onActiveChange,
}: {
  children: ReactNode;
  label: string;
  onActiveChange: (active: boolean) => void;
}) {
  const release = (
    event?: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    if (
      event &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onActiveChange(false);
  };

  return (
    <button
      aria-label={label}
      className="grid size-12 touch-none place-items-center rounded-md bg-slate-950/88 text-white shadow-lg ring-1 ring-white/25 active:bg-sky-700"
      onContextMenu={(event) => event.preventDefault()}
      onLostPointerCapture={() => onActiveChange(false)}
      onPointerCancel={release}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        onActiveChange(true);
      }}
      onPointerUp={release}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function MovementJoystick({
  onMovementChange,
}: {
  onMovementChange: (right: number, forward: number) => void;
}) {
  const activePointer = useRef<number | null>(null);
  const [position, setPosition] = useState<JoystickPosition>({
    x: 0,
    y: 0,
  });

  const updatePosition = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const radius = Math.min(bounds.width, bounds.height) * 0.31;
    const rawX = event.clientX - (bounds.left + bounds.width / 2);
    const rawY = event.clientY - (bounds.top + bounds.height / 2);
    const distance = Math.hypot(rawX, rawY);
    const scale = distance > radius ? radius / distance : 1;
    const x = rawX * scale;
    const y = rawY * scale;

    setPosition({ x, y });
    onMovementChange(x / radius, -y / radius);
  };

  const release = (
    event?: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    if (
      event &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    activePointer.current = null;
    setPosition({ x: 0, y: 0 });
    onMovementChange(0, 0);
  };

  return (
    <button
      aria-label="Controle direcional"
      className="relative size-[112px] shrink-0 touch-none rounded-full border border-white/25 bg-slate-950/55 shadow-xl backdrop-blur-sm"
      onContextMenu={(event) => event.preventDefault()}
      onLostPointerCapture={() => release()}
      onPointerCancel={release}
      onPointerDown={(event) => {
        event.preventDefault();
        activePointer.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        updatePosition(event);
      }}
      onPointerMove={(event) => {
        if (activePointer.current !== event.pointerId) {
          return;
        }
        event.preventDefault();
        updatePosition(event);
      }}
      onPointerUp={release}
      type="button"
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-2 h-[calc(100%-1rem)] w-px -translate-x-1/2 bg-white/12"
      />
      <span
        aria-hidden="true"
        className="absolute left-2 top-1/2 h-px w-[calc(100%-1rem)] -translate-y-1/2 bg-white/12"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-sky-600 text-[10px] font-black text-white shadow-lg"
        style={{
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        }}
      >
        5x
      </span>
    </button>
  );
}

export function MobileTourControls({
  isRunning,
  onMovementChange,
  onRunToggle,
  onVerticalDirectionChange,
}: MobileTourControlsProps) {
  return (
    <div
      aria-label="Controles de caminhada"
      className="pointer-events-auto flex w-full items-end justify-between gap-5"
      onContextMenu={(event) => event.preventDefault()}
    >
      <MovementJoystick onMovementChange={onMovementChange} />

      <div className="grid grid-cols-2 gap-2">
        <button
          aria-pressed={isRunning}
          className={`col-span-2 flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-xs font-black text-white shadow-lg ring-1 ring-white/25 ${
            isRunning ? "bg-sky-600" : "bg-slate-950/88"
          }`}
          onClick={onRunToggle}
          onContextMenu={(event) => event.preventDefault()}
          title="Correr em velocidade 10x"
          type="button"
        >
          <FastForward size={18} />
          Correr 10x
        </button>
        <HoldAction
          label="Subir enquanto estiver pressionado"
          onActiveChange={(active) =>
            onVerticalDirectionChange("up", active)
          }
        >
          <MoveUp size={21} />
        </HoldAction>
        <HoldAction
          label="Descer enquanto estiver pressionado"
          onActiveChange={(active) =>
            onVerticalDirectionChange("down", active)
          }
        >
          <MoveDown size={21} />
        </HoldAction>
      </div>
    </div>
  );
}
