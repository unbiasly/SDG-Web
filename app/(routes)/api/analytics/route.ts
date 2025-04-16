import { baseURL } from '@/service/app.api';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// The base URL should be defined in your environment variables

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    
    if (!jwtToken) {
      console.log('No JWT token found in cookies');
      // For tracking analytics, we'll continue without authentication rather than throwing an error
      // This matches the Flutter implementation where 'track' actions don't trigger token refresh
      // For other actions we would return an unauthorized response
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
    
    // Remove null or empty values (similar to Flutter implementation)
    Object.keys(requestData).forEach(key => {
      const typedKey = key as keyof typeof requestData;
      if (requestData[typedKey] === null || requestData[typedKey] === undefined || requestData[typedKey] === '') {
        delete requestData[typedKey];
      }
    });
    // Log request for debugging (similar to Flutter _logApiAction)
    console.log('Sending Analytics Request:', {
      endpoint: `${baseURL}/analytics`,
      method: 'POST',
      requestData
    });
    
    // Forward the request to the backend API
    const response = await fetch(`${baseURL}/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(jwtToken ? { 'Authorization': `Bearer ${jwtToken}` } : {})
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
