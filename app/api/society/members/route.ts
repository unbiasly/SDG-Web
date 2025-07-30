import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    const userId = searchParams.get('userId');

    try {
        const url = cursor ? `${baseURL}/sdg-society/get-members?userId=${userId}&cursor=${cursor}` : `${baseURL}/sdg-society/get-members?userId=${userId}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'sessionId': sessionId || '',
            },
        });
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching members:", error);
        return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;
    const { id, name, college, designation } = await req.json();
    
    try {
        const response = await fetch(`${baseURL}/sdg-society/member/${id}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
                'sessionId': sessionId || ''
            },
            method: 'PATCH',
            body: JSON.stringify({
                name,
                college,
                designation
            }),
        });
        
        const data = await response.json();
        console.log("Edit member response:", data);
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error editing member:", error);
        return NextResponse.json({ error: "Failed to edit member" });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;

    const contentType = req.headers.get('content-type');
    
    // Handle CSV file upload
    if (contentType?.includes('multipart/form-data')) {
        try {
            const formData = await req.formData();
            const csvFile = formData.get('csv') as File;
            
            if (!csvFile) {
                return NextResponse.json(
                    { error: "No CSV file provided" },
                    { status: 400 }
                );
            }
            
            const uploadFormData = new FormData();
            uploadFormData.append('file', csvFile);
            
            const response = await fetch(`${baseURL}/sdg-society/add-member`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'sessionId': sessionId || ''
                },
                body: uploadFormData,
            });

            const data = await response.json();
            console.log("CSV upload response:", data);

            return NextResponse.json(data, { status: response.status });
        } catch (error) {
            console.error("Error uploading CSV:", error);
            return NextResponse.json({ error: "Failed to upload CSV" }, { status: 500 });
        }
    }
    
    // Handle JSON payload (existing functionality)
    try {
        const { members } = await req.json();

        if (!members || !Array.isArray(members) || members.length === 0) {
            return NextResponse.json(
                { error: "Invalid members data" },
                { status: 400 }
            );
        }
        
        const response = await fetch(`${baseURL}/sdg-society/add-member`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
                'sessionId': sessionId || ''
            },
            body: JSON.stringify({ members }),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error adding members:", error);
        return NextResponse.json({ error: "Failed to add members" }, { status: 500 });
    }
}