import React from 'react';
import { cn } from '@/lib/utils';
import { PenLine, Plus } from 'lucide-react';

interface ExperienceCardProps {
  logo: string;
  position: string;
  company: string;
  type: string;
  className?: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  logo,
  position,
  company,
  type,
  className,
}) => {
  return (
    <div className={cn('flex items-start gap-4 py-6', className)}>
      <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
        <img 
          src={logo} 
          alt={`${company} logo`}
          className="w-full h-full object-cover image-lazy-load"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-1">{position}</h3>
        <div className="flex items-center gap-2 text-profile-secondary">
          <span>{company}</span>
          <span className="w-1 h-1 rounded-full bg-profile-secondary"></span>
          <span>{type}</span>
        </div>
      </div>
    </div>
  );
};

export const ExperienceSection: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => {
  return (
    <div className={cn('py-6 border-b border-t border-profile-border', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <button aria-label="Add experience" className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <Plus size={24} className="text-gray-700" />
          </button>
          <button aria-label="Edit experience" className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <PenLine size={24} className="text-gray-700" />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ExperienceCard;
