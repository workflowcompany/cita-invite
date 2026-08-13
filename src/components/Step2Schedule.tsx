import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { config, type DayId } from "../config";
import { OptionCard } from "./OptionCard";

interface Step2ScheduleProps {
  selectedDay: DayId | null;
  onSelectDay: (id: DayId) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Schedule({
  selectedDay,
  onSelectDay,
  onNext,
  onBack,
}: Step2ScheduleProps) {
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  useEffect(() => {
    if (!selectedDay) return;
    const timer = window.setTimeout(() => onNextRef.current(), 400);
    return () => window.clearTimeout(timer);
  }, [selectedDay]);

  return (
    <div className="flex flex-col">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="title-display text-center text-[var(--color-text)]"
        style={{ fontSize: "clamp(1.75rem, 6vw, 3rem)" }}
      >
        {config.texts.step2.title}
      </motion.h2>

      <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {config.days.map((day) => (
          <OptionCard
            key={day.id}
            label={day.label}
            emoji={day.emoji}
            subtitle={day.subtitle}
            image={day.image}
            alt={day.alt}
            selected={selectedDay === day.id}
            onSelect={() => onSelectDay(day.id)}
          />
        ))}
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-[var(--color-text)]/50 transition-colors hover:text-[var(--color-text)]/80"
        >
          ← {config.texts.step2.back}
        </button>
      </div>
    </div>
  );
}
