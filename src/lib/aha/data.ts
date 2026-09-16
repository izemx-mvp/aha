import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";
import prop4 from "@/assets/prop-4.jpg";
import prop5 from "@/assets/prop-5.jpg";

export const IMAGES = [prop1, prop2, prop3, prop4, prop5];

export const CHANNELS = ["Email", "WhatsApp", "Booking", "Airbnb", "Expedia"] as const;
export type Channel = (typeof CHANNELS)[number];

export const CONV_STATUSES = ["Traité par l'agent", "En attente d'intervention humaine", "Clôturé"] as const;
export type ConvStatus = (typeof CONV_STATUSES)[number];

export const REQUEST_TYPES = [
  "Disponibilité",
  "Demande spéciale",
  "Suivi de réservation",
  "Réclamation",
] as const;
export type RequestType = (typeof REQUEST_TYPES)[number];

export const CATEGORIES = ["Propreté", "Réservation", "Facturation", "Service sur place", "Autre"] as const;
export type Category = (typeof CATEGORIES)[number];

export const URGENCIES = ["Faible", "Moyen", "Urgent"] as const;
export type Urgency = (typeof URGENCIES)[number];

export const COMPLAINT_STATUSES = ["Nouvelle", "En cours", "Résolue"] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export type Hours = { days: string[]; from: string; to: string };

export type Establishment = {
  id: string;
  name: string;
  type: string;
  city: string;
  description: string;
  website: string;
  email: string;
  hours: Hours;
  instagram: string;
  facebook: string;
  other: string;
  image: string;
  isNew?: boolean;
};

export type Message = {
  id: string;
  from: "client" | "agent" | "human";
  text: string;
  at: string;
};

export type Conversation = {
  id: string;
  estId: string;
  client: string;
  channel: Channel;
  type: RequestType;
  status: ConvStatus;
  preview: string;
  urgency: Urgency;
  createdAt: string;
  messages: Message[];
};

export type FaqItem = {
  id: string;
  estId: string;
  question: string;
  answer: string;
  status: "Publiée" | "Brouillon";
};

export type Unanswered = { id: string; estId: string; question: string };

export type Doc = { id: string; estId: string; name: string; type: string; addedAt: string };

export type Service = {
  id: string;
  estId: string;
  name: string;
  description: string;
  status: "Disponible" | "Sur demande";
};

export type HistoryEntry = { at: string; label: string };

export type Complaint = {
  id: string;
  estId: string;
  client: string;
  channel: Channel;
  category: Category;
  urgency: Urgency;
  status: ComplaintStatus;
  createdAt: string;
  message: string;
  notes: string;
  history: HistoryEntry[];
  conversationId?: string | undefined;
};

/* ------------ deterministic pseudo-random ------------ */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}
const pick = <T,>(r: () => number, arr: readonly T[]) => arr[Math.floor(r() * arr.length)]!;

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const BASE = new Date("2026-09-16T09:00:00Z").getTime();
const ago = (minutes: number) => new Date(BASE - minutes * 60000).toISOString();

