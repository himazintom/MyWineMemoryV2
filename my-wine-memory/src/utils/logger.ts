/**
 * Unified logging system
 * Replaces console.log/error/warn throughout the application
 */

import { errorTrackingService } from '../services/errorTrackingService';

const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

type LogLevel = typeof LogLevel[keyof typeof LogLevel];

interface LogMetadata {
  [key: string]: unknown;
}

class Logger {
  private level: LogLevel;
  private enableConsole: boolean;

  constructor() {
    // In production, only show warnings and errors
    this.level = import.meta.env.PROD ? LogLevel.WARN : LogLevel.DEBUG;
    this.enableConsole = !import.meta.env.PROD;
  }

  /**
   * Debug level logging (development only)
   */
  debug(message: string, meta?: LogMetadata): void {
    if (this.level <= LogLevel.DEBUG && this.enableConsole) {
      console.log(`[DEBUG] ${message}`, meta || '');
    }
  }

  /**
   * Info level logging
   */
  info(message: string, meta?: LogMetadata): void {
    if (this.level <= LogLevel.INFO && this.enableConsole) {
      console.info(`[INFO] ${message}`, meta || '');
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, meta?: LogMetadata): void {
    if (this.level <= LogLevel.WARN) {
      if (this.enableConsole) {
        console.warn(`[WARN] ${message}`, meta || '');
      }

      // Send to monitoring in production
      if (import.meta.env.PROD) {
        this.sendToMonitoring('warn', message, meta);
      }
    }
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | unknown, meta?: LogMetadata): void {
    if (this.level <= LogLevel.ERROR) {
      if (this.enableConsole) {
        console.error(`[ERROR] ${message}`, error, meta || '');
      }

      // Always send errors to tracking service
      if (error instanceof Error) {
        errorTrackingService.captureException(error, meta as any);
      } else {
        // Create Error object for non-Error errors
        const err = new Error(message);
        errorTrackingService.captureException(err, meta as any);
      }
    }
  }

  /**
   * Send log to monitoring service
   */
  private sendToMonitoring(
    level: string,
    message: string,
    _meta?: LogMetadata
  ): void {
    if (import.meta.env.PROD) {
      // In production, could send to analytics service
      // analyticsService.track('log', { level, message, ..._meta });

      // For now, use error tracking service
      if (level === 'warn') {
        errorTrackingService.captureMessage(message, 'warning');
      }
    }
  }

  /**
   * Set log level programmatically
   */
  setLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    const levelMap: Record<string, LogLevel> = {
      debug: LogLevel.DEBUG,
      info: LogLevel.INFO,
      warn: LogLevel.WARN,
      error: LogLevel.ERROR,
    };
    this.level = levelMap[level] ?? LogLevel.INFO;
  }

  /**
   * Group related logs
   */
  group(label: string): void {
    if (this.enableConsole) {
      console.group(label);
    }
  }

  /**
   * End log group
   */
  groupEnd(): void {
    if (this.enableConsole) {
      console.groupEnd();
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience type for metadata
export type { LogMetadata };
