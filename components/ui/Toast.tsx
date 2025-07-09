'use client';

import React from 'react';
import toast, { Toaster, Toast as ToastType } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom toast types
export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface CustomToastProps {
  t: ToastType;
  variant: ToastVariant;
  title: string;
  description?: string | undefined;
  action?: {
    label: string;
    onClick: () => void;
  } | undefined;
}

// Custom toast component
function CustomToast({ t, variant, title, description, action }: CustomToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    loading: (
      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
    ),
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
    loading: 'bg-gray-50 border-gray-200',
  };

  return (
    <div
      className={cn(
        'max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border',
        bgColors[variant],
        t.visible ? 'animate-enter' : 'animate-leave'
      )}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{icons[variant]}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
            {action && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    action.onClick();
                    toast.dismiss(t.id);
                  }}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}

// Toast utility functions
export const showToast = {
  success: (
    title: string,
    description?: string,
    action?: { label: string; onClick: () => void }
  ) => {
    return toast.custom((t) => (
      <CustomToast
        t={t}
        variant="success"
        title={title}
        description={description}
        action={action}
      />
    ));
  },

  error: (
    title: string,
    description?: string,
    action?: { label: string; onClick: () => void }
  ) => {
    return toast.custom((t) => (
      <CustomToast
        t={t}
        variant="error"
        title={title}
        description={description}
        action={action}
      />
    ));
  },

  warning: (
    title: string,
    description?: string,
    action?: { label: string; onClick: () => void }
  ) => {
    return toast.custom((t) => (
      <CustomToast
        t={t}
        variant="warning"
        title={title}
        description={description}
        action={action}
      />
    ));
  },

  info: (
    title: string,
    description?: string,
    action?: { label: string; onClick: () => void }
  ) => {
    return toast.custom((t) => (
      <CustomToast
        t={t}
        variant="info"
        title={title}
        description={description}
        action={action}
      />
    ));
  },

  loading: (title: string, description?: string) => {
    return toast.custom((t) => (
      <CustomToast
        t={t}
        variant="loading"
        title={title}
        description={description}
      />
    ));
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: (data: T) => string;
      error: (err: any) => string;
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

// Simple toast functions for quick use
export const toast_success = (message: string) => toast.success(message);
export const toast_error = (message: string) => toast.error(message);
export const toast_loading = (message: string) => toast.loading(message);

// Advanced toast configurations
export const toastConfig = {
  // Default configuration
  default: {
    duration: 4000,
    position: 'top-right' as const,
    style: {
      background: '#fff',
      color: '#363636',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    iconTheme: {
      primary: '#007A3D',
      secondary: '#fff',
    },
  },

  // Success configuration
  success: {
    duration: 3000,
    iconTheme: {
      primary: '#10B981',
      secondary: '#fff',
    },
  },

  // Error configuration
  error: {
    duration: 5000,
    iconTheme: {
      primary: '#EF4444',
      secondary: '#fff',
    },
  },

  // Loading configuration
  loading: {
    duration: Infinity,
    iconTheme: {
      primary: '#6B7280',
      secondary: '#fff',
    },
  },
};

// Form-specific toast helpers
export const formToasts = {
  validationError: (message: string = 'Please check your input and try again') => {
    showToast.error('Validation Error', message);
  },

  saveSuccess: (itemName: string = 'Item') => {
    showToast.success('Success', `${itemName} saved successfully`);
  },

  saveError: (error?: string) => {
    showToast.error(
      'Save Failed',
      error || 'Failed to save. Please try again.'
    );
  },

  deleteConfirm: (
    itemName: string,
    onConfirm: () => void
  ) => {
    showToast.warning(
      'Confirm Delete',
      `Are you sure you want to delete ${itemName}?`,
      {
        label: 'Delete',
        onClick: onConfirm,
      }
    );
  },

  deleteSuccess: (itemName: string = 'Item') => {
    showToast.success('Deleted', `${itemName} deleted successfully`);
  },

  deleteError: (error?: string) => {
    showToast.error(
      'Delete Failed',
      error || 'Failed to delete. Please try again.'
    );
  },

  networkError: () => {
    showToast.error(
      'Network Error',
      'Please check your connection and try again',
      {
        label: 'Retry',
        onClick: () => window.location.reload(),
      }
    );
  },

  unauthorized: () => {
    showToast.error(
      'Access Denied',
      'You need to log in to perform this action',
      {
        label: 'Login',
        onClick: () => (window.location.href = '/login'),
      }
    );
  },

  sessionExpired: () => {
    showToast.warning(
      'Session Expired',
      'Your session has expired. Please log in again.',
      {
        label: 'Login',
        onClick: () => (window.location.href = '/login'),
      }
    );
  },
};

// Auth-specific toast helpers
export const authToasts = {
  loginSuccess: (userName?: string) => {
    showToast.success(
      'Welcome back!',
      userName ? `Welcome back, ${userName}` : 'Successfully logged in'
    );
  },

  loginError: (error?: string) => {
    showToast.error(
      'Login Failed',
      error || 'Invalid credentials. Please try again.'
    );
  },

  logoutSuccess: () => {
    showToast.success('Logged Out', 'You have been successfully logged out');
  },

  registerSuccess: () => {
    showToast.success(
      'Account Created',
      'Your account has been created successfully'
    );
  },

  registerError: (error?: string) => {
    showToast.error(
      'Registration Failed',
      error || 'Failed to create account. Please try again.'
    );
  },

  passwordResetSent: (email: string) => {
    showToast.success(
      'Reset Link Sent',
      `Password reset instructions sent to ${email}`
    );
  },

  passwordResetSuccess: () => {
    showToast.success(
      'Password Updated',
      'Your password has been successfully updated'
    );
  },

  emailVerificationSent: (email: string) => {
    showToast.info(
      'Verification Sent',
      `Verification email sent to ${email}`,
      {
        label: 'Resend',
        onClick: () => {
          // Handle resend logic
          console.log('Resending verification email...');
        },
      }
    );
  },
};

// Competition-specific toast helpers
export const competitionToasts = {
  registrationSuccess: (competitionName: string) => {
    showToast.success(
      'Registration Complete',
      `Successfully registered for ${competitionName}`
    );
  },

  registrationError: (error?: string) => {
    showToast.error(
      'Registration Failed',
      error || 'Failed to register for competition'
    );
  },

  teamCreated: (teamName: string) => {
    showToast.success('Team Created', `Team "${teamName}" created successfully`);
  },

  scoringUpdate: (message: string) => {
    showToast.info('Score Update', message);
  },

  matchResult: (result: string) => {
    showToast.success('Match Complete', result);
  },
};

// Main Toaster component with custom configuration
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={toastConfig.default}
      containerStyle={{
        top: 20,
        right: 20,
      }}
    />
  );
}

// CSS for animations (add to global.css)
export const toastStyles = `
  @keyframes enter {
    0% {
      transform: translate3d(0, -200%, 0) scale(0.6);
      opacity: 0.5;
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
  }

  @keyframes leave {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, -200%, 0) scale(0.6);
      opacity: 0.5;
    }
  }

  .animate-enter {
    animation: enter 0.35s ease-out;
  }

  .animate-leave {
    animation: leave 0.4s ease-in forwards;
  }
`;

export default ToastProvider;