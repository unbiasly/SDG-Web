import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const { cursor, jobType, status } = await req.json();
    const jobId = req.nextUrl.searchParams.get('id');
    const limit = 30;

    let queryString = `?limit=${limit}`;
    if (cursor) {
        queryString += `&cursor=${cursor}`;
    }
    if (jobType) {
        queryString += `&jobType=${encodeURIComponent(jobType)}`;
    }
    if (status) {
        queryString += `&status=${encodeURIComponent(status)}`;
    }
    
    try {
        
        const response = await fetch(`${baseURL}/job${jobId ? `/${jobId}` : `${queryString}`}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch jobs: ${response.status}` },
                { status: response.status }
            );
        }
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return NextResponse.json({ error: "Failed to fetch jobs" });
    }
}

export async function PATCH (req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    try {
        const formData = await req.formData();
        // Get jobId from the form data
        const jobId = formData.get('jobId');
        if (!jobId) {
            return NextResponse.json(
                { error: 'Job ID is required' }, 
                { status: 400 }
            );
        }
        const action = formData.get('action');

        // Get answers from the form data
        const answers = formData.get('answers');
        if (!answers) {
            return NextResponse.json(
                { error: 'Answers is required' }, 
                { status: 400 }
            );
        }

        const resume = formData.get('resume');
        if (!resume) {
            return NextResponse.json(
                { error: 'Resume is required' },
                { status: 400 }
            );
        }

        // Create FormData for the new images
        const requestData = new FormData();
        
        // Add the answers
        requestData.append('answers', answers);
        
        
        const response = await fetch(`${baseURL}/job/${jobId}/${action}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: requestData // Removed unnecessary parentheses
        });
        
        // Better error logging with await
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server error response:", errorText);
            throw new Error(`Failed to update post: ${response.status} ${response.statusText}`);
        }
        
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
