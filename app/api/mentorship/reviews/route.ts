import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;
    const { searchParams } = new URL(req.url);
    const mentorId = searchParams.get("mentorId");
    try {
        const response = await fetch(`${baseURL}/mentorship/review?mentor_id=${mentorId}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
                'sessionId': sessionId || ''
            },
        });
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching mentors:", error);
        return NextResponse.json({ error: "Failed to fetch mentors" });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;
    const { mentorId, text } = await req.json();
    try {
        const response = await fetch(`${baseURL}/mentorship/review`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
                'sessionId': sessionId || ''
            },
            body: JSON.stringify({ mentor_id : mentorId, text })
        });
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching mentors:", error);
        return NextResponse.json({ error: "Failed to fetch mentors" });
    }
}
