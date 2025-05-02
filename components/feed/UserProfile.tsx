"use client"
import React, { useMemo } from 'react';
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
    
    // Check if essential user data has loaded
    const isDataLoaded = useMemo(() => {
        return Boolean(user && user.username);
    }, [user]);

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
            <Link href='/' className="justify-center items-center gap-2 pb-2 flex lg:hidden">    
                <Image src='/Logo.svg' alt='SDG Logo' width={35} height={35}  />
            </Link>
            <div className="flex-col items-start lg:border-b py-2 border-gray-600 hidden lg:flex">
                <div className="relative mb-2 w-20 ">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden ">
                        {isDataLoaded ? (
                            <ProfileAvatar 
                                src={user?.profileImage || ''}
                                className='object-contain'
                                size='profile'
                                displayName={user?.username}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 animate-pulse rounded-full"></div>
                        )}
                    </div>
                    <button aria-label='.' className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </button>
                </div>
                
                {isDataLoaded ? (
                    <>
                        {user?.fName && user?.lName && (
                            <h3 className="font-semibold text-lg">{user.fName} {user.lName}</h3>
                        )}
                        <p className="text-sm text-gray-500 mb-1">@{user?.username}</p>
                    </>
                ) : (
                    <>
                        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-md mb-2"></div>
                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md mb-1"></div>
                    </>
                )}
            </div>
            
            <nav className="lg:pt-2">
                <ul className="space-y-1">
                    {PROFILE_OPTIONS.map((option, key) => {
                        let route = option.route;
                        
                        if (option.routeGenerator && user?._id) {
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
                                className="flex items-center justify-center lg:justify-start cursor-pointer space-x-2 py-2 lg:p-2 rounded-xl hover:bg-accent/30"
                            >
                                <LogOut className='m-0'/>
                                <span className="text-md font-regular lg:ml-2 hidden lg:block">Logout</span>
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
          className={`flex items-center justify-center lg:justify-start space-x-2 py-2 lg:p-2 rounded-xl hover:bg-accent/30 ${isActive ? ' font-bold text-accent' : ''}`}
        >
          <Image src={icon} alt={label} className='object-fill m-0' width={25} height={25} />
          <span className="text-md font-regular lg:ml-2 hidden lg:block">{label}</span>
        </Link>
      </div>
    </li>
  );
};
