import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    const response = await fetch(`${baseURL}/session`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`,
        },
    });
    const data = await response.json();
    console.log("data", data);

    return NextResponse.json(data);
}


export async function PUT(request:NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    // Parsing the request body
    const { sessionIds } = await request.json();
    
    // Validate that sessionIds is an array
    if (!Array.isArray(sessionIds)) {
        return new Response(JSON.stringify({ error: "sessionIds must be an array" }), { status: 400 });
    }
    
    const response = await fetch(`${baseURL}/session`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ sessionIds }),
    });
    
    const data = await response.json();
    
    
    return NextResponse.json(data);
}