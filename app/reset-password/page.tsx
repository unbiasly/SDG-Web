import ResetPassword from '@/components/login/ResetPassword'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-sdg-purple-light/30 p-4">
      <div className="w-full max-w-md">
        <ResetPassword />
      </div>
      
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>© 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default page