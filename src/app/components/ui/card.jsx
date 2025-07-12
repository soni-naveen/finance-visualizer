import * as React from "react";

import { cn } from "@/lib/utils";

const Card = ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-slate-200 bg-white text-card-foreground shadow-xs",
      className
    )}
    {...props}
  />
);
Card.displayName = "Card";

const CardHeader = ({ className, chart, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 xs:p-6",
      chart ? "px-4 py-6" : "p-4",
      className
    )}
    {...props}
  />
);
CardHeader.displayName = "CardHeader";

const CardTitle = ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
);
CardTitle.displayName = "CardTitle";

const CardDescription = ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);
CardDescription.displayName = "CardDescription";

const CardContent = ({ className, chart, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("xs:p-6 pt-0", chart ? "p-3" : "p-4", className)}
    {...props}
  />
);
CardContent.displayName = "CardContent";

const CardFooter = ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
