// Explicit type declarations for tailwind-merge
// This file ensures compatibility across all IDEs and environments

declare module 'tailwind-merge' {
  export type ClassNameValue = string | undefined | null;

  export default function twMerge(...inputs: ClassNameValue[]): string;
  
  export function twMerge(...inputs: ClassNameValue[]): string;
}