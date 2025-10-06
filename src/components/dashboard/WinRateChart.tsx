import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Target } from "lucide-react";

interface WinRateChartProps {
  wins: number;
  losses: number;
}

export const WinRateChart = ({ wins, losses }: WinRateChartProps) => {
  const total = wins + losses;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "0";

  const data = [
    { name: "Wins", value: wins, color: "hsl(142, 76%, 36%)" },
    { name: "Losses", value: losses, color: "hsl(0, 84%, 60%)" },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : "0";
      return (
        <div className="bg-card/95 backdrop-blur-xl border border-primary/20 p-3 rounded-lg shadow-xl">
          <p className="text-sm font-bold text-foreground">
            {payload[0].name}
          </p>
          <p className="text-xs text-muted-foreground">
            {payload[0].value} operações ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Target className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Taxa de Acerto
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Win Rate
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-4xl font-bold text-foreground">{winRate}%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Win Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-2xl font-bold text-green-500">{wins}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Vitórias</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-2xl font-bold text-red-500">{losses}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Derrotas</p>
        </div>
      </div>
    </Card>
  );
};
