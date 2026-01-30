
import React from 'react';
import ScreenLayout from '../components/ScreenLayout';
import type { AIResponse, Oeuvre } from '../types';
import { catalogue } from '../data/catalogue';
import { useAppContext } from '../contexts/AppContext';

const OeuvreCard: React.FC<{ oeuvre: Oeuvre }> = ({ oeuvre }) => {
  const { sendMessage } = useAppContext();
  const imageUrl = `https://picsum.photos/seed/${oeuvre.id}/400/300`;

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-cyan-500/20 cursor-pointer group"
      onClick={() => sendMessage(`Montre-moi l'œuvre "${oeuvre.titre}" (ID: ${oeuvre.id})`)}
    >
      <img src={imageUrl} alt={oeuvre.titre} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold truncate group-hover:text-cyan-400">{oeuvre.titre}</h3>
        <p className="text-sm text-gray-400 capitalize">{oeuvre.type}</p>
      </div>
    </div>
  );
};


const GalleryScreen: React.FC<{ response: AIResponse }> = ({ response }) => {
  return (
    <ScreenLayout response={response}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pr-2 overflow-y-auto" style={{maxHeight: 'calc(100vh - 300px)'}}>
        {catalogue.oeuvres.map(oeuvre => (
          <OeuvreCard key={oeuvre.id} oeuvre={oeuvre} />
        ))}
      </div>
    </ScreenLayout>
  );
};

export default GalleryScreen;
