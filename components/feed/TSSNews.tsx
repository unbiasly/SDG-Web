import { Share } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { TSS_NEWS } from '@/lib/constants/feed-constants'
import Image from 'next/image'
import { PostCard } from './PostCard'

const TSSNews = () => {
  return (
    <div className="space-y-6">
      {/* Featured News Article */}
      <div className="overflow-hidden relative">
        <Image
          src="/TSS_NEWS.jpg" 
          alt="People working on documents" 
          width={400}
          height={400}
          className="w-full h-60 object-cover"
        />
        {/* content - now positioned with negative margin-top to create overlap */}
        <div className="py-5 px-10 mx-10 bg-white rounded-t-3xl -mt-15 relative z-10">
          <div className="flex flex-col">
            <div className="text-sm text-gray-500 mb-2">Posted 20 mins ago</div>
            <h2 className="flex justify-between items-center text-2xl font-bold mb-1">
              Perfios acquires CreditNirvana
              <Button variant="outline" size="lg" className="flex bg-gray-200 items-center gap-2 rounded-full">
                <Share className="h-10 w-10" />
                Share
              </Button>
            </h2>
            <div className="text-gray-600 text-sm mb-4">By Greenlabsofficial</div>
          </div>
          <p className="text-md text-gray-900 mb-6">
            {TSS_NEWS?.ARTICLE_TITLE} <br className='m-2'/>
            Perfios, a B2B SaaS fintech company, has acquired CreditNirvana, an AI-driven debt management and collection platform. "This acquisition is a strategic step in expanding our product suite and strengthening our capabilities in debt management," says Perfios CEO Sabyasachi Goswami. It also recently acquired fraud management company ClariS. Lenders in India spend over $7 billion. Perfios, a B2B SaaS fintech company, has acquired CreditNirvana, an AI-driven debt management and collection platform. "This acquisition is a strategic step in expanding our product suite and strengthening our capabilities in debt management," says Perfios CEO Sabyasachi Goswami. It also recently acquired fraud management company ClariS. Lenders in India spend over $7 billion
          </p>
        </div>
      </div>
      
      {/* More News Link */}
      
      {/* Social Media Post - UNDP */}
      <div className="bg-white  border border-gray-100 overflow-hidden p-4">
      <h2 className='py-3 text-2xl font-bold'>
        More Top News
      </h2>
      <PostCard
        name="UNDP India"
        handle="@UNDPIndia"
        avatar="/feed/undp-logo-blue.svg"
        time="21 hrs 54 mins"
        isVerified={true}
        content="MOU Signed Between Government of West Bengal and UNDP to Strengthen Collaboration for Development"
        imageUrl="/feed/mou-signing.jpg"
        likesCount="298"
        commentsCount="20"
        repostsCount="20"
    />
        
      </div>
    </div>
  )
}

export default TSSNews