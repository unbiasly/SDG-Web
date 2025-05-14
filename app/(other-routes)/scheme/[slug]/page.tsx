'use client'
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
// import { Select } from "@/components/ui/select";
// import { SCHEME_CATEGORIES } from '@/lib/constants/index-constants';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Scheme {
  id: string;
  title: string;
  state: string;
  description: string;
  tags: string[];
  scheme_url?: string;
  schemeCategory?: string[];
  level?: string;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Use Next.js hooks for better client-side routing
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier');
  const value = searchParams.get('value');
  
  const fetchSchemes = async (page = 1, keyword = '') => {
    setLoading(true);
    try {
      const response = await fetch('/api/scheme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page,
          identifier,
          value,
          keyword: keyword || undefined
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setSchemes(data.data.map((scheme: any) => ({
          id: scheme.id,
          title: scheme.schemeName,
          state: Array.isArray(scheme.beneficiaryState) ? scheme.beneficiaryState.join(', ') : 'Unknown',
          description: scheme.briefDescription || 'No description available',
          tags: Array.isArray(scheme.tags) ? scheme.tags : [],
          scheme_url: scheme.scheme_url,
          schemeCategory: scheme.schemeCategory,
          level: scheme.level
        })));
        
        // Set pagination data
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      } else {
        console.error('Failed to fetch schemes:', data.message);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes(currentPage);
  }, [currentPage, identifier, value]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSchemes(1, searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <div className="bg-[#fffcf1] p-8">
        <h1 className="text-3xl font-bold text-[#bf8b2e] w-1/2 mb-2">{value}</h1>
      </div>

      {/* Search Bar */}
      <div className="p-4 mx-auto">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter scheme name to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-4 rounded-full border border-gray-300"
          />
          <button 
            aria-label='Search' 
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={handleSearch}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        {/* <div className="border-b border-gray-300 mb-0.5">
                <div className="flex w-full justify-evenly">
                    {tabs.map((tab, index) => (
                        <React.Fragment key={tab}>
                            <div className={`py-2 ${
                                activeTab === tab 
                                    ? 'border-b-3 border-b-accent text-accent  active' 
                                    : 'border-b-2 text-gray-400 border-b-transparent'
                            }`}>
                                <button
                                    className={`flex cursor-pointer justify-center text-xl ${activeTab === tab ? 'font-bold' : 'text-gray-400'}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            </div>
                            {index < tabs.length - 1 && (
                                <div className="my-2 border-r border-l border-gray-300 rounded-full" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div> */}

        {/* Scheme Cards */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-2">Loading schemes...</p>
            </div>
          ) : schemes.length > 0 ? (
            schemes.map((scheme) => (
              <Link href={scheme.scheme_url || `/scheme/id/detail?id=${scheme.id}`} target={scheme.scheme_url ? "_blank" : "_self"} key={scheme.id} className="block">
                <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between mb-3">
                    <div className="inline-block px-3 py-1 rounded-full text-sm bg-gray-500 text-white">
                      {scheme.state}
                    </div>
                    {scheme.level && (
                      <div className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {scheme.level}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{scheme.title}</h3>
                  <p className="text-gray-600 mb-4">{scheme.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {scheme.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm border border-gray-600 text-black"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {scheme.schemeCategory && (
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Categories: </span>
                      {scheme.schemeCategory.join(', ')}
                    </div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p>No schemes found. Try a different search query.</p>
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 mx-1 bg-gray-100 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 mx-1 bg-gray-200 rounded-md">{currentPage}</span>
          {totalPages > 0 && (
            <span className="px-4 py-2 mx-1 text-gray-500">of {totalPages}</span>
          )}
          <button 
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={loading || (totalPages > 0 && currentPage >= totalPages)}
            className="px-4 py-2 mx-1 bg-gray-100 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

{/* Filters Sidebar */}
{/* <div className="fixed top-0 right-0 w-80 h-full bg-white border-l p-6">
  <div className="space-y-4">
    <h3 className="font-medium">State</h3>
    <Select>
      <option value="">Select</option>
    </Select>

    <h3 className="font-medium">Age</h3>
    <Select>
      <option value="">Please select</option>
    </Select>

    <h3 className="font-medium">Gender</h3>
    <Select>
      <option value="">Please select</option>
    </Select>

    <h3 className="font-medium">Ministry Name</h3>
    <Select>
      <option value="">Please select</option>
    </Select>

  </div>
</div> */}
export default Page;
