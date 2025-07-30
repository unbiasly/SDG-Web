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
        const response = await fetch(`${baseURL}/mentorship/slot?mentor_id=${mentorId}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
                'sessionId': sessionId || ''
            },
        });
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching mentor slots:", error);
        return NextResponse.json({ error: "Failed to fetch mentor slots" });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;
    const { mentor_id, time, duration } = await req.json();
    try {
        const response = await fetch(`${baseURL}/mentorship/slot`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
                'sessionId': sessionId || ''
            },
            body: JSON.stringify({ mentor_id, time, duration })
        });
        
        const data = await response.json();
        console.log("Slot created successfully:", data);
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error creating slot:", error);
        return NextResponse.json({ error: "Failed to create slot" });
    }
}

export async function PUT(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;
    const { slot_id, category_id } = await req.json();


    try {
        const response = await fetch(`${baseURL}/mentorship/slot/book`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
                'sessionId': sessionId || ''
            },
            body: JSON.stringify({ slot_id, category_id })
        });
        const data = await response.json();
        console.log("Slot booked successfully:", data);
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error booking slot:", error);
        return NextResponse.json({ error: "Failed to book slot" });
    }
}
