import React, { useState, createContext, useContext } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  openItem: string | null;
  toggleItem: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export function Accordion({
  children,
  className,
  defaultValue = null,
}: {
  children: React.ReactNode;
  className?: string;
  defaultValue?: string | null;
}) {
  const [openItem, setOpenItem] = useState<string | null>(defaultValue);

  const toggleItem = (value: string) => {
    setOpenItem((prev) => (prev === value ? null : value));
  };

  return (
    <AccordionContext.Provider value={{ openItem, toggleItem }}>
      <div className={cn("w-full divide-y divide-slate-100", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  children,
  className,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  value: string;
}) {
  return (
    <div data-value={value} className={cn("py-2", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ itemValue?: string }>, {
            itemValue: value,
          });
        }
        return child;
      })}
    </div>
  );
}

export function AccordionTrigger({
  children,
  className,
  itemValue,
}: {
  children: React.ReactNode;
  className?: string;
  itemValue?: string;
}) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("AccordionTrigger must be used within an Accordion");

  const isOpen = context.openItem === itemValue;

  return (
    <button
      type="button"
      onClick={() => itemValue && context.toggleItem(itemValue)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-bold text-slate-900 transition-all hover:text-rose-600 focus:outline-none group",
        className
      )}
    >
      <span className="flex items-center gap-3">{children}</span>
      <ChevronDown
        className={cn(
          "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 group-hover:text-rose-500",
          isOpen && "rotate-180 text-rose-600"
        )}
      />
    </button>
  );
}

export function AccordionContent({
  children,
  className,
  itemValue,
}: {
  children: React.ReactNode;
  className?: string;
  itemValue?: string;
}) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("AccordionContent must be used within an Accordion");

  const isOpen = context.openItem === itemValue;

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "pb-4 pt-1 text-sm text-slate-600 leading-relaxed animate-fadeIn",
        className
      )}
    >
      {children}
    </div>
  );
}
