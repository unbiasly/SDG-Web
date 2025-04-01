import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SETTINGS_OPTIONS } from '@/lib/constants/index-constants';

interface SettingsProps {
  className?: string;
  onSelectSetting: (setting: string) => void;
  activeSection: string;
}

const Settings: React.FC<SettingsProps> = ({ 
  className, 
  onSelectSetting,
  activeSection 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  
  
  const filteredItems = SETTINGS_OPTIONS.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn('w-full h-full border-r bg-white animate-enter', className)}>
      <div className="p-6 border-b">
        <h1 className="text-xl font-semibold mb-4">Settings & Help Center</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 py-2 pr-4 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:border-gray-300 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="py-2">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className={cn(
              'settings-item',
              activeSection === item.id && 'active'
            )}
            onClick={() => onSelectSetting(item.id)}
          >
            <span>{item.label}</span>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
