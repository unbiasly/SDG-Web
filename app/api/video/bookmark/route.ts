import { baseURL } from "@/service/app.api";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req: NextRequest) => {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    try {

        // Extract query parameters
        const searchParams = req.nextUrl.searchParams;
        const cursor = searchParams.get("cursor") || undefined;
        const limit = parseInt(searchParams.get("limit") || "30", 10);


        // Build the query string
        let queryString = `limit=${limit}`;
        if (cursor) queryString += `&cursor=${cursor}`;

        // Make API call to your backend service
        const response = await fetch(`${baseURL}/sdg-video/bookmark?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            }
        });

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching bookmarked SDG videos:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
};