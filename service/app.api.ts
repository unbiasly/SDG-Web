import { add } from "date-fns";
import { AddMember, QuestionAnswer } from "./api.interface";

export const baseURL = process.env.NEXT_PUBLIC_API_URL;



export const AppApi = {

    getCookie: async (tokenName?: string): Promise<string | Record<string, string> | null> => {
        try {
            const response = await fetch("/api/getCookie", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cookieName: tokenName }),
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                // If specific cookie requested, return its value
                if (tokenName && data.value) {
                    return data.value;
                }
                // If no specific cookie requested, return all cookies object
                if (!tokenName) {
                    return data;
                }
                return null;
            } 
            return null;
        } catch (error) {
            console.error("Error fetching cookie:", error);
            return null;
        }
    },
    
    postAction : async (
        postID:string, 
        actionType:string, 
        method: string, 
        comment?: string,
        cursor?: string,
        limit?: number,
    ) => {
        try {
            const response = await fetch(`/api/post/post-action`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    actionType: actionType,
                    postId: postID,
                    ...(comment && { comment: comment }),
                    ...(cursor && { cursor: cursor }),
                    ...(limit && { limit: limit }),
                }),
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    deletePost: async (postID:string) => {
        try {
            const response = await fetch(`/api/post`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId: postID,
                }),
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    handleFollow: async (postOwnerID:string, viewingId:string, followState: boolean) => {
        try {
            const response = await fetch(`/api/follow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    followingId: postOwnerID,
                    userId: viewingId,
                    action: followState ? "follow" : "unfollow",
                }),
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    updatePost: async (postData:FormData) => {
        try {
            const response = await fetch(`/api/post`, {
                method: "PUT",
                body: postData,
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    report : async (type: string, reason: string, reportCategory: string, id: string) => {
        try {
            const response = await fetch(`/api/${type}/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reason: reason,
                    report_category: reportCategory,
                    id
                }),
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    fetchUser: async (userId?:string) => {
        try {
            const response = await fetch(`/api/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                }),
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    fetchUserPosts: async (userId:string, cursor:string) => {
        try {
            const response = await fetch(`/api/post/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, cursor }),
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    analytics: async (action: string, userId: string, startDate: string, endDate: string, type?:string, viewerId?: string) => {
        try {
            const response = await fetch(`/api/analytics`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    userId,
                    startDate,
                    endDate,

                    
                    ...(action === 'track' && { type: type, viewerId }),
                }),
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    fetchJobs: async (cursor?: string, limit?: number, jobType?:string, jobId?:string) => {
        try {
            const response = await fetch(`/api/jobs${jobId ? `?id=${jobId}`: ''}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...(cursor && { cursor }),
                    ...(limit && { limit }),
                    ...(jobType && { jobType }),
                }),
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    jobAction: async (jobId: string, action: string, answers?: QuestionAnswer[], resume?: File) => {
        try {
            const formData = new FormData();
            if (answers) {
                formData.append('answers', JSON.stringify(answers));
            }
            if (resume) {
                formData.append('resume', resume);
            }
            const response = await fetch(`/api/jobs?action=${action}&jobId=${jobId}`, {
                method: 'PATCH',
                body: formData,
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    getRole: async () => {
        try {
            const response = await fetch(`/api/login/onboarding`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    getEvents: async (type: string, event_id?: string, user_id?: string) => {
        try {
            const queryParams = new URLSearchParams();
            if (type) queryParams.append('type', type);
            if (event_id) queryParams.append('event_id', event_id);
            if (user_id) queryParams.append('user_id', user_id);
            const queryString = queryParams.toString();
            
            const response = await fetch(`/api/events${queryString ? `?${queryString}` : ''}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },
    
    createEvent: async (formData: FormData) => {
        try {
            const response = await fetch(`/api/events`, {
                method: 'POST',
                body: formData, // Don't set Content-Type header for FormData
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    getReports: async (type?: string, cursor?: string | null) => {
        try {
            const queryParams = new URLSearchParams();
            if (type) queryParams.append('type', type);
            if (cursor) queryParams.append('cursor', cursor);
            const queryString = queryParams.toString();

            const response = await fetch(`/api/reports${queryString ? `?${queryString}` : ''}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Return the API response directly since it already has the correct structure
            const data = await response.json();
            return data; // This is already { success: true, data: [...], pagination: {...} }
            
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                data: [],
                pagination: {
                    limit: "0",
                    cursor: null,
                    nextCursor: null,
                    hasMore: false,
                    totalItems: 0
                }
            };
        }
    },

    completeRole : async (formBody: any) => {
        try {
            const response = await fetch(`/api/login/onboarding`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formBody),
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    getSocietyMembers : async (limit = 30, cursor?: string | null) => {
        try {
            const queryParams = new URLSearchParams();
            if (limit) queryParams.append('limit', limit.toString());
            if (cursor) queryParams.append('cursor', cursor);
            const queryString = queryParams.toString();

            const response = await fetch(`/api/society/members${queryString ? `?${queryString}` : ''}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    getSocietyRequests : async (limit = 30, cursor?: string | null) => {
        try {
            const queryParams = new URLSearchParams();
            if (limit) queryParams.append('limit', limit.toString());
            if (cursor) queryParams.append('cursor', cursor);
            const queryString = queryParams.toString();

            const response = await fetch(`/api/society/requests${queryString ? `?${queryString}` : ''}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            // Get updated data from API response
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    addSocietyMember: async (members?: AddMember[], csvFile?: File) => {
        try {
            // Handle CSV file upload
            if (csvFile) {
                const formData = new FormData();
                formData.append('csv', csvFile);
                
                const response = await fetch(`/api/society/members`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    return {
                        success: false,
                        error: response.statusText
                    };
                }

                const data = await response.json();
                return {
                    success: true,
                    data: data
                };
            }

            // Handle JSON payload with members array
            if (!members || members.length === 0) {
                return {
                    success: false,
                    error: 'Members array is required when not uploading CSV'
                };
            }

            const response = await fetch(`/api/society/members`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    members: members
                }),
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    editSocietyMember : async (memberId: string, name?:string, college?:string, designation?:string) => {
        try {
            const response = await fetch(`/api/society/members`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    id: memberId, 
                    ...(name && { name }),
                    ...(college && { college }),
                    ...(designation && { designation }),
                }),
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    evaluateRequest : async (requestId: string, type: 'accept' | 'reject') => {
        try {
            const response = await fetch(`/api/society/requests`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: requestId , type }),
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: response.statusText
                };
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

}
