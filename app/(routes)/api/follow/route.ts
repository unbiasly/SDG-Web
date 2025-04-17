import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;;
    const { userId, followingId, action, cursor, limit } = await request.json();

    type action = 'follow' | 'unfollow' | 'following' | 'followers' | 'all';
try {
    if (!jwtToken) {
        return NextResponse.json({ success: false, message: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const response = await fetch(`${baseURL}/follow/?action=${action}&limit=${limit}&cursor=${cursor}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, followingId, })
    });
    
    console.log('response\n', response);

    const data = await response.json();
    return NextResponse.json(data);
} catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error', code: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
}
}
