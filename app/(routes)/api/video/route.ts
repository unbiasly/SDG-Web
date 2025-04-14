import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// GET /v1/sdg-video
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
            method: "GET",
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
        // const { video_id, type } = params;
        
        // if (!video_id || !type) {
        //     return NextResponse.json(
        //         { success: false, message: "Video ID and action type are required" },
        //         { status: 400 }
        //     );
        // }

        // Extract video_id and type from URL path
        const url = new URL(req.url);
        const pathParts = url.pathname.split('/');
        const video_id = pathParts[pathParts.length - 2];
        const type = pathParts[pathParts.length - 1];
        
        if (!video_id || !type) {
            return NextResponse.json(
                { success: false, message: "Video ID and action type are required" },
                { status: 400 }
            );
        }

        // Validate action type
        const validActionTypes = ["like", "dislike", "bookmark", "unbookmark"];
        if (!validActionTypes.includes(type)) {
            return NextResponse.json(
                { success: false, message: "Action type not allowed" },
                { status: 404 }
            );
        }

        // Make API call to your backend service
        const response = await fetch(`${baseURL}/sdg-video-action/${video_id}/${type}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer `
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




