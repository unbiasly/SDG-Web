"use client"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import SocialSignIn from './SocialSignIn';
import { toast } from 'sonner';
import Link from 'next/link';

interface SignUpFormProps {
    className?: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ className }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e: React.FormEvent) => {
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
                    isSignUp: false, 
                }),
            }).then(res => res.json());
            if (response.jwtToken) {
                const cookieResponse = await fetch('/api/setCookieToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jwtToken: response.jwtToken,
                        refreshToken: response.refreshToken,
                        sessionId: response.sessionId,
                        userId: response.userId,
                    }),
                    credentials: 'include' // Important for cookies to be sent/received
                });
                
                console.log(cookieResponse)
                console.log("Login Successful, JWT Token:", response.jwtToken)
            // Redirect to home page or dashboard
            window.location.href = '/';
            } else {
                toast.error(response?.message);
            }
            
        } catch (error) {
            console.error("Login unsuccessful", error);
        } 
    };



  return (
    <div className={cn("w-full max-w-lg lg:max-w-md px-6 py-8", className)}>
      <div className="animate-slide-up">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Create Your Account</h1>
        <p className="text-gray-600 mb-8">
          Sign Up to Create your New SDG Story Account.
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-5">
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
        <p className='text-sm'>Must be between 8-14 characters, including an uppercase and lowercase letter, a number and a special character.</p>
        
        <div className="flex text-sm  justify-end">
            Already have an account?
          <Link href={"/login"} 
            className="text-sm ml-1 text-gray-500 hover:text-gray-700 underline cursor-pointer transition-colors"
          >
            Login
          </Link>
        </div>
        
        <button
          type="submit"
          className="w-full cursor-pointer bg-accent text-white font-medium py-3 px-4 rounded-full hover:bg-accent/80 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Sign Up
        </button>
      </form>
      
      <SocialSignIn className="mt-8 animate-slide-up" />
      
    </div>
  );
};

export default SignUpForm;
