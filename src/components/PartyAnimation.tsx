import { motion } from "framer-motion";

const floats = [
  { emoji: "🎉", x: "12%", y: "18%", delay: 0, duration: 2.8 },
  { emoji: "✨", x: "78%", y: "12%", delay: 0.2, duration: 3.2 },
  { emoji: "💕", x: "85%", y: "55%", delay: 0.4, duration: 2.6 },
  { emoji: "🥳", x: "8%", y: "62%", delay: 0.15, duration: 3 },
  { emoji: "🎊", x: "48%", y: "8%", delay: 0.35, duration: 2.4 },
  { emoji: "💖", x: "28%", y: "72%", delay: 0.5, duration: 3.4 },
  { emoji: "🪩", x: "62%", y: "68%", delay: 0.25, duration: 2.9 },
  { emoji: "⭐", x: "38%", y: "28%", delay: 0.45, duration: 3.1 },
];

export function PartyAnimation() {
  return (
    <div
      className="party-scene relative mx-auto flex h-44 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl sm:h-52"
      aria-hidden="true"
    >
      <div className="party-glow absolute inset-0 rounded-2xl" />

      <motion.div
        className="relative z-10 text-6xl sm:text-7xl"
        animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        🎉
      </motion.div>

      {floats.map(({ emoji, x, y, delay, duration }, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl sm:text-3xl"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.85, 1.15, 0.85],
            y: [0, -12, 0],
            rotate: [0, i % 2 === 0 ? 15 : -15, 0],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {emoji}
        </motion.span>
      ))}

      {[...Array(6)].map((_, i) => (
        <motion.span
          key={`spark-${i}`}
          className="absolute h-1.5 w-1.5 rounded-full bg-[var(--color-accent-secondary)]"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 22}%`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{
            duration: 1.8,
            delay: i * 0.25,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
