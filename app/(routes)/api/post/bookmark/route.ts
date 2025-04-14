import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '20';
    const cursor = url.searchParams.get('cursor');

    try {
        const endpoint = new URL(`${baseURL}/post/bookmark`);
        endpoint.searchParams.append('limit', limit);
        if (cursor) {
            endpoint.searchParams.append('cursor', cursor);
        }

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        console.log(data);
        return Response.json(data);
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return Response.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
    }
}