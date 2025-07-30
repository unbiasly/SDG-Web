
import { baseURL } from '@/service/app.api';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('sessionId')?.value;
        const { token, email, newPassword } = body;
        const response = await fetch(`${baseURL}/reset-password`, {
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
        console.error('Reset Password error:', error);
        return Response.json(
            {
                success: false,
                message: 'Route Server error',
            },
            { status: 500 }
        );
    }
}


