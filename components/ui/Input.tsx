import React, { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string | undefined;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      fullWidth = false,
      size = 'md',
      variant = 'default',
      leftIcon,
      rightIcon,
      loading = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const displayError = error;

    const baseClasses = cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      
      // Size variants
      {
        'h-8 px-2 text-xs': size === 'sm',
        'h-10 px-3 text-sm': size === 'md',
        'h-12 px-4 text-base': size === 'lg',
      },
      
      // Variant styles
      {
        'border-gray-300 bg-white focus:border-primary-500 focus:ring-primary-500': variant === 'default',
        'border-gray-200 bg-gray-50 focus:border-primary-500 focus:ring-primary-500': variant === 'filled',
        'border-2 border-gray-300 bg-transparent focus:border-primary-500': variant === 'outlined',
      },
      
      // Error states
      displayError && 'border-red-300 focus:border-red-500 focus:ring-red-500',
      
      // Width
      fullWidth && 'w-full',
      
      // Icon padding
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      
      className
    );

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium leading-6 text-gray-900',
              displayError && 'text-red-900'
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <div className="h-5 w-5 text-gray-400">{leftIcon}</div>
            </div>
          )}
          
          <input
            type={type}
            className={baseClasses}
            ref={ref}
            id={inputId}
            onBlur={props.onBlur}
            onChange={props.onChange}
            aria-invalid={!!displayError}
            aria-describedby={
              displayError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="h-5 w-5 text-gray-400">{rightIcon}</div>
            </div>
          )}
          
          {loading && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            </div>
          )}
        </div>
        
        {displayError && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {displayError}
          </p>
        )}
        
        {helperText && !displayError && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;