'use client';

import ResetPassword from '@/components/login/ResetPassword'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const [resetParams, setResetParams] = useState<{
    token: string | null;
    email: string | null;
  }>({
    token: null,
    email: null,
  });

  useEffect(() => {
    // Extract token and email from URL parameters
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    setResetParams({ token, email });
  }, [searchParams]);

  console.log('Reset Params:', resetParams);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="w-full max-w-2xl m-30 h-full relative">
            <div className="bg-white/60 h-full flex  flex-col items-center justify-center rounded-lg border border-gray-500 overflow-hidden">
                {/* Logo div positioned to sit halfway outside the card */}
                <div className=" bg-white/40 mt-10 rounded-full border-2 border-white/40">
                    <Image src="/Logo.svg" alt="SDG Logo" width={130} height={130} />
                </div>
              
              <div className="flex flex-col items-center justify-center py-6 ">
                {/* Pass token and email to ResetPassword component */}
                <ResetPassword token={resetParams.token} email={resetParams.email} />
              </div>
              <div className="flex h-10 mt-5 w-full">
                <div className="flex-1 bg-[#E5243B]"></div>
                <div className="flex-1 bg-[#DDA63A]"></div>
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