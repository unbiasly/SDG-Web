'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, SmartphoneIcon, LaptopIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Session {
  id: string;
  device: string;
  deviceType: 'mobile' | 'web';
  lastActive: string;
  isCurrent: boolean;
}

const Sessions = () => {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionCount, setActiveSessionCount] = useState(0);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API call
      // const response = await fetch('/api/user/sessions');
      // const data = await response.json();
      // setSessions(data.sessions);
      
      // Mock data for now
      setSessions([
        {
          id: '1',
          device: 'iPhone',
          deviceType: 'mobile',
          lastActive: 'Active now',
          isCurrent: true
        },
        {
          id: '2',
          device: 'iPhone',
          deviceType: 'mobile',
          lastActive: '1 day ago',
          isCurrent: false
        },
        {
          id: '3',
          device: 'Web',
          deviceType: 'web',
          lastActive: '1 day ago',
          isCurrent: false
        }
      ]);
      setActiveSessionCount(7); // Mock value for other active sessions count
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API call
      const response = await fetch('/api/user/logout-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update the sessions list, keeping only the current one
        setSessions(sessions.filter(session => session.isCurrent));
        setActiveSessionCount(0);
      }
    } catch (error) {
      console.error('Error logging out all sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    return deviceType === 'mobile' ? 
      <SmartphoneIcon className="h-8 w-8 text-gray-500" /> : 
      <LaptopIcon className="h-8 w-8 text-gray-500" />;
  };
  
  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="p-0 mr-4"
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-bold">Active sessions</h1>
      </div>

      <div className="space-y-8">
        {/* Current active session */}
        <div>
          <h2 className="text-xl font-bold mb-4">Current active session</h2>
          <p className="text-gray-600 mb-4">
            You're logged into this Unbiasly account on this device and are currently using it.
          </p>
          
          {sessions.filter(session => session.isCurrent).map(session => (
            <div key={session.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center">
                {getDeviceIcon(session.deviceType)}
                <div className="ml-4">
                  <div className="font-semibold">{session.device}</div>
                  <div className="text-gray-500">{session.lastActive}</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>

        {/* Log out of other sessions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Log out of other sessions</h2>
          <p className="text-gray-600 mb-4">
            You're logged into these accounts on these devices and aren't currently using them.
          </p>
          
          <p className="text-gray-600 mb-4">
            Logging out will end {activeSessionCount} of your other active sessions. It won't affect your current active session.{' '}
            <a href="#" className="text-blue-500 hover:underline">Learn more</a>
          </p>
          
          <Button 
            onClick={handleLogoutAll}
            disabled={isLoading || activeSessionCount === 0}
            className="text-red-500 hover:text-red-600 p-0 bg-transparent hover:bg-transparent mb-8"
          >
            Log out of all other sessions
          </Button>

          {sessions.filter(session => !session.isCurrent).map(session => (
            <div key={session.id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center">
                {getDeviceIcon(session.deviceType)}
                <div className="ml-4">
                  <div className="font-semibold">{session.device}</div>
                  <div className="text-gray-500">{session.lastActive}</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
