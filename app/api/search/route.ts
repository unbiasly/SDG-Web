import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { baseURL } from "@/service/app.api";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get("jwtToken")?.value;

    try {
        if (!jwtToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Extract query parameters from the request URL
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");
        const type = searchParams.get("type");
        const page = searchParams.get("page");
        const limit = searchParams.get("limit");
        const recentSearch = searchParams.get("recentSearch");
        const clearSearch = searchParams.get("clearSearch");

        // Validate parameters based on the operation
        if (!recentSearch && !clearSearch && !q) {
            return NextResponse.json(
                { success: false, message: "Search query is required" },
                { status: 400 }
            );
        }

        console.log(`Calling search API with params:`, {
            q,
            type,
            page,
            limit,
            recentSearch,
            clearSearch,
        });

        // Construct API URL using URLSearchParams for proper encoding
        const apiParams = new URLSearchParams();
        if (q) apiParams.append("q", q);
        if (type) apiParams.append("type", type);
        if (page) apiParams.append("page", page);
        if (limit) apiParams.append("limit", limit);
        if (recentSearch) apiParams.append("recentSearch", recentSearch);
        if (clearSearch) apiParams.append("clearSearch", clearSearch);

        const apiUrl = `${baseURL}/search?${apiParams.toString()}`;
        console.log(`API URL: ${apiUrl}`);

        // Make API call
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            },
        });

        // Parse and return the response
        const data = await response.json();
        console.log("Search API response:", data);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Search API error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
