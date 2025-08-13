/**
 * Offline Indicator Component
 * Shows offline/online status and sync information
 */

import React from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useOfflineSync } from '../hooks/useOfflineSync';
import './OfflineIndicator.css';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline, connectionType, isSlowConnection, getOfflineDuration } = useNetworkStatus();
  const { syncQueueCount, isSyncing, drafts } = useOfflineSync();

  // Don't show anything if online and no pending sync
  if (isOnline && !wasOffline && syncQueueCount === 0 && !isSyncing) {
    return null;
  }

  const offlineDuration = getOfflineDuration();
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}分${seconds > 0 ? seconds + '秒' : ''}`;
    }
    return `${seconds}秒`;
  };

  return (
    <div className={`offline-indicator ${isOnline ? 'online' : 'offline'} ${wasOffline ? 'reconnected' : ''}`}>
      {/* Offline Status */}
      {!isOnline && (
        <div className="offline-status">
          <div className="status-icon">📶</div>
          <div className="status-text">
            <div className="status-title">オフライン</div>
            {offlineDuration && (
              <div className="status-subtitle">
                {formatDuration(offlineDuration)} 経過
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reconnection Status */}
      {isOnline && wasOffline && (
        <div className="reconnected-status">
          <div className="status-icon">✅</div>
          <div className="status-text">
            <div className="status-title">再接続しました</div>
            {syncQueueCount > 0 && (
              <div className="status-subtitle">
                {syncQueueCount}件の変更を同期中...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slow Connection Warning */}
      {isOnline && isSlowConnection && (
        <div className="slow-connection">
          <div className="status-icon">🐌</div>
          <div className="status-text">
            <div className="status-title">接続が遅い</div>
            <div className="status-subtitle">
              {connectionType === 'cellular' ? 'モバイル通信' : '低速回線'}
            </div>
          </div>
        </div>
      )}

      {/* Sync Status */}
      {isSyncing && (
        <div className="syncing-status">
          <div className="status-icon spinner">🔄</div>
          <div className="status-text">
            <div className="status-title">同期中...</div>
            <div className="status-subtitle">
              {syncQueueCount}件の変更を処理中
            </div>
          </div>
        </div>
      )}

      {/* Draft Count */}
      {drafts.length > 0 && (
        <div className="draft-count">
          <div className="status-icon">💾</div>
          <div className="status-text">
            <div className="status-title">{drafts.length}件の下書き</div>
            <div className="status-subtitle">
              ローカルに保存済み
            </div>
          </div>
        </div>
      )}
    </div>
  );
};