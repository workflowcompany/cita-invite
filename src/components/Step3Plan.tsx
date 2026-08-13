import { config, type PlanId } from "../config";
import { motion } from "framer-motion";
import { OptionCard } from "./OptionCard";

interface Step3PlanProps {
  selectedPlans: PlanId[];
  onTogglePlan: (id: PlanId) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3Plan({
  selectedPlans,
  onTogglePlan,
  onNext,
  onBack,
}: Step3PlanProps) {
  const canContinue = selectedPlans.length >= 1;

  return (
    <div className="flex flex-col">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="title-display text-center text-[var(--color-text)]"
        style={{ fontSize: "clamp(1.75rem, 6vw, 3rem)" }}
      >
        {config.texts.step3.title}
      </motion.h2>

      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3">
        {config.plans.map((plan) => (
          <OptionCard
            key={plan.id}
            label={plan.label}
            emoji={plan.emoji}
            image={plan.image}
            alt={plan.alt}
            selected={selectedPlans.includes(plan.id)}
            onSelect={() => onTogglePlan(plan.id)}
          />
        ))}
      </div>

      {!canContinue && (
        <p className="mt-4 text-center text-sm text-[var(--color-text)]/50">
          {config.texts.step3.minSelectionHint}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-[var(--color-text)]/50 transition-colors hover:text-[var(--color-text)]/80"
        >
          ← {config.texts.step3.back}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {config.texts.step3.next}
        </button>
      </div>
    </div>
  );
}
