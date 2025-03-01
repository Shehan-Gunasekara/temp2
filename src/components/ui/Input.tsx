import React from "react";
import { cn } from "../../utils/classNames";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  multiline?: boolean;
  rows?: number;
}

export function Input({
  label,
  multiline,
  rows = 4,
  className,
  ...props
}: InputProps) {
  const inputStyles = cn(
    "w-full rounded-xl bg-white/50 backdrop-blur-sm border border-black/5",
    "px-4 py-3 text-xs sm:text:sm text-black/80 placeholder:text-black/40",
    "focus:outline-none focus:ring-2 focus:ring-black/10",
    "transition-all duration-200",
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block sm:text-sm text-xs font-medium text-black/80">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          rows={rows}
          className={inputStyles}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input className={inputStyles} {...props} />
      )}
    </div>
  );
}
