import { QuestionAnswer } from "./api.interface";

export const baseURL = process.env.NEXT_PUBLIC_API_URL;



export const AppApi = {

    getCookie: async (tokenName: string): Promise<string | null> => {
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
                return data.value || null;
            } else {
                console.error("Failed to fetch cookie:", response.statusText);
                return null;
            }
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

    fetchUserPosts: async (userId:string) => {
        try {
            const response = await fetch(`/api/post/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
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
    }

};
