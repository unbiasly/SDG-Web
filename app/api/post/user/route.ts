
import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    const limit = 20;
    const cookieStore = await cookies(); // Ensure to await the promise
    const { userId } = await req.json();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const url = new URL(req.url);
    

    try {
        const cursor = url.searchParams.get('cursor') || '';
        const response = await fetch(`${baseURL}/post/?user_id=${userId}&limit=${limit}&cursor=${cursor}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });
        
        const data = await response.json();
        
        return Response.json(data);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
    }

    

}