"use client"
import React from 'react';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { PROFILE_OPTIONS } from '@/lib/constants/index-constants';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { baseURL } from '@/service/app.api';
import { useUser } from '@/lib/redux/features/user/hooks';

export const UserSidebar: React.FC = () => {
    const pathname = usePathname();
    const { user, userLoading } = useUser()


    return (
        <div className="w-full bg-white border-1 border-gray-300 p-4 rounded-2xl flex flex-col h-full">
            <div className="flex flex-col items-start border-b py-2 border-gray-600">
                <div className="relative mb-2 w-20">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                        <img
                            src="https://i.pravatar.cc/150?img=68"
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button aria-label='.' className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </button>
                </div>
                <h3 className="font-semibold text-lg">{user?.name || "Name"}</h3>
                <p className="text-sm text-gray-500 mb-1">@{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <div className="flex items-center">
                        <span className="font-semibold">000</span> <span className="ml-1">Followers</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300"/>
                    <div className="flex items-center">
                        <span className="font-semibold">000</span> <span className="ml-1">Following</span>
                    </div>
                </div>
            </div>
            
            <nav className="pt-2">
                <ul className="space-y-1">
                    {PROFILE_OPTIONS.map((option, key) => (
                        <SidebarItem 
                            key={key}
                            isActive={pathname === option.route}
                            route={option.route}
                            icon={option.icon} 
                            label={option.label} 
                        />
                    ))}
                    <li>
                        <div className="flex flex-col">
                            <button
                                onClick={async () => {
                                    try {
                                        await fetch(`${baseURL}/logout`, {
                                            method: 'HEAD',
                                        });
                                        window.location.href = '/login';
                                    } catch (error) {
                                        console.error('Error during logout:', error);
                                    }
                                }}
                                className="flex items-center cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-300"
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
          className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-300 ${isActive ? 'bg-gray-300 font-bold ' : ''}`}
        >
          <Image src={icon} alt='.' className='object-contain' width={25} height={25} />
          <span className="text-md font-regular ml-2">{label}</span>
        </Link>
      </div>
    </li>
  );
};
