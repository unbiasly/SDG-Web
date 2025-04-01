
import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies(); // Ensure to await the promise
    const jwtToken = cookieStore.get('jwtToken')?.value;
    if (!jwtToken) {
        return NextResponse.json({ error: 'Unauthorized (Token Undefined)' }, { status: 401 });
    }
    
    try {
        const response = await fetch(`${baseURL}/userDetails`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.log("api/route.ts :",error)
        window.location.href="/login"
        return NextResponse.json(
            { error: 'Failed to fetch user data' }, 
            { status: 500 }
        );
    }
}


