import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// POST /v1/sdg-video
export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const jwtToken = cookieStore.get('jwtToken')?.value;
        // Extract query parameters
        const searchParams = req.nextUrl.searchParams;
        const cursor = searchParams.get("cursor") || undefined;
        const limit = parseInt(searchParams.get("limit") || "30", 10);

        const { userId, type } = await req.json();

        // Validate limit
        if (isNaN(limit) || limit <= 0) {
            return NextResponse.json(
                { success: false, message: "Invalid limit parameter" },
                { status: 400 }
            );
        }



        // Build the query string
        let queryString = `limit=${limit}`;
        if (cursor) queryString += `&cursor=${cursor}`;
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

// PATCH /v1/sdg-video-action/:video_id/:type
export async function PATCH(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const jwtToken = cookieStore.get('jwtToken')?.value;

        // Extract video_id and type from URL path
        const url = new URL(req.url);
        const {videoId, actionType} = await req.json();
        
        if (!videoId || !actionType) {
            return NextResponse.json(
                { success: false, message: "Video ID and action type are required" },
                { status: 400 }
            );
        }

        // Validate action type
        const validActionTypes = ["like", "dislike", "bookmark" ];
        if (!validActionTypes.includes(actionType)) {
            return NextResponse.json(
                { success: false, message: "Action type not allowed" },
                { status: 404 }
            );
        }

        // Make API call to your backend service
        const response = await fetch(`${baseURL}/sdg-video-action/${videoId}/${actionType}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: data.message || "Failed to perform action" },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Action performed successfully"
        });
    } catch (error) {
        console.error("Error performing action on SDG video:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}




