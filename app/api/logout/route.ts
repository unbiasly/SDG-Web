import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;

    let backendResponseMessage = "Logout initiated";

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

            // Consider logout successful for cookie clearing if backend says OK, or session already invalid
            if (apiResponse.ok || apiResponse.status === 401 || apiResponse.status === 403) {
                if (apiResponse.status !== 204) { // 204 has no body
                    try {
                        const data = await apiResponse.json();
                        console.log("Backend logout response:", data);
                        backendResponseMessage = data.message || `Backend logout status: ${apiResponse.status}`;
                    } catch (e) {
                        console.log("Backend logout response (not JSON or empty):", apiResponse.status);
                        backendResponseMessage = `Backend logout status: ${apiResponse.status}`;
                    }
                } else {
                     console.log("Backend logout successful with 204 No Content");
                     backendResponseMessage = "Backend logout successful (204)";
                }
            } else {
                // Backend logout failed with an unexpected error
                const errorText = await apiResponse.text().catch(() => `Backend logout failed with status: ${apiResponse.status}`);
                console.error('Backend logout failed:', apiResponse.status, errorText);
                backendResponseMessage = `Backend logout failed: ${errorText}`;
            }
        } else {
            backendResponseMessage = "No session found to logout from backend, clearing local cookies.";
            console.log(backendResponseMessage);
        }

        // Always attempt to clear cookies and return a success response for the /api/logout route itself
        const response = new NextResponse(
            JSON.stringify({ success: true, message: "Cookies cleared. " + backendResponseMessage }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // CRITICAL: Match cookie setting
            sameSite: 'lax' as 'lax', // Explicitly type sameSite
            maxAge: 0, // Expire immediately
            path: '/'
        };

        response.cookies.set('jwtToken', '', cookieOptions);
        response.cookies.set('refreshToken', '', cookieOptions);
        response.cookies.set('sessionId', '', cookieOptions);
        response.cookies.set('userId', '', cookieOptions); // Assuming userId cookie also needs clearing

        console.log("Cookies cleared, returning 200 from /api/logout");
        return response;

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
        errorResponse.cookies.set('jwtToken', '', fallbackCookieOptions);
        errorResponse.cookies.set('refreshToken', '', fallbackCookieOptions);
        errorResponse.cookies.set('sessionId', '', fallbackCookieOptions);
        errorResponse.cookies.set('userId', '', fallbackCookieOptions);
        return errorResponse;
    }
}