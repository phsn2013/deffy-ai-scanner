import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotesPanel } from "@/components/NotesPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SYMBOLS = {
  forex: [
    { value: "FX:EURUSD", label: "EUR/USD" },
    { value: "FX:GBPUSD", label: "GBP/USD" },
    { value: "FX:USDJPY", label: "USD/JPY" },
    { value: "FX:AUDUSD", label: "AUD/USD" },
    { value: "FX:USDCAD", label: "USD/CAD" },
    { value: "FX:EURGBP", label: "EUR/GBP" },
    { value: "FX:EURJPY", label: "EUR/JPY" },
    { value: "FX:GBPJPY", label: "GBP/JPY" },
  ],
  crypto: [
    { value: "BINANCE:BTCUSDT", label: "BTC/USDT" },
    { value: "BINANCE:ETHUSDT", label: "ETH/USDT" },
    { value: "BINANCE:SOLUSDT", label: "SOL/USDT" },
    { value: "BINANCE:ADAUSDT", label: "ADA/USDT" },
    { value: "BINANCE:DOGEUSDT", label: "DOGE/USDT" },
    { value: "BINANCE:TRXUSDT", label: "TRX/USDT" },
  ],
  stocks: [
    { value: "NASDAQ:AAPL", label: "Apple" },
    { value: "NASDAQ:MSFT", label: "Microsoft" },
    { value: "NASDAQ:GOOGL", label: "Google" },
    { value: "NASDAQ:AMZN", label: "Amazon" },
    { value: "NASDAQ:TSLA", label: "Tesla" },
    { value: "NASDAQ:NVDA", label: "NVIDIA" },
  ],
};

const Estudo = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSymbol, setSelectedSymbol] = useState("BINANCE:BTCUSDT");
  const [selectedCategory, setSelectedCategory] = useState("crypto");
  const [selectedTimeframe, setSelectedTimeframe] = useState("D");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (containerRef.current && (window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: selectedSymbol,
          interval: selectedTimeframe,
          timezone: "America/Sao_Paulo",
          theme: "dark",
          style: "1",
          locale: "br",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview_chart",
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          hide_side_toolbar: false,
          details: true,
          hotlist: true,
          calendar: true,
          studies_overrides: {},
          overrides: {
            "mainSeriesProperties.candleStyle.upColor": "#26a69a",
            "mainSeriesProperties.candleStyle.downColor": "#ef5350",
            "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
            "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",
            "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
          },
          disabled_features: [],
          enabled_features: [
            "study_templates",
            "use_localstorage_for_settings",
            "save_chart_properties_to_local_storage",
          ],
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [selectedSymbol, selectedTimeframe]);

  const handleSymbolChange = (value: string) => {
    setSelectedSymbol(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const firstSymbol = SYMBOLS[value as keyof typeof SYMBOLS][0].value;
    setSelectedSymbol(firstSymbol);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Área de Estudo</h1>
            </div>

            <div className="flex items-center gap-3">
              <NotesPanel symbol={selectedSymbol} />
              
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forex">Forex</SelectItem>
                  <SelectItem value="crypto">Cripto</SelectItem>
                  <SelectItem value="stocks">Ações</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSymbol} onValueChange={handleSymbolChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecionar ativo" />
                </SelectTrigger>
                <SelectContent>
                  {SYMBOLS[selectedCategory as keyof typeof SYMBOLS].map((symbol) => (
                    <SelectItem key={symbol.value} value={symbol.value}>
                      {symbol.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minuto</SelectItem>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="240">4 horas</SelectItem>
                  <SelectItem value="D">1 dia</SelectItem>
                  <SelectItem value="W">1 semana</SelectItem>
                  <SelectItem value="M">1 mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* TradingView Chart */}
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-120px)]">
        <div
          id="tradingview_chart"
          ref={containerRef}
          className="w-full h-full rounded-lg overflow-hidden border bg-card"
        />
      </div>
    </div>
  );
};

export default Estudo;
