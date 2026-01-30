
import React from 'react';
import ScreenLayout from '../components/ScreenLayout';
import type { AIResponse } from '../types';
import { useAppContext } from '../contexts/AppContext';

const StyleCard: React.FC<{ title: string, description: string, imageUrl: string, onClick: () => void }> = ({ title, description, imageUrl, onClick }) => (
  <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col h-full border border-gray-700">
    <img src={imageUrl} alt={title} className="w-full h-48 object-cover"/>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 mb-4 flex-grow">{description}</p>
      <button 
        onClick={onClick}
        className="mt-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full"
      >
        Choisir ce style
      </button>
    </div>
  </div>
);

const AtelierHubScreen: React.FC<{ response: AIResponse }> = ({ response }) => {
  const { sendMessage } = useAppContext();

  return (
    <ScreenLayout response={response}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
        <StyleCard 
          title="Création Style Vitrail"
          description="Joue avec les formes géométriques, la lumière et les couleurs vives pour construire comme avec du verre."
          imageUrl="https://images.unsplash.com/photo-1579237096682-35a165f45812?q=80&w=800&auto=format&fit=crop"
          onClick={() => sendMessage("Je veux créer en style vitrail")}
        />
        <StyleCard 
          title="Création Style Peinture"
          description="Exprime-toi avec des gestes amples, des textures et des contrastes forts, comme avec un couteau à peindre."
          imageUrl="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=800&auto=format&fit=crop"
          onClick={() => sendMessage("Je veux créer en style peinture")}
        />
      </div>
    </ScreenLayout>
  );
};

export default AtelierHubScreen;
