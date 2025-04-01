// Utility to handle token refreshing

export function setupTokenRefresh() {
  if (typeof window === 'undefined') return;
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/tokenRefresh-worker.js');
        console.log('Token refresh service worker registered:', registration.scope);
        
        // Listen for messages from the service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'TOKEN_REFRESHED') {
            console.log('Token was refreshed by service worker');
          }
        });
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    });
  } else {
    console.warn('Service workers are not supported in this browser');
    
    // Fallback for browsers without service worker support
    setInterval(async () => {
      try {
        await fetch('/api/refreshToken', {
          method: 'POST',
          credentials: 'include'
        });
        console.log('Token refreshed via fallback method');
      } catch (error) {
        console.error('Error refreshing token via fallback:', error);
      }
    }, 8 * 60 * 1000); // 8 minutes
  }
}

// Function to force a token refresh
export async function forceTokenRefresh() {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'FORCE_REFRESH'
    });
    return true;
  } else {
    // Fallback if service worker is not controlling the page
    try {
      const response = await fetch('/api/refreshToken', {
        method: 'POST',
        credentials: 'include'
      });
      return response.ok;
    } catch (error) {
      console.error('Error during forced token refresh:', error);
      return false;
    }
  }
}
