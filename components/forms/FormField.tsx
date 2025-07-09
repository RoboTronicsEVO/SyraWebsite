'use client';

import React, { forwardRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Input from '@/components/ui/Input';

interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'textarea' | 'select';
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  description?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  showValidationIcon?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({
    name,
    label,
    placeholder,
    type = 'text',
    disabled = false,
    required = false,
    autoComplete,
    description,
    options,
    rows = 3,
    min,
    max,
    step,
    className,
    showValidationIcon = true,
    ...props
  }, ref) => {
    const {
      control,
      formState: { errors, touchedFields, isSubmitting },
      watch,
    } = useFormContext();

    const error = errors[name];
    const isTouched = touchedFields[name];
    const value = watch(name);
    const hasValue = value && value.toString().length > 0;
    const isValid = isTouched && !error && hasValue;

    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const getErrorMessage = (error: any): string => {
      if (typeof error === 'string') return error;
      if (error && typeof error === 'object' && 'message' in error) {
        return error.message || 'Invalid input';
      }
      return 'Invalid input';
    };

    const renderInput = (field: any) => {
      const inputProps = {
        ...field,
        ...props,
        ref,
        placeholder,
        disabled: disabled || isSubmitting,
        autoComplete,
        className: cn(
          'w-full transition-colors',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
          isValid && 'border-green-300 focus:border-green-500 focus:ring-green-500',
          className
        ),
        'aria-invalid': !!error,
        'aria-describedby': error ? `${name}-error` : description ? `${name}-description` : undefined,
      };

      if (type === 'textarea') {
        return (
          <textarea
            {...inputProps}
            rows={rows}
            className={cn(
              'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm',
              'placeholder-gray-400 shadow-sm transition-colors',
              'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              inputProps.className
            )}
          />
        );
      }

      if (type === 'select' && options) {
        return (
          <select
            {...inputProps}
            className={cn(
              'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm',
              'bg-white shadow-sm transition-colors',
              'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              inputProps.className
            )}
          >
            <option value="">{placeholder || 'Select an option'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      if (type === 'number') {
        return (
          <Input
            {...inputProps}
            type="number"
            min={min}
            max={max}
            step={step}
          />
        );
      }

      return (
        <Input
          {...inputProps}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        />
      );
    };

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={cn('space-y-2', className)}>
            {/* Label */}
            {label && (
              <label
                htmlFor={name}
                className={cn(
                  'block text-sm font-medium text-gray-700',
                  required && "after:content-['*'] after:ml-0.5 after:text-red-500",
                  disabled && 'text-gray-400'
                )}
              >
                {label}
              </label>
            )}

            {/* Input Container */}
            <div className="relative">
              {renderInput(field)}

              {/* Validation Icon */}
              {showValidationIcon && (isTouched || error) && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {error ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : null}
                </div>
              )}

              {/* Password Toggle */}
              {type === 'password' && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={cn(
                    'absolute inset-y-0 right-0 flex items-center pr-3',
                    'text-gray-400 hover:text-gray-600 focus:outline-none',
                    showValidationIcon && (isTouched || error) && 'pr-10'
                  )}
                  disabled={disabled || isSubmitting}
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
              )}
            </div>

            {/* Description */}
            {description && !error && (
              <p
                id={`${name}-description`}
                className="text-sm text-gray-500"
              >
                {description}
              </p>
            )}

            {/* Error Message */}
            {error && (
              <p
                id={`${name}-error`}
                className="text-sm text-red-600 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {getErrorMessage(error)}
              </p>
            )}
          </div>
        )}
      />
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;