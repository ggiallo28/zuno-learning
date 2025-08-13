import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Mobile-friendly sizing and touch support
          "min-h-[44px] touch-manipulation",
          // Error state styling
          error && "border-destructive focus-visible:ring-destructive",
          // High contrast mode support
          "border-2",
          className
        )}
        ref={ref}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid || error}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

