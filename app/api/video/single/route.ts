import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const jwtToken = cookieStore.get('jwtToken')?.value;
        // Extract query parameters
        const searchParams = req.nextUrl.searchParams;
        const cursor = searchParams.get("cursor") || undefined;
        const limit = parseInt(searchParams.get("limit") || "30", 10);

        const { userId, type, videoId } = await req.json();

        // Build the query string
        let queryString = `limit=${limit}`;
        if (cursor) queryString += `&cursor=${cursor}`;
        if (videoId) queryString += `&video_id=${videoId}`;
        if (userId) queryString += `&userId=${userId}`;
        if (type) queryString += `&type=${type}`;

        // Make API call to backend
        const response = await fetch(`${baseURL}/sdg-video?${queryString}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: data.message || "Failed to fetch videos" },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching SDG videos:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
