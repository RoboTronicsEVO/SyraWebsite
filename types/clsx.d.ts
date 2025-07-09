// Explicit type declarations for clsx
// This file ensures compatibility across all IDEs and environments

declare module 'clsx' {
  export type ClassDictionary = Record<string, any>;
  
  export type ClassArray = ClassValue[];
  
  export type ClassValue =
    | ClassArray
    | ClassDictionary  
    | string
    | number
    | bigint
    | null
    | boolean
    | undefined;

  export default function clsx(...inputs: ClassValue[]): string;
  
  export function clsx(...inputs: ClassValue[]): string;
}