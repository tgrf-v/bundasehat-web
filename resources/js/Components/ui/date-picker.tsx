import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";

export interface DatePickerProps {
  id?: string;
  value?: string;
  onChange?: (dateString: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const MONTH_SHORT_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  value,
  onChange,
  placeholder = "Pilih tanggal...",
  className,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [viewMode, setViewMode] = React.useState<"days" | "months" | "years">("days");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const yearListRef = React.useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;
  const [viewDate, setViewDate] = React.useState<Date>(selectedDate || new Date());

  React.useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setViewDate(parsed);
      }
    }
  }, [value]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setViewMode("days");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-scroll ke tahun terpilih saat mode tahun dibuka
  React.useEffect(() => {
    if (viewMode === "years" && yearListRef.current) {
      const selectedYearBtn = yearListRef.current.querySelector('[data-selected="true"]');
      if (selectedYearBtn) {
        selectedYearBtn.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [viewMode]);

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const dateObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${formattedDay}`;

    if (onChange) onChange(dateStr);
    setIsOpen(false);
    setViewMode("days");
  };

  const handleSelectMonth = (monthIndex: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), monthIndex, 1));
    setViewMode("days");
  };

  const handleSelectYear = (selectedYear: number) => {
    setViewDate((prev) => new Date(selectedYear, prev.getMonth(), 1));
    setViewMode("days");
  };

  // Calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // List 90 tahun ke belakang untuk pemilihan cepat
  const currentYear = new Date().getFullYear();
  const years = React.useMemo(() => {
    return Array.from({ length: 90 }, (_, i) => currentYear + 1 - i);
  }, [currentYear]);

  const formattedDisplay = selectedDate && !isNaN(selectedDate.getTime())
    ? selectedDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setViewMode("days");
          }
        }}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 transition-all duration-200 focus:border-rose-500 outline-none focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50 shadow-soft-sm text-left select-none",
          isOpen && "border-rose-500 ring-2 ring-rose-500/20",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
          className
        )}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
          <span className={cn("truncate", !formattedDisplay && "text-slate-400")}>
            {formattedDisplay || placeholder}
          </span>
        </div>

        {value ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (onChange) onChange("");
            }}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </button>

      {/* Floating Popover Calendar Card */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-72 rounded-3xl border border-slate-100 bg-white p-4 shadow-soft-lg animate-scaleUp">
          
          {/* Header Controls with Custom Month & Year Pills */}
          <div className="flex items-center justify-between gap-1.5 mb-3 border-b border-slate-100 pb-2.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={viewMode !== "days"}
              className={cn(
                "p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0",
                viewMode !== "days" && "opacity-0 pointer-events-none"
              )}
              aria-label="Bulan Sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
              {/* Tombol Pemilih Bulan (Ghost Button) */}
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "months" ? "days" : "months")}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-bold transition-colors inline-flex items-center gap-1",
                  viewMode === "months"
                    ? "bg-rose-50 text-rose-600"
                    : "text-slate-800 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <span>{MONTH_NAMES[month]}</span>
                <ChevronDown className={cn("h-3 w-3 text-slate-500 transition-transform", viewMode === "months" && "rotate-180")} />
              </button>

              {/* Tombol Pemilih Tahun (Ghost Button) */}
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "years" ? "days" : "years")}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-bold transition-colors inline-flex items-center gap-1",
                  viewMode === "years"
                    ? "bg-rose-50 text-rose-600"
                    : "text-slate-800 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <span>{year}</span>
                <ChevronDown className={cn("h-3 w-3 text-slate-500 transition-transform", viewMode === "years" && "rotate-180")} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              disabled={viewMode !== "days"}
              className={cn(
                "p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0",
                viewMode !== "days" && "opacity-0 pointer-events-none"
              )}
              aria-label="Bulan Berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* VIEW 1: TAMPILAN GRID TANGGAL (DAYS) */}
          {viewMode === "days" && (
            <div className="animate-fadeIn">
              {/* Day Names Grid */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-1">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* Empty slots */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Days in month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected =
                    selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getFullYear() === year;

                  const isToday =
                    new Date().getDate() === day &&
                    new Date().getMonth() === month &&
                    new Date().getFullYear() === year;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center font-semibold transition-all mx-auto text-xs",
                        isSelected
                          ? "bg-rose-600 text-white font-bold shadow-soft-sm"
                          : isToday
                          ? "bg-rose-50 text-rose-700 font-bold border border-rose-200"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 2: TAMPILAN GRID BULAN (MONTHS) */}
          {viewMode === "months" && (
            <div className="grid grid-cols-3 gap-1.5 py-1 animate-fadeIn">
              {MONTH_SHORT_NAMES.map((mShort, idx) => {
                const isSelectedMonth = month === idx;
                return (
                  <button
                    key={mShort}
                    type="button"
                    onClick={() => handleSelectMonth(idx)}
                    className={cn(
                      "py-2 px-1 rounded-xl text-xs font-bold transition-colors text-center",
                      isSelectedMonth
                        ? "bg-rose-600 text-white shadow-soft-sm"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    {MONTH_NAMES[idx]}
                  </button>
                );
              })}
            </div>
          )}

          {/* VIEW 3: TAMPILAN DAFTAR TAHUN (YEARS) */}
          {viewMode === "years" && (
            <div
              ref={yearListRef}
              className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto p-1 animate-fadeIn"
            >
              {years.map((y) => {
                const isSelectedYear = year === y;
                return (
                  <button
                    key={y}
                    type="button"
                    data-selected={isSelectedYear}
                    onClick={() => handleSelectYear(y)}
                    className={cn(
                      "py-2 rounded-xl text-xs font-bold transition-colors text-center",
                      isSelectedYear
                        ? "bg-rose-600 text-white shadow-soft-sm"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}

        </div>
      )}

      {error && (
        <p className="mt-1 text-xs font-medium text-rose-600 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};
