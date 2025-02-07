import * as React from "react"

import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  dark?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, dark, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground",
        dark && "bg-card-dark text-card-foreground-dark",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, dark, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        dark && "bg-card-header-dark text-card-header-foreground-dark",
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, dark, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight",
        dark && "text-card-title-dark",
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, dark, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground",
        dark && "text-muted-foreground-dark",
        className
      )}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, dark, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-6 pt-0",
        dark && "bg-card-content-dark text-card-content-foreground-dark",
        className
      )}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, dark, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-0",
        dark && "bg-card-footer-dark text-card-footer-foreground-dark",
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
