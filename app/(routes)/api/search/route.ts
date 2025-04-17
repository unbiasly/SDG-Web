import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { baseURL } from "@/service/app.api";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('jwtToken')?.value;
  try {
    
    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const type = searchParams.get("type");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const recentSearch = searchParams.get("recentSearch");
    const clearSearch = searchParams.get("clearSearch");
    
    if (!jwtToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }


    // Extract query parameters froqm the request URL
    let queryString = `q=${q}`;
        if (type) queryString += `&type=${type}`;
        if (page) queryString += `&page=${page}`;
        if (limit) queryString += `&limit=${limit}`;
        if (recentSearch) queryString += `&recentSearch=${recentSearch}`;
        if (clearSearch) queryString += `&clearSearch=${clearSearch}`;


    // Validate parameters based on the operation
    if (!recentSearch && !clearSearch && !q) {
      return NextResponse.json(
        { success: false, message: "Search query is required" },
        { status: 400 }
      );
    }

    // Construct API URL based on parameters


    // Make API call
    const response = await fetch(`${baseURL}/search/${queryString}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      }
    });

    // Parse and return the response
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch search results" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}