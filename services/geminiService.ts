import { GoogleGenAI, Type } from "@google/genai";
import type { AIResponse, Oeuvre } from "../types";
import { catalogue } from "../data/catalogue";

// @google/genai-sdk-guideline:
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// @google/genai-sdk-guideline:
// Use the `systemInstruction` config property for setting the model's persona, rules, and instructions.
const SYSTEM_INSTRUCTION = `
TU ES “MARCELLE FERRON — GUIDE NUMÉRIQUE” POUR UN KIOSQUE TACTILE (MONTRÉAL, 10–14 ANS).
But: déclencher une création en 2–8 minutes, relier art ↔ science (lumière/couleur/perception + essai/erreur), et mettre en valeur une femme marquante du Québec.

TRANSPARENCE (IMPORTANT)
- Tu es une interprétation numérique inspirée de Marcelle Ferron.
- Les titres/phrases marqués “inspiré” dans le catalogue sont des contenus de prototype (pas des citations historiques vérifiées).
- Ne JAMAIS inventer de faits biographiques précis, dates exactes, ou citations authentifiées si ce n’est pas dans le CATALOGUE.

PUBLIC & TON
- Enfants 10–14 ans : phrases courtes, concrètes, positives, humour léger.
- Jamais professoral. Toujours orienté action (“On essaie?”).
- Évite les sujets sensibles (violence, sexualité, politique partisane). Si ça arrive: recentre vers art/science/création.

RÈGLES D’INTERACTION (KIOSQUE)
- Toujours proposer 3 à 6 “chips” (boutons) clairs pour répondre sans clavier.
- Chaque réponse = 1 idée principale + 1 action possible.
- Durées: privilégier 10 s / 20 s / 2 min / 5 min.
- Si l’utilisateur est perdu: ramener vers Accueil ou Parcours Éclat.
- Ne collecte aucune donnée personnelle. Ne demande pas d’adresse, numéro, école, etc.
- Si question hors-sujet: “Je peux t’aider à créer ou à explorer une œuvre. Tu préfères quoi?”
- Si l'écran cible est "atelier", inclure un objet "context" avec la clé "mode" définie à "vitrail" ou "peinture" selon le choix.

STRUCTURE DU PARCOURS (4 ZONES)
1) GALERIE: regarder, choisir, mini découverte (science), lancer un défi.
2) PARLER À MARCELLE: discussion guidée + citations (mur de vitrail).
3) ATELIER-JEU: jeu 2 min + création 2–5 min.
4) HÉRITAGE: vidéo 45–90 s + 3 boutons (“Dans la ville”, “Femmes & science”, “Ton futur”).

OBJECTIF DE CHAQUE ZONE
- Galerie: “choisis une œuvre” + “découvre 20 s” + “défi 2 min”.
- Chat: réponses courtes + chips + proposer un défi.
- Atelier: outils simples (3–5), contraste, formes, lumière.
- Héritage: émotion + art public + lien femmes & science.

UTILISATION DU CATALOGUE (SOURCE UNIQUE)
- Toute œuvre, défi, pont science et palette viennent du CATALOGUE.
- Si l’utilisateur demande une œuvre non présente: répondre “Je ne l’ai pas dans cette galerie-prototype.” et proposer 2 alternatives proches (mêmes tags couleur/énergie/type).
- Quand l’utilisateur sélectionne une œuvre: utiliser son id (ex: FERRON_P01) et ses champs: pitch_10s, pont_science_20s, defi_2min, palette_atelier, questions_rapides.

FORMAT DE RÉPONSE (OBLIGATOIRE) — JSON POUR INTERFACE TACTILE
Réponds TOUJOURS avec un objet JSON de cette forme:
{
  "screen": "accueil|galerie|detail_oeuvre|chat|citations|atelier_hub|jeu|atelier|resultat|heritage|souvenirs|projection",
  "voice": "texte court (ce que Marcelle dit)",
  "on_screen": "texte très court à afficher (1–2 lignes)",
  "chips": ["bouton 1", "bouton 2", "bouton 3", "bouton 4"],
  "cta": {"label": "bouton principal", "route": "nom_route", "params": {"oeuvre_id": "FERRON_P01"}},
  "context": {"oeuvre_id": "FERRON_P01", "mode": "parcours|libre|vitrail|peinture", "creation_index": 0}
}

CONTRAINTES DE STYLE (UI)
- "voice" max ~2–4 phrases.
- "on_screen" max 120 caractères si possible.
- "chips": 3 à 6 items, verbes d’action, inclure “🏠 Accueil” ou “← Retour” selon l’écran.

COMPORTEMENTS PAR DÉFAUT
- Si l’utilisateur ne précise rien: proposer “Parcours Éclat (3–6 min)” → screen=accueil ou atelier_hub avec mode parcours.
- “Je veux voir des œuvres” → screen=galerie.
- “Je veux parler avec Marcelle” → screen=chat.
- “Je veux jouer/créer” → screen=atelier_hub.
- “Je veux voir le legacy/vidéo” → screen=heritage.
- “Je veux créer en style vitrail” → screen=atelier, context.mode="vitrail".
- “Je veux créer en style peinture” → screen=atelier, context.mode="peinture".
- “Mon œuvre est terminée” → screen=souvenirs, voice de félicitation.
- “Je veux voir mes souvenirs” → écran "souvenirs".
- “Je veux voir ma création numéro X” → écran "projection", context: {"creation_index": X-1}.
- “Retour au mur des souvenirs” → écran "souvenirs".
`;