const RAW: Array<Omit<Establishment, "id" | "image">> = [
  {
    name: "Riad Villa Saphir & Spa",
    type: "Maison d'hôtes & Spa",
    city: "Marrakech, Médina",
    description:
      "Accompagnement stratégique, développement de l'expérience client et optimisation des standards d'hospitalité.",
    website: "https://riad-villa-saphir.ma",
    email: "reservations@riad-villa-saphir.ma",
    hours: { days: DAYS, from: "08:00", to: "20:00" },
    instagram: "https://www.instagram.com/riad.villa.saphir/",
    facebook: "https://www.facebook.com/riadvillasaphir",
    other: "https://wa.me/212661112233",
  },
  {
    name: "Palais Menzah",
    type: "Maison d'hôtes",
    city: "Marrakech, Hivernage",
    description:
      "Développement du positionnement commercial, structuration opérationnelle et valorisation de l'identité du lieu.",
    website: "https://palais-menzah.ma",
    email: "contact@palais-menzah.ma",
    hours: { days: DAYS, from: "07:30", to: "21:00" },
    instagram: "https://www.instagram.com/palais.menzah/",
    facebook: "https://www.facebook.com/palaismenzah",
    other: "https://wa.me/212661112244",
  },
  {
    name: "Dar Salah Eddine Oasis Pool & Spa",
    type: "Villa & Maison d'hôtes",
    city: "Marrakech, Route de Ouarzazate",
    description:
      "Création de l'expérience client, développement commercial, gestion de la distribution et optimisation de la performance.",
    website: "https://dar-salaheddine-oasis.ma",
    email: "booking@dar-salaheddine-oasis.ma",
    hours: { days: DAYS, from: "08:00", to: "22:00" },
    instagram: "https://www.instagram.com/dar.salaheddine.oasis/",
    facebook: "https://www.facebook.com/darsalaheddineoasis",
    other: "https://wa.me/212661112255",
  },
  {
    name: "Dr Lazrek Villa & Guest House",
    type: "Villa & Guest House",
    city: "Marrakech, Targa",
    description:
      "Conseil en hospitalité, structuration des opérations et amélioration des standards de service.",
    website: "https://lazrek-villa.ma",
    email: "hello@lazrek-villa.ma",
    hours: { days: DAYS, from: "09:00", to: "19:00" },
    instagram: "https://www.instagram.com/lazrek.villa/",
    facebook: "https://www.facebook.com/lazrekvilla",
    other: "",
  },
  {
    name: "Palais des Collectionneurs",
    type: "Villa de prestige",
    city: "Marrakech, Palmeraie",
    description:
      "Accompagnement dans la stratégie de marque, le développement de l'offre et la mise en valeur de l'expérience haut de gamme.",
    website: "https://palais-collectionneurs.ma",
    email: "concierge@palais-collectionneurs.ma",
    hours: { days: DAYS, from: "08:30", to: "20:30" },
    instagram: "https://www.instagram.com/palais.collectionneurs/",
    facebook: "https://www.facebook.com/palaisdescollectionneurs",
    other: "https://wa.me/212661112266",
  },
  {
    name: "Riad Zahra Almendra",
    type: "Maison d'hôtes",
    city: "Marrakech, Kasbah",
    description:
      "Gestion hôtelière déléguée, structuration de l'accueil et suivi de la satisfaction voyageurs.",
    website: "https://riad-zahra-almendra.ma",
    email: "contact@riad-zahra-almendra.ma",
    hours: { days: DAYS, from: "08:00", to: "20:00" },
    instagram: "https://www.instagram.com/riad.zahra.almendra/",
    facebook: "https://www.facebook.com/riadzahraalmendra",
    other: "",
  },
  {
    name: "Villa Nakhil Ourika",
    type: "Villa privée",
    city: "Vallée de l'Ourika",
    description:
      "Développement de l'offre séjour nature, coordination des équipes et conciergerie sur-mesure.",
    website: "https://villa-nakhil-ourika.ma",
    email: "sejour@villa-nakhil-ourika.ma",
    hours: { days: DAYS, from: "09:00", to: "19:00" },
    instagram: "https://www.instagram.com/villa.nakhil.ourika/",
    facebook: "",
    other: "https://wa.me/212661112277",
  },
  {
    name: "Dar Anbar Agafay",
    type: "Camp & Maison d'hôtes",
    city: "Désert d'Agafay",
    description:
      "Positionnement expérientiel, gestion de la distribution et standards de service en environnement désertique.",
    website: "https://dar-anbar-agafay.ma",
    email: "reservations@dar-anbar-agafay.ma",
    hours: { days: DAYS, from: "10:00", to: "23:00" },
    instagram: "https://www.instagram.com/dar.anbar.agafay/",
    facebook: "https://www.facebook.com/daranbaragafay",
    other: "",
  },
  {
    name: "Riad Yasmine Bahia",
    type: "Boutique-hôtel",
    city: "Marrakech, Médina",
    description:
      "Optimisation du revenu, formation des équipes d'accueil et pilotage de la relation voyageur.",
    website: "https://riad-yasmine-bahia.ma",
    email: "contact@riad-yasmine-bahia.ma",
    hours: { days: DAYS, from: "07:00", to: "21:00" },
    instagram: "https://www.instagram.com/riad.yasmine.bahia/",
    facebook: "https://www.facebook.com/riadyasminebahia",
    other: "",
  },
  {
    name: "Ksar Tameslohte Retreat",
    type: "Domaine & Retreat",
    city: "Tameslohte, région de Marrakech",
    description:
      "Structuration opérationnelle d'un domaine de retraite et création d'expériences bien-être signature.",
    website: "https://ksar-tameslohte.ma",
    email: "retreat@ksar-tameslohte.ma",
    hours: { days: DAYS, from: "08:00", to: "20:00" },
    instagram: "https://www.instagram.com/ksar.tameslohte/",
    facebook: "",
    other: "https://wa.me/212661112288",
  },
];

