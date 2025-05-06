

import { baseURL } from '@/service/app.api';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    
  try {
    if (!jwtToken) {
      console.log('No JWT token found in cookies');
    }
    
    // Parse the request body
    const { identifier, value, page, keyword } = await req.json();
    
    // Prepare request data, removing null or empty values
    const requestData = {
        identifier,
        value,
        page,
        keyword
    };
    console.log(JSON.stringify(requestData));
    
    
    
    // Forward the request to the backend API
    const response = await fetch(`${baseURL}/scheme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(requestData),
    });
    
    // Log response for debugging
    console.log('Scheme Data Response:', {
      response
    });
    
    // Get the response data
    const responseData = await response.json();
    
    // Return the backend response with the same status code
    return NextResponse.json(responseData, { status: response.status });
    
  } catch (error) {
    console.error("Scheme Data API Proxy Error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
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