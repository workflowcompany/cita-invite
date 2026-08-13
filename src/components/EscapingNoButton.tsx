interface EscapingNoButtonProps {
  noButtonRef: React.RefObject<HTMLButtonElement | null>;
  label: string;
  offset: { x: number; y: number };
  scale: number;
  opacity: number;
  isFinalCorner: boolean;
  prefersReducedMotion: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onClick: (e: React.MouseEvent) => void;
}

export function EscapingNoButton({
  noButtonRef,
  label,
  offset,
  scale,
  opacity,
  isFinalCorner,
  prefersReducedMotion,
  onPointerDown,
  onTouchStart,
  onClick,
}: EscapingNoButtonProps) {
  return (
    <button
      ref={noButtonRef}
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      onClick={onClick}
      onPointerDown={onPointerDown}
      onTouchStart={onTouchStart}
      className={`absolute left-1/2 top-1/2 z-20 max-w-[calc(100%-2rem)] select-none truncate rounded-full border-2 border-[var(--color-text)]/20 bg-[var(--color-bg-radial)] px-5 py-2 text-sm font-medium text-[var(--color-text)]/80 md:max-w-none md:px-8 md:py-3 md:text-base ${isFinalCorner ? "shake-loop" : ""}`}
      style={{
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        opacity,
        ["--tx" as string]: `${offset.x}px`,
        ["--ty" as string]: `${offset.y}px`,
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,
        transition: prefersReducedMotion
          ? "none"
          : "transform 0.3s cubic-bezier(0.34, 1.3, 0.64, 1)",
      }}
    >
      {label}
    </button>
  );
}
