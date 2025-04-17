'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DEACTIVATE_CONTENT } from '@/lib/constants/settings-constants';

const Deactivate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeactivate = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Replace with your API call
      const response = await fetch('/api/user/deactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to deactivate account');
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred while deactivating your account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="p-0 mr-4"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-bold">Deactivate account</h1>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{DEACTIVATE_CONTENT?.title}</h2>
        
        <p className="text-gray-700">{DEACTIVATE_CONTENT?.description}</p>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What else you should know</h3>
          
          <ul className="space-y-4">
            {DEACTIVATE_CONTENT.additionalInfo.map((info, index) => {
              // Check if info contains "Learn more" text
              const hasLearnMore = info.includes("Learn more");
              // Check if info mentions changing username/settings
              const hasSettings = info.includes("edit it in your settings") || 
                     info.includes("change them before you deactivate");
              
              if (hasLearnMore) {
            const [text, learnMore] = info.split("Learn more");
            return (
              <li key={index}>
                {text}
                <Link href="#" className="text-blue-600 hover:underline">Learn more</Link>
              </li>
            );
              } else if (hasSettings) {
            if (info.includes("edit it in your settings")) {
              const [text, settings] = info.split("edit it in your");
              return (
                <li key={index}>
                  {text}edit it in your 
                  <Link href="/settings/profile" className="text-blue-600 hover:underline"> settings</Link>.
                </li>
              );
            } else {
              const [text, change] = info.split("change them");
              return (
                <li key={index}>
                  {text}
                  <Link href="/settings/profile" className="text-blue-600 hover:underline">change them</Link> 
                  before you deactivate this account.
                </li>
              );
            }
              } else {
            return <li key={index}>{info}</li>;
              }
            })}
          </ul>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="w-full flex justify-center">
          <Button 
            onClick={handleDeactivate}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white py-5 px-8 rounded-full"
          >
            {isLoading ? 'Deactivating...' : 'Deactivate'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Deactivate;
