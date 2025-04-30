import Image from 'next/image'
import React from 'react'


const Loader = () => {
  return (
    <div className='flex items-center justify-center h-screen z-50 inset-0'>
        <div className="flex flex-col justify-center text-center space-y-4">
        <Image src='/loader.gif' alt='loading' width={100} height={100} priority />
        <p className='w-full animate-pulse text-2xl font-bold'>Loading..</p>
        </div>
    </div>
  )
}

export default Loader