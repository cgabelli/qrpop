export interface AiPreset {
  id: string;
  cluster: string;
  title: string;
  description: string;
  prompt: string;
  variables: string[]; // Variabili richieste es. ["TOPIC"]
}

export const AI_PRESETS: AiPreset[] = [
  // Cluster 1: The Corporate & Data Suite
  {
    id: "corp_1",
    cluster: "The Corporate & Data Suite",
    title: "La Storia dei Dati Minimalista",
    description: "Design pulito e minimalista ispirato al design svizzero.",
    prompt: "Crea un'infografica verticale poster ad alta risoluzione, no testo leggibile, per {{TOPIC}}. Stile: Pulito Minimalista. Layout: Da 4 a 6 sezioni di contenitori vettoriali vuoti. Visual: Sfondo neutro morbido, icone monocromatiche minimali. Nessun disordine, nessun gradiente. Focalizzati sullo spazio negativo.",
    variables: ["TOPIC"]
  },
  {
    id: "corp_2",
    cluster: "The Corporate & Data Suite",
    title: "Il Cruscotto Aziendale",
    description: "Stile Cruscotto SaaS, modalità scura.",
    prompt: "Progetta un'infografica di sfondo in stile aziendale (SaaS dashboard) per {{TOPIC}}. Layout: Cruscotto basato su griglia con schede vuote per metriche. Visual: Design piatto, grafici astratti semplici. Palette: Sfondo grigio scuro con accenti blu elettrico e verde smeraldo. No testo leggibile vero.",
    variables: ["TOPIC"]
  },
  {
    id: "corp_3",
    cluster: "The Corporate & Data Suite",
    title: "La Mappa Temporale",
    description: "Timeline lineare vettoriale.",
    prompt: "Genera uno sfondo infografica per mappa temporale su {{TOPIC}}. Layout: Linea di progresso lineare con nodi di traguardo. Visual: Stile vettoriale isometrico pulito. Palette: Gradazione professionale (Blu a Viola). Stile artistico vettoriale ad alta definizione. Solo contenitori base, no testo reale.",
    variables: ["TOPIC"]
  },
  {
    id: "corp_4",
    cluster: "The Corporate & Data Suite",
    title: "Il Confronto a Due Colonne",
    description: "Stile pro/contro a schermo diviso.",
    prompt: "Crea un'infografica di sfondo a confronto schermo diviso per il mercato di: {{TOPIC}}. Layout: Griglia simmetrica a due colonne. Visual: Il lato sinistro e destro con due colori in contrasto elegante. L'asse centrale presenta sfumature. Stile: Vettoriale moderno piatto. Rigorosamente organizzato, no testo.",
    variables: ["TOPIC"]
  },
  {
    id: "corp_5",
    cluster: "The Corporate & Data Suite",
    title: "Grafico Statistico a Barre",
    description: "Preciso, numerico con grafici vettoriali 3D.",
    prompt: "Progetta uno sfondo con grafico a barre astratto e professionale per argomento: {{TOPIC}}. Layout: Barre orizzontali in ordine decrescente. Visual: Barre opache 3D morbide, ombre tenui. Annotazioni: fumetti vuoti fluttuanti. Palette: Sfondo bianco elegante con colori energetici per i punti dati. Nessun testo intellegibile.",
    variables: ["TOPIC"]
  },

  // Cluster 2: The Editorial & Magazine Suite
  {
    id: "mag_1",
    cluster: "The Editorial & Magazine Suite",
    title: "L'Editoriale Audace",
    description: "Stile Wired Magazine asimmetrico ad alto impatto.",
    prompt: "Un'illustrazione grafica audace in stile pagina rivista editoriale per il tema: {{TOPIC}}. Stile: Alto impatto Wired/Vox. Visual: Griglia asimmetrica, blocchi di colore ad alto contrasto. Incorpora elementi stile collage vettoriale astratto. Sovrapposizione di texture granulose. Nessun testo leggibile grande, solo forme letterali astratte.",
    variables: ["TOPIC"]
  },
  {
    id: "mag_2",
    cluster: "The Editorial & Magazine Suite",
    title: "Tech Cyberpunk",
    description: "Neon tech, UI futuristica.",
    prompt: "Uno sfondo elegante modalità scura tech cyberpunk ispirato al tema: {{TOPIC}}. Stile: Interfaccia UI futuristica pulita. Sfondo: Nero charcoal. Accenti: Neon Ciano e Magenta luminosi. Effetti glassmorphism sulle schede, linee sottili vettoriali in stile disegno tecnico. No testo ingombrante.",
    variables: ["TOPIC"]
  },
  {
    id: "mag_3",
    cluster: "The Editorial & Magazine Suite",
    title: "Funnel Vettoriale 3D",
    description: "Ideale per marketing funnel.",
    prompt: "Uno sfondo grafico verticale che esplora il tema del Funnel e conversione nel mercato: {{TOPIC}}. Visual: Una forma di imbuto stratificato in 3D che fluttua al centro. Gradiente fluido e luminoso in stile brand moderni. Rendering pulito ad alta brillantezza, strati vuoti per contenere testo. No parole scritte.",
    variables: ["TOPIC"]
  },
  {
    id: "mag_4",
    cluster: "The Editorial & Magazine Suite",
    title: "Bento Box Fatti Rapidi",
    description: "Griglia per brevi consigli stile Instagram Carousel.",
    prompt: "Progetta un background a griglia stile bento-box. Tema generale: {{TOPIC}}. Layout: Piastrelle arrotondate contenenti pattern o icone piatte oversize stile Big Tech. Palette: Sfondo pastello fresco, riquadri a contrasto. Moderno e amichevole, pronto come template per scriverci sopra. No font veri.",
    variables: ["TOPIC"]
  },
  {
    id: "mag_5",
    cluster: "The Editorial & Magazine Suite",
    title: "La Piramide Gerarchica",
    description: "Piramide geometrica stilizzata.",
    prompt: "Genera uno sfondo con piramide geometrica a strati per argomentazione: {{TOPIC}}. Visual: Piramide 3D minimale o stilizzata vettoriale piana. Gradiente moderno luminoso. Spazi laterali per poter permettere all'utente di metterci del testo. Sfondo astratto minimale.",
    variables: ["TOPIC"]
  },

  // Cluster 3: The Educational & Explainer Suite
  {
    id: "edu_1",
    cluster: "The Educational & Explainer Suite",
    title: "Educativo Soft Pastel",
    description: "Amichevole, accessibile, colori delicati.",
    prompt: "Immagine vettoriale educativa stile libro amichevole, senza testo vero. Tema del background: {{TOPIC}}. Palette: Colori pastello morbidi (Lavanda, Pesca, Menta). Forme arrotondate in vettoriale 2.0. Estetica rilassante e pulita con grandi spazi vuoti per overlay.",
    variables: ["TOPIC"]
  },
  {
    id: "edu_2",
    cluster: "The Educational & Explainer Suite",
    title: "Manuale d'Istruzioni",
    description: "Passo dopo passo in stile illustrazione piatta 2.0.",
    prompt: "Uno sfondo di guida al processo per la nicchia di: {{TOPIC}}. Stile: Illustrazione vettoriale piatta d'istruzione. Un percorso visuale a 'S' che scende lungo una canvas vuota. Colori primari puliti e luminosi in un mondo bianco. No scritte, solo l'infrastruttura visuale (scatole / step geometrici).",
    variables: ["TOPIC"]
  },
  {
    id: "edu_3",
    cluster: "The Educational & Explainer Suite",
    title: "La Checklist",
    description: "Foglio in stile clipboard per listare to-do.",
    prompt: "Progetta un poster vettoriale che simula una elegante checkbox board moderna per il settore: {{TOPIC}}. Sfondo: Stilizzazione accattivante di un clipboard o carta morbida al tratto vettoriale. Spazi vuoti verticali pronti dove l'utente potrà scriverci su checklist. Senza parole e minimale.",
    variables: ["TOPIC"]
  },
  {
    id: "edu_4",
    cluster: "The Educational & Explainer Suite",
    title: "Il Diagramma del Framework",
    description: "Pensiero sistemico con schema circolare.",
    prompt: "Immagine vettoriale di un diagramma vuoto astratto per rappresentare un framework. Tema d'ispirazione estetica: {{TOPIC}}. Layout: Diagramma concentrico a ciambella. Precisione matematica pulita, colori flat vettoriali moderni senza alcun testo sovra-impresso.",
    variables: ["TOPIC"]
  },
  {
    id: "edu_5",
    cluster: "The Educational & Explainer Suite",
    title: "Layout Esplicativo a Bande",
    description: "Struttura a righe orizzontali distinte.",
    prompt: "Genera uno sfondo canvas lungo e astratto che usa bande di colore morbido (colorati orizzontali) dedicate al mercato di: {{TOPIC}}. In ogni riga piccoli tocchi isometrici illustrativi astratti, stile the New York Times infographics senza numeri né testo reale. Colori terrosi e maturi.",
    variables: ["TOPIC"]
  },

  // Cluster 4: The Creative & Conceptual Suite
  {
    id: "cre_1",
    cluster: "The Creative & Conceptual",
    title: "Sketchnote Disegnato a Mano",
    description: "Matematica da tovagliolo e schemi a mano liberi.",
    prompt: "Crea uno sfondo finto disegnato a pennarello e schizzi veloci per spiegare in stile creativo il tema: {{TOPIC}}. Sfondo: Carta quadrettata molto chiara o texture stropicciata. Elementi: freccie disegnate a mano libere, scarabocchi creativi astratti ai bordi lasciando il centro vuoto per posizionarci testi digitali. Vibe da brain storming geniale.",
    variables: ["TOPIC"]
  },
  {
    id: "cre_2",
    cluster: "The Creative & Conceptual",
    title: "La Mappa Mentale Rete Neurale",
    description: "Albero logico per concetti organici e complessi.",
    prompt: "Genera uno sfondo raffigurante una fitta rete neurale vettoriale bioluminescente o moderna in tema: {{TOPIC}}. Nodi astratti trasparenti di forma organica connessi tra loro, pronti per essere sovrascritti. UI biologica minimalista. Alta risoluzione pulita, assenza totale di tipografia.",
    variables: ["TOPIC"]
  },
  {
    id: "cre_3",
    cluster: "The Creative & Conceptual",
    title: "Storyboard Cinematografico",
    description: "Pannelli tipo fumetto per narrare viaggi.",
    prompt: "Layout a pannelli rettangolari vuoti in stile storyboard o concept art fumetto. Atmosfera incentrata su: {{TOPIC}}. Un layout per narrazione visuale 3x2 dove all'interno dei riquadri vi sono solo pennellate suggestive ed ambienti. Lo spazio centrale/inferiore è sgombro per ospitare del copy. Semirealistico e moderno.",
    variables: ["TOPIC"]
  },
  {
    id: "cre_4",
    cluster: "The Creative & Conceptual",
    title: "Diagramma Flusso Ingegneristico",
    description: "Progetto logico su blueprint.",
    prompt: "Uno sfondo vettoriale da blueprint (carta blu architettonica con linee logiche bianche/ciano) dedicato alla tecnologia o workflow del ramo: {{TOPIC}}. Linee che si intersecano a 90 gradi con diamanti geometrici svuotati senza testo. Estetica da progetto tecnico preciso ad alta risoluzione.",
    variables: ["TOPIC"]
  },
  {
    id: "cre_5",
    cluster: "The Creative & Conceptual",
    title: "Diagramma di Venn Elegante",
    description: "Cerchi color-blend per mostrare l'intersezione.",
    prompt: "Generazione di sfondo vettoriale poster layout: Una splendida composizione di cerchi di Venn giganti e trasparenti sovrapposti. Tema di ispirazione cromatico: {{TOPIC}}. Effetti di colore blend additivo, design pulito minimale vettoriale. I cerchi sono vuoti e accolgono virtualmente le informazioni future. Nessun font presente.",
    variables: ["TOPIC"]
  },

  // Cluster 5: The Bonus Creative Suite
  {
    id: "bon_1",
    cluster: "The Bonus Creative Suite",
    title: "Poster Blockbuster Cinematografico",
    description: "Illuminazione hollywoodiana e texture fotografica.",
    prompt: "Un poster senza scritte fotorealistico stile locandina blockbuster hollywoodiana. Trama: {{TOPIC}}. Illuminazione drammatica ciano e rosso/arancio, soggetto de-centrato scuro e stilizzato per lasciare spazio vuoto per il titolo (che sarà aggiunto poi). Texture da pellicola cinematografica premium, lens flare. NESSUN TESTO NÉ TIPOGRAFIA DI ALCUN TIPO, SOLO BACKGROUND EPIC.",
    variables: ["TOPIC"]
  },
  {
    id: "bon_2",
    cluster: "The Bonus Creative Suite",
    title: "Startup Whiteboard",
    description: "Lavagna realistica da ufficio.",
    prompt: "Sfondo fotorealistico di una lavagna bianca e pulita in una stanza creativa da start-up e uffici tecnologici, illuminazione naturale o neo fredda. Il tema accennato in minuscoli doodle sul bordo della lavagna riguarda: {{TOPIC}}. Al centro la lavagna è totalmente illibata. Dettaglio di pennarelli cancellabili alla base.",
    variables: ["TOPIC"]
  },
  {
    id: "bon_3",
    cluster: "The Bonus Creative Suite",
    title: "Retro 8-Bit Nintendo",
    description: "Pixel art e vibe arcade anni 80.",
    prompt: "Background in squisita pixel art a 8-bit stile Nintendo. Vibe retro gaming. Tema del background: {{TOPIC}}. Layout: Una schermata pulita di interfaccia RPG retro dove il centro e l'area inferiore ha uno spazio per dialog box enormi ma la box all'interno è vuota per fargliela compilare all'utente in seguito. Palette limitata NES. No testo reale.",
    variables: ["TOPIC"]
  },
  {
    id: "bon_4",
    cluster: "The Bonus Creative Suite",
    title: "Viaggio Vintage Art Deco",
    description: "Parchi Nazionali e geometrie spazzolate.",
    prompt: "Sensazionale illustrazione poster stile Parchi Nazionali / Art Deco anni 30 di grande impatto visivo. Scenografia/Ispirazione: {{TOPIC}}. Ampi blocchi di colore, pennellate stese, no sfumature artificiali. Layout verticale con metà spazio cielo sgombro, idoneo per apporre font grandissimi in post-produzione. Assenza di qualsiasi scritta nativa nell'immagine.",
    variables: ["TOPIC"]
  },
  {
    id: "bon_5",
    cluster: "The Bonus Creative Suite",
    title: "Insegna Neon Noir",
    description: "Tubi in vetro fosforescente su muro di pietra.",
    prompt: "Fotorealistico sfondo 3D dark di un vicolo fumoso cyber/noir. Tema dell'insegna suggerita e ambiente: {{TOPIC}}. C'è un'imponente sagoma rettangolare vuota in tubature neon rosa elettrico o ciano spenta sul muro di mattoni scuri bagnati, progettata proprio affinché possa farci scrivere graficamente al di sopra l'utente senza accavallare testo pre-renderizzato. Molto cinematografico.",
    variables: ["TOPIC"]
  }
];
