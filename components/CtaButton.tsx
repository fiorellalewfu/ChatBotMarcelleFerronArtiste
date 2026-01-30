
import React from 'react';

interface CtaButtonProps {
  label: string;
  onClick: () => void;
}

const CtaButton: React.FC<CtaButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-75 animate-pulse"
    >
      {label}
    </button>
  );
};

export default CtaButton;
