# Atlas Connect

Crée une application web backoffice / tableau de bord interne pour AHA (Atlas Hospitality Advisory), une maison marocaine de conseil et gestion hôtelière basée à Marrakech (site réel : atlashospitalityadvisory.com), fondée par Rachid Baliti, positionnée sur le développement, la gestion hôtelière et les services de conciergerie pour boutique-hôtels, riads et propriétés d'exception au Maroc. Ce backoffice centralise la communication client multicanal (email, WhatsApp, plateformes de réservation) pour l'ensemble des établissements gérés par AHA — aujourd'hui traitée manuellement, adresse par adresse, plateforme par plateforme — et pilote un agent IA de service client propre à chaque établissement, ainsi qu'un espace dédié au traitement des réclamations.

Le design doit être somptueux et mémorable, du niveau d'un site d'hôtellerie de luxe (dans l'esprit du site réel d'AHA : arches marocaines, zelliges, tons chauds terracotta/or/brun profond, typographie serif élégante), avec un très haut niveau de soin sur les micro-interactions — mais organisé comme un vrai outil de travail interne, pas une vitrine. La priorité absolue de ce prompt reste fonctionnelle : chaque page listée ci-dessous décrit précisément ses boutons, filtres, barres de recherche, tris, pagination et aperçus — chacun de ces éléments doit se comporter exactement comme décrit, avec un vrai changement d'état visible côté front. S'il y a un doute entre "plus joli" et "vraiment fonctionnel", choisis toujours fonctionnel — mais ne sacrifie jamais un effet visuel décrit ci-dessous : les deux doivent coexister.

Toutes les données réelles ci-dessous (identité, contact, réseaux sociaux, établissements) viennent directement du site officiel atlashospitalityadvisory.com et doivent être utilisées telles quelles, pas remplacées par des équivalents génériques.

Règles techniques non négociables, valables sur toute l'application :

Le login est un pur mock sans validation bloquante : champs en état contrôlé (useState + value/onChange, jamais un simple defaultValue), et les deux boutons de connexion redirigent systématiquement vers le tableau de bord au clic.
Sur chaque liste avec recherche/filtre/tri (Service Client IA, Gestion des réclamations), la liste affichée et le compteur de résultats doivent lire exactement la même variable filtrée calculée une seule fois — jamais deux sources de vérité différentes.
Chaque bouton d'action (ajouter, valider, répondre, tester la connexion, enregistrer, clôturer) doit déclencher un vrai changement d'état local (nouvel élément ajouté, statut modifié, badge mis à jour, compteur recalculé) accompagné d'un toast de confirmation — jamais un clic silencieux sans effet visible.
Rien de purement décoratif ou écrit "en théorie" n'est acceptable. Chaque effet visuel décrit dans ce prompt doit être réellement codé et visible à l'écran, appliqué de façon identique et cohérente sur toutes les pages concernées — pas seulement sur l'écran de login. De la même façon, chaque champ de recherche, chaque filtre, chaque tri et chaque bouton listé plus bas doit fonctionner réellement au premier chargement de l'aperçu, sans exception.
1. Identité visuelle & effets — niveau d'exigence maximal
Marque réelle : "AHA — Atlas Hospitality Advisory". Le vrai site utilise un monogramme en forme de losange fin (outline, non rempli) avec un petit point centré à l'intérieur, accompagné du sigle "A H A" en majuscules serif très espacées (letter-spacing large). Reconstruis ce logo à l'identique en CSS/SVG (pas de logo générique à la place) : un losange tracé au trait (stroke, pas de remplissage, ~1.5px), un point centré, puis "A H A" en police serif à droite avec un tracking large. Sur l'écran de login, anime légèrement le losange : rotation très lente et continue (~40s/tour, @keyframes rotate), à peine perceptible mais vivante.
Coordonnées réelles de l'entreprise (à utiliser telles quelles dans le footer/profil/aide) : téléphone +212 771 040 202, e-mail contact@atlashospitalityadvisory.com, Instagram https://www.instagram.com/atlas_hospitality_advisory/, LinkedIn https://www.linkedin.com/company/aha-atlas-hospitality-advisory/, site https://atlashospitalityadvisory.com/.
Couleur principale : brun/bronze chaud du site réel, 
#8B6F52 — --primary-dark: #4A3826 (brun espresso profond) / --primary-glow: #A6875F.
Couleur d'accent : or/sable du site réel (couleur de thème officielle du site), 
#D4A574 — --accent-soft: #F3E7D3 / --accent-glow: #E0BD8C.
Fond/texte : --background: #FFFDF9 (blanc chaud) / --foreground: #2E2318 / --muted: #F7F1E7 / --border: #E8DCC8.
Polices : "Playfair Display" ou "Cormorant Garamond" (serif élégante) pour les titres et le monogramme, "Inter" pour le corps, via Google Fonts.
Univers visuel : arches marocaines, zelliges, riads, patios, tons chauds — dans l'esprit exact du site réel d'AHA (arcs en fer à cheval, tentures dorées, zelliges bleus/verts en soubassement).
Fond d'écran vivant, sur toutes les pages (priorité de design n°1, à faire avant tout le reste) : abandonne le fond blanc plat. Construis un arrière-plan en dégradé "aurora" doux mêlant --primary-glow et --accent-glow, à une opacité clairement visible (~15-20%, fondu vers transparent), qui dérive lentement en boucle (@keyframes, 20-30s), avec 3 masses de dégradé positionnées différemment (haut-gauche, bas-droite, centre) pour éviter un effet plat. En superposition très discrète (~4-6% d'opacité), ajoute un motif géométrique inspiré des zelliges (SVG répété en pattern, étoiles à 8 branches) fixe en arrière-plan sur toutes les pages internes, pour ancrer l'identité marocaine sans nuire à la lisibilité.
En-tête de chaque page (sous le header de navigation, voir section 3) : bandeau hero léger avec le titre de la page en grande typographie serif, une phrase de sous-titre, et un dégradé chaud en arrière-plan (pas juste un 

 nu) — donne à chaque page une vraie identité, comme une page d'un site d'hôtellerie plutôt qu'un back-office administratif.
