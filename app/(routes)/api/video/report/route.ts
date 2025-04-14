import { NextRequest, NextResponse } from "next/server";
import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";

// POST /v1/sdg-video/report/:video_id
export async function POST(req: NextRequest) {
    try {

        // Extract video_id from URL path
        const url = new URL(req.url);
        const pathParts = url.pathname.split('/');
        // Check if the path contains "report" and get the video_id
        const reportIndex = pathParts.findIndex(part => part === "report");
        const video_id = reportIndex >= 0 && reportIndex < pathParts.length - 1 
            ? pathParts[reportIndex + 1] 
            : null;
        
        if (!video_id) {
            return NextResponse.json(
                { success: false, message: "Video ID is required" },
                { status: 400 }
            );
        }

        const body = await req.json();

        // Make API call to your backend service
        const response = await fetch(`${baseURL}/sdg-video/report/${video_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer `
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: data.message || "Failed to submit report" },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Report submitted successfully"
        });
    } catch (error) {
        console.error("Error reporting SDG video:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}