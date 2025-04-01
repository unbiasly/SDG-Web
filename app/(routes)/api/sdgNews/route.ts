import { deployedURL } from "@/service/app.api";


export async function GET() {
    const limit = 20;
    // const cursor = 
    const response = await fetch(`${deployedURL}/sdg-news/?limit=${limit}&cursor=`, {
        headers: {
            "Content-Type": "application/json",
        }
    });

    const data = await response.json();
    if (data.pagination.hasMore) {
        const cursor = data.pagination.nextCursor;
    }

    return Response.json({ 
        success: true, 
        data: data.data || [],
        pagination: data.pagination || {}
    });
}