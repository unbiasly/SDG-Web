'use client';
import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import UserFallback from './UserFallback';

interface ProfileAvatarProps {
  src: string | File;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'profile' | 'lg' | 'xl';
  editable?: boolean;
  className?: string;
  displayName?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  src,
  alt = 'Profile',
  size = 'sm',
  editable = false,
  className = '',
  displayName = '',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  

  const sizeClasses = {
    xs: 'w-11 h-11',
    sm: 'w-16 h-16',
    profile: 'w-20 h-20',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  return (
    <div className={`aspect-square ${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full overflow-hidden rounded-full bg-gray-100 border-2 border-black shadow-lg">
        {src ? (
          <Image
            src={typeof src === 'string' ? src : ''}
            alt={alt}
            layout="fill"
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } image-lazy-load`}
            onLoad={() => setImageLoaded(true)}
            priority
          />
        ) : (
          <UserFallback charSize={size}/>
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
