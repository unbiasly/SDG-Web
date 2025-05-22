
import { baseURL } from '@/service/app.api';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const response = await fetch(`${baseURL}/forgot-password`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        const data = await response.json()

        return Response.json(data);
    } catch (error) {
        console.error('Forgot Password error:', error);
        return Response.json(
            {
                success: false,
                message: 'Route Server error',
            },
            { status: 500 }
        );
    }
}


