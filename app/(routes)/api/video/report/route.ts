import { NextRequest, NextResponse } from "next/server";
import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";

// POST /v1/sdg-video/report/:video_id
export async function POST(req: NextRequest) {

    const cookieStore = await cookies();
    const jwtToken = cookieStore.get("jwtToken")?.value;
    try {
        const body = await req.json();
        const { reason, report_category, id } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
          }
          
          // Check if at least one of reason or report_category is provided
          if (!reason && !report_category) {
            return NextResponse.json({ 
              error: "Either reason or report_category must be provided" 
            }, { status: 400 });
          }
          
          // Make API call to report the post
          const response = await fetch(`${baseURL}/sdg-video/report/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
              ...(reason && { reason }),
              ...(report_category && { report_category })
            })
          });

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: "Failed to submit report" },
                { status: response.status }
            );
        }
        const data = await response.json();
        

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