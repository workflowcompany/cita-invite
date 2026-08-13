import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getImagesForStep, type DayId, type PlanId } from "./config";
import { ProgressDots } from "./components/ProgressDots";
import { Step1Question } from "./components/Step1Question";
import { Step2Schedule } from "./components/Step2Schedule";
import { Step3Plan } from "./components/Step3Plan";
import { Step4Confirmation } from "./components/Step4Confirmation";

function preloadImages(urls: string[]) {
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<DayId | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<PlanId[]>([]);

  useEffect(() => {
    preloadImages(getImagesForStep(step));
  }, [step]);

  const goToStep = useCallback((next: number) => setStep(next), []);

  const handleTogglePlan = useCallback((id: PlanId) => {
    setSelectedPlans((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }, []);

  const stepVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  };

  return (
    <div className="app-bg relative flex min-h-[100dvh] flex-col">
      <div className="noise-overlay" aria-hidden="true" />

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-8 sm:px-6">
        <ProgressDots currentStep={step} />

        <div className="flex flex-1 flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <Step1Question onYes={() => goToStep(2)} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <Step2Schedule
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                  onNext={() => goToStep(3)}
                  onBack={() => goToStep(1)}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <Step3Plan
                  selectedPlans={selectedPlans}
                  onTogglePlan={handleTogglePlan}
                  onNext={() => goToStep(4)}
                  onBack={() => goToStep(2)}
                />
              </motion.div>
            )}

            {step === 4 && selectedDay && selectedPlans.length > 0 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <Step4Confirmation
                  selectedDay={selectedDay}
                  selectedPlans={selectedPlans}
                  onChange={() => goToStep(2)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
