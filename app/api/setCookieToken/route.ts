import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Parse the JSON body
        const body = await req.json();
        const { jwtToken, refreshToken, sessionId, userId } = body;
        
        // Create a new response
        const response = new NextResponse(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        
        // Set cookies properly
        response.cookies.set({
            name: 'jwtToken',
            value: jwtToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 1 week in seconds
            path: '/'
        });
        
        if (refreshToken) {
            response.cookies.set({
                name: 'refreshToken',
                value: refreshToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only secure in production
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60, // 1 week in seconds
                path: '/'
            });
        }
        if (sessionId) {
            response.cookies.set({
                name: 'sessionId',
                value: sessionId,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only secure in production
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60, // 1 week in seconds
                path: '/'
        })}
        if (userId) {
            response.cookies.set({
                name: 'userId',
                value: userId,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only secure in production
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60, // 1 week in seconds
                path: '/'
            });
        }

        
        return response;
    } catch (error) {
        console.error('Error setting cookies:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to set cookies' },
            { status: 500 }
        );
    }
}
