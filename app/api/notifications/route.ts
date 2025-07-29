import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const body = await req.json();
    const { limit, cursor, category } = body;
    
    let queryString = `limit=${limit}`;
        if (cursor) queryString += `&cursor=${cursor}`;
        if (category) queryString += `&category=${category}`;


    try {
        
        const response = await fetch(`${baseURL}/notification/?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" });
    }
}

export async function PUT(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const body = await req.json();
    const { notificationId } = body;

    try {
        const response = await fetch(`${baseURL}/notification/${notificationId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error updating notification:", error);
        return NextResponse.json({ error: "Failed to update notification" });
    }
}