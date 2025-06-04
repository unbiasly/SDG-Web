import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    try {
        const body = await req.json();
        
        // Validate required fields
        const { title, companyName, location, jobType, salaryRange, experienceLevel, description, applyUrl } = body;
        
        if (!title || !companyName || !location || !jobType || !salaryRange || !experienceLevel || !description || !applyUrl) {
            return NextResponse.json(
                { error: 'Missing required fields' }, 
                { status: 400 }
            );
        }

        const response = await fetch(`${baseURL}/job`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
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
        console.error("api/jobs/create/route.ts error:", error);
        return NextResponse.json(
            { error: 'Failed to create job' }, 
            { status: 500 }
        );
    }
}
