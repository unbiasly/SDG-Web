
import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    const limit = 20;
    const cookieStore = await cookies(); // Ensure to await the promise
    const jwtToken = cookieStore.get('jwtToken')?.value;
    

    try {
        const response = await fetch(`${baseURL}/post/?limit=${limit}&cursor=`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return Response.json(data);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
    }

    

}