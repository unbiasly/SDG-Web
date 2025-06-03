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
        
        if (!response.ok) {
            const errorText = await response.text();
            return Response.json(
                { error: `Server responded with ${response.status}: ${errorText}` }, 
                { status: response.status }
            );
        }
        
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
    const { postId, actionType } = await req.json();

    try {
        const response = await fetch(`${baseURL}/post-action/${postId}/${actionType}?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            return Response.json(
                { error: `Server responded with ${response.status}: ${errorText}` }, 
                { status: response.status }
            );
        }
        
        const data = await response.json();
        console.log('Comments data:', data);
        
        return Response.json(data);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return Response.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}