Cartes & surfaces : verre dépoli (backdrop-blur) avec ombres douces teintées brun/or (jamais un gris générique), qui se soulèvent au survol (translateY(-4px) + ombre qui s'intensifie, transition ~200ms) et dont la bordure s'illumine légèrement en --accent-glow au survol.
Boutons : effet de brillance diagonale qui traverse au survol (shimmer sweep), léger scale(1.02) au survol, et un effet "magnétique" discret sur les boutons principaux (le bouton suit très légèrement le curseur dans un rayon de ~6px quand la souris est proche).
KPI & chiffres : comptent progressivement de 0 à leur valeur finale à l'affichage (easing, ~1.2s), avec une légère pulsation à l'arrivée sur la valeur finale.
Transitions de page : fluides en fondu + léger décalage vertical (framer-motion AnimatePresence), ~250ms.
Listes : entrée en cascade (stagger) des lignes/cartes au chargement d'une page ou après un filtrage (chaque élément apparaît ~40ms après le précédent, fondu + léger décalage vers le haut).
États de chargement simulés : skeletons avec effet de balayage lumineux (shimmer) pendant les traitements simulés (génération de réponse de l'agent, etc.).
Confirmations : toast avec icône animée (check qui se dessine en stroke-dashoffset) plutôt qu'une simple icône statique.
Scrollbar personnalisée discrète dans les tons bruns sur les zones à défilement interne.
2. Écran de connexion
Deux colonnes plein écran (min-h-screen w-full, aucune zone morte) : formulaire à gauche, photo de patio de riad marocain (arcs en fer à cheval, zelliges, tentures dorées) avec un dégradé brun profond en superposition à droite, portant "AHA Control" et l'accroche "Toutes vos communications voyageurs, sur tous vos établissements, dans un seul endroit".
Champs pré-remplis en état contrôlé : Email contact@atlashospitalityadvisory.com, mot de passe AHA@2026. Encart "Accès démonstration" + bouton "Connexion instantanée (démo)". Les deux boutons redirigent systématiquement vers /dashboard, sans aucune condition de validation.
3. Navigation — dans le header, pas de sidebar

Pas de sidebar latérale : toute la navigation vit dans un header fixe en haut de page (sticky top-0), sur fond légèrement translucide avec backdrop-blur au scroll (pour rester lisible par-dessus le fond animé de la section 1).

Zone gauche : monogramme + "A H A" (voir section 1), cliquable, ramène au Tableau de bord.
Zone centrale : les 3 liens de navigation côte à côte, en petites majuscules espacées façon site réel d'AHA — Tableau de bord, Service Client IA, Gestion des réclamations. Le lien actif est souligné par un petit trait doré animé qui glisse d'un lien à l'autre au changement de page (framer-motion layoutId), jamais un simple changement de couleur statique.
Zone droite : recherche rapide "aller à" (icône loupe qui s'étend en champ de saisie au clic ; tape le nom d'un établissement, Entrée redirige vers son espace Service Client IA), icône notifications (badge avec le nombre de réclamations urgentes ou de conversations en attente d'intervention humaine, ouvre un petit panneau listant les dernières activités), avatar (Rachid Baliti, AHA) avec menu déroulant (Profil / Déconnexion → redirige vers /).
Mobile (< 768px) : les 3 liens centraux disparaissent derrière une icône hamburger qui ouvre un menu déroulant plein-largeur sous le header, avec une transition fluide (hauteur animée, pas un simple display: none/block).
Le contenu de chaque page commence directement sous ce header, avec le bandeau hero décrit en section 1.
4. Page "Tableau de bord"
5 cartes KPI qui comptent progressivement à l'affichage (voir effets section 1), chacune cliquable et redirigeant vers la page correspondante : "Messages traités aujourd'hui", "Taux de réponse automatique de l'agent (%)", "Réclamations urgentes ouvertes", "Établissements actifs", "Conversations en attente d'intervention humaine".
Graphique en barres du volume de messages par établissement sur les 7 derniers jours, données mockées cohérentes avec les autres pages.
Flux "Activité récente" avec au moins 6 entrées horodatées réalistes (ex. "Réponse automatique envoyée — Riad Villa Saphir & Spa — WhatsApp — il y a 12 min", "Réclamation urgente créée — Palais Menzah — il y a 40 min", "Nouvel établissement ajouté — il y a 2h"), chaque entrée cliquable et redirigeant vers l'établissement ou la réclamation concernée.
5. Page "Service Client IA" — cœur de l'application

C'est le module qui centralise, établissement par établissement, tout ce qui est aujourd'hui éclaté sur 10 adresses e-mail, WhatsApp et plusieurs plateformes de réservation.

a) Sélecteur d'établissement (en haut de page, toujours visible)

Barre de recherche en temps réel + rangée de cartes/chips établissement (photo miniature, nom, badge du nombre de conversations en attente), scrollable horizontalement. Cliquer sur une carte charge son espace dédié en dessous, avec transition en fondu.
Génère 10 établissements mockés. Utilise en priorité ces 5 établissements réels, avec leur description reprise mot pour mot du portfolio officiel d'AHA (à utiliser comme description par défaut de l'établissement, modifiable ensuite) :
Riad Villa Saphir & Spa — Maison d'hôtes & Spa — "Accompagnement stratégique, développement de l'expérience client et optimisation des standards d'hospitalité."
Palais Menzah — Maison d'hôtes — "Développement du positionnement commercial, structuration opérationnelle et valorisation de l'identité du lieu."
Dar Salah Eddine Oasis Pool & Spa — Villa & Maison d'hôtes — "Création de l'expérience client, développement commercial, gestion de la distribution et optimisation de la performance."
Dr Lazrek Villa & Guest House — Villa & Guest House — "Conseil en hospitalité, structuration des opérations et amélioration des standards de service."
Palais des Collectionneurs — Villa de prestige — "Accompagnement dans la stratégie de marque, le développement de l'offre et la mise en valeur de l'expérience haut de gamme."
Puis complète avec 5 établissements fictifs plausibles du même type, tous situés à Marrakech ou dans sa région, pour atteindre les 10 établissements mentionnés par le client. (Le site public d'AHA ne liste pas de site web, horaires ou réseaux sociaux propres à chaque établissement — ces champs sont justement ce que ce backoffice permet au client de renseigner : pré-remplis-les avec des valeurs mockées plausibles pour les 10 établissements de la démo, mais présente-les comme éditables dès le premier écran, pas comme des données figées.)
Bouton "+ Ajouter un établissement" en fin de rangée : ouvre un modal avec formulaire complet (nom, photo de couverture, puis directement les champs de la fiche "Infos générales" détaillés au point e). À la validation, ajoute réellement une nouvelle carte dans le sélecteur, la sélectionne automatiquement, toast de confirmation, badge "Nouveau" temporaire. C'est l'illustration concrète du besoin client d'un système paramétrable : aucune intervention technique ne doit être nécessaire pour ajouter un établissement futur.

b) Espace de l'établissement sélectionné — 5 onglets internes

Bandeau d'en-tête avec photo, nom et ville de l'établissement, puis 5 onglets :

Onglet "Conversations" (onglet par défaut à la sélection)

Barre d'outils : recherche en temps réel (nom du client, contenu), filtres déroulants fonctionnels (Canal : Email / WhatsApp / Booking / Airbnb / Expedia — Statut : Traité par l'agent / En attente d'intervention humaine / Clôturé — Type de demande : Disponibilité / Demande spéciale / Suivi de réservation / Réclamation), tri (Date, Urgence), bouton "Réinitialiser les filtres".
Chaque ligne : icône du canal, nom du client, aperçu du dernier message, type de demande, statut, horodatage. Pagination fonctionnelle (10/25/50 par page), total affiché et lignes provenant strictement de la même liste filtrée (règle n°2).
Détail d'une conversation (clic sur une ligne) : fil de discussion complet (bulles client / agent IA), chaque message de l'agent avec un badge "Réponse générée par l'agent IA". Si statut "En attente d'intervention humaine" : zone de réponse manuelle activée, bouton "Envoyer et clôturer" (change réellement le statut, toast de confirmation). Bouton "Transformer en réclamation" disponible sur toute conversation : ouvre un mini-formulaire (catégorie, urgence) et crée réellement une entrée dans "Gestion des réclamations", avec lien retour vers la conversation d'origine.
Génère 8-10 conversations mockées réalistes par établissement (soit ~90 au total, réparties sur les 5 canaux).

Onglet "FAQ"

Liste de questions/réponses éditables (ajout, édition, suppression), chaque entrée avec question, réponse, statut (Publiée / Brouillon).
Bandeau "Questions sans réponse détectées par l'agent" en haut de l'onglet : questions réelles posées par des clients de cet établissement sans réponse en base — bouton "Ajouter à la FAQ" qui ouvre le formulaire pré-rempli et retire réellement l'entrée du bandeau une fois traitée.

Onglet "Documents"

Liste de documents mockés (upload simulé, drag & drop avec barre de progression ~1s), avec nom, type, date d'ajout, bouton de suppression.

Onglet "Services"

Liste éditable des services/prestations propres à l'établissement. Pré-remplis les exemples avec les vrais services de conciergerie mis en avant par AHA sur son site (à décliner par établissement) : Accueil VIP et gestion personnalisée des voyageurs, Organisation d'expériences privées et d'excursions sur-mesure, Logistique de transport haut de gamme, Services lifestyle (réservations, événements, bien-être) — plus une ou deux prestations propres au type d'établissement (ex. Spa pour "Riad Villa Saphir & Spa", Piscine pour "Dar Salah Eddine Oasis Pool & Spa"). Chaque service avec un nom, une courte description, un statut Disponible/Sur demande. Ajout/édition/suppression réels.

Onglet "Infos générales"

Formulaire éditable avec : nom de l'établissement, ville/adresse, site web, horaires d'ouverture (jours actifs à cocher + créneau horaire, ex. Lun-Dim 08:00-20:00 pour la réception), liens réseaux sociaux (champs Instagram, Facebook, autre — avec petite icône par réseau), adresse e-mail dédiée utilisée par l'agent pour cet établissement.
Bouton "Enregistrer les informations" : toast de succès, ces informations alimentent réellement la base de connaissances utilisée par l'agent (mentionné en info-bulle).

c) Formulaire "Ajouter un établissement" (modal, depuis le bouton du point a)

