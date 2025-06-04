'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'



// Mock components - replace with your actual components
const ColorfulLogo = () => (
    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-xl">L</span>
    </div>
)

const BikeIllustration = () => (
    <div className="w-64 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-6xl">🚲</span>
    </div>
)

export default function NotFound() {
    const router = useRouter()

    const handleBackToHome = () => {
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            {/* Colorful Logo */}
            <div className="relative w-[150px] h-[150px] mb-12">
                <Image
                    src="/Logo.svg"
                    alt="SDG Logo"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Main Illustration */}
            <div className="relative aspect-[4/3] mb-12">
                <Image
                    src="/Error-Illustation.svg"
                    alt="SDG Logo"
                    width={600}
                    height={0}
                    // className="object-contain"
                />
            </div>

            {/* Error Message */}
            <div className="text-center mb-8 max-w-3xl">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                    Oops! Sorry, somethings gone missing....
                </h1>
                <p className="text-gray-600 text-xl leading-relaxed">
                    We apologize for the inconvenience. It looks like you are trying to
                    access a page that has been deleted or does not exist.
                </p>
            </div>

            {/* Back to Homepage Button */}
            <Button 
                onClick={handleBackToHome}
                className="bg-accent hover:bg-accent/80 text-white px-8 py-5.5 text-lg font-medium rounded-lg transition-colors"
            >
                BACK TO HOMEPAGE
            </Button>
        </div>
    )
}