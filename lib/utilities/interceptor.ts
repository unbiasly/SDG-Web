/**
 * API interceptor to globally handle 403 status codes
 * This will redirect users to login when unauthorized responses are received
 * Also prevents navigation to auth pages when user is logged in
 */
export const setupAPIInterceptor = () => {
    const originalFetch = window.fetch;

    // Interface for queued requests
    interface QueuedRequest {
        request: () => Promise<Response>;
    }
    
    // Request queue for handling 401 responses
    const requestQueue: QueuedRequest[] = [];
    // Flag to track if a token refresh is in progress
    const refreshState = { isRefreshing: false };
    // Rate limiting for token refreshes
    const refreshHistory: number[] = [];
    const MAX_REFRESH_PER_MINUTE = 5;
    const REFRESH_WINDOW_MS = 60 * 1000; // 1 minute

    // Function to check if user is logged in by checking cookies
    const isUserLoggedIn = (): boolean => {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split('=');
            acc[name] = value;
            return acc;
        }, {} as Record<string, string>);
        
        // Align with middleware logic: require both sessionId and jwtToken
        return !!(cookies.sessionId && cookies.jwtToken);
    };

    // Function to check if we've hit the refresh rate limit
    const isRateLimited = (): boolean => {
        const now = Date.now();
        // Remove refresh attempts older than our window
        while (
            refreshHistory.length &&
            refreshHistory[0] < now - REFRESH_WINDOW_MS
        ) {
            refreshHistory.shift();
        }
        return refreshHistory.length >= MAX_REFRESH_PER_MINUTE;
    };

    // Function to process queued requests after token refresh
    const processQueue = async (success: boolean) => {
        if (success) {
            await Promise.all(
                requestQueue.map(({ request }) =>
                    request().catch((error) => {
                        console.error("Error processing queued request:", error);
                    })
                )
            );
        }
        requestQueue.length = 0;
    };

    // Function to prevent navigation to auth pages
    const preventAuthPageNavigation = () => {
        const authPages = ['/login', '/sign-up', '/reset-password'];
        const currentPath = window.location.pathname;
        
        if (isUserLoggedIn() && authPages.includes(currentPath)) {
            // Use history.replaceState to immediately change URL without triggering navigation
            window.history.replaceState(null, '', '/');
            // Force reload to home page
            window.location.href = '/';
            return true;
        }
        return false;
    };

    // Override history methods to prevent auth page navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(state, title, url) {
        if (typeof url === 'string' && isUserLoggedIn()) {
            const authPages = ['/login', '/sign-up', '/reset-password'];
            const targetPath = url.startsWith('/') ? url : new URL(url, window.location.origin).pathname;
            
            if (authPages.includes(targetPath)) {
                // Redirect to home instead
                originalPushState.call(this, state, title, '/');
                window.location.href = '/';
                return;
            }
        }
        originalPushState.call(this, state, title, url);
    };

    window.history.replaceState = function(state, title, url) {
        if (typeof url === 'string' && isUserLoggedIn()) {
            const authPages = ['/login', '/sign-up', '/reset-password'];
            const targetPath = url.startsWith('/') ? url : new URL(url, window.location.origin).pathname;
            
            if (authPages.includes(targetPath)) {
                // Redirect to home instead
                originalReplaceState.call(this, state, title, '/');
                window.location.href = '/';
                return;
            }
        }
        originalReplaceState.call(this, state, title, url);
    };

    // Listen for popstate events (back/forward button)
    window.addEventListener('popstate', (event) => {
        // Small delay to ensure URL has updated
        setTimeout(() => {
            preventAuthPageNavigation();
        }, 0);
    });

    // Intercept click events on links
    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const link = target.closest('a');
        
        if (link && isUserLoggedIn()) {
            const href = link.getAttribute('href');
            if (href) {
                const authPages = ['/login', '/sign-up', '/reset-password'];
                const targetPath = href.startsWith('/') ? href : new URL(href, window.location.origin).pathname;
                
                if (authPages.includes(targetPath)) {
                    event.preventDefault();
                    event.stopPropagation();
                    // Redirect to home instead
                    window.location.href = '/';
                }
            }
        }
    }, true); // Use capture phase

    // Check on page load
    window.addEventListener('load', () => {
        preventAuthPageNavigation();
    });

    // Check when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            preventAuthPageNavigation();
        });
    } else {
        preventAuthPageNavigation();
    }

    // Original fetch interceptor logic
    window.fetch = async function (input: URL | RequestInfo, init?: RequestInit) {
        const executeRequest = () => originalFetch(input, init);

        try {
            const response = await executeRequest();
            const clonedResponse = response.clone();

            // Enhanced session validation on response
            if (
                clonedResponse.status === 403 ||
                clonedResponse.status === 401
            ) {
                // Clear all authentication data immediately
                try {
                    await originalFetch("/api/logout", { method: "POST" });
                } catch (error) {
                    console.error("Error during logout:", error);
                }

                // Force redirect to login
                window.location.href = "/login";
                return response;
            }

            // Additional check for expired sessions in response body
            if (clonedResponse.ok) {
                try {
                    const responseData = await clonedResponse.clone().json();
                    if (
                        responseData &&
                        (responseData.code === "SESSION_EXPIRED" ||
                            responseData.message?.includes("session"))
                    ) {
                        try {
                            await originalFetch("/api/logout", {
                                method: "POST",
                            });
                        } catch (error) {
                            console.error("Error during logout:", error);
                        }
                        window.location.href = "/login";
                        return response;
                    }
                } catch (error) {
                    // Not JSON response, continue normally
                    console.debug("Failed to parse response as JSON:", error);
                }
            }

            // Handle 401 responses with token refresh
            if (clonedResponse.status === 401) {
                // If we're already refreshing, queue this request
                if (refreshState.isRefreshing) {
                    return new Promise((resolve, reject) => {
                        requestQueue.push({
                            request: () =>
                                executeRequest()
                                    .then((response) => {
                                        resolve(response);
                                        return response;
                                    })
                                    .catch((error) => {
                                        reject(error);
                                        throw error;
                                    }),
                        });
                    });
                }

                // Check rate limiting
                if (isRateLimited()) {
                    console.warn("Token refresh rate limit reached");
                    try {
                        await originalFetch("/api/logout", { method: "POST" });
                        window.location.href = "/login";
                        return response;
                    } catch (error) {
                        console.error("Error during logout:", error);
                    }
                }

                // Start refreshing token
                refreshState.isRefreshing = true;
                refreshHistory.push(Date.now());

                try {
                    const res = await originalFetch("/api/refreshToken", {
                        method: "POST",
                    });

                    if (res.ok) {
                        // Token refresh successful, retry the original request and process queue
                        refreshState.isRefreshing = false;
                        await processQueue(true);
                        return executeRequest();
                    } else if (res.status === 401) {
                        console.warn("Session expired or refresh failed");
                        refreshState.isRefreshing = false;
                        await processQueue(false);
                        try {
                            await originalFetch("/api/logout", {
                                method: "POST",
                            });
                            window.location.href = "/login";
                        } catch (error) {
                            console.error("Error during logout:", error);
                        }
                    } else {
                        refreshState.isRefreshing = false;
                        await processQueue(false); // Still try to process queue on other errors
                    }
                } catch (err) {
                    console.error("Token refresh error:", err);
                    refreshState.isRefreshing = false;
                }
            }

            // Always return the original response so it can be properly inspected
            return response;
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    };
};
