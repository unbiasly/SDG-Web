import { NextRequest, NextResponse } from 'next/server';
import { baseURL } from '@/service/app.api';

export async function POST(request: NextRequest) {
  try {
    // Get the JWT token from cookies
    const cookieStore = request.cookies;
    const jwtToken = cookieStore.get('jwtToken')?.value;
    
    if (!jwtToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${baseURL}/v1/follow/?action=all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch follow count');
    }

    const data = await response.json();
    
    // Extract follower and following counts from the response
    const followerCount = data.followers?.length || 0;
    const followingCount = data.following?.length || 0;
    
    // Create a structured response with the counts
    const followCounts = {
      followerCount,
      followingCount,
      data
    };

    console.log("Follower Count: ", followerCount)
    console.log("Following Count: ", followingCount)
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching follow count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch follow count' },
      { status: 500 }
    );
  }
}