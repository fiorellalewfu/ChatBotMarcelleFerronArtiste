
import React, { ReactNode } from 'react';
import { useAppContext } from '../contexts/AppContext';
import type { AIResponse } from '../types';
import Chip from './Chip';
import CtaButton from './CtaButton';
import LoadingSpinner from './LoadingSpinner';

interface ScreenLayoutProps {
  response: AIResponse;
  children?: ReactNode;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({ response, children }) => {
  const { voice, on_screen, chips, cta } = response;
  const { sendMessage, isLoading } = useAppContext();

  return (
    <div className="w-full h-full max-w-7xl mx-auto flex flex-col p-4 sm:p-8">
      <div className="flex-shrink-0 mb-4 h-24 flex items-center">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg relative max-w-2xl">
          <p className="text-lg sm:text-xl text-cyan-300 italic">“{voice}”</p>
        </div>
      </div>

      <main className="flex-grow bg-gray-800/50 rounded-2xl shadow-inner p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">{on_screen}</h1>
          {children}
        </div>
      </main>
      
      <footer className="flex-shrink-0 pt-6">
         {isLoading ? (
            <div className="flex justify-center items-center h-24">
                <LoadingSpinner />
            </div>
         ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    {chips.map((chip, index) => (
                    <Chip
                      key={index}
                      label={chip}
                      onClick={() => sendMessage(chip, response.screen === 'chat' ? { isChat: true } : undefined)}
                    />
                    ))}
                </div>
                {cta && <CtaButton label={cta.label} onClick={() => sendMessage(cta.label)} />}
            </div>
        )}
      </footer>
    </div>
  );
};

export default ScreenLayout;
