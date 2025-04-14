import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Page = () => {
    return (
        <div className="flex w-full min-h-screen items-center justify-center bg-white p-10">
          <div className="w-full m-30 h-full relative">
            <div className="bg-[#ECECEC] h-full flex flex-col items-center justify-center rounded-lg shadow-lg overflow-hidden">
                {/* Logo div positioned to sit halfway outside the card */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full border-2 border-[#ECECEC] z-10">
                    <Image src="/Logo.svg" alt="SDG Logo" width={100} height={100} />
                </div>
              
              <div className="flex flex-col items-center justify-center p-6 pt-12 mt-5">
                <h2 className="text-center text-2xl font-bold  text-gray-800">
                  The SDG Story
                </h2>
                
                <div className="my-6">
                  <Image src="/icons/email_logo.svg" alt="Email Verified" width={200} height={200} />
                </div>
                
                <h1 className="text-center text-4xl font-bold mb-4">
                  Congratulations!
                </h1>
                
                <p className="text-center text-xl text-gray-600 mb-8">
                  Welcome to The SDG Story! Your email has been verified and 
                  registered in our systems.
                </p>
                
                <div className="text-center mb-4">
                  <Link 
                    href="/login" 
                    className="inline-block text-xl font-bold text-gray-700 hover:text-gray-900 hover:underline transition-colors"
                  >
                    Complete your login&gt;
                  </Link>
                </div>
              </div>
              
              <div className="flex h-20 w-full">
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
      );
}

export default Page