import { baseURL } from '@/service/app.api';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('sessionId')?.value;
        
        const response = await fetch(`${baseURL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'sessionId': sessionId || ''
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return NextResponse.json(
            data,
            {
                status: response.status,
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}


