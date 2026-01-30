
import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import LoadingSpinner from './components/LoadingSpinner';
import ScreenRouter from './components/ScreenRouter';
import MarcelleAvatar from './components/MarcelleAvatar';

const AppContent: React.FC = () => {
  const { isLoading, error, aiResponse, sendMessage } = useAppContext();

  return (
    <div className="bg-gray-900 text-white w-screen h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <MarcelleAvatar />
      </div>
      {isLoading && !aiResponse && (
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="mt-4 text-lg">Préparation du kiosque...</p>
        </div>
      )}
      {error && (
        <div className="text-center bg-red-900 p-8 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Une erreur est survenue</h2>
          <p className="mb-6 text-red-200">{error}</p>
          <button
            onClick={() => sendMessage("Bonjour")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}
      {aiResponse && <ScreenRouter response={aiResponse} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
