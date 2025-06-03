import { ManualAuthRequest, ManualAuthResponse, RefreshRequest, RefreshResponse, SocialAuthRequest } from "./api.interface";


const handleResponse = <T>(response: Response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  };
  
  const commonHeaders = {
    "Content-Type": "application/json",
  };
  
  const fetchClient = {
    get: <T>(url: string) => fetch(url).then<T>(handleResponse),
    post: <T>(url: string, body: object | FormData) => {
      const headers = body instanceof FormData ? {} : commonHeaders;
      
      const requestBody = body instanceof FormData ? body : JSON.stringify(body);
      return fetch(url, {
        method: "POST",
        body: requestBody,
        headers: headers as HeadersInit,
      }).then<T>(handleResponse);
    },
  };

export const baseURL = process.env.NEXT_PUBLIC_API_URL;

const BackAPI = {
    postManualLogin : (body: ManualAuthRequest) => fetchClient.post<ManualAuthResponse>(`${baseURL}/auth`, body),
    
    postSocialLogin : (body: SocialAuthRequest) => fetchClient.post<ManualAuthResponse>(`${baseURL}/auth`, body),

};

export const getCookie = async (tokenName: string): Promise<string | null> => {
    try {
        const response = await fetch("/api/getCookie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cookieName: tokenName }),
            credentials: "include", // Important for cookies to be sent/received
        });

        if (response.ok) {
            const data = await response.json();
            return data.value || null;
        } else {
            console.error("Failed to fetch cookie:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error fetching cookie:", error);
        return null;
    }
};


export default BackAPI;