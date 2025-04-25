
import SearchPageClient from '@/components/search/SearchPageClient';
import React, { Suspense } from 'react'

type Params = Promise<{ q: string }>;``

const SearchContent = async ({ params }: { params: Params }) => {
    // Await the params to get the userId
    const { q } = await params;

    return <SearchPageClient q={q} />;
}

const Page = ({ params }: { params: Params }) => {
    return(
    <Suspense fallback={<div className="w-full min-h-screen flex justify-center items-center">
        <div className="animate-pulse text-xl">Loading...</div>
        </div>}>
            <SearchContent params={params} />
    </Suspense>
    )
}

export default Page