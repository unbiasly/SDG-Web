
import React from 'react';
import { cn } from '@/lib/utils';
import { PenLine } from 'lucide-react';

interface EducationCardProps {
//   logo?: string;
  institution: string;
  degree: string;
  className?: string;
  authUser?: boolean;
  handleEditClick?: () => void;
}



const EducationCard: React.FC<EducationCardProps> = ({
//   logo,
  institution,
  degree,
  className,
    handleEditClick = () => {},
    authUser = false,
}) => {
  return (
    <div className={cn('flex items-start gap-4 py-6', className)}>
      {/* <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
        <img 
          src={logo} 
          alt={`${institution} logo`}
          className="w-full h-full object-cover image-lazy-load"
        />
      </div> */}
      
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-1">{degree}</h3>
        <div className="text-profile-secondary">
          <span>{institution}</span>
        </div>
      </div>
      {authUser && (
        <button aria-label="Edit experience" className="rounded-full p-2 hover:bg-gray-100 cursor-pointer transition-colors" onClick={handleEditClick}>
          <PenLine size={24} className="text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default EducationCard;