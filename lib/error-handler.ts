import { NextResponse } from 'next/server';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  context?: Record<string, any>;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  code: string;
  context: Record<string, any>;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    context: Record<string, any> = {},
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
    this.code = code;
    this.context = context;
    this.isOperational = isOperational;

    // Capture stack trace
    Error.captureStackTrace(this, CustomError);
  }
}

// Predefined error types
export class ValidationError extends CustomError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', context);
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication required', context?: Record<string, any>) {
    super(message, 401, 'AUTHENTICATION_ERROR', context);
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Insufficient permissions', context?: Record<string, any>) {
    super(message, 403, 'AUTHORIZATION_ERROR', context);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found', context?: Record<string, any>) {
    super(message, 404, 'NOT_FOUND_ERROR', context);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Resource conflict', context?: Record<string, any>) {
    super(message, 409, 'CONFLICT_ERROR', context);
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Rate limit exceeded', context?: Record<string, any>) {
    super(message, 429, 'RATE_LIMIT_ERROR', context);
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string = 'Database operation failed', context?: Record<string, any>) {
    super(message, 500, 'DATABASE_ERROR', context);
  }
}

export class ExternalServiceError extends CustomError {
  constructor(message: string = 'External service error', context?: Record<string, any>) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', context);
  }
}

// Error logging utility
export class ErrorLogger {
  private static isDevelopment = process.env.NODE_ENV === 'development';

  static log(error: AppError | Error, context?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      message: error.message,
      stack: error.stack,
      statusCode: 'statusCode' in error ? error.statusCode : 500,
      code: 'code' in error ? error.code : 'UNKNOWN_ERROR',
      context: {
        ...('context' in error ? error.context : {}),
        ...context,
      },
    };

    if (this.isDevelopment) {
      console.error('🚨 Application Error:', errorInfo);
    } else {
      // In production, you might want to send to external logging service
      console.error(JSON.stringify(errorInfo));
      
      // Example: Send to external logging service
      // this.sendToLogService(errorInfo);
    }

    // Store in local storage for user error reporting (client-side only)
    if (typeof window !== 'undefined') {
      try {
        const errorHistory = JSON.parse(localStorage.getItem('errorHistory') || '[]');
        errorHistory.push(errorInfo);
        
        // Keep only last 10 errors
        if (errorHistory.length > 10) {
          errorHistory.shift();
        }
        
        localStorage.setItem('errorHistory', JSON.stringify(errorHistory));
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }

  // Client-side error reporting
  static reportClientError(error: Error, additionalContext?: Record<string, any>) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      ...additionalContext,
    };

    this.log(error, errorInfo);

    // Send to server for aggregation
    fetch('/api/client-errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorInfo),
    }).catch(() => {
      // Ignore if error reporting fails
    });
  }
}

// API error handler for Next.js routes
export function handleApiError(error: unknown): NextResponse {
  let appError: AppError;

  if (error instanceof CustomError) {
    appError = error;
  } else if (error instanceof Error) {
    appError = new CustomError(
      error.message || 'An unexpected error occurred',
      500,
      'INTERNAL_ERROR',
      { originalError: error.name }
    );
  } else {
    appError = new CustomError(
      'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR',
      { error: String(error) }
    );
  }

  // Log the error
  ErrorLogger.log(appError);

  // Return appropriate response
  return NextResponse.json(
    {
      error: {
        message: appError.message,
        code: appError.code,
        ...(process.env.NODE_ENV === 'development' && {
          stack: appError.stack,
          context: appError.context,
        }),
      },
    },
    { status: appError.statusCode || 500 }
  );
}

// React error boundary utility
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}

// Error recovery suggestions
export function getErrorRecoveryActions(error: AppError): string[] {
  const actions: string[] = [];

  switch (error.code) {
    case 'AUTHENTICATION_ERROR':
      actions.push('Please log in again');
      actions.push('Check your credentials');
      break;
    case 'AUTHORIZATION_ERROR':
      actions.push('Contact your administrator for access');
      actions.push('Verify your account permissions');
      break;
    case 'VALIDATION_ERROR':
      actions.push('Please check your input and try again');
      actions.push('Ensure all required fields are filled');
      break;
    case 'NOT_FOUND_ERROR':
      actions.push('Check the URL and try again');
      actions.push('Go back to the previous page');
      break;
    case 'RATE_LIMIT_ERROR':
      actions.push('Please wait a moment and try again');
      actions.push('Reduce the frequency of your requests');
      break;
    case 'DATABASE_ERROR':
    case 'EXTERNAL_SERVICE_ERROR':
      actions.push('Please try again in a few moments');
      actions.push('Contact support if the problem persists');
      break;
    default:
      actions.push('Please refresh the page and try again');
      actions.push('Contact support if the problem persists');
  }

  return actions;
}

// Async operation wrapper with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: Record<string, any>
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    let appError: AppError;

    if (error instanceof CustomError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = new CustomError(
        error.message,
        500,
        'OPERATION_ERROR',
        { ...context, originalError: error.name }
      );
    } else {
      appError = new CustomError(
        'Operation failed',
        500,
        'UNKNOWN_ERROR',
        { ...context, error: String(error) }
      );
    }

    ErrorLogger.log(appError);
    return { data: null, error: appError };
  }
}