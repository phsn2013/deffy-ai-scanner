import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3 } from "lucide-react";

interface ProfitLossChartProps {
  data: {
    date: string;
    profit: number;
    loss: number;
  }[];
}

export const ProfitLossChart = ({ data }: ProfitLossChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-xl border border-primary/20 p-3 rounded-lg shadow-xl">
          <p className="text-sm font-bold mb-2 text-foreground">
            {payload[0].payload.date}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Lucros vs Prejuízos
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Comparativo por período
          </p>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value) => value === "profit" ? "Lucros" : "Prejuízos"}
            />
            <Bar 
              dataKey="profit" 
              fill="hsl(142, 76%, 36%)" 
              radius={[8, 8, 0, 0]}
              name="profit"
            />
            <Bar 
              dataKey="loss" 
              fill="hsl(0, 84%, 60%)" 
              radius={[8, 8, 0, 0]}
              name="loss"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
