"use client"
import React from 'react';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { PROFILE_OPTIONS } from '@/lib/constants/index-constants';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser } from '@/lib/redux/features/user/hooks';
import ProfileAvatar from '../profile/ProfileAvatar';

export const UserSidebar = () => {
    const pathname = usePathname();
    const { user } = useUser();

    const handleLogout = async () => {
        try {
            await fetch('/api/logout',{
                method: 'POST'
            });
            window.location.href = '/login';
        }
        catch (error) {
            console.error('Error during logout:', error);
        }
    }

    return (
        <div className="w-full bg-white border-1 border-gray-300 p-4 rounded-2xl flex flex-col h-full">
            <div className="flex flex-col items-start border-b py-2 border-gray-600">
                <div className="relative mb-2 w-20">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                        <ProfileAvatar 
                        src={user?.profileImage || ''}
                        className='object-contain'
                        size='profile'
                        displayName={user?.username}
                        />
                    </div>
                    <button aria-label='.' className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </button>
                </div>
                <h3 className="font-semibold text-lg">{user?.fName && user?.lName ? `${user.fName} ${user.lName}` : (user?.name || `@${user?.username}`)}</h3>
                <p className="text-sm text-gray-500 mb-1">@{user?.username}</p>
                {/* <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <div className="flex items-center">
                        <span className="font-semibold">000</span> <span className="ml-1">Followers</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300"/>
                    <div className="flex items-center">
                        <span className="font-semibold">000</span> <span className="ml-1">Following</span>
                    </div>
                </div> */}
            </div>
            
            <nav className="pt-2">
                <ul className="space-y-1">
                    {PROFILE_OPTIONS.map((option, key) => {
                        let route = option.route;
                        
                        if (option.routeGenerator && user?._id) {
                            // Using user._id instead of username
                            route = option.routeGenerator(user._id);
                        }
                        
                        const isActive = pathname === route || 
                                        (pathname.startsWith('/profile/') && option.label === 'Profile');
                        
                        return (
                            <SidebarItem 
                                key={key}
                                isActive={isActive}
                                route={route || '#'}
                                icon={option.icon} 
                                label={option.label} 
                            />
                        );
                    })}
                    <li>
                        <div className="flex flex-col">
                            <button
                                onClick={handleLogout}
                                className="flex items-center cursor-pointer space-x-2 p-2 rounded-xl hover:bg-accent/30"
                            >
                                <LogOut />
                                <span className="text-md font-regular ml-2">Logout</span>
                            </button>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

interface SidebarItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  route: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, route }) => {
  return (
    <li>
      <div className="flex flex-col">
        <Link
          href={route} 
          className={`flex items-center space-x-2 p-2 rounded-xl hover:bg-accent/30 ${isActive ? ' font-bold text-accent' : ''}`}
        >
          <Image src={icon} alt={label} className='object-contain' width={25} height={25} />
          <span className="text-md font-regular ml-2">{label}</span>
        </Link>
      </div>
    </li>
  );
};
