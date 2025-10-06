
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
        <SparklesIcon className="w-10 h-10 text-brand-yellow" />
        AI Creative Studio
      </h1>
      <p className="mt-3 text-lg text-gray-400">
        Generate stunning visuals by combining images with the power of AI.
      </p>
    </header>
  );
};
