import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { PROFILE_OPTIONS } from '@/lib/constants/feed-constants';
import Image from 'next/image';

export const UserSidebar: React.FC = () => {
  return (
    <div className="w-full bg-white border-2 p-4 rounded-2xl flex flex-col h-full ">
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
        <h3 className="font-semibold text-lg ">Full Name</h3>
        <p className="text-xs text-gray-500 mb-1">@username</p>
        <p className="text-xs text-sdg-blue">mail@website.com</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="font-semibold">000</span> <span className="ml-1">Followers</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="flex items-center">
            <span className="font-semibold">000</span> <span className="ml-1">Following</span>
          </div>
        </div>
      </div>
      
      <nav className="py-3">
        <ul className="space-y-1 ">
          {PROFILE_OPTIONS.map((option) => (
            <SidebarItem 
              key={option.id}
              icon={option.icon} 
              label={option.label} 
              hasSubmenu={!!option.sub_options}
              subOptions={option.sub_options}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

interface SidebarItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  subOptions?: Array<{id: string; label: string; icon: string}>;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, hasSubmenu, subOptions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubmenu = () => {
    if (hasSubmenu) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li>
      <div className="flex flex-col">
        <Link
          href="#" 
          className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-300 ${isActive ? 'bg-gray-400' : ''}`}
          onClick={hasSubmenu ? toggleSubmenu : undefined}
        >
          <Image src={icon} alt='.' className='object-contain' width={25} height={25} />
          <span className="text-md font-regular ml-2">{label}</span>
          {hasSubmenu && (
            isOpen 
              ? <ChevronUp size={16} className="ml-auto" /> 
              : <ChevronDown size={16} className="ml-auto" />
          )}
        </Link>
        
        {hasSubmenu && isOpen && subOptions && (
          <ul className=" mt-1 space-y-1">
            {subOptions.map((subOption) => (
              <li key={subOption.id}>
                <Link 
                  href="#" 
                  className="flex items-center p-2 rounded-md hover:bg-gray-300"
                >
                  <Image src={subOption.icon} alt='.' className='object-contain' width={20} height={20} />
                  <span className="text-sm ml-2">{subOption.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};