import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const searchParams = req.nextUrl.searchParams;
    const limit = searchParams.get('limit') || 20;
    const cursor = searchParams.get('cursor') || '';
    
    try {
        
        const response = await fetch(`${baseURL}/post/?limit=${limit}&cursor=${cursor}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

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

export async function PUT(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    try {
        const formData = await req.formData();
        // Get postId from the form data
        const postId = formData.get('postId');
        if (!postId) {
            return NextResponse.json(
                { error: 'Post ID is required' }, 
                { status: 400 }
            );
        }

        // Get content from the form data
        const content = formData.get('content')?.toString() || '';
        if (!content) {
            return NextResponse.json(
                { error: 'Content is required' }, 
                { status: 400 }
            );
        }

        // Get the deleteImageUrls from the form data
        const deleteImageUrlsRaw = formData.get('deleteImageUrls');
        let deleteImageUrls = [];
        if (deleteImageUrlsRaw) {
            const parsed = JSON.parse(deleteImageUrlsRaw.toString());
            deleteImageUrls = Array.isArray(parsed) ? parsed : [parsed];
        }
        console.log("deleteImageUrls\n", deleteImageUrls);
        // Create FormData for the new images
        const requestData = new FormData();
        
        // Add the content
        requestData.append('content', content);
        
        // Use array notation in field names to ensure the backend receives it as an array
        deleteImageUrls.forEach((url, index) => {
            requestData.append(`deleteImageUrls[${index}]`, url);
        });

        console.log(requestData);
        
        // Add any new images (files)
        const newImageFiles = formData.getAll('images');
        newImageFiles.forEach(file => {
            if (file instanceof File) {
                requestData.append('images', file);
            }
        });
        
        const response = await fetch(`${baseURL}/post/${postId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: (requestData)
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
        console.error("api/createPost/route.ts PUT error:", error);
        return NextResponse.json(
            { error: 'Failed to update post' }, 
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    const { postId } = await req.json();
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    if (!jwtToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${baseURL}/post/${postId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    console.log(response.json())
    return NextResponse.json({ message: "Post deleted" });
}