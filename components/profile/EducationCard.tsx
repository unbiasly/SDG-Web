
import React from 'react';
import { cn } from '@/lib/utils';

interface EducationCardProps {
  logo: string;
  institution: string;
  degree: string;
  className?: string;
}

const EducationCard: React.FC<EducationCardProps> = ({
  logo,
  institution,
  degree,
  className,
}) => {
  return (
    <div className={cn('flex items-start gap-4 py-6', className)}>
      <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
        <img 
          src={logo} 
          alt={`${institution} logo`}
          className="w-full h-full object-cover image-lazy-load"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-1">{institution}</h3>
        <div className="text-profile-secondary">
          <span>{degree}</span>
        </div>
      </div>
    </div>
  );
};

export default EducationCard;