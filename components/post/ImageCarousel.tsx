import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  className?: string;
}

const ImageCarousel = ({ images, className }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  if (!images.length) return null;

  return (
    <div className={cn("w-full h-full relative", className)}>
      <div className="w-full h-full relative overflow-hidden">
        {images.map((imageUrl, index) => (
          <div 
            key={index}
            className={cn(
              "absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out",
              currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={imageUrl}
                alt={`Image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 66vw"
                className="object-contain p-2"
                style={{ objectFit: 'contain' }}
                priority={index === currentIndex}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows - Only show for multiple images */}
      {images.length > 1 && (
        <>
          <button 
            onClick={goToPrevious} 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors cursor-pointer border-none"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6 text-white" color='white' />
          </button>
          
          <button 
            onClick={goToNext} 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors cursor-pointer border-none"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6 text-white" color='white' />
          </button>
          
          {/* Simple counter indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
            <div className="bg-black/60 rounded-full px-3 py-1 text-white text-xs">
              {currentIndex + 1}/{images.length}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
