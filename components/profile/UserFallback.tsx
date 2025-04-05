
import React from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectUser } from '@/lib/redux/features/user/selectors';

interface UserFallbackProps {
    charSize: 'xs' | 'sm' | 'md' | 'profile' | 'lg' | 'xl';
}

const UserFallback: React.FC<UserFallbackProps> = ({ charSize }) => {
  const user = useAppSelector(selectUser);
  const fallbackColor = useAppSelector((state) => state.user.fallbackColor);

  const sizeClasses = {
    xs: 'text-xl',
    sm: 'text-3xl',
    profile: 'text-5xl',
    md: 'text-5xl',
    lg: 'text-6xl',
    xl: 'text-7xl',
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center rounded-full"
      style={{ backgroundColor: fallbackColor }}
    >
      <span className={`${sizeClasses[charSize]} font-bold text-white`}>
        {user?.username?.charAt(0).toUpperCase() || '?'}
      </span>
    </div>
  );
};

export default UserFallback; 