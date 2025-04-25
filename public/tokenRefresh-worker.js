// Service Worker for automatic token refreshing
const REFRESH_INTERVAL = 8 * 60 * 1000; // 8 minutes in milliseconds

self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Token refresh service worker installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  console.log('Token refresh service worker activated');
  
  // Start the refresh cycle
  startRefreshCycle();
});

function startRefreshCycle() {
  console.log('Starting token refresh cycle');
  
  // Immediately try to refresh the token
  refreshToken();
  
  // Set up periodic refresh
  setInterval(() => {
    refreshToken();
  }, REFRESH_INTERVAL);
}

async function refreshToken() {
  try {
    console.log('Service worker attempting to refresh token');
    const response = await fetch('/api/refreshToken', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Token refreshed successfully by service worker');
      
      // Notify all clients that the token has been refreshed
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'TOKEN_REFRESHED',
            expiresAt: data.expiresAt
          });
        });
      });
    } else {
      console.error('Failed to refresh token:', await response.text());
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
}

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FORCE_REFRESH') {
    console.log('Forced token refresh requested');
    refreshToken();
  }
});
