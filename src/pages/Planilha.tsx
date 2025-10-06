import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Plus, 
  Trash2,
  Target,
  TrendingUpDown,
  Percent,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PeriodFilter, Period } from "@/components/dashboard/PeriodFilter";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { WinRateChart } from "@/components/dashboard/WinRateChart";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { useTradingStats } from "@/hooks/useTradingStats";

interface Operation {
  id: string;
  date: string;
  value: number;
  type: "profit" | "loss";
  note?: string;
}

const Planilha = () => {
  const navigate = useNavigate();
  const [initialBalance, setInitialBalance] = useState<number>(1000);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [newOperationValue, setNewOperationValue] = useState<string>("");
  const [newOperationNote, setNewOperationNote] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month");

  const stats = useTradingStats(operations, initialBalance, selectedPeriod);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleAddOperation = (type: "profit" | "loss") => {
    const value = parseFloat(newOperationValue);
    
    if (!value || value <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    const newOperation: Operation = {
      id: Date.now().toString(),
      date: selectedDate,
      value,
      type,
      note: newOperationNote || undefined,
    };

    setOperations([...operations, newOperation]);
    setNewOperationValue("");
    setNewOperationNote("");
    toast.success(`${type === "profit" ? "Lucro" : "Prejuízo"} adicionado!`);
  };

  const handleDeleteOperation = (id: string) => {
    setOperations(operations.filter(op => op.id !== id));
    toast.success("Operação removida");
  };

  const getOperationsByDate = () => {
    const grouped: { [key: string]: Operation[] } = {};
    stats.filteredOperations.forEach(op => {
      if (!grouped[op.date]) {
        grouped[op.date] = [];
      }
      grouped[op.date].push(op);
    });
    return grouped;
  };

  const operationsByDate = getOperationsByDate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-primary/10">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary tracking-tight">
                  Dashboard de Trading
                </h1>
                <p className="text-muted-foreground text-xs tracking-wider uppercase">
                  Análise completa de performance
                </p>
              </div>
            </div>
            <PeriodFilter value={selectedPeriod} onChange={setSelectedPeriod} />
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Saldo Atual"
            value={formatCurrency(stats.currentBalance)}
            subtitle={`${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(2)}% ROI`}
            icon={DollarSign}
            colorScheme={stats.currentBalance >= initialBalance ? "success" : "danger"}
            trend={stats.currentBalance >= initialBalance ? "up" : "down"}
          />
          
          <MetricCard
            title="Lucro Líquido"
            value={formatCurrency(stats.netProfit)}
            subtitle={`${stats.totalTrades} operações`}
            icon={TrendingUpDown}
            colorScheme={stats.netProfit >= 0 ? "success" : "danger"}
          />

          <MetricCard
            title="Win Rate"
            value={`${stats.winRate.toFixed(1)}%`}
            subtitle={`${stats.wins}W / ${stats.losses}L`}
            icon={Target}
            colorScheme={stats.winRate >= 50 ? "success" : "danger"}
          />

          <MetricCard
            title="Profit Factor"
            value={stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2)}
            subtitle="Lucro / Prejuízo"
            icon={Activity}
            colorScheme={stats.profitFactor >= 1.5 ? "success" : stats.profitFactor >= 1 ? "warning" : "danger"}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total em Lucros"
            value={formatCurrency(stats.totalProfit)}
            subtitle={`Média: ${formatCurrency(stats.avgProfit)}`}
            icon={TrendingUp}
            colorScheme="success"
          />

          <MetricCard
            title="Total em Prejuízos"
            value={formatCurrency(stats.totalLoss)}
            subtitle={`Média: ${formatCurrency(stats.avgLoss)}`}
            icon={TrendingDown}
            colorScheme="danger"
          />

          <MetricCard
            title="Total de Trades"
            value={stats.totalTrades.toString()}
            subtitle={`${stats.wins} vitórias`}
            icon={Calendar}
            colorScheme="primary"
          />

          <MetricCard
            title="Banca Inicial"
            value={formatCurrency(initialBalance)}
            icon={DollarSign}
            colorScheme="primary"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <PerformanceChart data={stats.chartData} />
          </div>
          
          <div>
            <WinRateChart wins={stats.wins} losses={stats.losses} />
          </div>
        </div>

        <div className="mb-8">
          <ProfitLossChart data={stats.chartData} />
        </div>

        {/* Operations Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Initial Balance */}
            <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Configurar Banca Inicial
              </h3>
              <div className="space-y-2">
                <Label htmlFor="initial-balance">Valor Inicial</Label>
                <Input
                  id="initial-balance"
                  type="number"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
                  className="bg-white/5 border-primary/20"
                  placeholder="1000.00"
                />
              </div>
            </Card>

            {/* Add Operation */}
            <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Registrar Nova Operação
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="operation-date">Data</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="operation-date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-white/5 border-primary/20 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operation-value">Valor</Label>
                  <Input
                    id="operation-value"
                    type="number"
                    value={newOperationValue}
                    onChange={(e) => setNewOperationValue(e.target.value)}
                    className="bg-white/5 border-primary/20"
                    placeholder="100.00"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operation-note">Observação (opcional)</Label>
                  <Input
                    id="operation-note"
                    type="text"
                    value={newOperationNote}
                    onChange={(e) => setNewOperationNote(e.target.value)}
                    className="bg-white/5 border-primary/20"
                    placeholder="Ex: EUR/USD 5min"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleAddOperation("profit")}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Lucro
                  </Button>
                  <Button
                    onClick={() => handleAddOperation("loss")}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Prejuízo
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Operations List */}
          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Histórico de Operações ({selectedPeriod})
            </h3>
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {Object.keys(operationsByDate).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma operação no período selecionado
                </p>
              ) : (
                Object.keys(operationsByDate)
                  .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                  .map((date) => (
                    <div key={date} className="space-y-2">
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                      {operationsByDate[date].map((operation) => (
                        <div
                          key={operation.id}
                          className={`p-4 rounded-lg border ${
                            operation.type === "profit"
                              ? "bg-green-500/5 border-green-500/20"
                              : "bg-red-500/5 border-red-500/20"
                          } flex items-center justify-between`}
                        >
                          <div className="flex items-center gap-3">
                            {operation.type === "profit" ? (
                              <TrendingUp className="h-5 w-5 text-green-500" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-500" />
                            )}
                            <div>
                              <p
                                className={`font-bold ${
                                  operation.type === "profit" ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {operation.type === "profit" ? "+" : "-"}
                                {formatCurrency(operation.value)}
                              </p>
                              {operation.note && (
                                <p className="text-xs text-muted-foreground">{operation.note}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteOperation(operation.id)}
                            className="hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Planilha;
