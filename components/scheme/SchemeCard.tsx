import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SchemeCardProps } from '@/service/api.interface';
import Link from 'next/link';
import { generateSlug } from '@/lib/utilities/generateSlug';

const SchemeCard: React.FC<SchemeCardProps> = ({
  icon,
  count,
  label,
    type,
}) => {
    if (type === 'category') {
        type = 'schemeCategory';
    }
    else if (type === 'state') {
        type = 'beneficiaryState';
    }
    else if (type === 'ministry') {
        type = 'nodalMinistryName';
    }
    const imageStyle = ` ${label ===  'Lakshadweep' ? 'h-4/3' : ''}`;
  return (
    <div 
      className={cn(
        "scheme-card w-40 h-full relative bg-white rounded-lg p-3 flex flex-col items-center text-center shadow-sm border border-gray-300 hover:shadow-lg cursor-pointer")}
    >
      <Link 
        href={{
          pathname: `/scheme/${generateSlug(label)}`,
          query: { identifier: type, value: label }
        }} 
        prefetch={false}
        className="flex flex-col items-center flex-grow" // Added flex-grow to allow link content to expand
      >
        <div className="scheme-icon mb-4 p-1 w-16 h-16 flex items-center justify-center">
          <Image 
            src={icon}
            alt='Scheme Icon'
            width={40}
            height={40}
            className={cn(`object-contain ${imageStyle}`)}
          />
        </div>
        
        <h3 className="text-xl font-medium text-gray-800 mb-1">{count} Schemes</h3>
        <p className="text-sm text-gray-600 flex flex-wrap leading-tight">{label} </p>
      </Link>
    </div>
  );
};

export default SchemeCard;