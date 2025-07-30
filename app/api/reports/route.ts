import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;
    const searchParams = req.nextUrl.searchParams;
    const limit = 30;
    const cursor = searchParams.get('cursor');
    const type = searchParams.get('type');
    let queryString = `?limit=${limit}`;
    if (cursor) {
        queryString += `&cursor=${cursor}`;
    }
    if (type) {
        queryString += `&type=${type}`;
    }
    try {
        const response = await fetch(`${baseURL}/sdg-report${queryString}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
                'sessionId': sessionId || ''
            },
        });
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching SDG reports:", error);
        return NextResponse.json({ error: "Failed to fetch SDG reports" });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;

    try {
        const formData = await req.formData();
        
        // Create a new FormData object to send to the backend
        const forwardFormData = new FormData();
        
        // Add title from the request
        const title = formData.get('title');
        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' }, 
                { status: 400 }
            );
        }
        forwardFormData.append('title', title.toString());

        // Add category from the request
        const category = formData.get('category');
        if (!category) {
            return NextResponse.json(
                { error: 'Category is required' }, 
                { status: 400 }
            );
        }
        forwardFormData.append('category', category.toString());
        
        // Add report file from the request
        const reportFile = formData.get('report_file');
        if (!reportFile || !(reportFile instanceof File)) {
            return NextResponse.json(
                { error: 'Report file is required' }, 
                { status: 400 }
            );
        }
        forwardFormData.append('report_file', reportFile);

        // Add thumbnail image if provided
        const thumbnailFile = formData.get('thumbnail');
        if (thumbnailFile && thumbnailFile instanceof File) {
            forwardFormData.append('thumbnail', thumbnailFile);
        }

        const response = await fetch(`${baseURL}/sdg-reports`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'sessionId': sessionId || ''
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
        console.error("api/reports/route.ts error:", error);
        return NextResponse.json(
            { error: 'Failed to create SDG report' }, 
            { status: 500 }
        );
    }
}