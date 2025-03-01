import { cn } from '../../utils/classNames';

interface ToggleProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Toggle({ label, checked = false, onChange, className }: ToggleProps) {
  return (
    <label className={cn("inline-flex items-center space-x-3 cursor-pointer", className)}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <div className={cn(
          "w-10 h-6 rounded-full transition-all duration-200",
          "bg-black/10 peer-checked:bg-black",
          "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
          "after:bg-white after:rounded-full after:h-5 after:w-5",
          "after:transition-all after:duration-200",
          "peer-checked:after:translate-x-4"
        )} />
      </div>
      <span className="text-sm font-medium text-black/80">{label}</span>
    </label>
  );
}