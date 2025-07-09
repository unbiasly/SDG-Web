import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    // Check if user is authenticated
    if (!jwtToken) {
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }

    try {
        const body = await req.json();
        
        // Validate required fields
        const { 
            title, 
            companyName, 
            location, 
            jobType, 
            salaryRange, 
            experienceLevel, 
            description, 
            applyUrl, 
            expiresAt 
        } = body;

        // Check for required fields
        const requiredFields = [
            { field: title, name: 'title' },
            { field: companyName, name: 'companyName' },
            { field: location, name: 'location' },
            { field: jobType, name: 'jobType' },
            { field: salaryRange, name: 'salaryRange' },
            { field: experienceLevel, name: 'experienceLevel' },
            { field: description, name: 'description' },
            { field: applyUrl, name: 'applyUrl' },
            { field: expiresAt, name: 'expiresAt' }
        ];

        const missingFields = requiredFields
            .filter(({ field }) => !field || (typeof field === 'string' && !field.trim()))
            .map(({ name }) => name);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { 
                    error: 'Missing required fields',
                    missingFields: missingFields
                },
                { status: 400 }
            );
        }

        // Validate URL format for applyUrl
        try {
            new URL(applyUrl);
        } catch {
            return NextResponse.json(
                { error: 'Invalid apply URL format' },
                { status: 400 }
            );
        }

        // Validate expiration date
        const expirationDate = new Date(expiresAt);
        const currentDate = new Date();
        
        if (isNaN(expirationDate.getTime()) || expirationDate <= currentDate) {
            return NextResponse.json(
                { error: 'Expiration date must be a valid future date' },
                { status: 400 }
            );
        }

        // Make request to backend API
        const response = await fetch(`${baseURL}/job`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        // Handle response
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            
            if (!response.ok) {
                console.error("Backend API error:", data);
                return NextResponse.json(
                    { 
                        error: data.message || 'Failed to create job',
                        details: data.error || 'Unknown error'
                    },
                    { status: response.status }
                );
            }
            
            return NextResponse.json(data, { status: response.status });
        } else {
            // Handle non-JSON response (like HTML error pages)
            const text = await response.text();
            console.error("Non-JSON response from backend:", {
                status: response.status,
                statusText: response.statusText,
                body: text
            });
            
            return NextResponse.json(
                { 
                    error: 'Server returned an invalid response',
                    statusCode: response.status
                },
                { status: response.status || 500 }
            );
        }
        
    } catch (error) {
        const errorId = `job-create-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        console.error(`[${errorId}] Job creation error:`, {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
            requestInfo: {
                userAgent: req.headers.get('user-agent'),
                ip: req.headers.get('x-forwarded-for') || 'unknown'
            }
        });
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return NextResponse.json(
                { 
                    error: 'Unable to connect to backend service',
                    errorId,
                    retryable: true
                },
                { status: 503 }
            );
        }
        
        return NextResponse.json(
            { 
                error: 'Internal server error occurred while creating job',
                errorId,
                message: process.env.NODE_ENV === 'development' 
                    ? (error instanceof Error ? error.message : 'Unknown error')
                    : 'Something went wrong'
            },
            { status: 500 }
        );
    }
}
