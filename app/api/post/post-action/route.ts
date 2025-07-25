import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    
    // Parse the request body once
    const requestBody = await req.json();
    const { postId, actionType, comment, shareData } = requestBody;

    try {
        // Prepare the body based on action type
        let bodyToSend = {};
        
        if (actionType === 'comment') {
            bodyToSend = { 
                comment: comment 
            };
        } else if (actionType === 'share') {
            bodyToSend = { 
                shareDestination: shareData 
            };
        }
        
        const response = await fetch(`${baseURL}/post-action/${postId}/${actionType}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: Object.keys(bodyToSend).length > 0 ? JSON.stringify(bodyToSend) : undefined,
        });
        
        const data = await response.json();
        console.log('Action response:', data);
        
        return Response.json(data);
    } catch (error) {
        console.error("Error performing post action:", error);
        return Response.json({ error: "Failed to perform action on post" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '30';
    const cursor = url.searchParams.get('cursor');
    const requestBody = await req.json();
    const { postId, actionType } = requestBody;
    
    // Validation
    if (!postId || typeof postId !== 'string') {
        return Response.json({ error: "postId is required and must be a string" }, { status: 400 });
    }
    
    if (!actionType || typeof actionType !== 'string') {
        return Response.json({ error: "actionType is required and must be a string" }, { status: 400 });
    }

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