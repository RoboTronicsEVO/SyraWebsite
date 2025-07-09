'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ErrorLogger, getErrorMessage, getErrorRecoveryActions, AppError } from '@/lib/error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  showDetails: boolean;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    ErrorLogger.reportClientError(error, {
      errorBoundary: true,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
    });

    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        showDetails: false,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false,
      retryCount: 0,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportBug = () => {
    const { error, errorInfo, errorId } = this.state;
    const bugReport = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    // In a real app, you might send this to a bug tracking service
    console.log('Bug Report:', bugReport);
    
    // For now, copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(bugReport, null, 2)).then(() => {
      alert('Error details copied to clipboard. Please paste this information when reporting the bug.');
    });
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, errorId, showDetails, retryCount } = this.state;
      const errorMessage = getErrorMessage(error);
      const canRetry = retryCount < this.maxRetries;
      
      // Get recovery actions based on error type
      const recoveryActions = error && 'code' in error 
        ? getErrorRecoveryActions(error as AppError)
        : ['Please refresh the page and try again', 'Contact support if the problem persists'];

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            {/* Error Icon and Title */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 text-sm">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </div>

            {/* Error Message */}
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-800 text-sm font-medium">
                {errorMessage}
              </p>
              {errorId && (
                <p className="text-red-600 text-xs mt-1">
                  Error ID: {errorId}
                </p>
              )}
            </div>

            {/* Recovery Actions */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                What you can do:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {recoveryActions.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-4">
              {canRetry && (
                <Button
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="primary"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again ({this.maxRetries - retryCount} attempts left)
                </Button>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
                
                <Button
                  onClick={this.handleReportBug}
                  variant="outline"
                  className="w-full"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Report Bug
                </Button>
              </div>
            </div>

            {/* Error Details Toggle */}
            {(this.props.showErrorDetails || process.env.NODE_ENV === 'development') && (
              <div className="border-t pt-4">
                <button
                  onClick={this.toggleDetails}
                  className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <span>Technical Details</span>
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                
                {showDetails && (
                  <div className="mt-3 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 max-h-32 overflow-y-auto">
                    <div className="mb-2">
                      <strong>Error:</strong> {error?.message}
                    </div>
                    {error?.stack && (
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                      </div>
                    )}
                    {errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">{errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
}

// Simple error fallback component
export function SimpleErrorFallback({ 
  error, 
  resetError 
}: { 
  error?: Error; 
  resetError?: () => void; 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      {resetError && (
        <Button onClick={resetError} variant="outline" size="sm">
          Try again
        </Button>
      )}
    </div>
  );
}