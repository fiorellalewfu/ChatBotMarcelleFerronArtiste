
export type ScreenName = "accueil" | "galerie" | "detail_oeuvre" | "chat" | "citations" | "atelier_hub" | "jeu" | "atelier" | "resultat" | "heritage" | "souvenirs" | "projection";

export interface Oeuvre {
  id: string;
  titre: string;
  type: "peinture" | "vitrail";
  energie: "explosive" | "intense" | "vive" | "calme" | "éclatant";
  couleurs_tags: string[];
  pitch_10s: string;
  phrase_inspiree: string;
  pont_science_20s: string;
  defi_2min: string[];
  questions_rapides: string[];
  palette_atelier: string[];
}

export interface Catalogue {
  meta: {
    lang: string;
    version: string;
    public: string;
    format: string;
    disclaimer: string;
  };
  global_ui: {
    chips_questions_generales: string[];
    defi_format_2min: string[];
  };
  oeuvres: Oeuvre[];
  heritage_module: {
    video: {
      titre: string;
      duree_cible: string;
      caption: string;
    };
    boutons: {
      id: string;
      label: string;
      microcopy: string;
    }[];
    final_cta: {
      label: string;
      route: string;
    };
  };
}

export interface Cta {
  label: string;
  route: string;
  params?: Record<string, any>;
}

export interface AIResponse {
  screen: ScreenName;
  voice: string;
  on_screen: string;
  chips: string[];
  cta?: Cta;
  context?: Record<string, any>;
}
