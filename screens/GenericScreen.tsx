
import React from 'react';
import ScreenLayout from '../components/ScreenLayout';
import type { AIResponse } from '../types';
import { catalogue } from '../data/catalogue';

const OeuvreDetail: React.FC<{ oeuvreId: string }> = ({ oeuvreId }) => {
  const oeuvre = catalogue.oeuvres.find(o => o.id === oeuvreId);
  if (!oeuvre) return null;

  const imageUrl = `https://picsum.photos/seed/${oeuvre.id}/800/600`;

  return (
    <div className="flex flex-col md:flex-row gap-6 text-white max-h-[calc(100vh-350px)] overflow-y-auto">
      <div className="md:w-1/2">
        <img src={imageUrl} alt={oeuvre.titre} className="w-full h-auto object-cover rounded-lg shadow-2xl"/>
      </div>
      <div className="md:w-1/2 space-y-4">
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">Le mot de Marcelle</h3>
          <p className="italic">“{oeuvre.phrase_inspiree}”</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-cyan-400 mb-2">Pont avec la science (20s)</h3>
          <p>{oeuvre.pont_science_20s}</p>
        </div>
      </div>
    </div>
  );
};

const GenericScreen: React.FC<{ response: AIResponse }> = ({ response }) => {
  const oeuvreId = response.context?.oeuvre_id;

  return (
    <ScreenLayout response={response}>
      {response.screen === 'detail_oeuvre' && oeuvreId && <OeuvreDetail oeuvreId={oeuvreId} />}
    </ScreenLayout>
  );
};

export default GenericScreen;
