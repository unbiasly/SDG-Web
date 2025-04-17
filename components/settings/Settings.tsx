'use client';
import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SETTINGS_OPTIONS } from '@/lib/constants/settings-constants';
import ChangePassword from './ChangePassword';
import Deactivate from './Deactivate';
import Sessions from './Sessions';
import { Switch } from '../ui/switch';

interface SettingsProps {
  className?: string;
}

const Settings: React.FC<SettingsProps> = ({ 
  className,
}) => {
//   const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSelectSetting = (id: string) => {
    setActiveSection(id === activeSection ? null : id);
  };

  const filteredItems = SETTINGS_OPTIONS;
//   .filter(item => 
//     item.label.toLowerCase().includes(searchTerm.toLowerCase())
//   );

  const activeItem = activeSection ? SETTINGS_OPTIONS.find(item => item.id === activeSection) : null;

  return (
    <div className="flex  w-full h-full">
      <div 
        className={cn(
          'h-full border-r bg-white transition-all duration-300 ease-in-out',
          activeSection ? 'w-1/2' : 'w-full',
          className,
        )}
        style={{
          animation: activeSection 
            ? 'slideWidth 0.3s ease-in-out forwards' 
            : 'expandWidth 0.3s ease-in-out forwards'
        }}
      >
        <div className="p-2 border-b">
          <h1 className="text-xl font-semibold mb-2">Settings & Help Center</h1>
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 py-2 pr-4 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:border-gray-300 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> */}
        </div>
        
        <div className="">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className={cn(
                'flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100',
                activeSection === item.id && 'bg-[#19486A]/15 border-r-2 border-[#19486A] text-[#19486A]',
              )}
              onClick={() => handleSelectSetting(item.id)}
            >
              <span className='text-md font-semibold'>{item.label}</span>
              <ChevronRight size={18} className={cn("text-gray-400", activeSection === item.id && "transform rotate-90 transition-transform")} />
            </div>
          ))}
        </div>
      </div>

      {/* SubOptions Panel */}
      {activeSection && activeItem?.subOptions && (
        <div 
          className={cn(
            'w-full h-full bg-white border-l p-6 animate-slide-in-right',
          )}
        >
          <h2 className="text-xl font-semibold mb-4">{activeItem.label}</h2>
          <p className="text-gray-600 mb-6">{activeItem.description}</p>
          
          <div className="space-y-4">
            {activeItem.subOptions.map(subOption => (
              <div 
                key={subOption.id} 
                className="p-3 rounded-md hover:bg-gray-100 cursor-pointer transition-colors flex items-center justify-between"
                onClick={subOption?.sessionTab ? () => handleSelectSetting(subOption?.sessionTab || '') : undefined}
              >
                <div>
                  <h3 className="font-medium">{subOption.label}</h3>
                  {subOption?.description && (
                    <p className="text-sm text-gray-500 mt-1">{subOption?.description}</p>
                  )}
                </div>
                {activeItem?.isToggle ? <Switch  className="text-gray-400" />  : <ChevronRight size={20} className="text-gray-400" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection && !activeItem?.subOptions && activeSection == 'Change_Passord' && <ChangePassword />}
      {activeSection && !activeItem?.subOptions && activeSection == 'Deactivate' && <Deactivate />}
      {activeSection && !activeItem?.subOptions && activeSection == 'Sessions' && <Sessions />}
      
    </div>
  );
};

export default Settings;
