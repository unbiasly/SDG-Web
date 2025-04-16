import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// GET endpoint to fetch user career details
export async function GET() {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    
    if (!jwtToken) {
        return NextResponse.json({ error: 'Unauthorized (Token Undefined)', redirectToLogin: true }, { status: 401 });
    }
    
    try {
        const response = await fetch(`${baseURL}/userDetails`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                return NextResponse.json({ error: 'Unauthorized', redirectToLogin: true }, { status: 401 });
            }
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("careerUpdate/route.ts GET error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch career data', redirectToLogin: false }, 
            { status: 500 }
        );
    }
}

// PUT endpoint to update user career details
export async function PUT(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const jwtToken = cookieStore.get('jwtToken')?.value;
        
        if (!jwtToken) {
            return NextResponse.json({ error: 'Unauthorized (Token Undefined)', redirectToLogin: true }, { status: 401 });
        }
        
        // Parse the JSON request body
        const requestData = await req.json();
        
        // Send the request to the backend
        const response = await fetch(`${baseURL}/userDetails`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        } else {
            // Handle non-JSON response
            const text = await response.text();
            console.error("Non-JSON response:", text);
            return NextResponse.json(
                { success: false, message: "Server error occurred", details: text }, 
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error updating career details:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update career details", error: String(error) },
            { status: 500 }
        );
    }
}