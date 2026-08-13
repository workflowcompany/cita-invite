interface OptionCardProps {
  label: string;
  emoji: string;
  subtitle?: string;
  image: string;
  alt: string;
  selected: boolean;
  onSelect: () => void;
}

export function OptionCard({
  label,
  emoji,
  subtitle,
  image,
  alt,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-secondary)] ${
        selected
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 shadow-[0_0_24px_rgba(255,61,110,0.2)]"
          : "border-[var(--color-text)]/12 bg-[var(--color-bg-radial)]/90 hover:border-[var(--color-text)]/25"
      }`}
    >
      <img
        src={image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12] transition-opacity duration-300 group-hover:opacity-[0.18]"
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-r transition-opacity duration-300 ${
          selected
            ? "from-[var(--color-accent)]/20 via-transparent to-transparent opacity-100"
            : "from-[var(--color-text)]/5 via-transparent to-transparent opacity-80"
        }`}
      />

      <span className="relative shrink-0 text-3xl leading-none" aria-hidden="true">
        {emoji}
      </span>

      <div className="relative min-w-0 flex-1">
        <p className="text-base font-semibold leading-tight text-[var(--color-text)]">
          {label}
        </p>
        {subtitle && (
          <p className="mt-0.5 text-sm leading-snug text-[var(--color-text)]/55">
            {subtitle}
          </p>
        )}
      </div>

      {selected && (
        <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)] text-[var(--color-bg)]">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M2.5 7L5.5 10L11.5 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      <span className="sr-only">{alt}</span>
    </button>
  );
}
