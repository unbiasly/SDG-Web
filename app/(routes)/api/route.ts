import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
    
    if (!jwtToken) {
        return NextResponse.json({ error: 'Unauthorized (Token Undefined)'}, { status: 401 });
    }
    
    try {
        const response = await fetch(`${baseURL}/userDetails`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return NextResponse.json({ error: 'Unauthorized'}, { status: response.status });
            }
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.log("api/route.ts error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch user data'}, 
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const jwtToken = cookieStore.get('jwtToken')?.value;
        
        if (!jwtToken) {
            return NextResponse.json({ error: 'Unauthorized (Token Undefined)'}, { status: 401 });
        }

        // Depending on the content type, handle JSON or FormData
        let requestBody;
        let contentType = req.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            // Handle JSON request
            requestBody = await req.json();
            
            // Make sure education and experience are properly formatted
            

            // Send the request to the backend
            const response = await fetch(`${baseURL}/userDetails`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            // Process response
            const resContentType = response.headers.get("content-type");
            if (resContentType && resContentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                return NextResponse.json(data, { status: response.status });
            } else {
                const text = await response.text();
                console.error("Non-JSON response:", text);
                return NextResponse.json(
                    { success: false, message: "Server error occurred", details: text }, 
                    { status: 500 }
                );
            }
        } else if (contentType.includes("multipart/form-data")) {
            // Handle existing FormData processing for file uploads
            const formData = await req.formData();
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
            
            // Handle file uploads
            const profileImageFile = formData.get('profileImage') as File | null;
            const backgroundImageFile = formData.get('profileBackgroundImage') as File | null;
            
            if (profileImageFile instanceof File && profileImageFile.size > 0) {
                backendFormData.append('profileImage', profileImageFile);
            }
            
            if (backgroundImageFile instanceof File && backgroundImageFile.size > 0) {
                backendFormData.append('profileBackgroundImage', backgroundImageFile);
            }
            
            // Handle education and experience arrays
            const education = formData.get('education');
            if (education) {
                try {
                    const educationArray = JSON.parse(education.toString());
                    if (Array.isArray(educationArray)) {
                        backendFormData.append('education', JSON.stringify(educationArray));
                    }
                } catch (e) {
                    backendFormData.append('education', education.toString());
                }
            }
            
            const experience = formData.get('experience');
            if (experience) {
                try {
                    const experienceArray = JSON.parse(experience.toString());
                    if (Array.isArray(experienceArray)) {
                        backendFormData.append('experience', JSON.stringify(experienceArray));
                    }
                } catch (e) {
                    backendFormData.append('experience', experience.toString());
                }
            }
            
            // Send FormData request
            const response = await fetch(`${baseURL}/userDetails`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                body: backendFormData
            });
            
            // Process response
            const resContentType = response.headers.get("content-type");
            if (resContentType && resContentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                return NextResponse.json(data, { status: response.status });
            } else {
                const text = await response.text();
                console.error("Non-JSON response:", text);
                return NextResponse.json(
                    { success: false, message: "Server error occurred", details: text }, 
                    { status: 500 }
                );
            }
        } else {
            return NextResponse.json(
                { success: false, message: "Unsupported content type" }, 
                { status: 400 }
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