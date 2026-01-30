
import React from 'react';

interface ChipProps {
  label: string;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-700 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
    >
      {label}
    </button>
  );
};

export default Chip;
