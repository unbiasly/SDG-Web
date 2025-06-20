'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'



export default function NotFound() {
    const router = useRouter()

    const handleBackToHome = () => {
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            {/* Colorful Logo */}
            <div className="relative w-[100px] lg:w-[150px] h-[150px] mb-12">
                <Image
                    src="/Logo.svg"
                    alt="SDG Logo"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Main Illustration */}
            <div className="relative aspect-[4/3]  lg:mb-12">
                <Image
                    src="/Error-Illustation.svg"
                    alt="SDG Logo"
                    width={600}
                    height={0}
                    // className="object-contain"
                />
            </div>

            {/* Error Message */}
            <div className="text-center lg:mb-8 max-w-3xl">
                <h1 className="text-lg lg:text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                    Oops! Sorry, something's gone missing...
                </h1>
                <p className="text-gray-600 text-sm lg:text-xl leading-relaxed">
                    We apologize for the inconvenience. It looks like you are trying to
                    access a page that has been deleted or does not exist.
                </p>
            </div>

            {/* Back to Homepage Button */}
            <Button 
                onClick={handleBackToHome}
                className="bg-accent hover:bg-accent/80 text-white px-4 lg:px-8 py-4 lg:py-5.5 text-sm lg:text-lg font-medium rounded-lg transition-colors"
            >
                BACK TO HOMEPAGE
            </Button>
        </div>
    )
}