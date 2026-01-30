# Architecture du kiosque “Marcelle Ferron — Guide Numérique”

Cette note sert à répartir le travail en équipe. Le projet reste léger, mais chaque dossier a une responsabilité claire.

## Vue d’ensemble
- `index.html` : page Vite (charge Tailwind CDN), point d’entrée unique.
- `App.tsx` : composition racine, injection du provider et du routeur d’écrans.
- `contexts/` : état global (charge/erreur, historique, créations, envoi des messages).
- `services/` : appels externes (Gemini) + logique fallback locale.
- `data/` : catalogue d’œuvres, palettes, contenu statique.
- `screens/` : écrans correspondant aux zones du parcours (galerie, atelier, souvenirs, etc.).
- `components/` : UI réutilisable (layout, chips, avatar, loader).
- `types.ts` : types partagés pour réponses IA et catalogue.
- `docs/` : documentation interne (ce fichier).  

## Répartition conseillée par “dossier / section”
1) **Experience & flux** (`screens/`, `components/ScreenRouter.tsx`, `App.tsx`)  
   - Prototyper les écrans, enchaînements, CTA et chips.
   - Garantir que chaque écran respecte le format JSON attendu.

2) **Contenus & data** (`data/catalogue.ts`, `types.ts`)  
   - Enrichir/valider le catalogue, les palettes, les tags.
   - Vérifier cohérence des IDs d’œuvres et des textos courts.

3) **IA & règles** (`services/geminiService.ts`)  
   - Ajuster le `SYSTEM_INSTRUCTION`, gérer les schémas, fallback offline.
   - Sécuriser la clé (via `.env.local`) et surveiller les erreurs côté UI.

4) **État & persistance locale** (`contexts/AppContext.tsx`)  
   - Historique, créations sauvegardées, gestion des erreurs / loaders.
   - Brancher de futurs stockages (ex. LocalStorage) si besoin.

5) **UI système** (`components/`, `screens/*`)  
   - Motion, accessibilité tactile, cohérence des chips/boutons.

## Environnement & clés
- Clé Gemini dans `.env.local` : `GEMINI_API_KEY=...`
- Vite charge la clé au build via `vite.config.ts` (pas de préfixe VITE_ requis ici).

## Tests rapides
- `npm run dev -- --host 0.0.0.0 --port 3000` pour le kiosque local.
- `npm run build` puis `npm run preview` pour vérifier le bundle prod.

## Bonnes pratiques d’équipe
- Garder les textes courts (<=120 caractères pour `on_screen`).
- Toujours 3–6 chips, inclure `🏠 Accueil` ou `← Retour` selon l’écran.
- Documenter toute nouvelle route/écran dans ce fichier ou dans les composants concernés.
