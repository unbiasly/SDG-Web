import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <main className="flex min-h-screen flex-col lg:flex-row">
          {/* Left side - Image */}
          <div className="relative hidden lg:block lg:w-1/2">
            <Image
              src="/public/login/Onboard-1.png"
              alt="Person writing on blackboard"
              className="h-full w-full object-cover"
              fill
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
              <h2 className="text-2xl font-bold">SDG Stories: Global progress, daily updates. Stay informed</h2>
            </div>
          </div>
    
          {/* Right side - Sign In Form */}
          <div className="flex w-full flex-col justify-between p-8 lg:w-1/2">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 space-y-2">
                <h1 className="text-4xl font-bold">Sign In</h1>
                <p className="text-muted-foreground">
                  Sign in to get the best experience of our app. Never miss update turn on notifications.
                </p>
              </div>
    
              <div className="space-y-4">
                <div>
                  <input type="email" placeholder="Email*" />
                </div>
                <div>
                  <input type="password" placeholder="Password*" />
                  <div className="mt-1 text-right">
                    <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">
                      Forgot Password?
                    </Link>
                  </div>
                </div>
    
                <button className="w-full bg-gray-500 hover:bg-gray-600">Sign in</button>
    
                <div className="mt-6">
                  <p className="mb-4 text-center text-sm">Sign in with:</p>
                  <div className="grid grid-cols-4 gap-2">
                    <button aria-label='a' className="h-12 w-full">
                      <GoogleIcon className="h-5 w-5" />
                    </button>
                    <button aria-label='a' className="h-12 w-full">
                      <AppleIcon className="h-5 w-5" />
                    </button>
                    <button aria-label='a' className="h-12 w-full">
                      <FacebookIcon className="h-5 w-5" />
                    </button>
                    <button aria-label='a' className="h-12 w-full">
                      <TwitterIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
    
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">or</span>
                  </div>
                </div>
    
                <button  className="w-full">
                  Sign up
                </button>
              </div>
            </div>
    
            {/* Mobile view - Bottom text */}
            <div className="mt-12 text-center lg:hidden">
              <div className="mb-4 flex justify-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
              </div>
              <h2 className="text-xl font-bold">SDG Stories: Global progress, daily updates. Stay informed</h2>
            </div>
    
            {/* Desktop view - Pagination dots */}
            <div className="hidden justify-center space-x-2 lg:flex">
              <span className="h-2 w-2 rounded-full bg-gray-500"></span>
              <span className="h-2 w-2 rounded-full bg-gray-300"></span>
              <span className="h-2 w-2 rounded-full bg-gray-300"></span>
              <span className="h-2 w-2 rounded-full bg-gray-300"></span>
            </div>
          </div>
        </main>
      )
    }
    
    // Icon components
    function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )
    }
    
    function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.82 3.28-.82 2 .82 3.3.79 2.22-1.24 3.06-2.45a11 11 0 0 0 1.38-2.85 4.41 4.41 0 0 1-2.68-4.04z" />
        </svg>
      )
    }
    
    function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
      return (
        <svg viewBox="0 0 24 24" fill="#1877F2" {...props}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    }
    
    function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    }
    
    

export default page