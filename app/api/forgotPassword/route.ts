
import { baseURL } from '@/service/app.api';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;

    try {
        const body = await request.json();
        
        const response = await fetch(`${baseURL}/forgot-password`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'sessionId': sessionId || ''

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


