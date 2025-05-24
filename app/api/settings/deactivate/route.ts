import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"; // Import NextResponse

export async function DELETE() {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    // Prepare the response object early to set cookies on it
    let apiResponseData;
    let apiStatus = 200;

    try {
        const backendApiResponse = await fetch(`${baseURL}/deactivate`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
        });

        apiResponseData = await backendApiResponse.json();
        apiStatus = backendApiResponse.status;

        const response = NextResponse.json(apiResponseData, { status: apiStatus });

        if (apiResponseData.success || backendApiResponse.ok) { // Check for success from backend
            console.log("Account deactivation successful or backend responded OK, clearing cookies.");
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as 'lax',
                maxAge: 0, // Expire immediately
                path: '/'
            };

            response.cookies.set('jwtToken', '', cookieOptions);
            response.cookies.set('refreshToken', '', cookieOptions);
            response.cookies.set('sessionId', '', cookieOptions);
            response.cookies.set('userId', '', cookieOptions); // Assuming userId cookie also needs clearing
        } else {
            console.error("Account deactivation failed on backend:", apiStatus, apiResponseData);
        }
        return response;

    } catch (error: any) {
        console.error('Error during account deactivation process:', error.message);
        const errorResponse = NextResponse.json(
            { success: false, message: 'Failed to deactivate account due to server error: ' + error.message },
            { status: 500 }
        );
        // Attempt to clear cookies even in case of an unexpected error during the process
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