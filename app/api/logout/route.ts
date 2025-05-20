import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;;
    try {
        // Create a response that clears the auth cookies
        const apiResponse = await fetch(`${baseURL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ sessionId: sessionId })
        });

        const data = await apiResponse.json();
        console.log("Logout response:", data);

        if (apiResponse.status === 204 || 200) {
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
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0, // Expire immediately
            path: '/'
        });
        
        // Clear the refresh token cookie
        response.cookies.set({
            name: 'refreshToken',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0, // Expire immediately
            path: '/'
        });
        response.cookies.set({
            name: 'sessionId',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0, // Expire immediately
            path: '/'
        });
        return response;
    } else {
        console.error('Logout failed:', apiResponse.statusText);
        return NextResponse.json(
            { success: false, message: 'Failed to logout' },
            { status: 500 }
        )
    }
    } catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to logout' },
            { status: 500 }
        )
    }
        }