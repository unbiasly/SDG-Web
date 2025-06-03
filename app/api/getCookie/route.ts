import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    
    const { cookieName } = await request.json();


    if (!cookieName) {
        return NextResponse.json({ error: 'Cookie name "name" is required in the request body' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const requestedCookie = cookieStore.get(`${cookieName}`);
    console.log(`Requested cookie: ${cookieName}`, requestedCookie);

    if (requestedCookie) {
        return NextResponse.json({ name: requestedCookie.name, value: requestedCookie.value }, { status: 200 });
    } else {
        return NextResponse.json({ error: `Cookie "${cookieName}" not found` });
    }
}