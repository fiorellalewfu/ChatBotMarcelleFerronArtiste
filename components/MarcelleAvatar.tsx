
import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const MarcelleAvatar: React.FC = () => {
  const { sendMessage } = useAppContext();
  return (
    <button
      type="button"
      onClick={() => sendMessage('🏠 Accueil')}
      aria-label="Retour à l'accueil"
      className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-100"
    >
      <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center">
        <span className="text-2xl font-bold text-white">MF</span>
      </div>
    </button>
  );
};

export default MarcelleAvatar;
