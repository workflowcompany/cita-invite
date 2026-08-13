import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { config, type DayId, type PlanId } from "../config";
import { PartyAnimation } from "./PartyAnimation";

interface Step4ConfirmationProps {
  selectedDay: DayId;
  selectedPlans: PlanId[];
  onChange: () => void;
}

function getDayLabel(id: DayId): string {
  return config.days.find((d) => d.id === id)?.label ?? id;
}

function getPlanLabels(ids: PlanId[]): string[] {
  return ids.map((id) => config.plans.find((p) => p.id === id)?.label ?? id);
}

export function Step4Confirmation({
  selectedDay,
  selectedPlans,
  onChange,
}: Step4ConfirmationProps) {
  const dayLabel = getDayLabel(selectedDay);
  const planLabels = getPlanLabels(selectedPlans);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const colors = ["#FF3D6E", "#FFC145", "#6FE0C0", "#F7ECE1"];
    const duration = 3500;
    const end = Date.now() + duration;

    const burst = () => {
      confetti({ particleCount: 80, spread: 70, origin: { x: 0.5, y: 0.45 }, colors });
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      });
    };

    burst();

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.65 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  }, []);

  const message = config.texts.whatsappMessage(dayLabel, planLabels);
  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <PartyAnimation />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="title-display mt-8 text-[var(--color-text)]"
        style={{ fontSize: "clamp(2rem, 7vw, 4rem)" }}
      >
        {config.texts.step4.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-4 text-base text-[var(--color-text)]/75"
      >
        <span className="text-[var(--color-accent-secondary)]">
          {config.texts.step4.dayPrefix}
        </span>{" "}
        {dayLabel}
        <span className="mx-2 text-[var(--color-text)]/30">·</span>
        <span className="text-[var(--color-accent-secondary)]">
          {config.texts.step4.plansPrefix}
        </span>{" "}
        {planLabels.join(", ")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-8 flex w-full flex-col gap-3"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-yes-glow rounded-full bg-[var(--color-accent)] px-8 py-4 text-center text-lg font-semibold text-white no-underline transition-transform hover:brightness-110"
        >
          {config.texts.step4.whatsappButton(config.recipientName)}
        </a>
        <button
          type="button"
          onClick={onChange}
          className="rounded-full border border-[var(--color-text)]/20 px-8 py-3 text-sm text-[var(--color-text)]/70 transition-colors hover:border-[var(--color-text)]/40 hover:text-[var(--color-text)]"
        >
          {config.texts.step4.changeButton}
        </button>
      </motion.div>
    </div>
  );
}
