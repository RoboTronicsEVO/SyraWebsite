import { z } from 'zod';

// Base validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number');

// Auth form schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['student', 'parent', 'coach', 'school-admin'], {
    required_error: 'Please select a role',
  }),
  schoolCode: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Profile schemas
export const profileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
});

// School schemas
export const schoolSchema = z.object({
  name: z.string().min(2, 'School name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  phone: phoneSchema,
  email: emailSchema,
  principalName: nameSchema,
  roboticsCoordinatorEmail: emailSchema.optional(),
});

// Competition schemas
export const competitionSchema = z.object({
  name: z.string().min(3, 'Competition name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['knockout', 'leaderboard', 'sprint'], {
    required_error: 'Please select a competition type',
  }),
  startDate: z.string().refine(date => new Date(date) > new Date(), {
    message: 'Start date must be in the future',
  }),
  endDate: z.string(),
  registrationDeadline: z.string(),
  maxTeams: z.number().min(2, 'Must allow at least 2 teams').max(100, 'Maximum 100 teams allowed'),
  entryFee: z.number().min(0, 'Entry fee cannot be negative'),
  prizes: z.array(z.string()).min(1, 'At least one prize must be specified'),
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine(data => new Date(data.registrationDeadline) < new Date(data.startDate), {
  message: 'Registration deadline must be before start date',
  path: ['registrationDeadline'],
});

// Team schemas
export const teamSchema = z.object({
  name: z.string().min(2, 'Team name is required'),
  description: z.string().max(300, 'Description must be less than 300 characters').optional(),
  members: z.array(z.string()).min(1, 'At least one member is required').max(6, 'Maximum 6 members allowed'),
  coachId: z.string().optional(),
  schoolId: z.string().min(1, 'School selection is required'),
});

// Post/Community schemas
export const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(2000, 'Content must be less than 2000 characters'),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
  category: z.enum(['general', 'help', 'showcase', 'tutorial', 'announcement'], {
    required_error: 'Please select a category',
  }),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment must be less than 500 characters'),
  parentId: z.string().optional(), // For nested comments
});

// Coach booking schemas
export const coachBookingSchema = z.object({
  coachId: z.string().min(1, 'Coach selection is required'),
  sessionType: z.enum(['individual', 'team', 'workshop'], {
    required_error: 'Please select a session type',
  }),
  date: z.string().refine(date => new Date(date) > new Date(), {
    message: 'Session date must be in the future',
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
  duration: z.number().min(30, 'Minimum session duration is 30 minutes').max(240, 'Maximum session duration is 4 hours'),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
});

// Type exports for use in components
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type ProfileForm = z.infer<typeof profileSchema>;
export type SchoolForm = z.infer<typeof schoolSchema>;
export type CompetitionForm = z.infer<typeof competitionSchema>;
export type TeamForm = z.infer<typeof teamSchema>;
export type PostForm = z.infer<typeof postSchema>;
export type CommentForm = z.infer<typeof commentSchema>;
export type CoachBookingForm = z.infer<typeof coachBookingSchema>;

// Validation helper functions
export function validateField<T>(schema: z.ZodSchema<T>, value: T) {
  try {
    schema.parse(value);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Validation failed' };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}

export function validateForm<T>(schema: z.ZodSchema<T>, data: T) {
  try {
    const result = schema.parse(data);
    return { success: true, data: result, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      return { success: false, data: null, errors: fieldErrors };
    }
    return { success: false, data: null, errors: { general: 'Unknown validation error' } };
  }
}