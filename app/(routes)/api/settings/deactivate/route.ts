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

    return new Response(JSON.stringify(data), { status: response.status });
}