export const PLAN_TYPES = {
  image_only: {
    id: "image_only",
    name: "Solo Immagine",
    type: "image" as const,
    limit: 5,
    description: "5 immagini al mese",
    features: [
      "5 immagini al mese (JPG o GIF)",
      "QR code statico dedicato",
      "Scheduling contenuti",
      "Link permanente",
    ],
    monthly: {
      price: 10,
      stripePriceId: process.env.STRIPE_PRICE_IMAGE_ONLY_MONTHLY,
    },
    annual: {
      price: 99,
      monthlyEquiv: 8.25,
      stripePriceId: process.env.STRIPE_PRICE_IMAGE_ONLY_ANNUAL,
    },
  },
  plus_video: {
    id: "plus_video",
    name: "Immagine + Video",
    type: "video" as const,
    limit: 5,
    description: "5 upload al mese",
    features: [
      "5 upload totali (Immagini o Video)",
      "QR code statico dedicato",
      "Video autoplay mobile",
      "Scheduling avanzato",
    ],
    monthly: {
      price: 15,
      stripePriceId: process.env.STRIPE_PRICE_PLUS_VIDEO_MONTHLY,
    },
    annual: {
      price: 119,
      monthlyEquiv: 9.9,
      stripePriceId: process.env.STRIPE_PRICE_PLUS_VIDEO_ANNUAL,
    },
  },
  unlimited: {
    id: "unlimited",
    name: "Unlimited",
    type: "video" as const,
    limit: null,
    description: "Upload illimitati",
    features: [
      "Caricamenti illimitati",
      "Foto e Video inclusi",
      "QR code statico dedicato",
      "Priorità supporto",
    ],
    monthly: null, // Nessun piano mensile previsto
    annual: {
      price: 249,
      monthlyEquiv: 20.75,
      stripePriceId: process.env.STRIPE_PRICE_UNLIMITED_ANNUAL,
    },
  },
} as const;

export type PlanId = keyof typeof PLAN_TYPES;
export type BillingInterval = "monthly" | "annual";

export function getPlan(planId: string) {
  return PLAN_TYPES[planId as PlanId] ?? PLAN_TYPES.image_only;
}

export function getStripePriceId(planId: string, interval: BillingInterval): string | undefined {
  const plan = getPlan(planId);
  if (interval === "monthly" && !plan.monthly) return undefined;
  return interval === "monthly" ? plan.monthly?.stripePriceId : plan.annual.stripePriceId;
}

export function getPlanPrice(planId: string, interval: BillingInterval): number {
  const plan = getPlan(planId);
  if (interval === "monthly" && !plan.monthly) return 0;
  return interval === "monthly" ? (plan.monthly?.price ?? 0) : plan.annual.price;
}

export function canUpload(
  planId: string,
  uploadCount: number,
  uploadResetDate: Date
): boolean {
  const plan = getPlan(planId);
  if (plan.limit === null) return true;

  const now = new Date();
  const resetDate = new Date(uploadResetDate);
  if (
    now.getMonth() !== resetDate.getMonth() ||
    now.getFullYear() !== resetDate.getFullYear()
  ) {
    return true; // Contatore si resetterà al prossimo upload
  }

  return uploadCount < plan.limit;
}

// Backward compat: usato in posti che non hanno ancora il billing interval
export const PLANS = PLAN_TYPES;
