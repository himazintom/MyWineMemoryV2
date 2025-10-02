/**
 * Custom error classes for the application
 * Provides semantic error types for better error handling
 */

/**
 * Base application error
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends AppError {
  constructor(message: string, code: string = 'VALIDATION_ERROR') {
    super(message, code, 400);
  }
}

/**
 * Authentication error (401)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = '認証が必要です', code: string = 'AUTHENTICATION_ERROR') {
    super(message, code, 401);
  }
}

/**
 * Authorization error (403)
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'アクセス権限がありません', code: string = 'AUTHORIZATION_ERROR') {
    super(message, code, 403);
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string, code: string = 'NOT_FOUND') {
    super(`${resource}が見つかりません`, code, 404);
  }
}

/**
 * Conflict error (409)
 */
export class ConflictError extends AppError {
  constructor(message: string, code: string = 'CONFLICT') {
    super(message, code, 409);
  }
}

/**
 * Network error
 */
export class NetworkError extends AppError {
  constructor(message: string = 'ネットワークエラーが発生しました', code: string = 'NETWORK_ERROR') {
    super(message, code, 0);
  }
}

/**
 * Firebase error
 */
export class FirebaseError extends AppError {
  constructor(message: string, code: string = 'FIREBASE_ERROR') {
    super(message, code, 500);
  }
}

/**
 * Check if error is operational (expected) or programming error
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Get user-friendly error message
 */
export function getUserMessage(error: Error | unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Map common Firebase errors
    if (error.message.includes('auth/')) {
      if (error.message.includes('auth/user-not-found')) {
        return 'ユーザーが見つかりません';
      }
      if (error.message.includes('auth/wrong-password')) {
        return 'パスワードが正しくありません';
      }
      if (error.message.includes('auth/network-request-failed')) {
        return 'ネットワークエラーが発生しました';
      }
      return '認証エラーが発生しました';
    }

    if (error.message.includes('permission-denied')) {
      return 'アクセス権限がありません';
    }

    return error.message || '不明なエラーが発生しました';
  }

  return '不明なエラーが発生しました';
}
