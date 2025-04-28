/**
 * API interceptor to globally handle 403 status codes
 * This will redirect users to login when unauthorized responses are received
 */
export const setupAPIInterceptor = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async function(input, init) {
    // Make the original fetch call
    const response = await originalFetch(input, init);
    
    // If the response status is 403, redirect to login page
    if (response.status === 403) {
      console.log('Access forbidden (403) detected, redirecting to login');
      try {
        await fetch('/api/logout',{
            method: 'POST'
        });
        window.location.href = '/login';
        } catch (error) {
            console.error('Error during logout:', error);
        }
      return response;
    }
    
    return response;
  };
};