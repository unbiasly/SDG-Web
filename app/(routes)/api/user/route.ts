import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const cookieStore = await cookies(); // Ensure to await the promise
    const jwtToken = cookieStore.get('jwtToken')?.value;
    if (!jwtToken) {
        return NextResponse.json({ error: 'Unauthorized (Token Undefined)', redirectToLogin: true }, { status: 401 });
    }
    const { userId } = await req.json();
    try {
        const response = await fetch(`${baseURL}/userDetails/?user_id=${userId}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            // Handle unauthorized response from backend
            if (response.status === 401) {
                return NextResponse.json({ error: 'Unauthorized', redirectToLogin: true }, { status: 401 });
            }
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.log("api/route.ts error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch user data', redirectToLogin: true }, 
            { status: 500 }
        );
    }
}