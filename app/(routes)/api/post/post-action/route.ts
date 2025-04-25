import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
    const cookieStore = await cookies(); // Ensure to await the promise
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const { postId, actionType } = await req.json();


    try {
        const body = (actionType === 'comment' || actionType === 'share') 
            ? await req.json() : undefined; // No body for other action types

        const response = await fetch(`${baseURL}/post-action/${postId}/${actionType}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body), // Pass body only if it's defined
        });
        
        // if (!response.ok) {
        //     const errorText = await response.text(); // Get the response text for better error handling
        //     throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText} - ${errorText}`);
        // }
        
        const data = await response.json();
        console.log('Posts data:', data);
        
        return Response.json(data);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies(); // Ensure to await the promise
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '30';
    const cursor = url.searchParams.get('cursor');
    const { postId, actionType } = await req.json();


    try {
        const response = await fetch(`${baseURL}/post-action/${postId}/${actionType}?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });
        
        const data = await response.json();
        console.log('Comments data:', data);
        
        return Response.json(data);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return Response.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}