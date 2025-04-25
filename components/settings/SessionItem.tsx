'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import ConfirmationDialog from '../ConfirmationDialog';
import { useRouter } from 'next/navigation';

interface SessionItemProps {
session: {
    _id: string;
    userId: string;
    ipAddress: string;
    userAgent: string;
    loginTime: string;
};
  onSessionRemoved: () => void;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, onSessionRemoved }) => {
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
  const getBrowserInfo = (userAgent: string) => {
    // Simple user agent parsing
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    let browser = "Unknown browser";
    
    if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Safari")) browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";
    else if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) browser = "Internet Explorer";
    
    return {
      deviceType: isMobile ? "Mobile" : "Desktop",
      browser
    };
  };
  
  const { deviceType, browser } = getBrowserInfo(session.userAgent);
  const loginDate = new Date(session.loginTime).toLocaleString();

  return (
    <div className="flex justify-between items-center p-4 border rounded-md mb-3">
      <div>
        <div className="flex items-center">
          <span className="font-bold">{deviceType}</span>
          <span className="ml-2 text-sm text-gray-500">{browser}</span>
        </div>
        <p className="text-sm text-gray-500">
          IP: {session.ipAddress} · Login time: {loginDate}
        </p>
      </div>
      
      <button
        aria-label='Remove session'
        onClick={() => setIsConfirmationOpen(true)}
        className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full"
      >
        <X size={18} />
      </button>

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