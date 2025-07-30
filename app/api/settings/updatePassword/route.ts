import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;
    const { newPassword, oldPassword } = await request.json();
    
    if (!newPassword || !oldPassword) {
        return new Response(JSON.stringify({ message: "Please provide all the fields" }), {
        status: 400,
        });
    }
    console.log("newPassword", newPassword);
    console.log("oldPassword", oldPassword);
    
    const response = await fetch(`${baseURL}/update-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`,
            'sessionId': sessionId || ''

        },
        body: JSON.stringify({ 
            newPassword, 
            existingPassword: oldPassword 
        }),
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), { status: response.status });
    }