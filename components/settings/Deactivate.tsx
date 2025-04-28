'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DEACTIVATE_CONTENT } from '@/lib/constants/settings-constants';

interface DeactivateProps {
  onBack: () => void;
}

const Deactivate: React.FC<DeactivateProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeactivate = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Replace with your API call
      const response = await fetch('/api/settings/deactivate', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to deactivate account');
      }
      window.location.href = '/login';

    } catch (err: any) {
      setError(err.message || 'An error occurred while deactivating your account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center mb-6 space-x-2">
            <ArrowLeft size={20} onClick={onBack} className="cursor-pointer" />
        <h1 className="text-2xl font-bold">Deactivate account</h1>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{DEACTIVATE_CONTENT?.title}</h2>
        
        <p className="text-gray-700">{DEACTIVATE_CONTENT?.description}</p>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What else you should know</h3>
          
          <ul className="space-y-4">
            {DEACTIVATE_CONTENT.additionalInfo.map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <p className="text-gray-700">{item}</p>
              </li>
            ))}
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
