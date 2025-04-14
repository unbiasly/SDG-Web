import { NextRequest, NextResponse } from "next/server";
import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    
    if (!jwtToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { reason, report_category, postId } = body;
    
    if (!postId || (!reason && !report_category)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Make API call to report the post
    const response = await fetch(`${baseURL}/post/report/${postId}`, {
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
      const errorData = await response.json().catch(() => ({ message: "Failed to report post" }));
      return NextResponse.json(
        { error: errorData.message || "Failed to report post" },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("[REPORT_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}