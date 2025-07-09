import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    
    const { cookieName } = await request.json();

    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    // Create an object with all cookies for easy access
    const cookiesObject = allCookies.reduce((acc, cookie) => {
        acc[cookie.name] = cookie.value;
        return acc;
    }, {} as Record<string, string>);

    // console.log('All cookies:', allCookies);
    // console.log('Cookies object:', cookiesObject);

    // If a specific cookie is requested
    if (cookieName) {
        // Validate cookieName
        if (typeof cookieName !== 'string' || cookieName.trim() === '') {
            return NextResponse.json({ error: 'Invalid cookie name' }, { status: 400 });
        }

        const requestedCookie = cookieStore.get(cookieName);
        // console.log(`Requested cookie: ${cookieName}`, requestedCookie);
        
        if (requestedCookie) {
            return NextResponse.json(
                { name: requestedCookie.name, value: requestedCookie.value },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: `Cookie "${cookieName}" not found` },
                { status: 400 }
            );
        }
    }

    // Return all cookies if no specific cookie is requested
    return NextResponse.json(cookiesObject, { status: 200 });
}