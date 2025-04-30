/**
 * API interceptor to globally handle 403 status codes
 * This will redirect users to login when unauthorized responses are received
 */
export const setupAPIInterceptor = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async function(input, init) {
    // Make the original fetch call
    const response = await originalFetch(input, init);
    
    // Clone the response so we can both check the status AND return a usable response
    // This is critical for Network tab debugging
    const clonedResponse = response.clone();
    
    // If the response status is 403, redirect to login page
    if (clonedResponse.status === 403) {
      console.log('Access forbidden (403) detected, redirecting to login');
      try {
        await originalFetch('/api/logout', {
          method: 'POST'
        });
        window.location.href = '/login';
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    
    // Always return the original response so it can be properly inspected
    return response;
  };
};