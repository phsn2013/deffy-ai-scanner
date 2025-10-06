import { Button } from "@/components/ui/button";
import { Calendar, Clock, CalendarRange, CalendarClock } from "lucide-react";

export type Period = "day" | "week" | "month" | "year";

interface PeriodFilterProps {
  value: Period;
  onChange: (period: Period) => void;
}

export const PeriodFilter = ({ value, onChange }: PeriodFilterProps) => {
  const periods: { value: Period; label: string; icon: typeof Calendar }[] = [
    { value: "day", label: "Hoje", icon: Clock },
    { value: "week", label: "Semana", icon: Calendar },
    { value: "month", label: "Mês", icon: CalendarRange },
    { value: "year", label: "Ano", icon: CalendarClock },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {periods.map((period) => {
        const Icon = period.icon;
        return (
          <Button
            key={period.value}
            variant={value === period.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(period.value)}
            className={`
              ${value === period.value 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "bg-white/5 border-primary/20 hover:bg-primary/10"
              }
              transition-all
            `}
          >
            <Icon className="h-4 w-4 mr-2" />
            {period.label}
          </Button>
        );
      })}
    </div>
  );
};