export const ESTABLISHMENTS: Establishment[] = RAW.map((e, i) => ({
  ...e,
  id: `est-${i + 1}`,
  image: IMAGES[i % IMAGES.length]!,
}));

const CLIENTS = [
  "Camille Fournier",
  "James Whitfield",
  "Sofia Marchetti",
  "Youssef Benali",
  "Hannah Müller",
  "Élise Duval",
  "Peter Van Dijk",
  "Laura Esposito",
  "Omar Cherkaoui",
  "Rebecca Klein",
  "Antoine Perrot",
  "Nadia Amrani",
  "Thomas Berger",
  "Claire Lemoine",
  "Michael O'Sullivan",
];

const OPENERS: Record<RequestType, string[]> = {
  Disponibilité: [
    "Bonjour, avez-vous une suite disponible du 12 au 16 octobre pour deux personnes ?",
    "Bonsoir, reste-t-il une chambre double le week-end du 24 ?",
    "Hello, do you have availability for 3 nights in November ?",
  ],
  "Demande spéciale": [
    "Nous arrivons avec un bébé, un lit parapluie est-il possible ?",
    "Serait-il possible d'organiser un dîner privé sur la terrasse ?",
    "Pouvez-vous prévoir une décoration florale pour un anniversaire ?",
  ],
  "Suivi de réservation": [
    "Bonjour, je souhaite confirmer mon transfert aéroport de mardi.",
    "Pouvez-vous m'envoyer à nouveau ma confirmation de réservation ?",
    "Est-il possible d'avancer mon arrivée à 11h ?",
  ],
  Réclamation: [
    "La climatisation de la chambre n'a pas fonctionné cette nuit.",
    "Nous avons été facturés deux fois pour le même séjour.",
    "La chambre n'était pas prête à notre arrivée, très déçus.",
  ],
};

const AGENT_REPLIES: Record<RequestType, string> = {
  Disponibilité:
    "Bonjour et merci pour votre message. Nous avons effectivement de la disponibilité sur ces dates. Je vous transmets les tarifs et conditions d'annulation dans l'instant.",
  "Demande spéciale":
    "Merci pour votre demande. C'est tout à fait réalisable : notre équipe conciergerie prépare cela avant votre arrivée et vous confirmera les détails.",
  "Suivi de réservation":
    "Bonjour, votre réservation est bien confirmée. Je vous renvoie le récapitulatif complet ainsi que les informations d'accès par e-mail.",
  Réclamation:
    "Nous sommes sincèrement désolés pour cette expérience. Votre message est transmis en priorité au responsable de l'établissement, qui revient vers vous très rapidement.",
};

function buildConversations(): Conversation[] {
  const out: Conversation[] = [];
  ESTABLISHMENTS.forEach((est, ei) => {
    const r = rng(97 + ei * 31);
    const count = 8 + Math.floor(r() * 3);
    for (let i = 0; i < count; i++) {
      const type = pick(r, REQUEST_TYPES);
      const channel = pick(r, CHANNELS);
      const status: ConvStatus =
        i % 5 === 0
          ? "En attente d'intervention humaine"
          : i % 4 === 0
            ? "Clôturé"
            : "Traité par l'agent";
      const urgency: Urgency =
        type === "Réclamation" ? (i % 3 === 0 ? "Urgent" : "Moyen") : i % 2 === 0 ? "Faible" : "Moyen";
      const opener = pick(r, OPENERS[type]);
      const minutes = 12 + Math.floor(r() * 4000) + i * 37;
      const messages: Message[] = [
        { id: `m-${ei}-${i}-1`, from: "client", text: opener, at: ago(minutes) },
        {
          id: `m-${ei}-${i}-2`,
          from: "agent",
          text: AGENT_REPLIES[type],
          at: ago(minutes - 4),
        },
      ];
      if (status !== "En attente d'intervention humaine") {
        messages.push({
          id: `m-${ei}-${i}-3`,
          from: "client",
          text: "Parfait, merci beaucoup pour votre réactivité.",
          at: ago(minutes - 10),
        });
      } else {
        messages.push({
          id: `m-${ei}-${i}-3`,
          from: "client",
          text: "Ce n'est pas exactement ma question, puis-je parler à un responsable ?",
          at: ago(minutes - 9),
        });
      }
      out.push({
        id: `conv-${ei + 1}-${i + 1}`,
        estId: est.id,
        client: CLIENTS[(ei * 3 + i) % CLIENTS.length]!,
        channel,
        type,
        status,
        urgency,
        preview: messages[messages.length - 1]!.text,
        createdAt: ago(minutes),
        messages,
      });
    }
  });
  return out;
}

