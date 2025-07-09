/* eslint-disable react/jsx-no-bind */
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loginSchema, type LoginForm as LoginFormData } from '@/lib/validation';
import { authToasts, formToasts, rateLimitToasts } from '@/components/ui/Toast';
import { ErrorLogger } from '@/lib/error-handler';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface LoginFormProps {
  className?: string;
  redirectTo?: string;
}

export default function LoginForm({ className, redirectTo = '/dashboard' }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    clearErrors();

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Handle different types of authentication errors
        if (result.error === 'CredentialsSignin') {
          setError('email', { message: 'Invalid email or password' });
          setError('password', { message: 'Invalid email or password' });
          authToasts.loginError('Invalid email or password');
        } else if (result.error === 'not_verified') {
          setError('email', { message: 'Account not verified. Please check your email.' });
          authToasts.loginError('Account not verified. Please check your email.');
        } else if (result.error.toLowerCase().includes('too many login attempts')) {
          rateLimitToasts.loginRateLimited();
        } else {
          authToasts.loginError('An error occurred during login');
        }

        ErrorLogger.reportClientError(new Error(`Login failed: ${result.error}`), {
          email: data.email,
          errorType: 'authentication',
        });
      } else if (result?.ok) {
        authToasts.loginSuccess();
        router.push(redirectTo);
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      authToasts.loginError('An unexpected error occurred');
      
      ErrorLogger.reportClientError(error as Error, {
        email: data.email,
        context: 'login_form_submission',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: 'demo@syrarobot.com',
        password: 'password123',
        redirect: false,
      });

      if (result?.ok) {
        authToasts.loginSuccess('Demo User');
        router.push(redirectTo);
      } else {
        formToasts.saveError('Demo login failed');
      }
    } catch (error) {
      formToasts.networkError();
      ErrorLogger.reportClientError(error as Error, {
        context: 'demo_login',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getFieldError = (fieldName: keyof LoginFormData) => {
    const error = errors[fieldName];
    return error?.message;
  };

  const isFieldValid = (fieldName: keyof LoginFormData) => {
    return touchedFields[fieldName] && !errors[fieldName];
  };

  return (
    <div className={cn('space-y-6', className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <div className="relative">
            <Input
              {...register('email')}
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              disabled={isLoading}
              className={cn(
                'transition-colors',
                errors.email && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                isFieldValid('email') && 'border-green-300 focus:border-green-500 focus:ring-green-500'
              )}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </div>
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-red-600"
              role="alert"
            >
              {getFieldError('email')}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <Input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isLoading}
              className={cn(
                'pr-10 transition-colors',
                errors.password && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                isFieldValid('password') && 'border-green-300 focus:border-green-500 focus:ring-green-500'
              )}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              disabled={isLoading}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              className="text-sm text-red-600"
              role="alert"
            >
              {getFieldError('password')}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
          className="relative"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Demo Login Button */}
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="relative"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading Demo...
            </>
          ) : (
            'Try Demo Account'
          )}
        </Button>
      </form>

      {/* Additional Links */}
      <div className="text-center space-y-2">
        <a
          href="/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
        >
          Forgot your password?
        </a>
        <div className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a
            href="/register"
            className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
          >
            Sign up
          </a>
        </div>
      </div>

      {/* Demo Credentials Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Demo Credentials
        </h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Email:</strong> demo@syrarobot.com</p>
          <p><strong>Password:</strong> password123</p>
        </div>
      </div>
    </div>
  );
}