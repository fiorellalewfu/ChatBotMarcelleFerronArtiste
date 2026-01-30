
import type { Catalogue } from '../types';

export const catalogue: Catalogue = {
  "meta": {
    "lang": "fr",
    "version": "prototype_v1",
    "public": "10-14",
    "format": "kiosque_tactile",
    "disclaimer": "Titres et phrases inspirés pour prototype. Remplacer par œuvres/quotes validées + crédits."
  },
  "global_ui": {
    "chips_questions_generales": [
      "Pourquoi autant de couleurs?",
      "C’est quoi un vitrail?",
      "Comment tu trouves tes formes?",
      "Le lien avec la science?",
      "Un défi rapide!",
      "Une phrase inspirante?"
    ],
    "defi_format_2min": [
      "Choisis 3 couleurs",
      "Ajoute 6 formes",
      "Crée un contraste fort",
      "Change 1 chose et observe"
    ]
  },
  "oeuvres": [
    {
      "id": "FERRON_P01",
      "titre": "Éclats rouges",
      "type": "peinture",
      "energie": "explosive",
      "couleurs_tags": ["rouge", "noir", "blanc"],
      "pitch_10s": "Des blocs rouges qui claquent, comme une percussion.",
      "phrase_inspiree": "Ose le contraste. C’est lui qui réveille l’œil.",
      "pont_science_20s": "Ton œil repère d’abord les contrastes (clair/sombre). Plus c’est contrasté, plus ton cerveau ‘accroche’ vite.",
      "defi_2min": [
        "Prends rouge + noir + blanc",
        "Place 3 grands blocs et 3 petits",
        "Laisse un ‘chemin’ blanc pour respirer",
        "Augmente le contraste une dernière fois"
      ],
      "questions_rapides": [
        "Pourquoi le rouge frappe autant?",
        "Comment faire du contraste?",
        "C’est abstrait… ça veut dire quoi?"
      ],
      "palette_atelier": ["#B91C1C", "#1F2937", "#FFFFFF", "#6B7280", "#F97316", "#7F1D1D"]
    },
    {
      "id": "FERRON_P02",
      "titre": "Noir en mouvement",
      "type": "peinture",
      "energie": "intense",
      "couleurs_tags": ["noir", "bleu", "blanc"],
      "pitch_10s": "Du noir qui semble bouger comme une ombre rapide.",
      "phrase_inspiree": "Le noir n’est pas vide. Il fait respirer la lumière.",
      "pont_science_20s": "Dans la perception, le sombre peut ‘pousser’ le clair. Ton cerveau lit les bords (contours) avant les détails.",
      "defi_2min": [
        "Fond clair (blanc/gris)",
        "Dessine 4 traits noirs épais (différentes directions)",
        "Ajoute 2 petites touches bleues pour l’énergie",
        "Éloigne-toi: est-ce que ça ‘bouge’?"
      ],
      "questions_rapides": [
        "Pourquoi le noir est important?",
        "Comment créer du mouvement?",
        "Tu regardes de près ou de loin?"
      ],
      "palette_atelier": ["#111827", "#FFFFFF", "#2563EB", "#6B7280", "#312E81", "#06B6D4"]
    },
    {
      "id": "FERRON_P03",
      "titre": "Bleu électrique",
      "type": "peinture",
      "energie": "vive",
      "couleurs_tags": ["bleu", "jaune", "noir"],
      "pitch_10s": "Un bleu puissant, coupé par des éclairs de jaune.",
      "phrase_inspiree": "Quand deux couleurs se disputent, l’image s’allume.",
      "pont_science_20s": "Couleurs complémentaires: certaines paires (ex. bleu/jaune) augmentent la sensation d’énergie par contraste.",
      "defi_2min": [
        "Choisis bleu + jaune + noir",
        "Fais 5 formes bleues (tailles variées)",
        "Ajoute 3 ‘éclairs’ jaunes",
        "Pose 1 ligne noire pour ‘tenir’ la composition"
      ],
      "questions_rapides": [
        "Pourquoi ça ‘vibre’?",
        "Comment choisir 2 couleurs fortes?",
        "Tu planifies ou tu testes?"
      ],
      "palette_atelier": ["#2563EB", "#FACC15", "#111827", "#FFFFFF", "#312E81", "#F97316"]
    },
    {
      "id": "FERRON_P04",
      "titre": "Rythme fracturé",
      "type": "peinture",
      "energie": "explosive",
      "couleurs_tags": ["multicolore", "noir"],
      "pitch_10s": "Des morceaux de couleur comme un vitrail cassé… mais vivant.",
      "phrase_inspiree": "Brise la forme. C’est là que l’idée apparaît.",
      "pont_science_20s": "Ton cerveau adore reconnaître des motifs… puis il se réveille quand le motif se casse. Surprise = attention.",
      "defi_2min": [
        "Choisis 4 couleurs + noir",
        "Crée 8 formes ‘cassées’ (angles, triangles)",
        "Trace 3 lignes noires pour séparer comme du verre",
        "Change 1 forme: plus grande, plus audacieuse"
      ],
      "questions_rapides": [
        "Pourquoi casser les formes?",
        "Ça vient d’où, le style vitrail?",
        "Comment éviter le ‘trop plein’?"
      ],
      "palette_atelier": ["#DC2626", "#3B82F6", "#FACC15", "#22C55E", "#000000", "#FFFFFF"]
    },
    {
      "id": "FERRON_P05",
      "titre": "Silence lumineux",
      "type": "peinture",
      "energie": "calme",
      "couleurs_tags": ["blanc", "gris", "bleu pâle"],
      "pitch_10s": "Peu de couleurs, mais beaucoup de lumière.",
      "phrase_inspiree": "Moins, c’est parfois plus fort.",
      "pont_science_20s": "Quand il y a moins d’éléments, ton attention se fixe mieux. C’est comme réduire le “bruit” dans une expérience.",
      "defi_2min": [
        "Choisis blanc + gris + bleu pâle",
        "Fais 3 grandes zones douces",
        "Ajoute 2 petites formes plus foncées",
        "Demande-toi: où l’œil se pose?"
      ],
      "questions_rapides": [
        "Comment faire ‘calme’?",
        "Pourquoi laisser du vide?",
        "C’est quoi ‘respirer’ en art?"
      ],
      "palette_atelier": ["#FFFFFF", "#9CA3AF", "#BFDBFE", "#3B82F6", "#111827", "#D1D5DB"]
    },
    {
      "id": "FERRON_P06",
      "titre": "Collision chaude-froide",
      "type": "peinture",
      "energie": "vive",
      "couleurs_tags": ["orange", "rouge", "bleu"],
      "pitch_10s": "Des couleurs chaudes contre des couleurs froides: ça s’affronte.",
      "phrase_inspiree": "Fais se rencontrer deux mondes: chaud et froid.",
      "pont_science_20s": "Ton cerveau associe souvent chaud/froid à des émotions. C’est de la perception: on ‘ressent’ une couleur.",
      "defi_2min": [
        "Choisis 2 chaudes (rouge/orange) + 1 froide (bleu)",
        "Place une grande zone froide",
        "Fais 4 formes chaudes qui la traversent",
        "Ajoute 1 petite touche opposée pour l’équilibre"
      ],
      "questions_rapides": [
        "Pourquoi ça fait ‘chaud’?",
        "Comment équilibrer 2 mondes?",
        "Tu veux choquer ou calmer?"
      ],
      "palette_atelier": ["#DC2626", "#F97316", "#3B82F6", "#000000", "#FFFFFF", "#FBBF24"]
    },
    {
      "id": "FERRON_P07",
      "titre": "Cadence en diagonales",
      "type": "peinture",
      "energie": "intense",
      "couleurs_tags": ["noir", "jaune", "blanc"],
      "pitch_10s": "Des diagonales qui donnent l’impression de vitesse.",
      "phrase_inspiree": "Une diagonale, c’est une flèche pour l’œil.",
      "pont_science_20s": "Les lignes obliques suggèrent souvent le mouvement. Ton cerveau anticipe une direction, comme dans le sport.",
      "defi_2min": [
        "Choisis noir + blanc + jaune",
        "Trace 5 diagonales (tailles variées)",
        "Place 3 formes jaunes sur les ‘intersections’",
        "Regarde: est-ce que ça va ‘vers’ quelque part?"
      ],
      "questions_rapides": [
        "Pourquoi les diagonales bougent?",
        "Comment guider le regard?",
        "C’est quoi une composition?"
      ],
      "palette_atelier": ["#000000", "#FFFFFF", "#FACC15", "#6B7280", "#F97316", "#3B82F6"]
    },
    {
      "id": "FERRON_V01",
      "titre": "Vitrail — Champ-de-Mars (inspiré)",
      "type": "vitrail",
      "energie": "éclatant",
      "couleurs_tags": ["multicolore", "noir"],
      "pitch_10s": "Comme une fenêtre de lumière: la couleur change quand tu bouges.",
      "phrase_inspiree": "La lumière est mon pinceau invisible.",
      "pont_science_20s": "Un vitrail filtre la lumière: selon l’intensité et l’angle, ton œil perçoit des couleurs différentes. Teste en bougeant!",
      "defi_2min": [
        "Active le slider ‘Lumière’",
        "Observe 2 couleurs qui changent le plus",
        "Choisis 3 couleurs et fais un ‘mini-vitrail’ en 6 formes",
        "Sépare avec des lignes sombres (comme du plomb)"
      ],
      "questions_rapides": [
        "Pourquoi la lumière change tout?",
        "Comment ça se construit, un vitrail?",
        "C’est quoi ‘filtrer’ la lumière?"
      ],
      "palette_atelier": ["#EF4444", "#3B82F6", "#FACC15", "#22C55E", "#000000", "#FFFFFF"]
    },
    {
      "id": "FERRON_V02",
      "titre": "Mur de lumière",
      "type": "vitrail",
      "energie": "calme",
      "couleurs_tags": ["bleu", "vert", "jaune"],
      "pitch_10s": "Des couleurs qui semblent flotter, comme de l’eau et du soleil.",
      "phrase_inspiree": "Je construis avec des éclats, comme des notes de musique.",
      "pont_science_20s": "La transparence laisse passer la lumière. Plus c’est transparent, plus l’arrière-plan influence ce que tu vois.",
      "defi_2min": [
        "Choisis 3 couleurs ‘calmes’ (bleu/vert/jaune)",
        "Fais 6 formes avec beaucoup d’espace entre elles",
        "Baisse puis monte la ‘Lumière’",
        "Décide: plus doux ou plus éclatant?"
      ],
      "questions_rapides": [
        "C’est quoi la transparence?",
        "Pourquoi l’arrière-plan compte?",
        "Comment faire ‘flotter’ une forme?"
      ],
      "palette_atelier": ["#60A5FA", "#4ADE80", "#FDE047", "#FFFFFF", "#2DD4BF", "#A7F3D0"]
    },
    {
      "id": "FERRON_V03",
      "titre": "Éclats urbains",
      "type": "vitrail",
      "energie": "vive",
      "couleurs_tags": ["rouge", "orange", "bleu"],
      "pitch_10s": "Une ville en morceaux de couleur: énergie, vitesse, bruit.",
      "phrase_inspiree": "La ville aussi peut devenir une toile.",
      "pont_science_20s": "Notre attention est attirée par les zones très lumineuses. C’est utile en ville… et en art public.",
      "defi_2min": [
        "Choisis rouge/orange/bleu",
        "Fais 3 zones ‘phares’ très lumineuses",
        "Entoure-les de formes plus sombres",
        "Teste: où ton œil va en premier?"
      ],
      "questions_rapides": [
        "Pourquoi l’art dans la ville?",
        "Comment attirer l’œil?",
        "C’est quoi l’art public?"
      ],
      "palette_atelier": ["#F87171", "#FB923C", "#60A5FA", "#111827", "#FFFFFF", "#FACC15"]
    },
    {
      "id": "FERRON_V04",
      "titre": "Prisme",
      "type": "vitrail",
      "energie": "éclatant",
      "couleurs_tags": ["multicolore"],
      "pitch_10s": "Comme un arc-en-ciel découpé: ça disperse la lumière.",
      "phrase_inspiree": "Je laisse la lumière faire une partie du travail.",
      "pont_science_20s": "Un prisme sépare la lumière en couleurs. Même sans prisme, ton œil voit des différences selon le contraste et la transparence.",
      "defi_2min": [
        "Choisis 5 couleurs (arc-en-ciel ou presque)",
        "Fais 10 petites formes en dégradé",
        "Ajoute 2 grandes formes pour ‘tenir’ la scène",
        "Joue avec ‘Lumière’ et observe les changements"
      ],
      "questions_rapides": [
        "C’est quoi un prisme?",
        "Pourquoi on voit un arc-en-ciel?",
        "Comment faire un dégradé simple?"
      ],
      "palette_atelier": ["#EF4444", "#F97316", "#FACC15", "#22C55E", "#3B82F6", "#8B5CF6"]
    },
    {
      "id": "FERRON_V05",
      "titre": "Constellation",
      "type": "vitrail",
      "energie": "intense",
      "couleurs_tags": ["bleu", "blanc", "noir"],
      "pitch_10s": "Des points de lumière dans la nuit: ça scintille.",
      "phrase_inspiree": "Même un petit éclat peut guider tout le regard.",
      "pont_science_20s": "Dans le noir, ton œil cherche les points lumineux. C’est comme repérer des étoiles: peu d’infos, mais très fortes.",
      "defi_2min": [
        "Fond sombre (noir/bleu nuit)",
        "Ajoute 12 petits ‘éclats’ blancs",
        "Relie 3 éclats par des lignes fines",
        "Décide où mettre ‘l’étoile principale’ (plus grande)"
      ],
      "questions_rapides": [
        "Pourquoi ça scintille?",
        "Comment faire une ‘étoile’ en art?",
        "Le noir, c’est une couleur?"
      ],
      "palette_atelier": ["#000000", "#1E3A8A", "#FFFFFF", "#6B7280", "#7DD3FC", "#312E81"]
    }
  ],
  "heritage_module": {
    "video": {
      "titre": "Héritage de Marcelle (prototype)",
      "duree_cible": "45-90s",
      "caption": "Art public, vitrail, audace. Une femme qui a changé l’espace."
    },
    "boutons": [
      {
        "id": "H_CITY",
        "label": "Dans la ville",
        "microcopy": "Voir où l’art vit dehors."
      },
      {
        "id": "H_WOMEN_SCI",
        "label": "Femmes & science",
        "microcopy": "Créer = tester, oser, recommencer."
      },
      {
        "id": "H_FUTURE",
        "label": "Ton futur",
        "microcopy": "Et toi, qu’est-ce que tu veux inventer?"
      }
    ],
    "final_cta": {
      "label": "Refaire un défi (2 min)",
      "route": "atelier-jeu"
    }
  }
};
