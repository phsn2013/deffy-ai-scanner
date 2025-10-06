import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Timeframe = "5s" | "10s" | "15s" | "30s" | "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1d";

interface TimeframeSelectorProps {
  value: Timeframe;
  onChange: (value: Timeframe) => void;
}

export const TimeframeSelector = ({ value, onChange }: TimeframeSelectorProps) => {
  return (
    <div className="w-full space-y-2 md:space-y-3">
      <label className="block text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase text-primary">
        Time
      </label>
      <Select value={value} onValueChange={(val) => onChange(val as Timeframe)}>
        <SelectTrigger className="w-full bg-white/5 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/40 transition-all rounded-xl h-10 md:h-12 text-foreground font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent className="bg-card/95 backdrop-blur-xl border-2 border-primary/20 rounded-xl z-[100]">
          <SelectItem value="5s" className="text-foreground bg-transparent hover:bg-primary/10 focus:bg-primary/10 rounded-lg">5seg</SelectItem>
          <SelectItem value="10s" className="text-foreground bg-transparent hover:bg-primary/10 focus:bg-primary/10 rounded-lg">10seg</SelectItem>
          <SelectItem value="15s" className="text-foreground bg-transparent hover:bg-primary/10 focus:bg-primary/10 rounded-lg">15seg</SelectItem>
          <SelectItem value="30s" className="text-foreground bg-transparent hover:bg-primary/10 focus:bg-primary/10 rounded-lg">30seg</SelectItem>
          <SelectItem value="1m" className="text-foreground bg-transparent hover:bg-primary/10 focus:bg-primary/10 rounded-lg">1min</SelectItem>
          <SelectItem value="5m" className="text-foreground bg-transparent hover:bg-primary/10 focus:bg-primary/10 rounded-lg">5min</SelectItem>
          <SelectItem value="15m" className="text-foreground bg-transparent hover:bg-primary/10 focus:bg-primary/10 rounded-lg">15min</SelectItem>
          <SelectItem value="30m" className="text-foreground bg-transparent hover:bg-primary/10 focus:bg-primary/10 rounded-lg">30min</SelectItem>
          <SelectItem value="1h" className="text-foreground bg-transparent hover:bg-primary/10 focus:bg-primary/10 rounded-lg">1h</SelectItem>
          <SelectItem value="4h" className="text-foreground bg-transparent hover:bg-primary/10 focus:bg-primary/10 rounded-lg">4h</SelectItem>
          <SelectItem value="1d" className="text-foreground bg-transparent hover:bg-primary/10 focus:bg-primary/10 rounded-lg">1d</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
