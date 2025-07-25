"use client"
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import SocialSignIn from '@/components/login/SocialSignIn';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react'; // Added Loader2
import { Input } from '@/components/ui/input';
import { AppApi } from '@/service/app.api';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true
        try {
            const response = await AppApi.auth(email, password, true);
            
            const data = await response.data;
            
            if (!response.success) {
                toast.error(data?.error || data?.message || "Sign-up request failed");
                // setIsLoading(false); // Handled by finally
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
                    credentials: 'include'
                });
                
                const cookieData = await cookieResponse.json();
                
                if (cookieResponse.ok) {
                    toast.success(`Account created successfully! ${data?.message || ''}`);
                    router.push('/'); 
                } else {
                    toast.error(cookieData?.error || cookieData?.message);
                }
            } else {
                toast.error(data?.error || data?.message);
            }
            
        } catch (error) {
            console.error("Signup unsuccessful", error);
            toast.error("Signup failed");
        } finally {
            setIsLoading(false); // Ensure loading is set to false in all cases
        }
    };

    if (isLoading) { // Conditional rendering for loader
        return (
            <div className="flex items-center justify-center h-screen z-50 inset-0">
                <div className="flex flex-col justify-center text-center space-y-4">
                    <Loader2 className="animate-spin mx-auto" color="black" size={62} />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg lg:max-w-md px-6 py-8">
            <div className="animate-slide-up">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    Create Your Account
                </h1>
                <p className="text-gray-600 mb-8">
                    Sign Up to Create your New SDG Story Account.
                </p>
            </div>
            <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2 ">
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
                <p className="text-sm">
                    Must be between 8-14 characters, including an uppercase and
                    lowercase letter, a number and a special character.
                </p>

                <div className="flex text-sm  justify-end">
                    Already have an account?
                    <Link
                        href={"/login"}
                        className={`text-sm ml-1 text-gray-500 hover:text-gray-700 underline cursor-pointer transition-colors ${
                            isLoading ? "pointer-events-none opacity-50" : ""
                        }`}
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
            <SocialSignIn
                className="mt-8 animate-slide-up"
                setIsLoading={setIsLoading}
            />{" "}
            {/* Pass setIsLoading */}
        </div>
    );
};

export default Page;
