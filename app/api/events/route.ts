import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    const searchParams = req.nextUrl.searchParams;
    // Validate and sanitize limit parameter
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10), 1), 100) : 30;
    if (limitParam && (isNaN(limit) || limit < 1 || limit > 100)) {
        return NextResponse.json(
            { error: 'Invalid limit parameter. Must be a number between 1 and 100.' },
            { status: 400 }
        );
    }

    // Get and validate other parameters
    const cursor = searchParams.get('cursor') || '';
    const user_id = searchParams.get('user_id') || '';
    const event_id = searchParams.get('event_id') || '';
    const type = searchParams.get('type') || '';
    
    // Validate type parameter if provided
    if (type && !['event', 'talk'].includes(type)) {
        return NextResponse.json(
            { error: 'Invalid type parameter. Must be "event" or "talk".' },
            { status: 400 }
        );
    }
    
    try {
        // Build query string with proper URL encoding
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        
        if (cursor) {
            params.append('cursor', cursor);
        }
        if (user_id) {
            params.append('user_id', user_id);
        }
        if (event_id) {
            params.append('event_id', event_id);
        }
        if (type) {
            params.append('type', type);
        }
        
        const queryString = params.toString();
        const response = await fetch(`${baseURL}/event/?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch events: ${response.status}` },
                { status: response.status }
            );
        }
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Failed to fetch events" });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    if (!jwtToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        
        // Create a new FormData object to send to the backend
        const forwardFormData = new FormData();
        
        // Required fields validation and extraction
        const title = formData.get('title');
        const location = formData.get('location');
        const description = formData.get('description');
        const time = formData.get('time');
        const type = formData.get('type');
        
        // Validate required fields
        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' }, 
                { status: 400 }
            );
        }
        if (!location) {
            return NextResponse.json(
                { error: 'Location is required' }, 
                { status: 400 }
            );
        }
        if (!description) {
            return NextResponse.json(
                { error: 'Description is required' }, 
                { status: 400 }
            );
        }
        if (!time) {
            return NextResponse.json(
                { error: 'Time is required' }, 
                { status: 400 }
            );
        }
        if (!type) {
            return NextResponse.json(
                { error: 'Type is required' }, 
                { status: 400 }
            );
        }
        
        // Validate type field
        if (type !== 'talk' && type !== 'event') {
            return NextResponse.json(
                { error: 'Type must be either "talk" or "event"' }, 
                { status: 400 }
            );
        }
        
        // Add required fields to form data
        forwardFormData.append('title', title.toString());
        forwardFormData.append('location', location.toString());
        forwardFormData.append('description', description.toString());
        forwardFormData.append('time', time.toString());
        forwardFormData.append('type', type.toString());
        
        // Add optional fields
        const ticketLink = formData.get('ticket_link');
        if (ticketLink) {
            forwardFormData.append('ticket_link', ticketLink.toString());
        }
        
        const host = formData.get('host');
        if (host) {
            // Handle host as array of ObjectIds
            try {
                const hostArray = JSON.parse(host.toString());
                if (Array.isArray(hostArray)) {
                    hostArray.forEach((hostId, index) => {
                        forwardFormData.append(`host[${index}]`, hostId);
                    });
                } else {
                    forwardFormData.append('host', host.toString());
                }
            } catch (error) {
                // If it's not JSON, treat as single host ID
                forwardFormData.append('host', host.toString());
            }
        }
        
        // Add all files from the request with the correct field name 'images'
        const files = formData.getAll('images');
        if (files.length > 5) {
            return NextResponse.json(
                { error: 'Maximum 5 images allowed' }, 
                { status: 400 }
            );
        }
        
        files.forEach(file => {
            if (file instanceof File) {
                // Validate file type
                const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
                if (!validTypes.includes(file.type)) {
                    return NextResponse.json(
                        { error: 'Invalid image type. Only JPEG, PNG, WEBP, and JPG are allowed' }, 
                        { status: 400 }
                    );
                }
                
                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    return NextResponse.json(
                        { error: 'Image file size must be less than 5MB' }, 
                        { status: 400 }
                    );
                }
                
                forwardFormData.append('images', file);
            }
        });

        const response = await fetch(`${baseURL}/event`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: forwardFormData
        });
        
        // Handle non-JSON responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        } else {
            // Handle non-JSON response (like HTML error pages)
            const text = await response.text();
            console.error("Non-JSON response:", text);
            return NextResponse.json(
                { error: 'Server returned a non-JSON response' }, 
                { status: response.status }
            );
        }
    } catch (error) {
        console.error("api/events/route.ts error:", error);
        return NextResponse.json(
            { error: 'Failed to create event' }, 
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;

    try {
        const formData = await req.formData();
        // Get eventId from the form data
        const eventId = formData.get('eventId');
        if (!eventId) {
            return NextResponse.json(
                { error: 'Event ID is required' }, 
                { status: 400 }
            );
        }

        // Get content from the form data
        const content = formData.get('content')?.toString() || '';
        if (!content) {
            return NextResponse.json(
                { error: 'Content is required' }, 
                { status: 400 }
            );
        }

        // Get the deleteImageUrls from the form data
        const deleteImageUrlsRaw = formData.get('deleteImageUrls');
        let deleteImageUrls = [];
        if (deleteImageUrlsRaw) {
            const parsed = JSON.parse(deleteImageUrlsRaw.toString());
            deleteImageUrls = Array.isArray(parsed) ? parsed : [parsed];
        }
        console.log("deleteImageUrls\n", deleteImageUrls);
        
        // Create FormData for the new images
        const requestData = new FormData();
        
        // Add the content
        requestData.append('content', content);
        
        // Use array notation in field names to ensure the backend receives it as an array
        deleteImageUrls.forEach((url, index) => {
            requestData.append(`deleteImageUrls[${index}]`, url);
        });

        console.log(requestData);
        
        // Add any new images (files)
        const newImageFiles = formData.getAll('images');
        newImageFiles.forEach(file => {
            if (file instanceof File) {
                requestData.append('images', file);
            }
        });
        
        const response = await fetch(`${baseURL}/event/${eventId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: requestData
        });
        
        // Better error logging with await
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server error response:", errorText);
            throw new Error(`Failed to update event: ${response.status} ${response.statusText}`);
        }
        
        // Handle non-JSON responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        } else {
            // Handle non-JSON response (like HTML error pages)
            const text = await response.text();
            console.error("Non-JSON response:", text);
            return NextResponse.json(
                { error: 'Server returned a non-JSON response' }, 
                { status: response.status }
            );
        }
    } catch (error) {
        console.error("api/events/route.ts PUT error:", error);
        return NextResponse.json(
            { error: 'Failed to update event' }, 
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    if (!jwtToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { eventId } = await req.json();

    try {
        if (!eventId) {
            return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
        }

        const response = await fetch(`${baseURL}/event/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Delete error response:", errorText);
            return NextResponse.json({ error: `Failed to delete event: ${response.status}` }, { status: response.status });
        }
        
        return NextResponse.json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json({ error: "Failed to delete event" });
    }
}