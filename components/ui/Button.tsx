import * as React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Pre-defined size */
  size?: ButtonSize;
  /** Display a loading spinner and disable button */
  loading?: boolean;
  /** Icon element rendered before the children */
  startIcon?: ReactNode;
  /** Icon element rendered after the children */
  endIcon?: ReactNode;
  /** Make the button take the full width of its container */
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600',
  secondary:
    'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-600',
  outline:
    'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus-visible:ring-primary-600',
  ghost:
    'text-neutral-700 hover:bg-neutral-100 focus-visible:ring-primary-600',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

/**
 * Reusable button component following SyraRobot design system.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      startIcon,
      endIcon,
      fullWidth = false,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const isLoading = loading;
    const isDisabled = disabled || isLoading;

    const classes = cn(
      'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className,
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {/* Start icon or spinner */}
        {isLoading ? (
          <span className="mr-2 -ml-1">
            <Spinner />
          </span>
        ) : (
          startIcon && <span className="mr-2 -ml-1">{startIcon}</span>
        )}

        <span>{children}</span>

        {/* End icon */}
        {!isLoading && endIcon && <span className="ml-2 -mr-1">{endIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export default Button;