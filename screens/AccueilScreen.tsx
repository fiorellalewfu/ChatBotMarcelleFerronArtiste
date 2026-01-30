
import React from 'react';
import ScreenLayout from '../components/ScreenLayout';
import type { AIResponse } from '../types';
import { useAppContext } from '../contexts/AppContext';

const ActionCard: React.FC<{ title: string, description: string, onClick: () => void, icon: string }> = ({ title, description, onClick, icon }) => (
  <button 
    onClick={onClick}
    className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl text-left w-full max-w-sm transform transition-all duration-300 hover:scale-105 hover:bg-cyan-900/50 border border-gray-700 hover:border-cyan-500"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </button>
);

const AccueilScreen: React.FC<{ response: AIResponse }> = ({ response }) => {
  const { sendMessage } = useAppContext();

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-red-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-yellow-500/5 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      <div className="relative z-10">
        <ScreenLayout response={response}>
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <p className="text-xl text-gray-300 max-w-2xl">
              Prêt à explorer le monde de la couleur, de la lumière et de la science? Choisis ton aventure.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <ActionCard 
                title="Parcours Éclat"
                description="Une visite guidée de 3-6 min pour tout découvrir. (Recommandé)"
                icon="✨"
                onClick={() => sendMessage("Commencer le Parcours Éclat")}
              />
              <ActionCard 
                title="Venir à l'atelier"
                description="Crée ta propre œuvre inspirée de mon style."
                icon="🎨"
                onClick={() => sendMessage("Je veux créer")}
              />
              <ActionCard 
                title="Explorer la galerie"
                description="Plonge librement dans mes peintures et vitraux."
                icon="🖼️"
                onClick={() => sendMessage("Je veux voir les œuvres")}
              />
            </div>
          </div>
        </ScreenLayout>
      </div>
    </div>
  );
};

export default AccueilScreen;
