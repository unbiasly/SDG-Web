import React from 'react';
import Logo from '@/public/Logo.svg';
import { Home, Plus, Bell, Video, Search } from 'lucide-react';
import Image from 'next/image';

export const NavigationHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-transparent border-b border-gray-100 px-20 py-2.5">
      <div className="flex items-center justify-between mx-auto">
        <div className="flex items-center gap-4 ">
        
          <Image src={Logo} alt='' width={50} height={50}  />
          {/* Search Box */}
          
          <h1 className='text-2xl font-bold'>The SDG Story</h1>
          
        </div>
        <div className="flex items-center space-x-10">
          {/* <NavIconButton icon={<Home className="w-5 h-5" />} label="Home" isActive />
          <NavIconButton icon={<Plus className="w-5 h-5" />} label="Post" />
          <NavIconButton icon={<Bell className="w-5 h-5" />} label="Notifications" />
          <NavIconButton icon={<Video className="w-5 h-5" />} label="Videos" /> */}
          <div className="relative  rounded-2xl flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search"
                className="w-full h-10 pl-10 pr-4 rounded-2xl bg-sdg-gray text-sm outline-none ring-1 ring-gray-400 transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

// interface NavIconButtonProps {
//   icon: React.ReactNode;
//   label: string;
//   isActive?: boolean;
// }

// const NavIconButton: React.FC<NavIconButtonProps> = ({ icon, label, isActive }) => {
//   return (
//     <div className="flex flex-col items-center">
//       <button className={`p-1 rounded-md transition-all duration-200 ${isActive ? 'text-sdg-blue' : 'text-gray-500 hover:text-sdg-blue'}`}>
//         {icon}
//       </button>
//       <span className={`text-xs mt-1 ${isActive ? 'text-sdg-blue font-medium' : 'text-gray-500'}`}>
//         {label}
//       </span>
//     </div>
//   );
// };