import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const MarcelleAvatar: React.FC = () => {
  const { sendMessage } = useAppContext();

  return (
    <button
      onClick={() => sendMessage("🏠 Accueil")}
      className="bg-transparent border-none p-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 rounded-full"
      aria-label="Retour à l'accueil"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110">
        <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">MF</span>
        </div>
      </div>
    </button>
  );
};

export default MarcelleAvatar;
