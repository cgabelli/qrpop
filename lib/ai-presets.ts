export interface AiPreset {
  id: string;
  cluster: string;
  title: string;
  description: string;
  prompt: string;
  variables: string[];
}

export const AI_PRESETS: AiPreset[] = [
  // Cluster 1: Ristorazione Premium & Gourmet
  {
    id: "premium_1",
    cluster: "Ristorazione Premium & Gourmet",
    title: "Eleganza Minimalista",
    description: "Sfondo scuro con luci morbide, ideale per cene di gala e degustazioni.",
    prompt: "Crea uno sfondo fotografico ad altissima risoluzione per un ristorante. Tema: {{TOPIC}}. Stile: Fine dining, elegante, minimalista. Fotografia dark mood con illuminazione d'accento drammatica, toni caldi del ristorante sfocati sullo sfondo (bokeh). Grande area vuota centrale per posizionare il testo. Nessun testo né lettere leggibili.",
    variables: ["TOPIC"]
  },
  {
    id: "premium_2",
    cluster: "Ristorazione Premium & Gourmet",
    title: "Texture Materica",
    description: "Marmo e materiali nobili per un look lussuoso.",
    prompt: "Sfondo grafico vettoriale astratto per ristorante di lusso. Tema: {{TOPIC}}. Stile: Marmo nero o ardesia con sottili venature in oro lucido. Macro fotografia o render 3D di materiali nobili. Nessun testo vero. Perfetto per menù eleganti.",
    variables: ["TOPIC"]
  },
  {
    id: "premium_3",
    cluster: "Ristorazione Premium & Gourmet",
    title: "Cantina & Sommelier",
    description: "Caldo e avvolgente, perfetto per le serate del vino.",
    prompt: "Sfondo fotografico fotorealistico per enoteca o degustazione. Tema: {{TOPIC}}. Focus su botti di legno o dettagli di vino. Caldo, sfumature bordeaux e rovere. Sfocatura artistica marcata nella metà inferiore per permettere sovrascrittura di testi. Zero tipografia.",
    variables: ["TOPIC"]
  },
  {
    id: "premium_4",
    cluster: "Ristorazione Premium & Gourmet",
    title: "Sushi & Asian Fusion",
    description: "Linee geometriche zen e contrasti forti (rosso/nero).",
    prompt: "Sfondo ispirato all'oriente moderno e sushi bar. Tema: {{TOPIC}}. Stile: Architettura asiatica minimale, contrasto forte tra rosso rubino e nero opaco. Texture lisce, luci a neon rosse o lanterne sfocate sullo sfondo. Nessun carattere scritto, spazio negativo ampio per graphic design.",
    variables: ["TOPIC"]
  },
  {
    id: "premium_5",
    cluster: "Ristorazione Premium & Gourmet",
    title: "Bistrot Parigino",
    description: "Illustrazione calda, stile acquerello o pittura morbida.",
    prompt: "Sfondo per bistrot elegante. Tema: {{TOPIC}}. Stile: Illustrazione ad acquerello o pittura morbida francese, toni pastello caldi, dettagli di tavolini all'aperto o caffè. Il centro deve essere sfumato o vuoto come una tela neutra per poterci scrivere sopra. Senza parole scritte.",
    variables: ["TOPIC"]
  },

  // Cluster 2: Casual Dining, Pizzeria & Fast Food
  {
    id: "casual_1",
    cluster: "Casual Dining & Street Food",
    title: "Esplosione Pop (Urbano)",
    description: "Colori sgargianti vettoriali, ideale per Burger o Street Food.",
    prompt: "Sfondo grafico verticale in stile Pop Art / Vettoriale esplosivo. Tema: {{TOPIC}}. Colori sgargianti, contrasto forte (Giallo, Arancio, Rosso intenso). Grafica in stile fumetto o street food moderno, senza testo, il centro dell'immagine deve avere un grosso riquadro vuoto o macchia di colore per scriverci sopra.",
    variables: ["TOPIC"]
  },
  {
    id: "casual_2",
    cluster: "Casual Dining & Street Food",
    title: "Il Forno a Legna",
    description: "Texture fotorealistica di farina, legna e pietra. Classico Pizzeria.",
    prompt: "Sfondo fotografico premium in stile pizzeria/forno. Tema: {{TOPIC}}. Macro dettaglio stilizzato di una superficie in pietra o marmo cosparsa di strisce di farina e pomodorini sfocati ai lati o fiamme sfocate del forno a legna. Fortemente de-centrato, centro vuoto, zero testo.",
    variables: ["TOPIC"]
  },
  {
    id: "casual_3",
    cluster: "Casual Dining & Street Food",
    title: "American Diner Anni '50",
    description: "Piastrelle a scacchi e colori menta/ciliegia.",
    prompt: "Sfondo grafico per tavola calda/diner in stile retrò anni '50. Tema: {{TOPIC}}. Stile: Piastrelle a scacchi prospettiche in basso, muro color verde menta o rosso ciliegia vintage in alto. Spazio molto pulito e vuoto. Nesuna tipografia, no lettere.",
    variables: ["TOPIC"]
  },
  {
    id: "casual_4",
    cluster: "Casual Dining & Street Food",
    title: "Griglia & Fuoco 3D",
    description: "Fiamme 3D e carboni ardenti per Steakhouse.",
    prompt: "Sfondo spettacolare 3D per steakhouse / braceria. Tema: {{TOPIC}}. Fiamme vive ad alta definizione, brace ardente alla base dell'immagine e fumo realistico scuro nella parte alta, creando lo spazio nero naturale per scriverci su in bianco. Effetto drammatico, nessun testo.",
    variables: ["TOPIC"]
  },
  {
    id: "casual_5",
    cluster: "Casual Dining & Street Food",
    title: "Pattern Pattern Vettoriale",
    description: "Un pattern continuo in flat design, hipster style.",
    prompt: "Background a pattern grafico vettoriale piatto. Tema: icone minimali legate a {{TOPIC}}. Stile Hipster, palette colori moderna bicolore (es. Giallo e Crema). Al centro sfoca in un grande cerchio o rettangolo vuoto a tinta unita per permettere ai designer di apporci testi sopra. Nessuna scritta.",
    variables: ["TOPIC"]
  },

  // Cluster 3: Bar, Club & Nightlife
  {
    id: "night_1",
    cluster: "Bar, Club & Nightlife",
    title: "Atmosfera Neon Cyberpunk",
    description: "Ideale per Cocktail, serate tematiche o pub serali.",
    prompt: "Sfondo fotorealistico di un vicolo dark o club con tubi al neon brillanti sfocati. Tema: {{TOPIC}}. Illuminazione drammatica rosa fucsia e ciano. L'area centrale deve essere completamente buia o sfumata in un muro di mattoni neri anonimo, per scrivere testo. Assenza totale di scritte reali sui neon.",
    variables: ["TOPIC"]
  },
  {
    id: "night_2",
    cluster: "Bar, Club & Nightlife",
    title: "Speakeasy Glamour",
    description: "Velluto scuro e riflessi color oro. DJ Set o Cocktail di lusso.",
    prompt: "Sfondo avvolgente e misterioso da locale Speakeasy esclusivo. Tema: {{TOPIC}}. Texture di drappi di velluto scuro, riflessi color rame o oro di bicchieri tagliati in cristallo fuori fuoco. Lusso decadente. Completamente pulito, senza tipografia.",
    variables: ["TOPIC"]
  },
  {
    id: "night_3",
    cluster: "Bar, Club & Nightlife",
    title: "Onda Laser (Retrowave)",
    description: "Estetica synthwave per serate anni '80 o gaming bar.",
    prompt: "Sfondo vettoriale stile Synthwave / anni 80 retrowave per evento: {{TOPIC}}. Griglia a pavimento luminosa fucsia, orizzonte e tramonto vettoriale geometrico, palette oscura. Lascia grande vuoto creativo, zero testi artificiali o parole intere.",
    variables: ["TOPIC"]
  },
  {
    id: "night_4",
    cluster: "Bar, Club & Nightlife",
    title: "Liquid Smoke",
    description: "Fumo liquido colorato che danza, molto astratto e suggestivo.",
    prompt: "Sfondo artistico astratto ad alta definizione. Tema da discoteca: {{TOPIC}}. Nubi di fumo coloratissimo e liquido (blu, viola, rosa) che fluttuano su uno sfondo nero pece o blu profondo. Misterioso, ultra HD. Perfetto come tela, no tipografia.",
    variables: ["TOPIC"]
  },
  {
    id: "night_5",
    cluster: "Bar, Club & Nightlife",
    title: "Il Bancone Ghiacciato",
    description: "Riflessi di ghiaccio e gocce, per drink estivi o pestati.",
    prompt: "Sfondo fotografico macro. Tema: freschezza, drink, {{TOPIC}}. Superficie bagnata o coperta di brina, foglie di menta sfocate in primissimo piano. Lo sfondo diverge verso un colore a tinta unita (verde acqua, azzurro). Spazio negativato al 70%. Zero lettere.",
    variables: ["TOPIC"]
  },

  // Cluster 4: Caffetteria, Gelateria & Bakery
  {
    id: "cafe_1",
    cluster: "Caffetteria, Gelateria & Bakery",
    title: "Mattino Morbido",
    description: "Luce solare naturale che filtra dalla finestra su legno chiaro.",
    prompt: "Sfondo fotorealistico per colazioni o caffetteria. Tema: {{TOPIC}}. Taglio di luce mattutina che filtra in una stanza, tavolo in legno chiaro in primissimo piano fuori fuoco. Vibe Hygge, accogliente e soffuso. Area superiore pulita per font.",
    variables: ["TOPIC"]
  },
  {
    id: "cafe_2",
    cluster: "Caffetteria, Gelateria & Bakery",
    title: "Illustrazione Botanica Flat",
    description: "Disegno minimal chic con foglie e chicchi di caffè.",
    prompt: "Sfondo vettoriale minimalista e botanico. Tema: {{TOPIC}}. Silhouette di foglie boho e dettagli tenui. Palette terrosa (beige, terracotta, salvia). Estetica boho-chic in stile moderno vettoriale piatto. Delicato e privo di tipografia o scritte umane.",
    variables: ["TOPIC"]
  },
  {
    id: "cafe_3",
    cluster: "Caffetteria, Gelateria & Bakery",
    title: "Spruzzi di Cioccolato/Gelato",
    description: "Textures fluide, 3D cremoso.",
    prompt: "Sfondo 3D astratto cremoso e setoso. Tema mercato dolci/gelateria: {{TOPIC}}. Forme morbide e liquide increspate di panna o cioccolato in alta lucentezza 3D stile CGI art. Rende acquolina. No elementi di testo in nessuna parte della scena.",
    variables: ["TOPIC"]
  },
  {
    id: "cafe_4",
    cluster: "Caffetteria, Gelateria & Bakery",
    title: "Lavagna Classica al Gesso",
    description: "La tradizionale lavagna in ardesia del bar.",
    prompt: "Sfondo texture fotorealistica di una lavagna in ardesia nera piallata. Tema: {{TOPIC}}. Qualche fine sbavatura di polvere di gesso bianco sui bordi, leggeri disegnini di tazzine piccolissimi, ma per il 90% del centro l'immagine deve essere una lavagna nera perfetta e vuota per potervi in seguito scrivere sopra.",
    variables: ["TOPIC"]
  },
  {
    id: "cafe_5",
    cluster: "Caffetteria, Gelateria & Bakery",
    title: "Acquerello Fruttato (Estati)",
    description: "Pennellate sgargianti per brunch o smoothie.",
    prompt: "Sfondo pennellato in stile acquerello vivido. Tema estate, succhi, frullati: {{TOPIC}}. Tonalità calde (arancio pesca, giallo limone, rosa anguria) che si sfumano verso il bianco. Estremamente vibrante ed estivo. Nessuna lettera e nessuna grafica invasiva centrale.",
    variables: ["TOPIC"]
  },

  // Cluster 5: Eventi e Promozioni Generiche
  {
    id: "fest_1",
    cluster: "Eventi e Festività Stagionali",
    title: "Festività & Scintille",
    description: "Fuochi d'artificio, Capodanno o Anniversari.",
    prompt: "Sfondo fotografico festivo per evento speciale: {{TOPIC}}. Scintille sfuocate dorate tipo bokeh o fuochi d'artificio soffusi su uno sfondo notturno raffinato. Molto celebrativo. Scena molto ariosa che favorisce un posizionamento del testo centrale.",
    variables: ["TOPIC"]
  },
  {
    id: "fest_2",
    cluster: "Eventi e Festività Stagionali",
    title: "Festa Estiva (Tropical Vibe)",
    description: "Foglie di palma, tramonti e summer party.",
    prompt: "Sfondo stile estate tropicale. Tema dell'evento: {{TOPIC}}. Foglie di monstera o palme ombrose sfuocate sui margini, un cielo rosa corallo o arancione tramonto al centro con enorme prevalenza di spazio vuoto. Graficamente puro, zero testo tipografico o parole finte.",
    variables: ["TOPIC"]
  },
  {
    id: "fest_3",
    cluster: "Eventi e Festività Stagionali",
    title: "San Valentino & Amore",
    description: "Romantico, astratto e soffuso.",
    prompt: "Sfondo per promozione di coppia/romanticismo per evento: {{TOPIC}}. Seta rossa fluente, o petali di rosa fuori fuoco che fluttuano in modo super-rallentato con sfondo bordeaux scuro elegante e profondo. Vuoto tipografico assoluto.",
    variables: ["TOPIC"]
  },
  {
    id: "fest_4",
    cluster: "Eventi e Festività Stagionali",
    title: "Halloween / Horror Soft",
    description: "Nebbia, mistero, ma elegante.",
    prompt: "Sfondo suggestivo, misterioso e oscuro per promozioni legate a {{TOPIC}}. Una nebbia fitta color viola scuro/arancio pallido vicino a terra, foresta sfuocata o castello in lontananza. Grande area cielo livido per scrivere il titolo. Stile cinematografico di qualità premium, no scritte.",
    variables: ["TOPIC"]
  },
  {
    id: "fest_5",
    cluster: "Eventi e Festività Stagionali",
    title: "Super Promozione Scontata",
    description: "Attirare l'attenzione (Black Friday style), colori decisi.",
    prompt: "Sfondo grafico vettoriale aggressivo e iper-visibile, tipico da Black Friday / Mega saldi. Tema vendita forte: {{TOPIC}}. Contrasto tra Nero assoluto e Giallo Limone/Rosso neon. Linee cinetiche direzionali vettoriali e forme spigolose piatte. Privo di numeri e privo di lettere leggibili, concepito per sovra-impressioni di titoli 3D in un secondo momento.",
    variables: ["TOPIC"]
  }
];