export const getAiResponse = async (userInput: string, history: string[]): Promise<AIResponse> => {
  try {
    const fullPrompt = `========================
CATALOGUE (DONNÉES)
Voici le catalogue de données JSON que tu dois utiliser. Ne te base que sur ça pour les informations sur les oeuvres.
${JSON.stringify(catalogue, null, 2)}
========================
    
    Historique de la conversation:
    ${history.join('\n')}

    Nouvelle entrée de l'utilisateur: "${userInput}"

    Génère la réponse JSON.
    `;

    // @google/genai-sdk-guideline:
    // When asking the model to return a response in JSON format, the recommended way is to configure a `responseSchema`.
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: fullPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              screen: { type: Type.STRING },
              voice: { type: Type.STRING },
              on_screen: { type: Type.STRING },
              chips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              cta: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  route: { type: Type.STRING },
                  params: {
                    type: Type.OBJECT,
                    properties: {
                      oeuvre_id: { type: Type.STRING },
                    },
                  }
                },
                required: ['label', 'route']
              },
              context: {
                type: Type.OBJECT,
                properties: {
                  oeuvre_id: { type: Type.STRING },
                  mode: { type: Type.STRING },
                  creation_index: { type: Type.INTEGER }
                },
              }
            },
            required: ["screen", "voice", "on_screen", "chips"]
          }
        }
    });

    // @google/genai-sdk-guideline:
    // Access the `.text` property on the GenerateContentResponse object to get the generated text content.
    const text = response.text;

    if (!text) {
        throw new Error("La réponse de l'IA est vide.");
    }

    // With responseSchema, the output is guaranteed to be valid JSON, so complex string cleaning is not needed.
    const parsedResponse: AIResponse = JSON.parse(text.trim());
    return parsedResponse;

  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Gemini ou du parsing JSON:", error);
    return buildFallbackResponse(userInput);
  }
};

/**
 * Fallback minimal responses to keep the kiosk usable offline or si l'API tombe.
 * Ces réponses utilisent le catalogue pour rester cohérentes.
 */
const buildFallbackResponse = (userInput: string): AIResponse => {
  const firstOeuvre: Oeuvre | undefined = catalogue.oeuvres[0];
  const accueil: AIResponse = {
    screen: "accueil",
    voice: "Bienvenue! On teste la couleur et la lumière. Prêt pour le Parcours Éclat?",
    on_screen: "Choisis ton aventure",
    chips: ["Parcours Éclat", "Voir la galerie", "Créer maintenant", "Parler à Marcelle", "🏠 Accueil"],
    cta: { label: "Lancer Parcours Éclat", route: "parcours-eclat" },
    context: { mode: "parcours" }
  };

  const normalized = userInput.toLowerCase();

  if (normalized.includes("accueil") || normalized.includes("🏠")) {
    return accueil;
  }

  if ((normalized.includes("oeuvre") || normalized.includes("œuvre")) && (normalized.includes("termin") || normalized.includes("fin"))) {
    return {
      screen: "souvenirs",
      voice: "Bravo! Ton œuvre est enregistrée. La voici sur le mur des souvenirs.",
      on_screen: "Mur de souvenirs",
      chips: ["Créer une autre œuvre", "Explorer la galerie", "🏠 Accueil"],
    };
  }

  if (normalized.includes("galerie") || normalized.includes("œuvre") || normalized.includes("oeuvre")) {
    return {
      screen: "galerie",
      voice: "Voici ma galerie prototype. Choisis une œuvre et on joue avec la science en 20 secondes.",
      on_screen: "Sélectionne une œuvre",
      chips: catalogue.oeuvres.slice(0, 6).map(o => o.titre).concat(["🏠 Accueil"]).slice(0, 6),
      cta: firstOeuvre ? { label: `Découvrir ${firstOeuvre.titre}`, route: "detail_oeuvre", params: { oeuvre_id: firstOeuvre.id } } : undefined,
      context: firstOeuvre ? { oeuvre_id: firstOeuvre.id, mode: "libre" } : undefined
    };
  }

  if (normalized.includes("cré") || normalized.includes("creer") || normalized.includes("créer")) {
    return {
      screen: "atelier",
      voice: "On fabrique! Choisis vitrail ou peinture, ajoute formes et contraste.",
      on_screen: "Atelier rapide (2–5 min)",
      chips: ["Mode vitrail", "Mode peinture", "Défi 2 min", "← Retour", "🏠 Accueil"],
      cta: { label: "Mode peinture", route: "atelier", params: { mode: "peinture" } },
      context: { mode: "peinture" }
    };
  }

  if (normalized.includes("héritage") || normalized.includes("legacy") || normalized.includes("vidéo") || normalized.includes("video")) {
    return {
      screen: "heritage",
      voice: "Un mini héritage: art public, audace et science. Choisis où on va.",
      on_screen: "Héritage de Marcelle",
      chips: ["Dans la ville", "Femmes & science", "Ton futur", "← Retour", "🏠 Accueil"],
      cta: { label: "Refaire un défi", route: "atelier-jeu" },
    };
  }

  return accueil;
};
