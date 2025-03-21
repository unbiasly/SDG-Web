
import React from 'react';
import { User, Bookmark, Users, Award, Briefcase, Search, Settings, ChevronDown } from 'lucide-react';

export const UserSidebar: React.FC = () => {
  return (
    <aside className="w-full bg-white border-2 rounded-2xl flex flex-col h-full ">
      <div className="flex flex-col items-start p-4  border-b border-gray-100">
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
        <h3 className="font-semibold text-sm text-sdg-text">Full Name</h3>
        <p className="text-xs text-gray-500 mb-1">@username</p>
        <p className="text-xs text-sdg-blue">mailto:voda@co.com</p>
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
      
      <nav className="p-4">
        <ul className="space-y-1x ">
          <SidebarItem icon={<User />} label="Profile" />
          <SidebarItem icon={<Bookmark />} label="Bookmark" />
          <SidebarItem icon={<Users />} label="The SDG Society" isActive />
          <SidebarItem icon={<Award />} label="Mentorship" />
          <SidebarItem icon={<Briefcase />} label="Internship" />
          <SidebarItem icon={<Briefcase />} label="Job" />
          <SidebarItem icon={<Search />} label="Scheme Search" />
          <SidebarItem icon={<Settings />} label="Settings" hasSubmenu />
        </ul>
      </nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, hasSubmenu }) => {
  return (
    <li>
      <a 
        href="#" 
        className={`flex items-center sidebar-item ${isActive ? 'active' : ''}`}
      >
        {icon}
        <span className="text-xl ml-2">{label}</span>
        {hasSubmenu && <ChevronDown size={16} className="ml-auto" />}
      </a>
    </li>
  );
};