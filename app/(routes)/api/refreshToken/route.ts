import BackAPI from "@/service/app.api";
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

        const refreshBody = { 
            "refresh_token": cookieRefreshToken 
        };
        
        // Call your API to refresh the token
        const tokenResponse = await BackAPI.fetchTokenResponse(refreshBody);
        console.log("refreshToken: ", tokenResponse);
        
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
        
        const { jwtToken, refreshToken } = tokenResponse;
        
        response.cookies.set({
            name: 'jwtToken',
            value: jwtToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 10 * 60, // 10 minutes in seconds
            path: '/'
        });
        
        if (refreshToken) {
            response.cookies.set({
                name: 'refreshToken',
                value: refreshToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60, // 1 hour in seconds
                path: '/'
            });
        }
        
        return response;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to refresh token' },
            { status: 500 }
        );
    }
}