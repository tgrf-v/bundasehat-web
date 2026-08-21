import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NumberStepperProps {
  id?: string;
  name?: string;
  value?: number | string;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  suffix?: string;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  id,
  name,
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  placeholder,
  disabled = false,
  error,
  className,
  suffix,
}) => {
  const numericValue = typeof value === "number" ? value : Number(value) || 0;
  const isControlledEmpty = value === "" || value === undefined || value === null;

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    const current = isControlledEmpty ? min : numericValue;
    const next = Math.max(min, current - step);
    onChange?.(next);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    const current = isControlledEmpty ? min : numericValue;
    const next = Math.min(max, current + step);
    onChange?.(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === "") {
      onChange?.(0);
      return;
    }
    const parsed = Number(rawVal);
    if (!isNaN(parsed)) {
      onChange?.(parsed);
    }
  };

  const isMinDisabled = disabled || (!isControlledEmpty && numericValue <= min);
  const isMaxDisabled = disabled || (!isControlledEmpty && numericValue >= max);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-full border border-slate-200 bg-white p-1 shadow-soft-sm transition-all duration-200 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20",
          error && "border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500/20",
          disabled && "bg-slate-50 opacity-60 cursor-not-allowed"
        )}
      >
        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isMinDisabled}
          aria-label="Kurangi nilai"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300 active:scale-95"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Center Number Input */}
        <div className="flex flex-1 items-center justify-center px-2">
          <input
            id={id}
            name={name}
            type="number"
            min={min}
            max={max}
            step={step}
            value={isControlledEmpty ? "" : numericValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-transparent text-center text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {suffix && (
            <span className="shrink-0 text-xs font-medium text-slate-500 ml-1">
              {suffix}
            </span>
          )}
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={isMaxDisabled}
          aria-label="Tambah nilai"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300 active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <p className="mt-1 text-xs font-medium text-rose-600 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};
