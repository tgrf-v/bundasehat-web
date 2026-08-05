import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ items, activeTab, onChange, className }) => {
  return (
    <div className={cn("flex space-x-1 rounded-2xl bg-slate-100/80 p-1.5 border border-slate-200/50 shadow-inner", className)}>
      {items.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs md:text-sm font-semibold transition-all duration-200 select-none",
              isActive
                ? "bg-white text-emerald-700 shadow-soft-sm font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold",
                  isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export { Tabs };
