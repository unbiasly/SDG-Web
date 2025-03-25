import React from 'react'

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            <div className="flex-1 space-y-3 py-1">
                <div className="h-2 bg-gray-300 rounded"></div>
                <div className="h-2 bg-gray-300 rounded w-5/6"></div>
            </div>
        </div>
    </div>
  )
}

export default Loader