import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    
    // Parse the request body once
    const requestBody = await req.json();
    const { postId, actionType, comment } = requestBody;

    try {
        let body = undefined;
        if (actionType === 'comment') {
            body = { comment };
        } else if (actionType === 'share') {
            body = requestBody; // Or extract specific share data if needed
        }

        const response = await fetch(`${baseURL}/post-action/${postId}/${actionType}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        
        const data = await response.json();
        console.log('Action response:', data);
        
        return Response.json(data);
    } catch (error) {
        console.error(`Error performing ${actionType}:`, error);
        return Response.json({ error: `Failed to ${actionType}` }, { status: 500 });
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