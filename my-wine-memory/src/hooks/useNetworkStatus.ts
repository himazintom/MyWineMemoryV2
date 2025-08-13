import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
  connectionType: 'wifi' | 'cellular' | 'unknown';
  isSlowConnection: boolean;
  lastOnlineTime: number | null;
  lastOfflineTime: number | null;
}

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    wasOffline: false,
    connectionType: 'unknown',
    isSlowConnection: false,
    lastOnlineTime: navigator.onLine ? Date.now() : null,
    lastOfflineTime: null
  });

  // Check connection type and speed
  const updateConnectionInfo = useCallback(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const connectionType = connection.type === 'wifi' ? 'wifi' : 
                           connection.type === 'cellular' ? 'cellular' : 'unknown';
      
      // Consider connection slow if effective type is 'slow-2g' or '2g'
      const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                              connection.effectiveType === '2g' ||
                              connection.downlink < 1.5; // Less than 1.5 Mbps

      setStatus(prev => ({
        ...prev,
        connectionType,
        isSlowConnection
      }));
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: true,
        lastOnlineTime: Date.now(),
        wasOffline: prev.wasOffline || !prev.isOnline
      }));
      
      updateConnectionInfo();
      
      // Clear wasOffline flag after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, wasOffline: false }));
      }, 5000);
    };

    const handleOffline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        lastOfflineTime: Date.now(),
        wasOffline: true
      }));
    };

    const handleConnectionChange = () => {
      updateConnectionInfo();
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection changes (mobile networks)
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Initial connection info update
    updateConnectionInfo();

    // Periodic connectivity check
    const connectivityCheck = setInterval(() => {
      // Simple connectivity test using a small image request
      if (navigator.onLine) {
        const img = new Image();
        img.onload = () => {
          if (!status.isOnline) {
            handleOnline();
          }
        };
        img.onerror = () => {
          if (status.isOnline) {
            handleOffline();
          }
        };
        // Use a small favicon or 1x1 pixel image for connectivity test
        img.src = '/favicon.ico?' + Date.now();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
      
      clearInterval(connectivityCheck);
    };
  }, [updateConnectionInfo, status.isOnline]);

  // Helper methods
  const getOfflineDuration = useCallback((): number | null => {
    if (status.isOnline || !status.lastOfflineTime) return null;
    return Date.now() - status.lastOfflineTime;
  }, [status.isOnline, status.lastOfflineTime]);

  const getOnlineDuration = useCallback((): number | null => {
    if (!status.isOnline || !status.lastOnlineTime) return null;
    return Date.now() - status.lastOnlineTime;
  }, [status.isOnline, status.lastOnlineTime]);

  return {
    ...status,
    getOfflineDuration,
    getOnlineDuration
  };
};