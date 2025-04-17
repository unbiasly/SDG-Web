'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ChangePassword = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Replace with your API call
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          currentPassword, 
          newPassword 
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to change password');
      }

      // Success - navigate back or show success message
      router.back();
    } catch (err: any) {
      setError(err.message || 'An error occurred while changing password');
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
        //   onClick={() => router.back()}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-bold">Change your password</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current password */}
        <div className="space-y-2">
          <label htmlFor="current-password" className="text-gray-700 block text-lg font-medium">
            Current password
          </label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full h-14 rounded-md bg-gray-100"
          />
          <a href="#" className="text-blue-600 hover:underline block mt-1">
            Forgot Password?
          </a>
        </div>

        {/* New password */}
        <div className="space-y-2">
          <label htmlFor="new-password" className="text-gray-700 block text-lg font-medium">
            New password
          </label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full h-14 rounded-md bg-gray-100"
          />
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-gray-700 block text-lg font-medium">
            Confirm password
          </label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-14 rounded-md bg-gray-100"
          />
        </div>

        {/* Information text */}
        <p className="text-gray-700 text-sm">
          Changing your password will log you out of all your active sessions
          except the one you're using at this time.
        </p>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-8 rounded-full"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;