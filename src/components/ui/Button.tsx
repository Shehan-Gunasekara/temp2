import React from "react";
import { cn } from "../../utils/classNames";

type ButtonProps<T extends React.ElementType = "button"> = {
  as?: T; // Specifies the element type to render
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<T>; // Ensures props match the specified element

export function Button<T extends React.ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Component = as || "button"; // Default to "button" if no `as` is provided

  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none";

  const variants = {
    primary: "bg-black text-white hover:bg-black/90",
    secondary:
      "bg-white/10 backdrop-blur-sm text-black border border-black/10 hover:bg-white/20",
    ghost: "text-black/60 hover:text-black hover:bg-black/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <Component
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
