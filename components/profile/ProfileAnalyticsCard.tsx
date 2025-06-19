import React from 'react';
import { cn } from '@/lib/utils';
import { Eye, Users, BarChart3 } from 'lucide-react';

interface ProfileAnalyticsCardProps {
  type: 'views' | 'impressions';
  count: number;
  description: string;
  className?: string;
}

const ProfileAnalyticsCard: React.FC<ProfileAnalyticsCardProps> = ({
  type,
  count,
  description,
  className,
}) => {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="mt-1">
        {type === 'views' ? (
          <Users size={24} className="text-gray-500" />
        ) : (
          <BarChart3 size={24} className="text-gray-500" />
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="text-base md:text-lg font-semibold flex items-center gap-1">
          {count} {type === 'views' ? 'profile views' : 'post impressions'}
        </h3>
        <p className="text-profile-secondary text-xs md:text-sm">{description}</p>
      </div>
    </div>
  );
};

export default ProfileAnalyticsCard;
