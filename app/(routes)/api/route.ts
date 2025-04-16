import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies(); // Ensure to await the promise
    const jwtToken = cookieStore.get('jwtToken')?.value;
    if (!jwtToken) {
        return NextResponse.json({ error: 'Unauthorized (Token Undefined)', redirectToLogin: true }, { status: 401 });
    }
    
    try {
        const response = await fetch(`${baseURL}/userDetails`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            // Handle unauthorized response from backend
            if (response.status === 401) {
                return NextResponse.json({ error: 'Unauthorized', redirectToLogin: true }, { status: 401 });
            }
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.log("api/route.ts error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch user data', redirectToLogin: true }, 
            { status: 500 }
        );
    }
}


export async function PUT(req: NextRequest) {
    try {
        // Handle FormData instead of JSON
        const formData = await req.formData();
        const cookieStore = await cookies();
        const jwtToken = cookieStore.get('jwtToken')?.value;

        // Create a new FormData to send to the backend
        const backendFormData = new FormData();
        
        // Add all text fields from the form
        const textFields = [
            'name', 'username', 'location', 'gender', 'dob', 
            'portfolioLink', 'bio', 'fName', 'lName', 
            'occupation', 'pronouns', 'headline'
        ];
        
        textFields.forEach(field => {
            const value = formData.get(field);
            if (value) backendFormData.append(field, value.toString());
        });
        
        // Handle file uploads - match the field names from ProfileDialog.tsx
        // The client is using 'profileImage' and 'profileBackgroundImage'
        const profileImageFile = formData.get('profileImage') as File | null;
        const backgroundImageFile = formData.get('profileBackgroundImage') as File | null;
        
        // Only append files if they exist and have content
        if (profileImageFile instanceof File && profileImageFile.size > 0) {
            backendFormData.append('profileImage', profileImageFile);
        }
        
        if (backgroundImageFile instanceof File && backgroundImageFile.size > 0) {
            backendFormData.append('profileBackgroundImage', backgroundImageFile);
        }
        
        // Handle education and experience arrays if present
        const education = formData.get('education');
        if (education) {
            try {
                // If it's a JSON string, parse it and append each item
                const educationArray = JSON.parse(education.toString());
                if (Array.isArray(educationArray)) {
                    backendFormData.append('education', JSON.stringify(educationArray));
                }
            } catch (e) {
                // If parsing fails, just append as is
                backendFormData.append('education', education.toString());
            }
        }
        
        const experience = formData.get('experience');
        if (experience) {
            try {
                // If it's a JSON string, parse it and append each item
                const experienceArray = JSON.parse(experience.toString());
                if (Array.isArray(experienceArray)) {
                    backendFormData.append('experience', JSON.stringify(experienceArray));
                }
            } catch (e) {
                // If parsing fails, just append as is
                backendFormData.append('experience', experience.toString());
            }
        }

        console.log("Sending data to backend:", Object.fromEntries(backendFormData.entries()));

        // Send the request to the backend
        const response = await fetch(`${baseURL}/userDetails`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
                // Don't set Content-Type header when sending FormData
            },
            body: backendFormData
        });

        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        } else {
            // Handle non-JSON response (like HTML error pages)
            const text = await response.text();
            console.error("Non-JSON response:", text);
            return NextResponse.json(
                { success: false, message: "Server error occurred", details: text }, 
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error updating user details:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update user details", error: String(error) },
            { status: 500 }
        );
    }
}