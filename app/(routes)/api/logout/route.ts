import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Create a response that clears the auth cookies
        const response = new NextResponse(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        
        // Clear the JWT token cookie
        response.cookies.set({
            name: 'jwtToken',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Expire immediately
            path: '/'
        });
        
        // Clear the refresh token cookie
        response.cookies.set({
            name: 'refreshToken',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Expire immediately
            path: '/'
        });
        response.cookies.set({
            name: 'sessionId',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Expire immediately
            path: '/'
        });
        return response;
    } catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to logout' },
            { status: 500 }
        )
    }
        }