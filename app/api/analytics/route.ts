import { baseURL } from '@/service/app.api';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// The base URL should be defined in your environment variables

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;
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
        'Authorization': `Bearer ${jwtToken}`,
        'sessionId': sessionId || ''
      },
      body: JSON.stringify(requestData),
    });
    
    // Log response for debugging
    console.log('Analytics Response:', {
      statusCode: response.status
    });
    
    
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
