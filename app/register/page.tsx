"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterForm } from "@/lib/validation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { showToast } from "@/components/ui/Toast";

const roles = [
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
  { value: "coach", label: "Coach" },
  { value: "school-admin", label: "School Admin" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setBackendErrors({});
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        // Zod error flattening
        if (result.error && result.error.fieldErrors) {
          setBackendErrors(result.error.fieldErrors);
        } else {
          showToast.error("Registration failed", result.error || "Could not create account.");
        }
      } else {
        setSuccess(true);
        showToast.success("Account created", "You can now sign in.");
        setTimeout(() => router.push("/signin"), 1500);
      }
    } catch (err) {
      showToast.error("Network error", "Could not create account.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow rounded-lg p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Registration Successful</h1>
          <p className="mb-4">Your account has been created. You can now sign in.</p>
          <a href="/signin" className="text-primary-600 hover:underline">Go to Sign In</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow rounded-lg p-8 w-full max-w-md space-y-6"
        noValidate
      >
        <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input {...register("name")}
            type="text"
            placeholder="Your name"
            disabled={isLoading}
            aria-invalid={!!errors.name || !!backendErrors.name}
          />
          {(errors.name || backendErrors.name) && <p className="text-red-600 text-xs mt-1">{errors.name?.message || backendErrors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input {...register("email")}
            type="email"
            placeholder="you@email.com"
            disabled={isLoading}
            aria-invalid={!!errors.email || !!backendErrors.email}
          />
          {(errors.email || backendErrors.email) && <p className="text-red-600 text-xs mt-1">{errors.email?.message || backendErrors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input {...register("password")}
            type="password"
            placeholder="Password"
            disabled={isLoading}
            aria-invalid={!!errors.password || !!backendErrors.password}
          />
          {(errors.password || backendErrors.password) && <p className="text-red-600 text-xs mt-1">{errors.password?.message || backendErrors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <Input {...register("confirmPassword")}
            type="password"
            placeholder="Confirm password"
            disabled={isLoading}
            aria-invalid={!!errors.confirmPassword || !!backendErrors.confirmPassword}
          />
          {(errors.confirmPassword || backendErrors.confirmPassword) && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword?.message || backendErrors.confirmPassword}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            {...register("role")}
            className="w-full border px-3 py-2 rounded"
            disabled={isLoading}
            aria-invalid={!!errors.role || !!backendErrors.role}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
          {(errors.role || backendErrors.role) && <p className="text-red-600 text-xs mt-1">{errors.role?.message || backendErrors.role}</p>}
        </div>
        <div className="flex items-center">
          <input
            {...register("agreeToTerms")}
            type="checkbox"
            id="agreeToTerms"
            disabled={isLoading}
            className="mr-2"
          />
          <label htmlFor="agreeToTerms" className="text-sm">
            I agree to the <a href="/terms" className="underline">terms and conditions</a>
          </label>
        </div>
        {(errors.agreeToTerms || backendErrors.agreeToTerms) && <p className="text-red-600 text-xs mt-1">{errors.agreeToTerms?.message || backendErrors.agreeToTerms}</p>}
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? <span className="flex items-center justify-center"><span className="animate-spin mr-2">⏳</span>Registering...</span> : "Register"}
        </Button>
        <div className="text-center text-sm text-gray-600">
          Already have an account? <a href="/signin" className="text-primary-600 hover:underline">Sign in</a>
        </div>
      </form>
    </main>
  );
} 