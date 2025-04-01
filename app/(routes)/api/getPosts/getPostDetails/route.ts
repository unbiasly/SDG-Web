
import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    const cookieStore = await cookies(); // Ensure to await the promise
    const jwtToken = cookieStore.get('jwtToken')?.value;

    const url = new URL(req.url);
    const postId = url.searchParams.get('post_id');
    
    

    try {
        const response = await fetch(`${baseURL}/post/?post_id=${postId}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch post details: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return Response.json(data);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
    }

    

}