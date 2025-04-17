
import React, { Suspense } from 'react'
import ProfilePageClient from '@/components/profile/ProfilePageClient';

// Define the params type
type Params = Promise<{ userId: string }>;

// Create a ProfileContent component to handle async params
const ProfileContent = async ({ params }: { params: Params }) => {
  // Await the params to get the userId
  const { userId } = await params;
  
  return <ProfilePageClient userId={userId} />;
};

// Main page component that wraps the ProfileContent in a Suspense boundary
export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="w-full min-h-screen flex justify-center items-center">
      <div className="animate-pulse text-xl">Loading...</div>
    </div>}>
      <ProfileContent params={params} />
    </Suspense>
  );
}