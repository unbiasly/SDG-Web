// import { PostsFetchResponse } from '@/service/api.interface';
// import { useState, useCallback } from 'react';

// export const usePosts = () => {
//     const [posts, setPosts] = useState<PostsFetchResponse>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const fetchPosts = useCallback(async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             const response = await fetch('/api/getPosts');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch posts');
//             }
//             const data = await response.json();
//             setPosts(data);
//             return data;
//         } catch (error) {
//             const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching posts';
//             setError(errorMessage);
//             console.error("Post Fetch Error:", error);
//             return null;
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     const refreshPosts = useCallback(() => {
//         return fetchPosts();
//     }, [fetchPosts]);

//     return {
//         posts,
//         isLoading,
//         error,
//         fetchPosts,
//         refreshPosts
//     };
// }; 