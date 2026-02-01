import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext, useRef } from 'react';
import type { AIResponse } from '../types';
import { getAiResponse } from '../services/geminiService';

interface AppContextType {
  aiResponse: AIResponse | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => void;
  history: string[];
  creations: string[];
  saveCreation: (imageDataUrl: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const shouldStayInChat = (message: string) => {
  const normalized = message.toLowerCase();
  return !(
    normalized.includes('accueil') ||
    normalized.includes('retour') ||
    normalized.includes('parcours') ||
    normalized.includes('galerie') ||
    normalized.includes('atelier') ||
    normalized.includes('jeu') ||
    normalized.includes('souvenirs') ||
    normalized.includes('projection') ||
    normalized.includes('héritage') ||
    normalized.includes('heritage')
  );
};

const coerceChatResponse = (response: AIResponse): AIResponse => ({
  ...response,
  screen: 'chat',
  on_screen: response.on_screen || 'Dialogue avec Marcelle',
  chips: response.chips?.length
    ? response.chips
    : ["Mon enfance", "Le vitrail", "Créer librement", "Être artiste", "Conseil pour aujourd'hui", "🏠 Accueil"],
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [creations, setCreations] = useState<string[]>([]);
  const initialFetchMade = useRef(false); // Prevent double fetch in StrictMode

  const saveCreation = (imageDataUrl: string) => {
    setCreations(prev => [...prev, imageDataUrl]);
  };

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

    const newHistory = [...history, `User: ${message}`];
<<<<<<< HEAD
    const isChat = options?.isChat ?? false;
    const messageId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const screenHint = aiResponse?.screen;

    if (isChat) {
      setChatMessages(prev => [...prev, { id: messageId, role: 'user', text: message }]);
    }
=======
>>>>>>> parent of 40f9794 (chat bot area)

    try {
      const response = await getAiResponse(message, history, screenHint);
      const normalizedMessage = message.toLowerCase();
      const isHomeChip = normalizedMessage.includes('🏠');
      const resolvedResponse =
        screenHint === 'chat' &&
        response.screen === 'accueil' &&
        !isHomeChip &&
        shouldStayInChat(message)
          ? coerceChatResponse(response)
          : response;
      setAiResponse(resolvedResponse);
      setHistory([...newHistory, `AI: ${JSON.stringify(response)}`]);
<<<<<<< HEAD
      if (isChat || resolvedResponse.screen === 'chat') {
        const responseId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        setChatMessages(prev => [
          ...prev,
          { id: responseId, role: 'assistant', text: resolvedResponse.voice },
        ]);
      }
=======
>>>>>>> parent of 40f9794 (chat bot area)
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      setAiResponse(null); // Clear previous valid response on error
    } finally {
      setIsLoading(false);
    }
  }, [history, aiResponse]);

  useEffect(() => {
    if (!initialFetchMade.current) {
      initialFetchMade.current = true;
      // Show Accueil immediately so the activity cards are visible on load.
      setAiResponse({
        screen: "accueil",
        voice: "Bienvenue! On teste la couleur et la lumière. Prêt pour le Parcours Éclat?",
        on_screen: "Choisis ton aventure",
        chips: ["Parcours Éclat", "Voir la galerie", "Créer maintenant", "Parler à Marcelle", "🏠 Accueil"],
        cta: { label: "Lancer Parcours Éclat", route: "parcours-eclat" },
        context: { mode: "parcours" },
      });
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const value = {
    aiResponse,
    isLoading,
    error,
    sendMessage,
    history,
    creations,
    saveCreation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
