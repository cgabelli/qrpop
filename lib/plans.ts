export const PLAN_TYPES = {
  basic_image: {
    id: "basic_image",
    name: "Immagine Base",
    type: "image" as const,
    limit: 3,
    description: "3 upload al mese",
    features: [
      "3 immagini al mese",
      "QR code statico dedicato",
      "Scheduling contenuti",
      "Link permanente",
    ],
    monthly: {
      price: 10,
      stripePriceId: process.env.STRIPE_PRICE_BASIC_IMAGE_MONTHLY,
    },
    annual: {
      price: 99,        // €8.25/mese — risparmio 17%
      monthlyEquiv: 8,  // per visualizzazione
      stripePriceId: process.env.STRIPE_PRICE_BASIC_IMAGE_ANNUAL,
    },
  },
  unlimited_image: {
    id: "unlimited_image",
    name: "Immagine Unlimited",
    type: "image" as const,
    limit: null,
    description: "Upload illimitati",
    features: [
      "Immagini illimitate",
      "QR code statico dedicato",
      "Scheduling avanzato",
      "Link permanente",
      "Priorità supporto",
    ],
    monthly: {
      price: 15,
      stripePriceId: process.env.STRIPE_PRICE_UNLIMITED_IMAGE_MONTHLY,
    },
    annual: {
      price: 149,
      monthlyEquiv: 12,
      stripePriceId: process.env.STRIPE_PRICE_UNLIMITED_IMAGE_ANNUAL,
    },
  },
  basic_video: {
    id: "basic_video",
    name: "Video Base",
    type: "video" as const,
    limit: 2,
    description: "2 video al mese",
    features: [
      "2 video al mese",
      "QR code statico dedicato",
      "Video autoplay mobile",
      "Scheduling contenuti",
    ],
    monthly: {
      price: 20,
      stripePriceId: process.env.STRIPE_PRICE_BASIC_VIDEO_MONTHLY,
    },
    annual: {
      price: 199,
      monthlyEquiv: 17,
      stripePriceId: process.env.STRIPE_PRICE_BASIC_VIDEO_ANNUAL,
    },
  },
  unlimited_video: {
    id: "unlimited_video",
    name: "Video Unlimited",
    type: "video" as const,
    limit: null,
    description: "Video illimitati",
    features: [
      "Video illimitati",
      "QR code statico dedicato",
      "Video autoplay mobile",
      "Scheduling avanzato",
      "Priorità supporto",
      "Analytics (prossimamente)",
    ],
    monthly: {
      price: 50,
      stripePriceId: process.env.STRIPE_PRICE_UNLIMITED_VIDEO_MONTHLY,
    },
    annual: {
      price: 499,
      monthlyEquiv: 42,
      stripePriceId: process.env.STRIPE_PRICE_UNLIMITED_VIDEO_ANNUAL,
    },
  },
} as const;

export type PlanId = keyof typeof PLAN_TYPES;
export type BillingInterval = "monthly" | "annual";

export function getPlan(planId: string) {
  return PLAN_TYPES[planId as PlanId] ?? PLAN_TYPES.basic_image;
}

export function getStripePriceId(planId: string, interval: BillingInterval): string | undefined {
  const plan = getPlan(planId);
  return plan[interval].stripePriceId;
}

export function getPlanPrice(planId: string, interval: BillingInterval): number {
  const plan = getPlan(planId);
  return plan[interval].price;
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
