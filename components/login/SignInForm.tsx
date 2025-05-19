"use client"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import SocialSignIn from './SocialSignIn';
import { toast } from 'sonner';
import Link from 'next/link';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SignInFormProps {
    className?: string;
}

const SignInForm: React.FC<SignInFormProps> = ({ className }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
            const data = await response.json();
            
            if (!response.ok) {
                toast.error(data?.error || data?.message);
                return;
            } 
            
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
                
                const cookieData = await cookieResponse.json();
                
                if (cookieResponse.ok) {
                    toast.success('Signed in successfully!', {
                        description: data?.message
                    });
                    window.location.href = '/';
                } else {
                    toast.error(cookieData?.error || cookieData?.message);
                }
            } else {
                toast.error(data?.error || data?.message);
            }
            
        } catch (error) {
            console.error("Login unsuccessful", error);
            toast.error("Login failed", {
                description: "An unexpected error occurred. Please try again."
            });
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
        <div className='space-y-2'>
          <input
            type="email"
            placeholder="Email*"
            className="form-input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-10 py-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center cursor-pointer pr-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
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
