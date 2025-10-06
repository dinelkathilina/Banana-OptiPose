
import React from 'react';

interface OutputDisplayProps {
  outputImage: string | null;
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="aspect-square w-full bg-brand-gray-light rounded-lg animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-yellow"></div>
    </div>
);

const Placeholder: React.FC = () => (
    <div className="aspect-square w-full bg-brand-gray rounded-lg flex items-center justify-center text-center p-4">
        <p className="text-gray-400">Your generated image will appear here.</p>
    </div>
);


export const OutputDisplay: React.FC<OutputDisplayProps> = ({ outputImage, isLoading }) => {
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-center mb-6">Output</h2>
      <div className="w-full max-w-2xl mx-auto">
        {isLoading ? (
          <LoadingSkeleton />
        ) : outputImage ? (
          <div className="relative group">
            <img src={outputImage} alt="Generated output" className="w-full h-auto object-contain rounded-lg shadow-2xl" />
            <a href={outputImage} download="ai-generated-image.png" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg font-bold bg-brand-yellow text-brand-dark py-2 px-4 rounded-md">Download</span>
            </a>
          </div>
        ) : (
          <Placeholder />
        )}
      </div>
    </div>
  );
};
