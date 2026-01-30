import React from 'react';
import type { AIResponse } from '../types';
import { useAppContext } from '../contexts/AppContext';

const ProjectionScreen: React.FC<{ response: AIResponse }> = ({ response }) => {
  const { creations, sendMessage, isLoading } = useAppContext();
  const creationIndex = response.context?.creation_index;

  if (creationIndex === undefined || !creations[creationIndex]) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h2 className="text-2xl">Oups !</h2>
        <p className="mt-2 mb-6">Nous n'avons pas pu trouver cette création.</p>
        <button
          onClick={() => sendMessage('Retour au mur des souvenirs')}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Retour aux souvenirs
        </button>
      </div>
    );
  }

  const creationUrl = creations[creationIndex];

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black relative">
      <img src={creationUrl} alt={`Création ${creationIndex + 1}`} className="max-w-full max-h-full object-contain" />

      {!isLoading && (
        <button
          onClick={() => sendMessage('Retour au mur des souvenirs')}
          className="absolute top-4 left-4 bg-black/50 hover:bg-black/80 text-white font-bold py-2 px-4 rounded-full transition-colors text-2xl"
          aria-label="Retour au mur des souvenirs"
        >
          &larr;
        </button>
      )}
    </div>
  );
};

export default ProjectionScreen;
