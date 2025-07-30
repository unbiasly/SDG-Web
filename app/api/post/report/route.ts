import { NextRequest, NextResponse } from "next/server";
import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const jwtToken = cookieStore.get("jwtToken")?.value;
        const sessionId = cookieStore.get("sessionId")?.value;

        if (!jwtToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { reason, report_category, id } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if at least one of reason or report_category is provided
        if (!reason && !report_category) {
            return NextResponse.json(
                {
                    error: "Either reason or report_category must be provided",
                },
                { status: 400 }
            );
        }

        // Make API call to report the post
        const response = await fetch(`${baseURL}/post/report/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
                'sessionId': sessionId || "",
            },
            body: JSON.stringify({
                ...(reason && { reason }),
                ...(report_category && { report_category }),
            }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("[REPORT_POST_ERROR]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
