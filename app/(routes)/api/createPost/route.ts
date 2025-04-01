import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const cookieStore = await cookies(); // Ensure to await the promise
    const jwtToken = cookieStore.get('jwtToken')?.value;


    try {
        const { content } = await req.json();
        const postBody = { content };
        const response = await fetch(`${baseURL}/post`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        });
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.log("api/route.ts : ",error)
        return NextResponse.json(
            { error: 'Failed to fetch user data' }, 
            { status: 500 }
        );
    }
}