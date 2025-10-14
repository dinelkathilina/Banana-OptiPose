import React, { useState, useEffect } from 'react';
import { CarouselSlide } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface OutputDisplayProps {
  outputImage?: string | null;
  outputImages?: CarouselSlide[] | null;
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="aspect-square w-full bg-brand-gray-light rounded-lg animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-yellow"></div>
    </div>
);

const Placeholder: React.FC = () => (
    <div className="aspect-square w-full bg-brand-gray rounded-lg flex items-center justify-center text-center p-4">
        <p className="text-gray-400">Your generated content will appear here.</p>
    </div>
);


export const OutputDisplay: React.FC<OutputDisplayProps> = ({ outputImage, outputImages, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = outputImages || (outputImage ? [{ imageUrl: outputImage, title: '', body: '' }] : []);

  useEffect(() => {
    // Reset index when images change
    setCurrentIndex(0);
  }, [outputImages, outputImage]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (slides.length === 0) {
      return <Placeholder />;
    }

    const currentSlide = slides[currentIndex];
    const isCarousel = slides.length > 1 && !!outputImages;

    return (
      <div className="relative group aspect-square">
        <img 
          src={currentSlide.imageUrl} 
          alt={`Generated output ${currentIndex + 1}`} 
          className="w-full h-full object-cover rounded-lg shadow-2xl bg-brand-gray" 
        />
        
        {isCarousel && currentSlide.title && (
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-lg">
            <h3 className="text-2xl font-bold text-white shadow-lg">{currentSlide.title}</h3>
            <p className="text-white/90 mt-2 text-base shadow-lg">{currentSlide.body}</p>
          </div>
        )}

        {slides.length > 1 && (
          <>
            <button 
              onClick={handlePrev} 
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              aria-label="Previous slide"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext} 
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              aria-label="Next slide"
            >
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </>
        )}

        <a 
          href={currentSlide.imageUrl} 
          download={`ai-generated-image-${currentIndex + 1}.jpg`} 
          className="absolute top-3 right-3 bg-black/40 text-white py-1 px-3 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60"
        >
          Download
        </a>

        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  currentIndex === index ? 'bg-brand-yellow' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-center mb-6">Output</h2>
      <div className="w-full max-w-2xl mx-auto">
        {renderContent()}
        {slides.length > 1 && !isLoading && (
           <div className="text-center mt-4 text-gray-400 font-semibold">
             {currentIndex + 1} / {slides.length}
           </div>
        )}
      </div>
    </div>
  );
};
