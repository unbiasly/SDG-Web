import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";

export async function DELETE() {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    
    const response = await fetch(`${baseURL}/deactivate`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`,
        },
    });

    const data = await response.json();
    if (data.success) {
        // Clear the cookies
        cookieStore.delete('jwtToken');
        cookieStore.delete('refreshToken');
        cookieStore.delete('sessionId');
    }

    return Response.json(data);
}