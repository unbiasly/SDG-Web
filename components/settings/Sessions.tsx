'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, SmartphoneIcon, LaptopIcon, MonitorIcon, X } from 'lucide-react';
import { SessionsResponse } from '@/service/api.interface';
import SessionItem from './SessionItem';

interface SessionsProps {
  onBack: () => void;
}

const Sessions: React.FC<SessionsProps> = ({ onBack }) => {
  const [sessions, setSessions] = useState<SessionsResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/settings/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch sessions');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setSessions(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  const getDeviceInfo = (userAgent: string) => {
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    const isTablet = /tablet|ipad/i.test(userAgent.toLowerCase());
    
    let deviceType = 'desktop';
    let deviceName = 'Computer';
    
    if (isMobile && !isTablet) {
      deviceType = 'mobile';
      if (/iphone/i.test(userAgent)) deviceName = 'iPhone';
      else if (/android/i.test(userAgent)) deviceName = 'Android Phone';
      else deviceName = 'Mobile Device';
    } else if (isTablet) {
      deviceType = 'tablet';
      if (/ipad/i.test(userAgent)) deviceName = 'iPad';
      else deviceName = 'Tablet';
    } else {
      if (/macintosh|mac os/i.test(userAgent)) deviceName = 'Mac';
      else if (/windows/i.test(userAgent)) deviceName = 'Windows PC';
      else if (/linux/i.test(userAgent)) deviceName = 'Linux';
    }
    
    return { deviceType, deviceName };
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <SmartphoneIcon className="h-8 w-8 text-gray-500" />;
      case 'tablet':
        return <MonitorIcon className="h-8 w-8 text-gray-500" />;
      default:
        return <LaptopIcon className="h-8 w-8 text-gray-500" />;
    }
  };
  
  const formatLoginTime = (loginTime: string) => {
    try {
      const date = new Date(loginTime);
      if (isNaN(date.getTime())) return 'Unknown';
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      // If session is less than 5 minutes old, show "Active now"
      if (diffMins < 5) {
        return 'Active now';
      }
      
      // Format time based on how old it is
      if (diffMins < 60) {
        return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
      } else {
        // For older dates, show a formatted date
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  const formatIpAddress = (ip: string): string => {
    // Check if the IP is an IPv6-mapped IPv4 address (starts with ::ffff:)
    if (ip && ip.startsWith('::ffff:')) {
      // Extract only the IPv4 part after ::ffff:
      return ip.substring(7);
    }
    return ip;
  };

  const handleSessionRemoved = () => {
      fetchSessions();
  };
  
  if (isLoading && !sessions) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={fetchSessions}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="p-0 mr-4"
          onClick={onBack}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-bold">Active sessions</h1>
      </div>

      {sessions && (
        <div className="space-y-8">
          {/* Current active session */}
          <div>
            <h2 className="text-xl font-bold mb-4">Current active session</h2>
            <p className="text-gray-600 mb-4">
              You're logged into this SDG account on this device and are currently using it.
            </p>
            
            {sessions.currentSession && (
              <div key={sessions.currentSession._id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  {getDeviceIcon(getDeviceInfo(sessions.currentSession.userAgent).deviceType)}
                  <div className="ml-4">
                    <div className="font-semibold">{getDeviceInfo(sessions.currentSession.userAgent).deviceName}</div>
                    <div className="text-gray-500">Active now</div>
                    <div className="text-xs text-gray-400">IP: {formatIpAddress(sessions.currentSession.ipAddress)}</div>
                  </div>
                </div>
                {/* <ChevronRight className="h-5 w-5 text-gray-400" /> */}
              </div>
            )}
          </div>

          {/* Log out of other sessions */}
          {sessions.otherSessions && sessions.otherSessions.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Log out of other sessions</h2>
              <p className="text-gray-600 mb-4">
                You're logged into these accounts on these devices and aren't currently using them.
              </p>
              
              <p className="text-gray-600 mb-4">
                Logging out will end {sessions.otherSessions.length} of your other active sessions. It won't affect your current active session.{' '}
                {/* <a href="#" className="text-blue-500 hover:underline">Learn more</a> */}
              </p>
              

              {sessions.otherSessions.map(session => (
                <SessionItem 
                key={session._id}
                session={session}
                onSessionRemoved={handleSessionRemoved}/>
              ))}
            </div>
          )}
          
          {sessions.otherSessions && sessions.otherSessions.length === 0 && (
            <div className="py-4">
              <p className="text-gray-600">
                You don't have any other active sessions.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sessions;