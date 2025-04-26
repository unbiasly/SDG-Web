'use client'
import ImageSlider from '@/components/login/ImageSlider';
import SignUpForm from '@/components/login/SignUpForm';
import React from 'react';

const Page = () => {
  
    
    return (
      <div className="h-screen md:px-20">
        <div className="flex flex-col lg:flex-row w-full justify-center  h-screen">
          {/* Left side - Image */}
          <div className="hidden lg:flex justify-center items-center  w-1/2 relative">
            <ImageSlider/>
          </div>
          
          {/* Right side - Sign In Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center ">
                <SignUpForm />
            
          </div>
          
        </div>
      </div>
    );
    }
    

    
    

export default Page