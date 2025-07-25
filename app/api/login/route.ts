import { baseURL } from '@/service/app.api';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const response = await fetch(`${baseURL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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


