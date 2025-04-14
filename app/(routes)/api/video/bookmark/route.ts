import { baseURL } from "@/service/app.api";
import { NextRequest, NextResponse } from "next/server";
export const GET = async (req: NextRequest) => {
    try {

        // Extract query parameters
        const searchParams = req.nextUrl.searchParams;
        const cursor = searchParams.get("cursor") || undefined;
        const limit = parseInt(searchParams.get("limit") || "30", 10);

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

        // Make API call to your backend service
        const response = await fetch(`${baseURL}/sdg-video/bookmark?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${req.cookies.get('jwtToken')?.value}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: data.message || "Failed to fetch bookmarked videos" },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching bookmarked SDG videos:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
};