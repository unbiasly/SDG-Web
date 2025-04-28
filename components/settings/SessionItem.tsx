'use client';

import React, { useState } from 'react';
import { X, SmartphoneIcon, LaptopIcon } from 'lucide-react';
import ConfirmationDialog from '../ConfirmationDialog';
import { useRouter } from 'next/navigation';
import { is } from 'date-fns/locale';

interface SessionItemProps {
  session: {
    _id: string;
    userId: string;
    ipAddress: string;
    userAgent: string;
    loginTime: string;
    deviceId?: string;
    deviceName?: string;
  };
  onSessionRemoved: () => void;
  isCurrentSession?: boolean;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, onSessionRemoved, isCurrentSession }) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const router = useRouter();

  const handleRemoveSession = async () => {
    try {
      const response = await fetch('/api/settings/session', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionIds: [session._id], // Send as array with single element
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove session');
      }

      // Call the callback to refresh the sessions list
      onSessionRemoved();
    } catch (error) {
      console.error('Error removing session:', error);
    }
  };

  // Parse user agent to get browser and device info
  
  
  const loginDate = new Date(session.loginTime).toLocaleString();

  // Get the appropriate icon based on deviceId
  const getDeviceIcon = () => {
    if (session.deviceId === "web") {
      return <LaptopIcon className="h-6 w-6 text-gray-500 mr-3" />;
    } else {    
      return <SmartphoneIcon className="h-6 w-6 text-gray-500 mr-3" />;
    }
  };

  const deviceType = session.deviceId === "web" ? "Web" : "Mobile";

  return (
    <div className="flex justify-between items-center p-4 border rounded-md mb-3">
      <div className="flex items-center">
        {getDeviceIcon()}
        <div>
          <div className="flex items-center">
            <span className="font-bold">{deviceType}</span>
            <span className="ml-2 text-sm text-gray-500">{session?.deviceName}</span>
          </div>
          <p className="text-sm text-gray-500">
            Login time: {loginDate}
          </p>
        </div>
      </div>
      {!isCurrentSession && (
      <button
        aria-label='Remove session'
        onClick={() => setIsConfirmationOpen(true)}
        className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full"
      >
        <X size={18} />
      </button>
      )}

      <ConfirmationDialog
        open={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
        clickFunc={handleRemoveSession}
        subject="Remove"
        object="session"
      />
    </div>
  );
};

export default SessionItem;