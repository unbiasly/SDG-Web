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
        
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.log("api/route.ts error:", error);
        return NextResponse.json(
            { error: 'Failed to fetch user data'}, 
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

        let contentType = req.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            const requestBody = await req.json();
            
            // Handle "present" values in experience array when submitted as JSON
            if (requestBody.experience && Array.isArray(requestBody.experience)) {
                requestBody.experience = requestBody.experience.map((exp: any) => {
                    if (exp.endDate === "present" || exp.endDate === "Present" || exp.endDate === "") {
                        return { ...exp, endDate: null };
                    }
                    return exp;
                });
            }
            
            // Handle "present" values in education array when submitted as JSON
            if (requestBody.education && Array.isArray(requestBody.education)) {
                requestBody.education = requestBody.education.map((edu: any) => {
                    if (edu.endDate === "present" || edu.endDate === "Present" || edu.endDate === "") {
                        return { ...edu, endDate: null };
                    }
                    return edu;
                });
            }
            
            const response = await fetch(`${baseURL}/userDetails`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            const resContentType = response.headers.get("content-type");
            if (resContentType && resContentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                return NextResponse.json(data, { status: response.status });
            } else {
                const text = await response.text();
                console.error("Non-JSON response from backend (application/json flow):", text);
                return NextResponse.json(
                    { success: false, message: "Backend error or non-JSON response", details: text }, 
                    { status: response.status || 500 }
                );
            }
        } else if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            const backendFormData = new FormData();
            
            const textFields = [
                'name', 'username', 'location', 'gender', 'dob', 
                'portfolioLink', 'bio', 'fName', 'lName', 
                'occupation', 'pronouns', 'headline'
            ];
            
            textFields.forEach(field => {
                const value = formData.get(field);
                if (value !== null) { // Check if the field exists
                    backendFormData.append(field, value.toString());
                }
            });
            
            const profileImageFile = formData.get('profileImage') as File | null;
            if (profileImageFile instanceof File && profileImageFile.size > 0) {
                backendFormData.append('profileImage', profileImageFile);
            }
            
            const backgroundImageFile = formData.get('profileBackgroundImage') as File | null;
            if (backgroundImageFile instanceof File && backgroundImageFile.size > 0) {
                backendFormData.append('profileBackgroundImage', backgroundImageFile);
            }
            
            // Handle education and experience arrays
            // These fields are expected to be sent as JSON strings by the client (e.g., Flutter app)
            // when using multipart/form-data.
            const educationString = formData.get('education');
            if (educationString !== null) {
                try {
                    // Parse the education JSON string
                    const educationArray = JSON.parse(educationString.toString());
                    
                    // Process each education item
                    educationArray.forEach((edu: any) => {
                        // If endDate is "present" or invalid, set it to null
                        if (edu.endDate === "present" || edu.endDate === "Present" || edu.endDate === "") {
                            edu.endDate = null;
                        }
                    });
                    
                    // Stringify the modified education array
                    backendFormData.append('education', JSON.stringify(educationArray));
                } catch (error) {
                    // If parsing fails, pass through the original string
                    console.error("Failed to parse education data:", error);
                    backendFormData.append('education', educationString.toString());
                }
            }
            
            const experienceString = formData.get('experience');
            if (experienceString !== null) {
                try {
                    // Parse the experience JSON string
                    const experienceArray = JSON.parse(experienceString.toString());
                    
                    // Process each experience item
                    experienceArray.forEach((exp: any) => {
                        // If endDate is "present" or invalid, set it to null
                        if (exp.endDate === "present" || exp.endDate === "") {
                            exp.endDate = null;
                        }
                    });
                    
                    // Stringify the modified experience array
                    backendFormData.append('experience', JSON.stringify(experienceArray));
                } catch (error) {
                    // If parsing fails, pass through the original string
                    console.error("Failed to parse experience data:", error);
                    backendFormData.append('experience', experienceString.toString());
                }
            }
            
            const response = await fetch(`${baseURL}/userDetails`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                    // Content-Type for FormData is set automatically by fetch
                },
                body: backendFormData
            });
            
            const resContentType = response.headers.get("content-type");
            if (resContentType && resContentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                return NextResponse.json(data, { status: response.status });
            } else {
                const text = await response.text();
                console.error("Non-JSON response from backend (multipart/form-data flow):", text);
                return NextResponse.json(
                    { success: false, message: "Backend error or non-JSON response", details: text }, 
                    { status: response.status || 500 }
                );
            }
        } else {
            return NextResponse.json(
                { success: false, message: "Unsupported content type" }, 
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error updating user details in /api/route.ts:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { success: false, message: "Failed to update user details", error: errorMessage },
            { status: 500 }
        );
    }
}