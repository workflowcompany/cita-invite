const BASE = import.meta.env.BASE_URL;

export const config = {
  /** Número de WhatsApp en formato internacional sin + ni espacios (ej: 573001234567) */
  whatsappNumber: "573209003342",

  /** Nombre de la persona que recibe el mensaje */
  recipientName: "Sebas",

  texts: {
    step1: {
      title: "¿Quieres salir conmigo?",
      yes: "Sí",
      noLabels: ["No", "¿Segura?", "Piénsalo bien", "Ríndete", "Ya, di que sí"],
      microcopy: [
        "",
        "Tranquila, tómate tu tiempo",
        "El botón tiene voluntad propia",
        "Esto ya es evidente",
      ],
      noClickMessage: "Ese botón no sirve, es decorativo",
    },
    step2: {
      title: "¿Qué día te queda mejor?",
      next: "Siguiente",
      back: "Atrás",
    },
    step3: {
      title: "¿Y qué te provoca hacer?",
      next: "Siguiente",
      back: "Atrás",
      minSelectionHint: "Elige al menos una opción",
    },
    step4: {
      title: "Listo. Es una cita.",
      whatsappButton: (name: string) => `Mandarle el plan a ${name}`,
      changeButton: "Cambiar algo",
      dayPrefix: "Día:",
      plansPrefix: "Plan:",
    },
    whatsappMessage: (day: string, plans: string[]) =>
      `¡Hola ${config.recipientName}! 💕 Sí quiero salir contigo. Me queda mejor el ${day.toLowerCase()}. Me provoca ${plans.map((p) => p.toLowerCase()).join(", ")}. ¡Es una cita!`,
  },

  images: {
    hero: `${BASE}img/hero.jpg`,
    final: `${BASE}img/final.jpg`,
  },

  days: [
    {
      id: "sabado",
      label: "Sábado",
      emoji: "🌤️",
      subtitle: "Tarde libre, cero prisa",
      image: `${BASE}img/day-sabado.jpg`,
      alt: "Ilustración para salir un sábado",
    },
    {
      id: "domingo",
      label: "Domingo",
      emoji: "☀️",
      subtitle: "Brunch y calma",
      image: `${BASE}img/day-domingo.jpg`,
      alt: "Ilustración para salir un domingo",
    },
    {
      id: "lunes",
      label: "Lunes",
      emoji: "✨",
      subtitle: "Empezar la semana bonito",
      image: `${BASE}img/day-lunes.jpg`,
      alt: "Ilustración para salir un lunes",
    },
  ],

  plans: [
    {
      id: "comer",
      label: "Comer",
      emoji: "🍽️",
      image: `${BASE}img/plan-comer.jpg`,
      alt: "Plan para ir a comer",
    },
    {
      id: "cafe",
      label: "Tomar café",
      emoji: "☕",
      image: `${BASE}img/plan-cafe.jpg`,
      alt: "Plan para tomar café",
    },
    {
      id: "cocteles",
      label: "Cócteles",
      emoji: "🍸",
      image: `${BASE}img/plan-cocteles.jpg`,
      alt: "Plan para tomar cócteles",
    },
    {
      id: "bailar",
      label: "Bailar",
      emoji: "💃",
      image: `${BASE}img/plan-bailar.jpg`,
      alt: "Plan para bailar",
    },
    {
      id: "cine",
      label: "Cine",
      emoji: "🎬",
      image: `${BASE}img/plan-cine.jpg`,
      alt: "Plan para ir al cine",
    },
    {
      id: "sorpresa",
      label: "Sorpréndeme",
      emoji: "🎁",
      image: `${BASE}img/plan-sorpresa.jpg`,
      alt: "Plan sorpresa",
    },
  ],
} as const;

export type DayId = (typeof config.days)[number]["id"];
export type PlanId = (typeof config.plans)[number]["id"];

/** Imágenes a precargar según el paso actual */
export function getImagesForStep(step: number): string[] {
  switch (step) {
    case 1:
      return config.days.map((d) => d.image);
    case 2:
      return config.plans.map((p) => p.image);
    case 3:
      return [config.images.final];
    default:
      return [];
  }
}
