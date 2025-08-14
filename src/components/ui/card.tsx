import * as React from "react"

import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-label'?: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    interactive = false, 
    'aria-labelledby': ariaLabelledBy, 
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
        // No padding on the card itself - let children handle their own padding
        // Interactive card styles
        interactive && [
          "cursor-pointer hover:shadow-md hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]",
          // Touch-friendly for mobile
          "touch-manipulation select-none",
          // Minimum touch target size
          "min-h-[44px]"
        ],
        // High contrast mode support
        "border-2",
        className,
      )}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      {...(interactive && { tabIndex: 0, role: 'button' })}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 pb-2", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, level = 3, ...props }, ref) => {
    const headingProps = {
      ref,
      className: cn(
        "text-lg font-semibold leading-tight tracking-tight",
        // Responsive text sizing
        "text-responsive-lg",
        className,
      ),
      ...props
    };
    
    switch (level) {
      case 1:
        return <h1 {...headingProps} />;
      case 2:
        return <h2 {...headingProps} />;
      case 3:
        return <h3 {...headingProps} />;
      case 4:
        return <h4 {...headingProps} />;
      case 5:
        return <h5 {...headingProps} />;
      case 6:
        return <h6 {...headingProps} />;
      default:
        return <h3 {...headingProps} />;
    }
  }
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("px-4 pb-4", className)} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center px-4 pb-4", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

