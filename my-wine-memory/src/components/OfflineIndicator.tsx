/**
 * Offline Indicator Component
 * Shows offline/online status and sync information
 */

import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import './OfflineIndicator.css';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [visible, setVisible] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  // Show notification when connection status changes
  useEffect(() => {
    if (!isOnline) {
      // Show offline immediately
      setVisible(true);
      setShowReconnected(false);
    } else if (wasOffline) {
      // Show reconnected notification for 3 seconds
      setShowReconnected(true);
      setVisible(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // Hide when online and not reconnecting
      setVisible(false);
      setShowReconnected(false);
    }
  }, [isOnline, wasOffline]);

  // Don't render if not visible
  if (!visible) {
    return null;
  }


  return (
    <div className={`offline-indicator toast ${!isOnline ? 'offline' : 'online'} ${showReconnected ? 'reconnected' : ''}`}>
      {!isOnline ? (
        <div className="notification-content">
          <div className="status-icon">📶</div>
          <div className="status-text">
            <div className="status-title">オフライン</div>
          </div>
        </div>
      ) : showReconnected ? (
        <div className="notification-content">
          <div className="status-icon">✅</div>
          <div className="status-text">
            <div className="status-title">再接続しました</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};