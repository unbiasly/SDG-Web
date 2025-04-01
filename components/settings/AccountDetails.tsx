import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, User, KeyRound, Heart } from 'lucide-react';

interface AccountDetailsProps {
  className?: string;
  section: string;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ className, section }) => {
  return (
    <div className={cn('w-full h-full p-6 bg-white animate-enter-slide', className)}>
      {section === 'account' ? (
        <>
          <h1 className="text-xl font-semibold mb-4">Your Account</h1>
          <p className="text-gray-600 mb-6">
            See information about your account and download an archive of your data or learn more about your deactivation options
          </p>
          
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <User className="text-gray-500" size={20} />
                  <div>
                    <h3 className="font-medium">Your Account</h3>
                    <p className="text-sm text-gray-500">See your account information like your phone number and email address.</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-t">
                <div className="flex items-center gap-3">
                  <KeyRound className="text-gray-500" size={20} />
                  <div>
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-gray-500">Change your password at any time.</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-t">
                <div className="flex items-center gap-3">
                  <Heart className="text-gray-500" size={20} />
                  <div>
                    <h3 className="font-medium">Deactivate your account</h3>
                    <p className="text-sm text-gray-500">Find out how you can deactivate your account.</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
        </>
      ) : section === 'security' ? (
        <>
          <h1 className="text-xl font-semibold mb-4">Security and account access</h1>
          <p className="text-gray-600 mb-6">
            Manage your account's security and keep track of your account's usage including apps that you have connected to your account.
          </p>
        </>
      ) : section === 'privacy' ? (
        <>
          <h1 className="text-xl font-semibold mb-4">Privacy and safety</h1>
          <p className="text-gray-600 mb-6">
            Manage what information you see and share on the platform.
          </p>
        </>
      ) : section === 'notifications' ? (
        <>
          <h1 className="text-xl font-semibold mb-4">Notifications</h1>
          <p className="text-gray-600 mb-6">
            Select the kinds of notifications you get about your activities and interests.
          </p>
        </>
      ) : section === 'accessibility' ? (
        <>
          <h1 className="text-xl font-semibold mb-4">Accessibility, display and languages</h1>
          <p className="text-gray-600 mb-6">
            Manage how content is displayed to you.
          </p>
        </>
      ) : section === 'resources' ? (
        <>
          <h1 className="text-xl font-semibold mb-4">Additional resources</h1>
          <p className="text-gray-600 mb-6">
            Check out other places for helpful information to learn more about our products and services.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-xl font-semibold mb-4">Help Center</h1>
          <p className="text-gray-600 mb-6">
            Get help with your account, technical issues, and general questions.
          </p>
        </>
      )}
    </div>
  );
};

export default AccountDetails;
