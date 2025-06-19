import React from 'react';
import { cn } from '@/lib/utils';
import { PenLine } from 'lucide-react';

interface ExperienceCardProps {
//   logo?: string;
  position: string;
  company: string;
  type?: string;
  className?: string;
  handleEditClick?: () => void;
  authUser?: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
//   logo,
  position,
  company,
  type,
  className,
    handleEditClick = () => {},
    authUser = false,
}) => {
  return (
    <div className={cn('flex items-start gap-4 py-3 lg:py-6', className)}>
      
      {/* <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
        <img 
          src={logo} 
          alt={`${company} logo`}
          className="w-fit h-fit object-cover image-lazy-load"
        />
      </div> */}
      
      <div className="flex-1">
        <h3 className="text-lg lg:text-xl font-semibold mb-1">{position}</h3>
        <div className="flex items-center gap-2 ">
          <span className='text-profile-secondary text-sm lg:text-base'>{company} - {type}</span>
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

export default ExperienceCard;
