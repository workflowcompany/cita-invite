import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { config } from "../config";
import { useEscapingButton } from "../hooks/useEscapingButton";
import { EscapingNoButton } from "./EscapingNoButton";

interface Step1QuestionProps {
  onYes: () => void;
}

function getNoLabel(escapeCount: number): string {
  const labels = config.texts.step1.noLabels;
  return labels[Math.min(escapeCount, labels.length - 1)];
}

function getMicrocopy(escapeCount: number): string {
  const copies = config.texts.step1.microcopy;
  if (escapeCount === 0) return "";
  if (escapeCount <= 2) return copies[1];
  if (escapeCount <= 5) return copies[2];
  return copies[3];
}

export function Step1Question({ onYes }: Step1QuestionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const [toast, setToast] = useState("");

  const {
    offset,
    escapeCount,
    isFinalCorner,
    prefersReducedMotion,
    yesScale,
    noScale,
    noOpacity,
    handlePointerDown,
    handleTouchStart,
    handleNoClick,
  } = useEscapingButton({
    containerRef,
    yesButtonRef,
    noButtonRef,
  });

  const showToast = () => {
    setToast(config.texts.step1.noClickMessage);
    window.setTimeout(() => setToast(""), 2200);
  };

  const handleNoClickWithToast = (e: React.MouseEvent) => {
    handleNoClick(e);
    showToast();
  };

  return (
    <div className="flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="title-display text-center text-[var(--color-text)]"
      >
        {config.texts.step1.title}
      </motion.h1>

      {escapeCount > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-sm text-[var(--color-text)]/60"
        >
          {getMicrocopy(escapeCount)}
        </motion.p>
      )}

      <div className="relative mt-8 aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl">
        <img
          src={config.images.hero}
          alt="Sebas invitando a salir"
          loading="eager"
          className="h-full w-full object-cover"
        />
      </div>

      <div
        ref={containerRef}
        className="relative mt-10 flex w-full min-h-[280px] items-center justify-center overflow-visible sm:min-h-[260px] md:min-h-[200px]"
      >
        <button
          ref={yesButtonRef}
          type="button"
          onClick={onYes}
          className="btn-yes-glow relative z-10 rounded-full bg-[var(--color-accent)] px-8 py-3 text-base font-semibold text-white md:px-12 md:py-4 md:text-lg"
          style={{
            transform: `scale(${yesScale})`,
            transition: prefersReducedMotion ? "none" : "transform 0.3s ease",
          }}
        >
          {config.texts.step1.yes}
        </button>

        <EscapingNoButton
          noButtonRef={noButtonRef}
          label={getNoLabel(escapeCount)}
          offset={offset}
          scale={noScale}
          opacity={noOpacity}
          isFinalCorner={isFinalCorner}
          prefersReducedMotion={prefersReducedMotion}
          onPointerDown={handlePointerDown}
          onTouchStart={handleTouchStart}
          onClick={handleNoClickWithToast}
        />
      </div>

      {toast && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-sm text-[var(--color-accent-secondary)]"
          role="status"
        >
          {toast}
        </motion.p>
      )}
    </div>
  );
}
