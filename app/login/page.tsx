import ImageSlider from '@/components/login/ImageSlider';
import SignInForm from '@/components/login/SignInForm';
import React from 'react'

const Page = () => {
    
    return (
      <div className="h-screen md:px-20">
        <div className="flex flex-col lg:flex-row w-full justify-center  h-screen">
          {/* Left side - Image */}
          <div className="hidden lg:block w-2/5 bg-gray-900 relative">
            <ImageSlider/>
          </div>
          
          {/* Right side - Sign In Form */}
          <div className="w-full lg:w-3/5 flex items-center justify-center lg:justify-end lg:pr-20">
            <SignInForm />
          </div>
        </div>
      </div>
    );
    }
    

    
    

export default Page