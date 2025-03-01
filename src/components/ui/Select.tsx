import React, { useRef, useState, useEffect } from "react";
import { cn } from "../../utils/classNames";
import { ChevronDown, Info } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  info?: string;
}

export function Select({ label, options, className, info, ...props }: SelectProps) {
  const [showInfo, setShowInfo] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !infoButtonRef.current?.contains(event.target as Node)
      ) {
        setShowInfo(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center gap-2">
          <label className="block sm:text-sm text-xs font-medium text-black/80">
            {label}
          </label>
          {info && (
            <div className="relative inline-block">
              <button
                ref={infoButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowInfo(!showInfo);
                }}
                className="text-gray-400 hover:text-gray-300 focus:outline-none"
                aria-label="Show information"
              >
                <Info size={16} />
              </button>
              {showInfo && (
                <div
                  ref={tooltipRef}
                  className="absolute z-10 p-4 bg-gray-800 rounded-lg shadow-lg text-sm text-gray-200 mt-2 left-0 w-[280px] leading-relaxed"
                  onClick={(e) => e.stopPropagation()}
                >
                  {info}
                  <div className="absolute -top-2 left-4 w-0 h-0 border-8 border-transparent border-b-gray-800" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div className="relative">
        <select
          className={cn(
            "w-full appearance-none rounded-xl bg-white/50 backdrop-blur-sm border border-black/5",
            "pl-4  py-3 sm:text-sm text-[10px] text-black/80",
            "focus:outline-none focus:ring-2 focus:ring-black/10",
            "transition-all duration-200",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" />
      </div>
    </div>
  );
}
