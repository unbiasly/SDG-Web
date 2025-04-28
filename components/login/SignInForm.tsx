"use client"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import SocialSignIn from './SocialSignIn';
import { toast } from 'sonner';
import Link from 'next/link';

interface SignInFormProps {
    className?: string;
}

const SignInForm: React.FC<SignInFormProps> = ({ className }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/login/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    device_id: 'web',
                    device_token: 'web',
                    isSignin: true, 
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                toast.error("Login unsuccessful: " + (errorData?.message || 'Failed to login'));
                return;
            } 
            const data = await response.json();
            if (data.jwtToken) {
                const cookieResponse = await fetch('/api/setCookieToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jwtToken: data.jwtToken,
                        refreshToken: data.refreshToken,
                        sessionId: data.sessionId,
                        userId: data.userId,
                    }),
                    credentials: 'include' // Important for cookies to be sent/received
                });
                
                console.log(cookieResponse)
                if (cookieResponse.ok) {
                    toast.success('Signed in successfully!');
                    window.location.href = '/';
                } else {
                    const cookieError = await cookieResponse.json();
                    toast.error('Authentication error: ' + (cookieError?.message || 'Failed to set session'));
                }
            } else {
                toast.error(data?.message || data?.error || 'Login failed');
            }
            
        } catch (error) {
            console.error("Login unsuccessful", error);
        } 
    };



  return (
    <div className={cn("w-full max-w-lg lg:max-w-md px-6 py-8", className)}>
      <div className="animate-slide-up">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Sign In</h1>
        <p className="text-gray-600 mb-8">
          Sign in to get the best experience of our app. Never miss update turn on notifications.
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-5">
        <div className='space-y-2 '>
          <input
            type="email"
            placeholder="Email*"
            className="form-input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
          <Link href={"/forgot-password"} 
            className="text-sm text-gray-500 hover:text-gray-700 underline cursor-pointer transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
        
        <button
          type="submit"
          className="w-full cursor-pointer bg-accent text-white font-medium py-3 px-4 rounded-full hover:bg-accent/80 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Sign In
        </button>
      </form>
      
      <SocialSignIn className="mt-8 animate-slide-up" />
      
      <div className=" text-center animate-slide-up">

        <Link 
          href="/sign-up" 
          className="block w-full mt-4 text-center py-3 px-4 border border-gray-800 rounded-full text-gray-800 hover:bg-gray-50 transition-colors"
        >
          Don't have an Account? Sign up
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
