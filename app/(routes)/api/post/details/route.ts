import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const cookieStore = await cookies(); // Ensure to await the promise
    const jwtToken = cookieStore.get('jwtToken')?.value;

        if (!jwtToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const postId = body.postId; // Assuming postId is sent in the request body

        if (!postId) {
            return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
        }
    try {
        // Make a GET request to fetch post details
        const response = await fetch(`${baseURL}/post/?post_id=${postId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Failed to fetch post details" }));
            return NextResponse.json(
                { error: errorData.message || "Failed to fetch post details" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("[GET_POST_DETAILS_ERROR]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}