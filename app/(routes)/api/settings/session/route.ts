import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    const response = await fetch(`${baseURL}/session`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`,
        },
    });
    const data = await response.json();

    if (!response.ok) {
        return new Response(JSON.stringify(data), { status: response.status });
    }



    


    return new Response(JSON.stringify({ message: "Session data" }), { status: 200 });
}


export async function PUT(request:NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    // Removing User Sessions
    const { sessionIds } = await request.json();
    const response = await fetch(`${baseURL}/session`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ sessionIds }),
    });
    const data = await response.json();

    if (!response.ok) {
        return new Response(JSON.stringify(data), { status: response.status });
    }
    return new Response(JSON.stringify({ message: "Session updated" }), { status: 200 });
}