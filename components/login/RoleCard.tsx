import { UserRole } from '@/service/api.interface';
import { is } from 'date-fns/locale';
import React from 'react'

interface RoleCardProps {
    role: UserRole;
    clickFunc: () => void;
    disabled?: boolean;
    selectedRole: UserRole | null;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, clickFunc, selectedRole }) => {
    const isSelected = selectedRole?.name === role.name;
    const isDisabled = role.slug === 'organisation'; // Disable if role is 'organisation'

    return (
        <button 
            className={`flex items-center justify-between w-full p-4 bg-white border-2 rounded-2xl cursor-pointer transition-colors ${
                isSelected ? 'border-slate-600 bg-slate-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={clickFunc}
            disabled={isDisabled}
        >
            <span className={`text-lg font-medium ${isDisabled ? 'text-gray-400' : 'text-black'}`}>
                {role.name} {isDisabled && '(Coming Soon)'}
            </span>
            <div className={`w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 ${isDisabled ? 'opacity-50' : ''}`}>
                <img 
                    src={role.thumbnail_url} 
                    alt={role.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = '/default-role.png'; // Fallback image
                    }}
                />
            </div>
        </button>
    );
};

export default RoleCard;