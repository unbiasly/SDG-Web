// Utility to handle token refreshing

export function setupTokenRefresh() {
  console.log('Setting up token refresh...');
  if (typeof window === 'undefined') return;
  
  if ('serviceWorker' in navigator) {
    // Don't wait for window load - this could delay registration
    (async () => {
      try {
        // Register service worker with proper update control
        const registration = await navigator.serviceWorker.register('/tokenRefresh-worker.js');
        
        console.log('Token refresh service worker registered:', registration.scope);
        
        // Check if there's an update and handle it
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New service worker installed and will activate on reload');
                }
              }
            };
          }
        };
        
        // Listen for messages from the service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'TOKEN_REFRESHED') {
            console.log('Token was refreshed by service worker');
          }
        });
        
        // Ensure the service worker is activated
        if (registration.active) {
          // Force a token refresh to initialize the cycle
          setTimeout(() => {
            forceTokenRefresh();
          }, 1000);
        }
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    })();
  } else {
    console.warn('Service workers are not supported in this browser');
    
    // Fallback for browsers without service worker support
    setInterval(async () => {
      try {
        // Use relative URL that will respect the deployed domain
        const refreshEndpoint = new URL('/api/refreshToken', window.location.origin).toString();
        await fetch(refreshEndpoint, {
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
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
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
