interface ProgressDotsProps {
  currentStep: number;
  totalSteps?: number;
}

export function ProgressDots({ currentStep, totalSteps = 4 }: ProgressDotsProps) {
  if (currentStep < 2) return null;

  return (
    <div
      className="mb-8 flex items-center justify-center gap-2"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Paso ${currentStep} de ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step <= currentStep;
        return (
          <span
            key={step}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              isActive
                ? "scale-110 bg-[var(--color-accent)]"
                : "bg-[var(--color-text)]/20"
            }`}
          />
        );
      })}
    </div>
  );
}
