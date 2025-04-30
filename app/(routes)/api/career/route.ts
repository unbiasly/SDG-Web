import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const jwtToken = cookieStore.get('jwtToken')?.value;
        
        if (!jwtToken) {
            return NextResponse.json({ error: 'Unauthorized (Token Undefined)'}, { status: 401 });
        }

        // Get the current user details first to preserve other fields
        const userResponse = await fetch(`${baseURL}/userDetails`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!userResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch user data'}, { status: userResponse.status });
        }
        
        const userData = await userResponse.json();
        const currentUser = userData.data;
        
        // Process only education and experience data
        const contentType = req.headers.get("content-type") || "";
        let education = [];
        let experience = [];

        if (contentType.includes("application/json")) {
            // Handle JSON request
            const requestBody = await req.json();
            
            // Extract only education and experience
            if (requestBody.education && Array.isArray(requestBody.education)) {
                education = requestBody.education.map((edu: { school?: string; degree?: string; startDate?: string; endDate?: string; _id?: string }) => ({
                    school: edu.school || "",
                    degree: edu.degree || "",
                    startDate: edu.startDate || new Date().toISOString(),
                    endDate: edu.endDate || new Date().toISOString(),
                    _id: edu._id || crypto.randomUUID()
                }));
            } else {
                education = currentUser.education || [];
            }
            
            if (requestBody.experience && Array.isArray(requestBody.experience)) {
                experience = requestBody.experience.map((exp: { company?: string; role?: string; startDate?: string; endDate?: string; _id?: string }) => ({
                    company: exp.company || "",
                    role: exp.role || "",
                    startDate: exp.startDate || new Date().toISOString(),
                    endDate: exp.endDate || new Date().toISOString(),
                    _id: exp._id || crypto.randomUUID()
                }));
            } else {
                experience = currentUser.experience || [];
            }
        } else if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            
            // Handle only education array
            const educationData = formData.get('education');
            if (educationData) {
                try {
                    const educationArray = JSON.parse(educationData.toString());
                    if (Array.isArray(educationArray)) {
                        education = educationArray;
                    }
                } catch (e) {
                    console.error("Error parsing education data:", e);
                    education = currentUser.education || [];
                }
            } else {
                education = currentUser.education || [];
            }
            
            // Handle only experience array
            const experienceData = formData.get('experience');
            if (experienceData) {
                try {
                    const experienceArray = JSON.parse(experienceData.toString());
                    if (Array.isArray(experienceArray)) {
                        experience = experienceArray;
                    }
                } catch (e) {
                    console.error("Error parsing experience data:", e);
                    experience = currentUser.experience || [];
                }
            } else {
                experience = currentUser.experience || [];
            }
        } else {
            return NextResponse.json(
                { success: false, message: "Unsupported content type" }, 
                { status: 400 }
            );
        }

        // Create a request body with only the necessary career-related fields
        // and preserve all other user fields from the current data
        const updatedUserData = {
            // Include minimal required fields for identification
            education,
            experience
        };

        // Send the request to the backend
        const response = await fetch(`${baseURL}/userDetails`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUserData)
        });
        
        // Process response
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error updating career details:", errorText);
            return NextResponse.json(
                { success: false, message: "Failed to update career details" }, 
                { status: response.status }
            );
        }
        
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error updating career details:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update career details", error: String(error) },
            { status: 500 }
        );
    }
}