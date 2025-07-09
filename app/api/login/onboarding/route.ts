import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    if (!jwtToken) {
        return Response.json(
            { success: false, message: 'Authentication required' },
            { status: 401 }
        );
    }
    
    if (!jwtToken) {
        return Response.json(
            { success: false, message: 'Authentication required' },
            { status: 401 }
        );
    }
    try {
        
        const response = await fetch(`${baseURL}/role`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        });

        const data = await response.json();

        return Response.json(data, {status: response.status});
    } catch (error) {
        console.error('Role Fetch error:', error);
        return Response.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    try {
        
        const request = await req.json();
        const { role_type, name, phone, email, college, society_id, designation, ministry, posting, department, uid } = request;

if (!role_type || !name || !phone || !email) {
    return Response.json(
        { success: false, message: 'Missing required fields: role_type, name, phone, email' },
        { status: 400 }
    );
}

        const response = await fetch(`${baseURL}/role-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
                role_type,
                name,
                phone,
                email,
                ...(college && { college }),
                ...(society_id && { society_id }),
                ...(designation && { designation }),
                ...(ministry && { ministry }),
                ...(posting && { posting }),
                ...(department && { department }),
                ...(uid && { uid }),
            }),
        });
        console.log('request body:', request);

        const data = await response.json();

        return Response.json(data, {status: response.status});
    } catch (error) {
        console.error('Role Fetch error:', error);
        return Response.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
    }
}