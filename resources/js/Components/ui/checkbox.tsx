import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, label, disabled = false, id, error, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-center gap-2.5 select-none">
        <button
          type="button"
          role="checkbox"
          id={checkboxId}
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onCheckedChange && onCheckedChange(!checked)}
          className={cn(
            "peer h-5 w-5 shrink-0 rounded-md border border-slate-300 bg-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center shadow-soft-sm",
            checked && "bg-rose-500 border-rose-500 text-white shadow-soft-sm",
            className
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </button>

        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              "text-xs md:text-sm font-medium text-slate-700 cursor-pointer",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
