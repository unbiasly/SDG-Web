import { baseURL } from "@/service/app.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { MentorRequestData } from "@/service/api.interface";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get("jwtToken")?.value;
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const mentorId = searchParams.get("mentorId");

    let queryParam;
    if (categoryId) {
        queryParam = `category_id=${categoryId}`;
    } else if (mentorId) {
        queryParam = `mentor_id=${mentorId}`;
    }

    try {
        const response = await fetch(
            `${baseURL}/mentorship/mentor${queryParam && `?${queryParam}`}`,
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching mentors:", error);
        return NextResponse.json({ error: "Failed to fetch mentors" });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get("jwtToken")?.value;

    if (!jwtToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const requestBody = await req.json();
        
        // Handle the payload directly as MentorRequestData
        const payload: MentorRequestData = requestBody;

        const {
            user_id,
            title,
            name,
            shortDesc,
            gender,
            slot_duration_in_min,
            experience,
            slot_per_day,
            availability,
            specialization,
            category_id,
        } = payload;

        // Validate required fields
        if (!user_id) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }
        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }
        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }
        if (!shortDesc) {
            return NextResponse.json(
                { error: "Short description is required" },
                { status: 400 }
            );
        }
        if (!gender) {
            return NextResponse.json(
                { error: "Gender is required" },
                { status: 400 }
            );
        }
        if (!slot_duration_in_min) {
            return NextResponse.json(
                { error: "Slot duration in minutes is required" },
                { status: 400 }
            );
        }
        if (!experience) {
            return NextResponse.json(
                { error: "Experience is required" },
                { status: 400 }
            );
        }
        if (!slot_per_day) {
            return NextResponse.json(
                { error: "Slots per day is required" },
                { status: 400 }
            );
        }
        if (!availability) {
            return NextResponse.json(
                { error: "Availability is required" },
                { status: 400 }
            );
        }
        if (!specialization) {
            return NextResponse.json(
                { error: "Specialization is required" },
                { status: 400 }
            );
        }

        // Validate numeric fields
        const slotDuration = parseInt(slot_duration_in_min.toString());
        if (isNaN(slotDuration) || slotDuration <= 0) {
            return NextResponse.json(
                { error: "Slot duration must be a positive number" },
                { status: 400 }
            );
        }

        const slotsPerDay = parseInt(slot_per_day.toString());
        if (isNaN(slotsPerDay) || slotsPerDay <= 0) {
            return NextResponse.json(
                { error: "Slots per day must be a positive number" },
                { status: 400 }
            );
        }

        // Create JSON payload
        const requestBodyForAPI = {
            user_id: user_id.toString(),
            title: title.toString(),
            name: name.toString(),
            shortDesc: shortDesc.toString(),
            gender: gender.toString(),
            slot_duration_in_min: slotDuration,
            experience: experience.toString(),
            slot_per_day: slotsPerDay,
            availability: availability.toString(),
            specialization: specialization.toString(),
            category_id: category_id?.toString() || "",
        };

        const response = await fetch(`${baseURL}/mentorship/mentor`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBodyForAPI),
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
                { error: "Server returned a non-JSON response" },
                { status: response.status }
            );
        }
    } catch (error) {
        console.error("api/mentorship/mentor/route.ts error:", error);
        return NextResponse.json(
            { error: "Failed to create mentor profile" },
            { status: 500 }
        );
    }
}
