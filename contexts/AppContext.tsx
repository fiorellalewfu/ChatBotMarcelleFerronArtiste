import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext, useRef } from 'react';
import type { AIResponse } from '../types';
import { getAiResponse } from '../services/geminiService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface SendMessageOptions {
  isChat?: boolean;
}

interface AppContextType {
  aiResponse: AIResponse | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string, options?: SendMessageOptions) => void;
  history: string[];
  chatMessages: ChatMessage[];
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [creations, setCreations] = useState<string[]>([]);
  const initialFetchMade = useRef(false); // Prevent double fetch in StrictMode

  const saveCreation = (imageDataUrl: string) => {
    setCreations(prev => [...prev, imageDataUrl]);
  };

  const sendMessage = useCallback(async (message: string, options?: SendMessageOptions) => {
    setIsLoading(true);
    setError(null);

    const newHistory = [...history, `User: ${message}`];
    const isChat = options?.isChat ?? false;
    const messageId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const screenHint = aiResponse?.screen;

    if (isChat) {
      setChatMessages(prev => [...prev, { id: messageId, role: 'user', text: message }]);
    }

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
      if (isChat || resolvedResponse.screen === 'chat') {
        const responseId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        setChatMessages(prev => [
          ...prev,
          { id: responseId, role: 'assistant', text: resolvedResponse.voice },
        ]);
      }
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
      // Initial message to start the conversation
      sendMessage('Bonjour, présente-toi et propose le Parcours Éclat.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const value = {
    aiResponse,
    isLoading,
    error,
    sendMessage,
    history,
    chatMessages,
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
