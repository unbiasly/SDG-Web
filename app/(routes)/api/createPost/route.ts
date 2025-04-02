import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    try {
        const formData = await req.formData();
        
        // Create a new FormData object to send to the backend
        const forwardFormData = new FormData();
        
        // Add content from the request
        const content = formData.get('content');
        if (!content) {
            return NextResponse.json(
                { error: 'Content is required' }, 
                { status: 400 }
            );
        }
        forwardFormData.append('content', content.toString());
        
        // Add all files from the request with the correct field name 'images'
        const files = formData.getAll('images');
        files.forEach(file => {
            if (file instanceof File) {
                forwardFormData.append('images', file);
            }
        });

        const response = await fetch(`${baseURL}/post`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: forwardFormData
        });
        
        // Handle non-JSON responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        } else {
            // Handle non-JSON response (like HTML error pages)
            const text = await response.text();
            console.error("Non-JSON response:", text);
            return NextResponse.json(
                { error: 'Server returned a non-JSON response' }, 
                { status: response.status }
            );
        }
    } catch (error) {
        console.error("api/createPost/route.ts error:", error);
        return NextResponse.json(
            { error: 'Failed to create post' }, 
            { status: 500 }
        );
    }
}
