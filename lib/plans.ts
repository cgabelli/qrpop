// Tipi di QR Spot acquistabili a consumo
export const QR_SPOT_TYPES = {
  free: {
    id: "free",
    name: "Link Redirect",
    emoji: "🔗",
    description: "Reindirizza a qualsiasi URL esterno",
    features: [
      "Redirect verso qualsiasi URL",
      "Pagina Facebook, Instagram, sito web",
      "QR code dinamico (modificabile)",
      "Durata 1 anno",
      "Badge 'Powered by QRpop'",
    ],
    allowedTypes: ["redirect"],
    price: 0,
    stripePriceId: null, // Gratuito, gestito internamente
    expiresInDays: 365,
  },
  image: {
    id: "image",
    name: "Immagine",
    emoji: "🖼️",
    description: "Mostra foto e animazioni a schermo intero",
    features: [
      "Upload illimitati",
      "Formati: JPG, PNG, GIF",
      "Visualizzazione fullscreen",
      "QR code dinamico (modificabile)",
      "Durata 1 anno",
    ],
    allowedTypes: ["image"],
    price: 19,
    stripePriceId: process.env.STRIPE_PRICE_IMAGE_ANNUAL,
    expiresInDays: 365,
  },
  video: {
    id: "video",
    name: "Video",
    emoji: "🎥",
    description: "Riproduci video promozionali in loop",
    features: [
      "Upload illimitati",
      "Formato MP4 ottimizzato",
      "Autoplay e loop automatico",
      "QR code dinamico (modificabile)",
      "Durata 1 anno",
    ],
    allowedTypes: ["video"],
    price: 29,
    stripePriceId: process.env.STRIPE_PRICE_VIDEO_ANNUAL,
    expiresInDays: 365,
  },
  pdf: {
    id: "pdf",
    name: "PDF",
    emoji: "📄",
    description: "Condividi menù e cataloghi in PDF",
    features: [
      "Upload illimitati",
      "PDF multipagina fino a 50MB",
      "Visualizzatore integrato",
      "QR code dinamico (modificabile)",
      "Durata 1 anno",
    ],
    allowedTypes: ["pdf"],
    price: 49,
    stripePriceId: process.env.STRIPE_PRICE_PDF_ANNUAL,
    expiresInDays: 365,
  },
  unlimited: {
    id: "unlimited",
    name: "Unlimited",
    emoji: "🌟",
    description: "Tutti i formati, nessun limite",
    features: [
      "Upload illimitati",
      "Tutti i formati (JPG, PNG, GIF, MP4, PDF)",
      "Cambia tipo contenuto liberamente",
      "QR code dinamico (modificabile)",
      "Durata 1 anno",
    ],
    allowedTypes: ["image", "video", "pdf", "redirect", "wallet"],
    price: 99,
    stripePriceId: process.env.STRIPE_PRICE_UNLIMITED_ANNUAL,
    expiresInDays: 365,
  },
  wallet: {
    id: "wallet",
    name: "Wallet Card",
    emoji: "🪪",
    description: "Crea e rilascia carte fedeltà per Apple/Google Wallet",
    features: [
      "Acquisizione contatti automatica",
      "Template personalizzato (Colori, Logo)",
      "Pass Compatibili iOS/Android",
      "QR code dinamico (modificabile)",
      "Durata 1 anno",
    ],
    allowedTypes: ["wallet"],
    price: 79,
    stripePriceId: null, // Non acquistabile via Stripe — gestito internamente
    expiresInDays: 365,
  },
} as const;

export type QRSpotTypeId = keyof typeof QR_SPOT_TYPES;

export function getQRSpotType(typeId: string) {
  return QR_SPOT_TYPES[typeId as QRSpotTypeId] ?? QR_SPOT_TYPES.image;
}

export function canUploadType(spotType: string, fileType: "image" | "video" | "pdf" | "redirect"): boolean {
  const spot = getQRSpotType(spotType);
  return (spot.allowedTypes as readonly string[]).includes(fileType);
}

export function getStripePriceId(spotTypeId: string): string | undefined {
  return getQRSpotType(spotTypeId).stripePriceId ?? undefined;
}

// Re-esport per compatibilità temporanea con il codice legacy
export const PLAN_TYPES = QR_SPOT_TYPES;
export const PLANS = QR_SPOT_TYPES;
export type PlanId = QRSpotTypeId;
export function getPlan(planId: string) { return getQRSpotType(planId); }
