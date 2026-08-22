import React from "react";
import { Progress } from "@/Components/ui/progress";

interface ScreeningStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ScreeningStepIndicator({ currentStep, totalSteps }: ScreeningStepIndicatorProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
        <span className={currentStep >= 1 ? "text-emerald-700 font-bold" : ""}>
          Identitas &amp; Riwayat
        </span>
        <span className={currentStep >= 2 ? "text-emerald-700 font-bold" : ""}>
          Kondisi Saat Ini
        </span>
        <span className={currentStep >= 3 ? "text-emerald-700 font-bold" : ""}>
          Kondisi Gawat
        </span>
      </div>
      <Progress value={(currentStep / totalSteps) * 100} variant="default" className="h-2" />
    </div>
  );
}
