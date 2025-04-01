import { UserDetailsRequest } from "@/service/api.interface";
import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const body = await (req.json()) as UserDetailsRequest;
        const cookieStore = await cookies(); // Ensure to await the promise
        const jwtToken = cookieStore.get('jwtToken')?.value;

        const response = await fetch(`${baseURL}/userDetails`,
            {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
                },
                body : JSON.stringify(body)
            }
        );

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error updating user details:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update user details" },
            { status: 500 }
        );
    }
}