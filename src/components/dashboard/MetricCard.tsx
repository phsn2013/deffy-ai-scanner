import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  colorScheme?: "primary" | "success" | "danger" | "warning";
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = "neutral",
  colorScheme = "primary",
}: MetricCardProps) => {
  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      value: "text-foreground",
    },
    success: {
      bg: "bg-green-500/10",
      text: "text-green-500",
      value: "text-green-500",
    },
    danger: {
      bg: "bg-red-500/10",
      text: "text-red-500",
      value: "text-red-500",
    },
    warning: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-500",
      value: "text-yellow-500",
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
        {trend !== "neutral" && (
          <span className={`text-xs font-bold ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
            {trend === "up" ? "↑" : "↓"}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          {title}
        </p>
        <p className={`text-2xl font-bold ${colors.value}`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
};
