"use client"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import SocialSignIn from './SocialSignIn';
import Link from 'next/link';

interface SignInFormProps {
  className?: string;
}

const SignInForm: React.FC<SignInFormProps> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in attempt with:', { email, password });
    // Add your authentication logic here
    window.location.href = '/feed'
  };

  return (
    <div className={cn("w-full max-w-md px-6 py-8", className)}>
      <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Sign In</h1>
        <p className="text-gray-600 mb-8">
          Sign in to get the best experience of our app. Never miss update turn on notifications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div>
          <input
            type="email"
            placeholder="Email*"
            className="form-input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Password*"
            className="form-input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex justify-end">
          <a href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors">
            Forgot Password?
          </a>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gray-500 text-white font-medium py-3 px-4 rounded-full hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          onClick={handleSubmit}
        >
          Sign in
        </button>
      </form>
      
      <SocialSignIn className="mt-8 animate-slide-up" />
      
      <div className=" text-center animate-slide-up" style={{ animationDelay: '500ms' }}>

        <a 
          href="#" 
          className="block w-full mt-4 text-center py-3 px-4 border border-gray-800 rounded-full text-gray-800 hover:bg-gray-50 transition-colors"
        >
          Sign up
        </a>
      </div>
    </div>
  );
};

export default SignInForm;