export const CONVERSATIONS: Conversation[] = buildConversations();

const FAQ_SEED: Array<[string, string]> = [
  ["Quelle est l'heure d'arrivée et de départ ?", "L'arrivée se fait à partir de 15h et le départ jusqu'à 11h. Arrivées tardives possibles sur demande."],
  ["Le petit-déjeuner est-il inclus ?", "Oui, le petit-déjeuner marocain maison est inclus dans tous nos tarifs et servi de 8h à 10h30."],
  ["Proposez-vous un transfert depuis l'aéroport ?", "Oui, un transfert privé depuis l'aéroport Marrakech-Ménara est disponible sur réservation préalable."],
  ["Acceptez-vous les enfants ?", "Les enfants sont les bienvenus. Lit d'appoint et lit parapluie disponibles sur demande."],
  ["Quelles sont les conditions d'annulation ?", "Annulation gratuite jusqu'à 7 jours avant l'arrivée, puis la première nuit est due."],
];

export const FAQS: FaqItem[] = ESTABLISHMENTS.flatMap((est, ei) =>
  FAQ_SEED.slice(0, 4 + (ei % 2)).map(([q, a], i) => ({
    id: `faq-${ei + 1}-${i + 1}`,
    estId: est.id,
    question: q,
    answer: a,
    status: i === 3 ? ("Brouillon" as const) : ("Publiée" as const),
  })),
);

const UNANSWERED_SEED = [
  "Le spa est-il accessible aux non-résidents ?",
  "Peut-on célébrer un mariage intimiste sur place ?",
  "Y a-t-il un parking privé sécurisé ?",
  "Acceptez-vous les animaux de compagnie ?",
];

export const UNANSWERED: Unanswered[] = ESTABLISHMENTS.flatMap((est, ei) =>
  UNANSWERED_SEED.slice(0, 2 + (ei % 2)).map((q, i) => ({
    id: `unans-${ei + 1}-${i + 1}`,
    estId: est.id,
    question: q,
  })),
);

const DOC_SEED: Array<[string, string]> = [
  ["Charte d'accueil voyageurs.pdf", "PDF"],
  ["Grille tarifaire 2026.xlsx", "Tableur"],
  ["Procédure check-in tardif.docx", "Document"],
  ["Menu petit-déjeuner.pdf", "PDF"],
];

export const DOCS: Doc[] = ESTABLISHMENTS.flatMap((est, ei) =>
  DOC_SEED.slice(0, 3 + (ei % 2)).map(([name, type], i) => ({
    id: `doc-${ei + 1}-${i + 1}`,
    estId: est.id,
    name,
    type,
    addedAt: ago(3000 + i * 900 + ei * 60),
  })),
);

const CORE_SERVICES: Array<[string, string, Service["status"]]> = [
  ["Accueil VIP et gestion personnalisée des voyageurs", "Prise en charge dédiée de l'arrivée au départ, avec suivi personnalisé de chaque voyageur.", "Disponible"],
  ["Organisation d'expériences privées et d'excursions sur-mesure", "Excursions privées, expériences culturelles et itinéraires conçus à la demande.", "Sur demande"],
  ["Logistique de transport haut de gamme", "Véhicules avec chauffeur, transferts aéroport et déplacements privés.", "Disponible"],
  ["Services lifestyle (réservations, événements, bien-être)", "Réservations de restaurants, organisation d'événements privés et bien-être.", "Sur demande"],
];

