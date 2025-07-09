'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Base skeleton component
interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 rounded',
        animate && 'animate-pulse',
        className
      )}
    />
  );
}

// Card skeleton
export function CardSkeleton({ animate = true }: { animate?: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" animate={animate} />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" animate={animate} />
        <Skeleton className="h-3 w-5/6" animate={animate} />
        <Skeleton className="h-3 w-4/6" animate={animate} />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-8 w-20" animate={animate} />
        <Skeleton className="h-8 w-16" animate={animate} />
      </div>
    </div>
  );
}

// Button skeleton
export function ButtonSkeleton({ 
  className, 
  animate = true 
}: { 
  className?: string; 
  animate?: boolean; 
}) {
  return (
    <Skeleton 
      className={cn('h-10 w-24 rounded-md', className)} 
      animate={animate} 
    />
  );
}

// Input skeleton
export function InputSkeleton({ 
  className, 
  animate = true 
}: { 
  className?: string; 
  animate?: boolean; 
}) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" animate={animate} />
      <Skeleton 
        className={cn('h-10 w-full rounded-md', className)} 
        animate={animate} 
      />
    </div>
  );
}

// Avatar skeleton
export function AvatarSkeleton({ 
  size = 'md', 
  animate = true 
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  animate?: boolean; 
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <Skeleton 
      className={cn('rounded-full', sizeClasses[size])} 
      animate={animate} 
    />
  );
}

// Table skeleton
export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  animate = true 
}: { 
  rows?: number; 
  columns?: number; 
  animate?: boolean; 
}) {
  return (
    <div className="space-y-4">
      {/* Table header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 w-full" animate={animate} />
        ))}
      </div>
      
      {/* Table rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={`row-${rowIndex}`} 
            className="grid gap-4" 
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={`cell-${rowIndex}-${colIndex}`} 
                className="h-6 w-full" 
                animate={animate} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// List skeleton
export function ListSkeleton({ 
  items = 5, 
  showAvatar = false, 
  animate = true 
}: { 
  items?: number; 
  showAvatar?: boolean; 
  animate?: boolean; 
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          {showAvatar && <AvatarSkeleton animate={animate} />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" animate={animate} />
            <Skeleton className="h-3 w-1/2" animate={animate} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Competition card skeleton
export function CompetitionCardSkeleton({ animate = true }: { animate?: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Banner */}
      <Skeleton className="h-32 w-full rounded-none" animate={animate} />
      
      <div className="p-6 space-y-4">
        {/* Title and date */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-4/5" animate={animate} />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-24" animate={animate} />
            <Skeleton className="h-4 w-20" animate={animate} />
          </div>
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" animate={animate} />
          <Skeleton className="h-3 w-5/6" animate={animate} />
        </div>
        
        {/* Stats */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-16" animate={animate} />
            <Skeleton className="h-4 w-20" animate={animate} />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" animate={animate} />
        </div>
      </div>
    </div>
  );
}

// School card skeleton
export function SchoolCardSkeleton({ animate = true }: { animate?: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      <div className="flex items-start space-x-4">
        <AvatarSkeleton size="lg" animate={animate} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" animate={animate} />
          <Skeleton className="h-4 w-1/2" animate={animate} />
          <Skeleton className="h-3 w-full" animate={animate} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-1">
          <Skeleton className="h-3 w-16" animate={animate} />
          <Skeleton className="h-4 w-12" animate={animate} />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-20" animate={animate} />
          <Skeleton className="h-4 w-16" animate={animate} />
        </div>
      </div>
    </div>
  );
}

// Coach card skeleton
export function CoachCardSkeleton({ animate = true }: { animate?: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <AvatarSkeleton size="lg" animate={animate} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" animate={animate} />
          <Skeleton className="h-4 w-24" animate={animate} />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" animate={animate} />
            <Skeleton className="h-3 w-16" animate={animate} />
          </div>
        </div>
        <Skeleton className="h-8 w-20 rounded-md" animate={animate} />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" animate={animate} />
        <Skeleton className="h-3 w-4/5" animate={animate} />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" animate={animate} />
        <Skeleton className="h-6 w-20 rounded-full" animate={animate} />
        <Skeleton className="h-6 w-14 rounded-full" animate={animate} />
      </div>
    </div>
  );
}

// Post skeleton
export function PostSkeleton({ animate = true }: { animate?: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      {/* Author info */}
      <div className="flex items-center space-x-3">
        <AvatarSkeleton animate={animate} />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" animate={animate} />
          <Skeleton className="h-3 w-16" animate={animate} />
        </div>
      </div>
      
      {/* Title */}
      <Skeleton className="h-6 w-4/5" animate={animate} />
      
      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" animate={animate} />
        <Skeleton className="h-4 w-5/6" animate={animate} />
        <Skeleton className="h-4 w-3/4" animate={animate} />
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" animate={animate} />
        <Skeleton className="h-6 w-20 rounded-full" animate={animate} />
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-16" animate={animate} />
          <Skeleton className="h-8 w-20" animate={animate} />
        </div>
        <Skeleton className="h-8 w-14" animate={animate} />
      </div>
    </div>
  );
}

// Form skeleton
export function FormSkeleton({ 
  fields = 4, 
  animate = true 
}: { 
  fields?: number; 
  animate?: boolean; 
}) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, index) => (
        <InputSkeleton key={index} animate={animate} />
      ))}
      
      <div className="flex justify-end space-x-3 pt-4">
        <ButtonSkeleton className="w-20" animate={animate} />
        <ButtonSkeleton className="w-24" animate={animate} />
      </div>
    </div>
  );
}

// Dashboard skeleton
export function DashboardSkeleton({ animate = true }: { animate?: boolean }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" animate={animate} />
        <Skeleton className="h-4 w-96" animate={animate} />
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" animate={animate} />
              <Skeleton className="h-6 w-6 rounded" animate={animate} />
            </div>
            <Skeleton className="h-8 w-16" animate={animate} />
            <Skeleton className="h-3 w-24" animate={animate} />
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Skeleton className="h-6 w-32 mb-4" animate={animate} />
          <Skeleton className="h-64 w-full" animate={animate} />
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Skeleton className="h-6 w-28 mb-4" animate={animate} />
          <Skeleton className="h-64 w-full" animate={animate} />
        </div>
      </div>
    </div>
  );
}

// Full page loading skeleton
export function PageSkeleton({ animate = true }: { animate?: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" animate={animate} />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-24" animate={animate} />
            <AvatarSkeleton animate={animate} />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <DashboardSkeleton animate={animate} />
      </div>
    </div>
  );
}