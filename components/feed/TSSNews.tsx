import { Share } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { TSS_NEWS } from '@/lib/constants/feed-constants'

const TSSNews = () => {
  return (
        <div className="space-y-6">
        {/* Featured News Article */}
        <div className="rounded-xl overflow-hidden bg-white">
            <img 
            src="/TSS_NEWS.jpg" 
            alt="People working on documents" 
            className="w-full h-60 object-cover"
            />
            <div className="p-5">
            <div className="text-sm text-gray-500 mb-2">Posted 20 mins ago</div>
            <h2 className="text-xl font-bold mb-1">Perfios acquires CreditNirvana</h2>
            <div className="text-gray-600 text-sm mb-4">By Greenlabsofficial</div>
            
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                {TSS_NEWS?.ARTICLE_TITLE}
            </p>
            
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                Perfios, a B2B SaaS fintech company, has acquired CreditNirvana, an AI-driven debt management and collection platform. "This acquisition is a strategic step in expanding our product suite and strengthening our capabilities in debt management," says Perfios CEO Sabyasachi Goswami. It also recently acquired fraud management company ClariS. Lenders in India spend over $7 billion. Perfios, a B2B SaaS fintech company, has acquired CreditNirvana, an AI-driven debt management and collection platform. "This acquisition is a strategic step in expanding our product suite and strengthening our capabilities in debt management," says Perfios CEO Sabyasachi Goswami. It also recently acquired fraud management company ClariS. Lenders in India spend over $7 billion
            </p>
            
            <div className="flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full">
                <Share className="h-4 w-4" />
                Share
                </Button>
            </div>
            </div>
        </div>
        
        {/* More News Link */}
        <div className="text-center mb-4">
            <Button variant="ghost" className="text-sdg-blue hover:text-sdg-blue/80">
            More Top News
            </Button>
        </div>
        
        {/* Social Media Post - UNDP */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
            <div className="p-4">
            <div className="flex justify-between mb-3">
                <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                    <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/UNDP_logo.svg/1200px-UNDP_logo.svg.png" 
                    alt="UNDP India" 
                    className="w-full h-full object-cover"
                    />
                </div>
                <div className="ml-2">
                    <div className="flex items-center">
                    <h4 className="font-semibold text-sm">UNDP India</h4>
                    <span className="text-xs text-gray-500 ml-1.5">• Following</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                    <span>1M+ followers</span>
                    </div>
                </div>
                </div>
                <div className="flex items-center gap-1">
                <button aria-label='.' className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="2" fill="#6B7280"/>
                    <circle cx="4" cy="12" r="2" fill="#6B7280"/>
                    <circle cx="20" cy="12" r="2" fill="#6B7280"/>
                    </svg>
                </button>
                <button aria-label='.' className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
                </div>
            </div>
            
            <div className="mb-3">
                <p className="text-sm mb-3">MOU Signed Between Government of West Bengal and UNDP to Strengthen Collaboration for Development</p>
            </div>
            </div>
            
            <img 
            src="/lovable-uploads/fa6122a9-47c2-48c3-8dad-d8abf48ce9e2.png" 
            alt="Stock chart" 
            className="w-full h-48 object-cover"
            />
            
            <div className="px-4 py-2 text-xs text-gray-500 flex justify-between border-t border-gray-100">
            <div className="flex items-center gap-1">
                <span className="text-blue-500">•</span>
                <span>298</span>
            </div>
            <div className="flex gap-4">
                <span>20 comments</span>
                <span>20 reposts</span>
            </div>
            </div>
            
            <div className="flex justify-between px-4 py-3 border-t border-gray-100">
            <button className="flex-1 flex items-center justify-center gap-2 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5 5 5-5" />
                </svg>
                <span className="text-sm">Like</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                <span className="text-sm">Comment</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 014-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 01-4 4H3" />
                </svg>
                <span className="text-sm">Repost</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                <span className="text-sm">Share</span>
            </button>
            </div>
        </div>
        </div>
  )
}

export default TSSNews