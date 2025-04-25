import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies();

        const cookieRefreshToken = cookieStore.get('refreshToken')?.value;
        if (!cookieRefreshToken) {
            return NextResponse.json(
                { success: false, message: 'No refresh token found' },
                { status: 401 }
            );
        }
        const cookieSessionId = cookieStore.get('sessionId')?.value;
        if (!cookieSessionId) {
            return NextResponse.json(
                { success: false, message: 'No sessionId found' },
                { status: 401 }
            );
        }
        console.log("cookieSessionId:", cookieSessionId);

        const refreshBody = { 
            "refresh_token": cookieRefreshToken,
            "sessionId" : cookieSessionId
        };
        
        // Call your API to refresh the token
        const tokenResponse = await fetch(`${baseURL}/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(refreshBody),
        });
        
        if (!tokenResponse.ok) {
            console.error('External API error:', await tokenResponse.text());
            return NextResponse.json(
                { success: false, message: 'Failed to refresh token from external API' },
                { status: tokenResponse.status }
            );
        }
        
        const tokenData = await tokenResponse.json();
        const { jwtToken, refreshToken, userId } = tokenData;
        
        // Create a new response with the refreshed token
        const response = new NextResponse(
            JSON.stringify({ 
                success: true,
                // Include the expiry time so clients know when to refresh next
                expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes from now
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        
        response.cookies.set({
            name: 'jwtToken',
            value: jwtToken,
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Enable for HTTPS environments
            sameSite: 'strict',
            maxAge: 10 * 60, // 10 minutes in seconds
            path: '/'
        });
        
        response.cookies.set({
            name: 'refreshToken',
            value: refreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Enable for HTTPS environments
            sameSite: 'strict',
            maxAge: 60 * 60, // 1 hour in seconds
            path: '/'
        });
        
        return response;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to refresh token' },
            { status: 500 }
        );
    }
}