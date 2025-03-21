import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
        <div className="w-full max-w-md">
          {children}
          <h1 className='text-2xl text-black'> test</h1>
        </div>
      </div>
  );
};

export default LoginLayout;
