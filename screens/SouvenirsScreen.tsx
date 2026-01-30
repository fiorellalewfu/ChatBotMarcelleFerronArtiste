
import React from 'react';
import ScreenLayout from '../components/ScreenLayout';
import type { AIResponse } from '../types';
import { useAppContext } from '../contexts/AppContext';

const SouvenirsScreen: React.FC<{ response: AIResponse }> = ({ response }) => {
  const { creations, sendMessage } = useAppContext();

  return (
    <ScreenLayout response={response}>
      {creations.length === 0 ? (
        <div className="text-center text-gray-300 text-xl">
          <p>Le mur est encore vide !</p>
          <p className="mt-2">Va à l'atelier pour créer ton premier chef-d'œuvre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pr-2 overflow-y-auto" style={{maxHeight: 'calc(100vh - 350px)'}}>
          {creations.map((creationUrl, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-cyan-500/20 cursor-pointer group border-2 border-transparent hover:border-cyan-400"
              onClick={() => sendMessage(`Je veux voir ma création numéro ${index + 1}`)}
            >
              <img 
                src={creationUrl} 
                alt={`Création ${index + 1}`} 
                className="w-full h-40 object-cover bg-white" 
              />
               <div className="p-2 text-center">
                <p className="text-sm font-bold text-gray-300 group-hover:text-white">Création #{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScreenLayout>
  );
};

export default SouvenirsScreen;
