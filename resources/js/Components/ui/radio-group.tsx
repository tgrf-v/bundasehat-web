import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextType {
  value?: string;
  onValueChange?: (val: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextType | undefined>(undefined);

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  disabled?: boolean;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value: controlledValue, defaultValue, onValueChange, disabled, children, ...props }, ref) => {
    const [value, setValue] = React.useState<string | undefined>(controlledValue ?? defaultValue);

    React.useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue);
      }
    }, [controlledValue]);

    const handleValueChange = (val: string) => {
      setValue(val);
      if (onValueChange) onValueChange(val);
    };

    return (
      <RadioGroupContext.Provider value={{ value, onValueChange: handleValueChange, disabled }}>
        <div ref={ref} role="radiogroup" className={cn("grid gap-2.5", className)} {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  id?: string;
  disabled?: boolean;
  label?: string;
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ className, value: itemValue, id, disabled: itemDisabled, label, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    if (!context) {
      throw new Error("RadioGroupItem must be used within a RadioGroup");
    }

    const isSelected = context.value === itemValue;
    const isDisabled = itemDisabled || context.disabled;
    const generatedId = React.useId();
    const itemId = id || generatedId;

    return (
      <div className="flex items-center gap-2.5 select-none">
        <button
          ref={ref}
          type="button"
          role="radio"
          id={itemId}
          aria-checked={isSelected}
          disabled={isDisabled}
          onClick={() => !isDisabled && context.onValueChange && context.onValueChange(itemValue)}
          className={cn(
            "aspect-square h-5 w-5 rounded-full border border-slate-300 bg-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center shadow-soft-sm",
            isSelected && "border-rose-500 text-rose-500",
            className
          )}
          {...props}
        >
          {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />}
        </button>

        {label && (
          <label
            htmlFor={itemId}
            className={cn(
              "text-xs md:text-sm font-medium text-slate-700 cursor-pointer",
              isDisabled && "cursor-not-allowed opacity-50"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
