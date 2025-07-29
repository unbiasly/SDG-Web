import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    if (!jwtToken) {
        return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
        );
    }
    
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    
    try {
        const url = cursor ? `${baseURL}/sdg-society/student-requests?cursor=${cursor}` : `${baseURL}/sdg-society/student-requests`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            },
        });
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching student requests:", error);
        return NextResponse.json({ error: "Failed to fetch student requests" });
    }
}

export async function PATCH(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const { id, type } = await req.json();
    if (!id || !type) {
        return NextResponse.json(
            { error: "Missing required fields: id and type" },
            { status: 400 }
        );
    }
    
    if (!jwtToken) {
        return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
        );
    }

    if (typeof id !== 'string' || typeof type !== 'string') {
        return NextResponse.json(
            { error: "Invalid field types: id and type must be strings" },
            { status: 400 }
        );
    }

    if (!['accept', 'reject'].includes(type)) {
        return NextResponse.json(
            { error: "Invalid type: must be either 'accept' or 'reject'" },
            { status: 400 }
        );
    }
    try {
        const response = await fetch(`${baseURL}/sdg-society/verify-or-reject/${id}?type=${type}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            },
            method: 'PATCH',
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error verifying or rejecting request:", error);
        return NextResponse.json({ error: "Failed to verify or reject request" });
    }
}