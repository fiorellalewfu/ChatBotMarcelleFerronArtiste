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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [creations, setCreations] = useState<string[]>([]);
  const initialFetchMade = useRef(false); // Ref to prevent double fetch in StrictMode

  const saveCreation = (imageDataUrl: string) => {
    setCreations(prev => [...prev, imageDataUrl]);
  };

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);
    
    const newHistory = [...history, `User: ${message}`];

    try {
      const response = await getAiResponse(message, history);
      setAiResponse(response);
      setHistory([...newHistory, `AI: ${JSON.stringify(response)}`]);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      setAiResponse(null); // Clear previous valid response on error
    } finally {
      setIsLoading(false);
    }
  }, [history]);

  useEffect(() => {
    // This check prevents the double API call caused by React.StrictMode in development.
    if (!initialFetchMade.current) {
      initialFetchMade.current = true;
      // Initial message to start the conversation
      sendMessage("Bonjour, présente-toi et propose le Parcours Éclat.");
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
