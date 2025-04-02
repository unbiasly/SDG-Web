'use client'
import ForgotPasswordForm from '@/components/login/ForgotPassword';
import ImageSlider from '@/components/login/ImageSlider';
import SignInForm from '@/components/login/SignInForm';
import React, { useState } from 'react'

const Page = () => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationClass, setAnimationClass] = useState("");
  
    const handleForgotPassword = () => {
      setIsAnimating(true);
      setAnimationClass("animate-slide-out-left");
      setTimeout(() => {
        setShowForgotPassword(true);
        setAnimationClass("animate-slide-in-right");
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }, 300);
    };
  
    const handleBackToSignIn = () => {
      setIsAnimating(true);
      setAnimationClass("animate-slide-out-right");
      setTimeout(() => {
        setShowForgotPassword(false);
        setAnimationClass("animate-slide-in-left");
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }, 300);
    };
    return (
      <div className="h-screen md:px-20">
        <div className="flex flex-col lg:flex-row w-full justify-center  h-screen">
          {/* Left side - Image */}
          <div className="hidden lg:flex justify-center items-center  w-1/2 relative">
            <ImageSlider/>
          </div>
          
          {/* Right side - Sign In Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center ">
            <div className={`relative ${animationClass}`} style={{
                transform: isAnimating ? undefined : 'translateX(0)'
            }}>
                {showForgotPassword ? (
                    <ForgotPasswordForm onBackToSignIn={handleBackToSignIn} />
                ) : (
                    <SignInForm onForgotPassword={handleForgotPassword} />
                )}
            </div>
          </div>
          
        </div>
      </div>
    );
    }
    

    
    

export default Page