const EXTRA_SERVICE: Record<string, [string, string, Service["status"]]> = {
  "est-1": ["Spa & rituels hammam", "Rituels hammam traditionnels et soins signature au spa de la maison.", "Disponible"],
  "est-3": ["Piscine chauffée & pool service", "Piscine chauffée avec service en transat et carte de rafraîchissements.", "Disponible"],
  "est-5": ["Visite privée des collections", "Découverte guidée des collections d'art et d'objets de la maison.", "Sur demande"],
  "est-8": ["Dîner sous les étoiles", "Dîner privé dressé dans le désert, avec musiciens gnaoua.", "Sur demande"],
  "est-10": ["Retraite yoga & bien-être", "Programmes de retraite yoga, méditation et nutrition sur plusieurs jours.", "Sur demande"],
};

export const SERVICES: Service[] = ESTABLISHMENTS.flatMap((est, ei) => {
  const items = [...CORE_SERVICES];
  const extra = EXTRA_SERVICE[est.id];
  if (extra) items.push(extra);
  return items.map(([name, description, status], i) => ({
    id: `srv-${ei + 1}-${i + 1}`,
    estId: est.id,
    name,
    description,
    status,
  }));
});

const COMPLAINT_MESSAGES = [
  "La chambre n'était pas prête à notre arrivée à 16h et nous avons attendu près d'une heure sans explication.",
  "Nous avons été facturés deux fois pour la même nuit, merci de régulariser rapidement.",
  "La salle de bain présentait des traces de calcaire et les serviettes n'ont pas été changées.",
  "Le transfert aéroport réservé n'était pas au point de rendez-vous convenu.",
  "Le wifi est resté inutilisable pendant tout notre séjour malgré nos signalements.",
  "Le petit-déjeuner a été servi avec 45 minutes de retard deux matins de suite.",
  "Notre demande de chambre calme n'a pas été prise en compte, la rue est très bruyante.",
  "Le climatiseur faisait un bruit important toute la nuit, sommeil impossible.",
];

export const COMPLAINTS: Complaint[] = Array.from({ length: 22 }, (_, i) => {
  const r = rng(2200 + i * 17);
  const est = ESTABLISHMENTS[i % ESTABLISHMENTS.length]!;
  const conv = CONVERSATIONS.find((c) => c.estId === est.id && c.type === "Réclamation");
  const status = pick(r, COMPLAINT_STATUSES);
  const urgency: Urgency = i % 4 === 0 ? "Urgent" : i % 3 === 0 ? "Moyen" : pick(r, URGENCIES);
  const createdAt = ago(40 + i * 260);
  return {
    id: `rec-${i + 1}`,
    estId: est.id,
    client: CLIENTS[(i * 5) % CLIENTS.length]!,
    channel: pick(r, CHANNELS),
    category: CATEGORIES[i % CATEGORIES.length]!,
    urgency,
    status: urgency === "Urgent" && i % 8 === 0 ? "Nouvelle" : status,
    createdAt,
    message: COMPLAINT_MESSAGES[i % COMPLAINT_MESSAGES.length]!,
    notes: "",
    history: [{ at: createdAt, label: "Réclamation créée depuis le canal d'origine" }],
    conversationId: conv?.id,
  };
});

export const MESSAGE_VOLUME = ESTABLISHMENTS.map((est, i) => ({
  name: est.name.split(" ").slice(0, 2).join(" "),
  estId: est.id,
  messages: 38 + ((i * 27) % 96),
}));

export const CONTACT = {
  phone: "+212 771 040 202",
  email: "contact@atlashospitalityadvisory.com",
  instagram: "https://www.instagram.com/atlas_hospitality_advisory/",
  linkedin: "https://www.linkedin.com/company/aha-atlas-hospitality-advisory/",
  website: "https://atlashospitalityadvisory.com/",
};

export const CHANNEL_HINT: Record<Channel, string> = {
  Email: "Boîte e-mail dédiée",
  WhatsApp: "WhatsApp Business",
  Booking: "Booking.com",
  Airbnb: "Airbnb",
  Expedia: "Expedia",
};
