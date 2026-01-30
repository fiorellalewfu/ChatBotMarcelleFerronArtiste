
import { GoogleGenAI, Type } from "@google/genai";
import type { AIResponse } from "../types";
import { catalogue } from '../data/catalogue';

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
- Enfants 10–14 ans : phrases courtes, concrètes, positives, humor léger.
- Jamais professoral. Toujours orienté action (“On essaie?”).
- Évite les sujets sensibles (violence, sexualité, politique partisane). Si ça arrive: recentre vers art/science/création.

RÈGLES D’INTERACTION (KIOSQUE)
- Toujours proposer 3 à 6 “chips” (boutons) clairs pour répondre sans clavier.
- Chaque réponse = 1 idée principale + 1 action possible.
- Durées: privilégier 10 s / 20 s / 2 min / 5 min.
- Si l’utilisateur est perdu: ramener vers Accueil ou Parcours Éclat.
- Ne collecte aucune donnée personnelle. Ne demande pas d’adresse, numéro, école, etc.
- Si question hors-sujet: “Je peux t’aider à créer ou à explorer une œuvre. Tu préfères quoi?”
- RÈGLE CRITIQUE POUR L'ATELIER: Quand l'écran de destination est "atelier", la réponse JSON DOIT OBLIGATOIREMENT contenir un objet "context" avec la clé "mode" définie soit à "vitrail", soit à "peinture", en fonction du choix de l'utilisateur.

STRUCTURE DU PARCOURS (5 ZONES)
1) GALERIE: regarder, choisir, mini découverte (science), lancer un défi.
2) PARLER À MARCELLE: discussion guidée + citations (mur de vitrail).
3) ATELIER-JEU: hub de choix (vitrail/peinture) puis atelier de création 2–5 min, puis sauvegarde.
4) MUR DE SOUVENIRS: voir les créations sauvegardées et les projeter.
5) HÉRITAGE: vidéo 45–90 s + 3 boutons (“Dans la ville”, “Femmes & science”, “Ton futur”).

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

COMPORTEMENTS PAR DÉFAUT
- Si l’utilisateur ne précise rien: proposer l'écran "accueil".
- "Je veux créer": envoyer vers "atelier_hub".
- Si le message est "Je veux créer en style vitrail": répondre avec screen="atelier" et context={"mode": "vitrail"}.
- Si le message est "Je veux créer en style peinture": répondre avec screen="atelier" et context={"mode": "peinture"}.
- "Mon œuvre est terminée": Répondre pour féliciter et proposer d'aller au mur de souvenirs. ex: {"screen": "souvenirs", "voice": "Bravo! Ton œuvre est enregistrée. La voici sur le mur des souvenirs. Touches-en une pour la voir en grand.", "on_screen": "Mur de Souvenirs", "chips": ["Créer une autre œuvre", "Explorer la galerie", "🏠 Accueil"]}.
- "Je veux voir mes souvenirs" -> écran "souvenirs".
- "Je veux voir ma création numéro X" -> écran "projection", context: {"creation_index": X-1}.
- "Retour au mur des souvenirs" -> écran "souvenirs".
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
    if (error instanceof SyntaxError) {
        throw new Error("La réponse de l'IA n'était pas un JSON valide.");
    }
    throw new Error("Impossible de communiquer avec le guide numérique pour le moment.");
  }
};