Reprend exactement les champs de l'onglet "Infos générales" ci-dessus (nom, photo, ville, site web, horaires, réseaux sociaux, e-mail dédié), en une seule fois à la création — l'établissement créé démarre avec ses onglets Conversations/FAQ/Documents/Services vides mais fonctionnels (états vides soignés, pas d'erreur).
6. Page "Gestion des réclamations"
Vue en tableau : chaque ligne = une réclamation, avec client, établissement (badge coloré, cliquable vers son espace Service Client IA), canal d'origine, catégorie (Propreté, Réservation, Facturation, Service sur place, Autre), niveau d'urgence (badge coloré : vert Faible / orange Moyen / rouge Urgent), statut (Nouvelle / En cours / Résolue), date de création.
Recherche, filtres (établissement, catégorie, urgence, statut) et tri fonctionnels, avec la même règle de cohérence liste/compteur que partout ailleurs (règle n°2). Pagination fonctionnelle.
Clic sur une ligne : détail complet de la réclamation, contenu du message d'origine, lien vers la conversation source (redirige vers l'onglet Conversations de l'établissement concerné), zone de notes internes, et boutons de changement de statut ("Prendre en charge", "Marquer comme résolue") qui mettent réellement à jour le badge de statut et ajoutent une entrée horodatée à un petit historique en bas de fiche.
Bandeau récapitulatif en haut de page : 3 compteurs animés (Réclamations urgentes ouvertes, Temps de résolution moyen, Réclamations résolues ce mois).

Assistant IA (accessible depuis le Tableau de bord et Gestion des réclamations) : bouton flottant "Demander à l'assistant IA" en bas à droite (glow animé, toujours visible en scrollant), ouvre un panneau coulissant à droite (~400px). 4-5 questions suggérées au premier ouverture (ex. "Quel établissement reçoit le plus de réclamations ce mois-ci ?", "Combien de conversations sont en attente d'intervention humaine ?", "Quelles questions reviennent souvent sans réponse dans la base de connaissances ?"). Champ de saisie libre + bouton d'envoi, indicateur "L'assistant écrit…" (~800-1200ms) avant chaque réponse. Implémentation : une fonction unique getAssistantReply(question, data) qui génère une réponse pertinente à partir des données mockées via une correspondance par mots-clés simple.

7. Exigences transverses
Stack : React + Tailwind + shadcn/ui + framer-motion, entièrement responsive (mobile → header en menu déroulant, sélecteur d'établissement en scroll horizontal).
Toutes les données sont mockées en state local, cohérentes entre les pages — un même établissement garde les mêmes informations partout où il apparaît (dashboard, Service Client IA, réclamations).
Toasts de confirmation sur chaque action, états vides soignés ("Aucun résultat pour cette recherche", "Aucune conversation pour le moment"), mode clair uniquement.
Avant de livrer, vérifie concrètement, page par page (pas en supposant que le code "devrait" marcher — recharge réellement l'aperçu et teste chaque interaction) :
Que chaque champ de recherche, chaque filtre déroulant, chaque tri et chaque pagination, sur Service Client IA (Conversations) et Gestion des réclamations, mettent bien à jour la même liste affichée que le compteur de résultats.
Que chaque bouton clique réellement à quelque chose : "+ Ajouter un établissement", "Envoyer et clôturer", "Transformer en réclamation", "Prendre en charge" / "Marquer comme résolue", "Ajouter à la FAQ", "Enregistrer les informations", la navigation du header (y compris le menu mobile), et l'assistant IA (ouverture, envoi de message).
Que le lien actif du header se souligne bien du bon côté et que le trait glisse réellement d'un lien à l'autre (pas un simple changement instantané).
Que créer un établissement le fait bien apparaître dans le sélecteur de la page Service Client IA, avec ses 5 onglets fonctionnels dès sa création.
Que transformer une conversation en réclamation crée bien une entrée visible et cohérente dans "Gestion des réclamations", avec le lien retour fonctionnel vers la conversation d'origine et vers l'établissement.
Que tous les effets de la section 1 (aurora animé à 3 masses, motif zellige discret, bandeau hero par page, verre dépoli, lift + bordure lumineuse au survol, brillance et magnétisme des boutons, compteurs KPI progressifs avec pulsation, transitions de page, entrée en cascade des listes, skeletons shimmer, toasts animés, scrollbar personnalisée) sont bien visibles et fluides sur toutes les pages concernées, pas seulement sur l'écran de login ou le tableau de bord.
Si un seul de ces points ne fonctionne pas à la relecture, corrige-le avant de considérer le travail terminé — ne livre jamais une page avec un bouton, un filtre ou un effet qui ne fait rien.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/08cac4b4-e712-4b72-92be-09a1ccabb6f5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
