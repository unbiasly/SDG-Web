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

export async function PATCH(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const urlParams = req.nextUrl.searchParams;
    const jobId = urlParams.get('jobId');
    const action = urlParams.get('action');

    // Authentication check
    if (!jwtToken) {
        return NextResponse.json(
            { error: 'Authentication required' }, 
            { status: 401 }
        );
    }

    // Validation checks
    if (!jobId) {
        return NextResponse.json(
            { error: 'Job ID is required' }, 
            { status: 400 }
        );
    }

    if (!action) {
        return NextResponse.json(
            { error: 'Action is required' }, 
            { status: 400 }
        );
    }

    try {

        // Only process form data if action is 'applied'
        if (action === 'applied') {
            const formData = await req.formData();
            
            const answers = formData.get('answers');
            if (!answers) {
                return NextResponse.json(
                    { error: 'Answers are required' }, 
                    { status: 400 }
                );
            }

            const resume = formData.get('resume');
            if (!resume || !(resume instanceof File)) {
                return NextResponse.json(
                    { error: 'Resume file is required' },
                    { status: 400 }
                );
            }

            // Create FormData for the request
            const requestBody = new FormData();
            requestBody.append('answers', answers);
            requestBody.append('file', resume);
            
            const response = await fetch(`${baseURL}/job/${jobId}/${action}`, {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: requestBody
            });
        }
        const response = await fetch(`${baseURL}/job/${jobId}/${action}`, {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });


        const data = await response.json();
        console.log("api/jobs/route.ts PATCH response:", data);

        // Handle successful response
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return NextResponse.json(data, { status: response.status });
        } else {
            const text = await response.text();
            console.error("Non-JSON response:", text);
            return NextResponse.json(
                { error: 'Server returned a non-JSON response' }, 
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error("api/jobs/route.ts PATCH error:", error);
        return NextResponse.json(
            { error: 'Internal server error occurred while processing application' },
            { status: 500 }
        );
    }
}

