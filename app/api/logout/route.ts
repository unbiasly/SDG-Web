import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;

    try {
        if (jwtToken && sessionId) {
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
            

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as 'lax',
            maxAge: 0,
            path: '/'
        };

        cookieStore.set('jwtToken', '', cookieOptions);
        cookieStore.set('refreshToken', '', cookieOptions);
        cookieStore.set('sessionId', '', cookieOptions);
        cookieStore.set('userId', '', cookieOptions);

        console.log("Cookies cleared, returning 200 from /api/logout");
        return NextResponse.json({ success: true, message: 'Logged out successfully ', data }, { status: 200 });
        }

    } catch (error: any) {
        console.error('Error during logout process in /api/logout:', error.message);
        // Even in case of an unexpected error, try to clear cookies as a fallback.
        const errorResponse = new NextResponse(
            JSON.stringify({ success: false, message: 'Failed to logout due to server error during cookie clearing: ' + error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
        const fallbackCookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as 'lax',
            maxAge: 0,
            path: '/'
        };
        cookieStore.set('jwtToken', '', fallbackCookieOptions);
        cookieStore.set('refreshToken', '', fallbackCookieOptions);
        cookieStore.set('sessionId', '', fallbackCookieOptions);
        cookieStore.set('userId', '', fallbackCookieOptions);
        return errorResponse;
    }
}