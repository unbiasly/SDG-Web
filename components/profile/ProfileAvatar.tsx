'use client';
import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface ProfileAvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  src = 'https://i.pravatar.cc/150?img=68',
  alt = 'Profile',
  size = 'lg',
  editable = false,
  className = '',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const sizeClasses = {
    xs: 'w-11 h-11',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  return (
    <div className={`aspect-square ${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full overflow-hidden rounded-full bg-gray-100 border-2 border-black shadow-lg">
        {src ? (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } image-lazy-load`}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <span className="text-lg font-medium">?</span>
          </div>
        )}
        
        {editable && (
          <div className="absolute right-0 bottom-0 bg-white rounded-full p-2 shadow-md cursor-pointer transition-transform duration-200 hover:scale-105">
            <Camera size={18} className="text-gray-700" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;
