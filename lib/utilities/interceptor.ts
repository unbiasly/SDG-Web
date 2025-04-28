/**
 * API interceptor to globally handle 403 status codes
 * This will redirect users to login when unauthorized responses are received
 */
export const setupAPIInterceptor = () => {
  const originalFetch = window.fetch;
  
  // Request queue for handling 401 responses
  const requestQueue: { request: () => Promise<Response> }[] = [];
  // Flag to track if a token refresh is in progress
  let isRefreshingToken = false;
  // Rate limiting for token refreshes
  const refreshHistory: number[] = [];
  const MAX_REFRESH_PER_MINUTE = 5;
  const REFRESH_WINDOW_MS = 60 * 1000; // 1 minute
  
  // Function to check if we've hit the refresh rate limit
  const isRateLimited = (): boolean => {
    const now = Date.now();
    // Remove refresh attempts older than our window
    while (refreshHistory.length && refreshHistory[0] < now - REFRESH_WINDOW_MS) {
      refreshHistory.shift();
    }
    return refreshHistory.length >= MAX_REFRESH_PER_MINUTE;
  };
  
  // Function to process queued requests after token refresh
  const processQueue = () => {
    requestQueue.forEach(({ request }) => {
      request().catch(console.error);
    });
    // Clear the queue
    requestQueue.length = 0;
  };
  
  window.fetch = async function(input, init) {
    // Function to retry the original request
    const executeRequest = () => originalFetch(input, init);
    
    try {
      // Make the original fetch call
      const response = await executeRequest();
      
      // Clone the response so we can both check the status AND return a usable response
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
      } else if (clonedResponse.status === 401) {
          // If we're already refreshing, queue this request
          if (isRefreshingToken) {
              return new Promise((resolve, reject) => {
                  requestQueue.push({
                      request: () => executeRequest().then(response => {
                          resolve(response);
                          return response;
                      }).catch(error => {
                          reject(error);
                          throw error;
                      })
                  });
              });
          }
          
          // Check rate limiting
          if (isRateLimited()) {
              console.warn('Token refresh rate limit reached');
              try {
                  await originalFetch('/api/logout', { method: 'POST' });
                  window.location.href = '/login';
                  return response; // Return original response before redirect happens
              } catch (error) {
                  console.error('Error during logout:', error);
              }
          }
          
          // Start refreshing token
          isRefreshingToken = true;
          refreshHistory.push(Date.now());
          
          try {
              const res = await originalFetch('/api/refreshToken', {
                  method: 'POST',
              });
      
              if (res.ok) {
                  // Token refresh successful, retry the original request and process queue
                  isRefreshingToken = false;
                  processQueue();
                  return executeRequest();
              } else if (res.status === 401) {
                  console.warn('Session expired or refresh failed');
                  isRefreshingToken = false;
                  try {
                      await originalFetch('/api/logout', { method: 'POST' });
                      window.location.href = '/login';
                  } catch (error) {
                      console.error('Error during logout:', error);
                  }
              } else {
                  isRefreshingToken = false;
                  processQueue(); // Still try to process queue on other errors
              }
          } catch (err) {
              console.error('Token refresh error:', err);
              isRefreshingToken = false;
          }
      }
      
      // Always return the original response so it can be properly inspected
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };
};