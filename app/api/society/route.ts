import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    
    // Validate JWT token presence
    if (!jwtToken) {
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }
    
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    
    // Validate cursor parameter if present
    if (cursor && (typeof cursor !== 'string' || cursor.trim() === '')) {
        return NextResponse.json(
            { error: 'Invalid cursor parameter' },
            { status: 400 }
        );
    }
    
    try {
        const url = cursor ? `${baseURL}/sdg-society?cursor=${cursor}` : `${baseURL}/sdg-society`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            },
        });
        
        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch societies: ${response.status}` },
                { status: response.status }
            );
        }
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching societies:", error);
        return NextResponse.json(
            { error: "Failed to fetch societies" },
            { status: 500 }
        );
    }
}