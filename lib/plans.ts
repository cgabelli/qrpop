export const PLAN_TYPES = {
  media: {
    id: "media",
    name: "Media",
    type: "video" as const, // Allows jpg, gif, mp4
    limit: 10,
    description: "10 upload all'anno (JPG, GIF, MP4)",
    features: [
      "10 upload all'anno",
      "Formati supportati: JPG, GIF, MP4",
      "QR code statico dedicato",
      "Scheduling contenuti",
    ],
    price: 49,
    stripePriceId: process.env.STRIPE_PRICE_MEDIA_ANNUAL,
    addon: {
      price: 15,
      amount: 10,
      stripePriceId: process.env.STRIPE_PRICE_MEDIA_ADDON,
    }
  },
  pdf: {
    id: "pdf",
    name: "Pdf",
    type: "pdf" as const, // Allows jpg, gif, mp4, pdf
    limit: 20,
    description: "20 upload all'anno (Incluso PDF)",
    features: [
      "20 upload all'anno",
      "Supporto file PDF per Menu",
      "Modifica contenuti fluida",
      "Video autoplay mobile",
    ],
    price: 99,
    stripePriceId: process.env.STRIPE_PRICE_PDF_ANNUAL,
    addon: {
      price: 25,
      amount: 10,
      stripePriceId: process.env.STRIPE_PRICE_PDF_ADDON,
    }
  },
  unlimited: {
    id: "unlimited",
    name: "Unlimited",
    type: "pdf" as const,
    limit: null,
    description: "Upload illimitati (qualunque formato)",
    features: [
      "Upload illimitati totali",
      "Tutti i formati (Inclusi PDF Multi-pagina)",
      "QR code statico dedicato",
      "Analytics e report (Prossimamente)",
    ],
    price: 149,
    stripePriceId: process.env.STRIPE_PRICE_UNLIMITED_ANNUAL,
    addon: null
  },
} as const;

export type PlanId = keyof typeof PLAN_TYPES;

export function getPlan(planId: string) {
  return PLAN_TYPES[planId as PlanId] ?? PLAN_TYPES.media;
}

export function getStripePriceId(planId: string, isAddon: boolean = false): string | undefined {
  const plan = getPlan(planId);
  return isAddon && plan.addon ? plan.addon.stripePriceId : plan.stripePriceId;
}

export function getPlanPrice(planId: string, isAddon: boolean = false): number {
  const plan = getPlan(planId);
  return isAddon && plan.addon ? plan.addon.price : plan.price;
}

export function canUpload(
  planId: string,
  baseCredits: number,
  purchasedCredits: number
): boolean {
  const plan = getPlan(planId);
  if (plan.limit === null) return true;
  return (baseCredits + purchasedCredits) > 0;
}

export const PLANS = PLAN_TYPES;
