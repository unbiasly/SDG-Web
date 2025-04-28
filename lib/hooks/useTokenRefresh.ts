// hooks/useTokenRefresh.ts
import { useEffect } from 'react';

export const useTokenRefresh = (intervalMs: number = 9 * 60 * 1000) => {
  useEffect(() => {
    let active = true;

    const refresh = async () => {
      try {
        const res = await fetch('/api/refreshToken', {
          method: 'POST',
        });

        if (!res.ok && res.status === 401) {
          console.warn('Session expired or refresh failed');
          // Optional: redirect to login or set a logout state
          try {
            await fetch('/api/logout',{
                method: 'POST'
            });
            window.location.href = '/login';
            } catch (error) {
                console.error('Error during logout:', error);
            }

        }
      } catch (err) {
        console.error('Token refresh error:', err);
      }
    };

    // Refresh once immediately
    refresh();

    // Refresh every interval
    const interval = setInterval(() => {
      if (active) refresh();
    }, intervalMs);

    // Refresh when user focuses tab
    // const onFocus = () => refresh();
    // window.addEventListener('visibilitychange', onFocus);

    return () => {
      active = false;
      clearInterval(interval);
    //   window.removeEventListener('visibilitychange', onFocus);
    };
  }, [intervalMs]);
};
