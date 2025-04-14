import { PostsFetchResponse } from './api.interface';

export async function fetchPosts(cursor?: string): Promise<PostsFetchResponse> {
  const url = cursor 
    ? `/api/post?cursor=${cursor}` 
    : '/api/post';
    
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return response.json();
}

// Add this function for creating posts
export async function createPost(data: any): Promise<any> {
  const response = await fetch('/api/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  
  return response.json();
}