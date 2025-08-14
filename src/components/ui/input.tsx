import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-required'?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    error, 
    'aria-describedby': ariaDescribedBy, 
    'aria-invalid': ariaInvalid,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-required': ariaRequired,
    ...props 
  }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Mobile-friendly sizing and touch support
          "min-h-[44px] touch-manipulation",
          // Error state styling
          error && "border-destructive focus-visible:ring-destructive border-2",
          // High contrast mode support
          "border-2 border-gray-200 focus:border-blue-500",
          // Enhanced focus and hover states
          "hover:border-gray-300 focus:ring-2 focus:ring-blue-200",
          className
        )}
        ref={ref}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid || error}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-required={ariaRequired}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

