"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ImageSliderProps {
  images: string[];
  captions: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, captions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);


  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={image}
            alt={`Slide ${index + 1}`}
            className="h-full w-full object-cover rounded-t-[30px] shadow-lg"
            width={600}
            height={755}
          />
          <div className=" inset-0 absolute bg-gradient-to-t from-white to-transparent "/>
          <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center  space-x-2">
                {images.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`slide-indicator h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'active bg-gray-500 w-8' : 'bg-black/20 w-2'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                />
                ))}
            </div>
          <div className="absolute inset-x-0 bottom-20 z-20 px-10 text-center">
            <h3 className="text-xl font-semibold text-black mb-2 animate-fade-in">
              {captions[index]}
            </h3>
          </div>
        </div>
      ))}
      
      
    </div>
  );
};

export default ImageSlider;
