

import { baseURL } from '@/service/app.api';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// The base URL should be defined in your environment variables

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const searchParams = req.nextUrl.searchParams;
    const limit = searchParams.get('limit') || 20;
    const cursor = searchParams.get('cursor') || '';
    
  try {
    if (!jwtToken) {
      console.log('No JWT token found in cookies');
    }
    
    // Parse the request body
    const { action, userId, postId, type, viewerId } = await req.json();
    
    // Prepare request data, removing null or empty values
    const requestData = {
      action,
      userId,
      postId,
      type,
      viewerId
    };
    console.log(JSON.stringify(requestData));
    
    // Remove null or empty values (similar to Flutter implementation)
    Object.keys(requestData).forEach(key => {
      const typedKey = key as keyof typeof requestData;
      if (requestData[typedKey] === null || requestData[typedKey] === undefined || requestData[typedKey] === '') {
        delete requestData[typedKey];
      }
    });
    // Log request for debugging (similar to Flutter _logApiAction)
    // console.log('Sending Analytics Request:', {
    //   endpoint: `${baseURL}/analytics`,
    //   method: 'POST',
    //   requestData
    // });
    
    // Forward the request to the backend API
    const response = await fetch(`${baseURL}/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(requestData),
    });
    
    // Log response for debugging
    console.log('Analytics Response:', {
      statusCode: response.status
    });
    
    // For 'track' actions, we don't need to handle 401 errors with token refresh
    // This matches the Flutter implementation
    if (response.status === 401 && action !== 'track') {
      return NextResponse.json(
        { success: false, message: "Authentication token expired", redirectToLogin: true },
        { status: 401 }
      );
    }
    
    // Get the response data
    const responseData = await response.json();
    
    // Return the backend response with the same status code
    return NextResponse.json(responseData, { status: response.status });
    
  } catch (error) {
    console.error("Analytics API Proxy Error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
        
        const response = await fetch(`${baseURL}/scheme/count`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const data = await response.json()
        console.log(data);
        return NextResponse.json(data, { status: response.status }); 
    } catch (error) {
        console.error('Error fetching scheme count:', error);
        
        return NextResponse.json({ 
            error: 'Failed to fetch scheme count', 
            success: false 
        }, { status: 500 });
    }
}