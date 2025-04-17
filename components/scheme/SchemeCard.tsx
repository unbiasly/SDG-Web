import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SchemeCardProps } from '@/service/api.interface';



const SchemeCard: React.FC<SchemeCardProps> = ({
  icon,
  count,
  label,
  onClick,
}) => {
  return (
    <div 
      className={cn(
        "scheme-card w-35 relative bg-white rounded-lg p-3 flex flex-col items-center text-center shadow-sm border border-gray-300 hover:shadow-lg cursor-pointer")}
      onClick={onClick}
    >
      <div className="scheme-icon mb-4 p-1 w-16 h-16 flex items-center justify-center">
        <Image 
            src={icon}
            alt='Scheme Icon'
            width={40}
            height={40}
            className={cn('object-contain ', )}
            />
      </div>
      
      <h3 className="text-xl font-medium text-gray-800 mb-1">{count} Schemes</h3>
      <p className="text-sm text-gray-600 flex flex-wrap leading-tight">{label} </p>
    </div>
  );
};

export default SchemeCard;