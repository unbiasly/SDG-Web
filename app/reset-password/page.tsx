'use client';

import ResetPassword from '@/components/login/ResetPassword'
import Image from 'next/image'
import React, { Suspense } from 'react'
import Logo from '@/public/Logo.png'

// Create a client component that uses useSearchParams
const ResetPasswordForm = () => {
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  console.log('Reset Params:', { token, email });

  return <ResetPassword token={token} email={email} />;
}

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-2 sm:p-4">
        <div className="w-full max-w-md sm:max-w-2xl m-auto h-full relative">
            <div className="bg-white/60 mx-5 h-full flex flex-col items-center justify-center rounded-lg border border-gray-500 overflow-hidden">
                {/* Logo div positioned to sit halfway outside the card */}
                <div className="bg-white/40 mt-6 sm:mt-10 rounded-full border-2 border-white/40">
                    <Image 
                        src={Logo} 
                        alt="SDG Logo" 
                        width={90} 
                        height={90} 
                        className="sm:w-[130px] sm:h-[130px]" 
                    />
                </div>
              
              <div className="flex flex-col items-center justify-center py-4 sm:py-6 w-full px-4 sm:px-0">
                {/* Wrap the component that uses useSearchParams in Suspense */}
                <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
                  <ResetPasswordForm />
                </Suspense>
              </div>
              <div className="flex h-6 sm:h-10 mt-3 sm:mt-5 w-full">
                <div className="flex-1 bg-[#E5243B]"></div>
                <div className="flex-1 bg-[#dda73a80]"></div>
                <div className="flex-1 bg-[#4C9F38]"></div>
                <div className="flex-1 bg-[#C5192D]"></div>
                <div className="flex-1 bg-[#FF3A21]"></div>
                <div className="flex-1 bg-[#26BDE2]"></div>
                <div className="flex-1 bg-[#FCC30B]"></div>
                <div className="flex-1 bg-[#A21942]"></div>
                <div className="flex-1 bg-[#FD6925]"></div>
                <div className="flex-1 bg-[#DD1367]"></div>
                <div className="flex-1 bg-[#FD9D24]"></div>
                <div className="flex-1 bg-[#BF8B2E]"></div>
                <div className="flex-1 bg-[#3F7E44]"></div>
                <div className="flex-1 bg-[#0A97D9]"></div>
                <div className="flex-1 bg-[#56C02B]"></div>
                <div className="flex-1 bg-[#00689D]"></div>
                <div className="flex-1 bg-[#19486A]"></div>
              </div>
            </div>
          </div>
    </div>
  )
}

export default Page