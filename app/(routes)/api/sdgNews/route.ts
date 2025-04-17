
import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    const limit = 20;

    const { userId } = await req.json();
    const response = await fetch(`${baseURL}/sdg-news/?limit=${limit}&userId=${userId}`, {
        headers: {
            "Content-Type": "application/json",
        }
    });

    const data = await response.json();
    // if (data.pagination.hasMore) {
    //     const cursor = data.pagination.nextCursor;
    // }

    return Response.json({ 
        success: true, 
        data: data.data || [],
        pagination: data.pagination || {}
    });
}

export async function PATCH(req: NextRequest) {
    const cookieStore = await cookies(); // Ensure to await the promise
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const { newsId, actionType } = await req.json();


    try {
        const body = (actionType === 'comment' || actionType === 'share') 
            ? await req.json() : undefined; // No body for other action types

        const response = await fetch(`${baseURL}/sdg-news-action/${newsId}/${actionType}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body), // Pass body only if it's defined
        });
        
        // if (!response.ok) {
        //     const errorText = await response.text(); // Get the response text for better error handling
        //     throw new Error(`Failed to fetch newss: ${response.status} ${response.statusText} - ${errorText}`);
        // }
        
        const data = await response.json();
        console.log('Newss data:', data);
        
        return Response.json(data);
    } catch (error) {
        console.error("Error fetching newss:", error);
        return Response.json({ error: "Failed to fetch newss" }, { status: 500 });
    }
}