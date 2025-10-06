import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Plus, 
  Trash2,
  Target,
  TrendingUpDown,
  Activity,
  LayoutDashboard,
  FileText,
  Bitcoin,
  ArrowLeftRight,
  Users,
  Download,
  User
} from "lucide-react";
import { toast } from "sonner";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PeriodFilter, Period } from "@/components/dashboard/PeriodFilter";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { WinRateChart } from "@/components/dashboard/WinRateChart";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { useTradingStats } from "@/hooks/useTradingStats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface Operation {
  id: string;
  date: string;
  value: number;
  type: "profit" | "loss";
  note?: string;
}

const Planilha = () => {
  const navigate = useNavigate();
  const [initialBalance, setInitialBalance] = useState<number>(0);
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

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Reports", path: "/planilha" },
    { icon: Bitcoin, label: "Cryptocurrency", path: "/planilha" },
    { icon: ArrowLeftRight, label: "Exchange", path: "/configuracoes" },
    { icon: Users, label: "Community", path: "/ajuda" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Vertical Sidebar */}
        <Sidebar className="border-r border-border/30">
          <SidebarContent>
            {/* Logo */}
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                <span className="text-xl font-black text-primary">D</span>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton 
                        onClick={() => navigate(item.path)}
                        className="hover:bg-primary/10"
                      >
                        <item.icon className="h-5 w-5" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="border-b border-border/30">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <nav className="flex items-center gap-8">
                  <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </button>
                  <button className="text-sm font-medium text-foreground border-b-2 border-primary pb-4 -mb-4">
                    Reports
                  </button>
                  <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Cryptocurrency
                  </button>
                  <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Exchange
                  </button>
                  <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Community
                  </button>
                </nav>
                
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 px-6 py-8 overflow-auto">
            {/* Welcome Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-1">Welcome back, Trader</h1>
                <p className="text-muted-foreground text-sm">Here's take a look at your performance and analytics.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  {selectedPeriod === 'day' && 'Hoje'}
                  {selectedPeriod === 'week' && 'Esta Semana'}
                  {selectedPeriod === 'month' && 'Este Mês'}
                  {selectedPeriod === 'year' && 'Este Ano'}
                </Button>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add new coin
                </Button>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              {/* Left Stats Card */}
              <Card className="lg:col-span-3 p-6 bg-card/50 backdrop-blur-xl border-primary/20">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">SPENT THIS MONTH</p>
                    <p className="text-3xl font-bold">{formatCurrency(stats.totalLoss)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">24h% CHANGE</p>
                    <p className={`text-lg font-bold ${stats.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(2)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">VOLUME (24H)</p>
                    <p className="text-lg font-bold">{formatCurrency(stats.totalProfit + stats.totalLoss)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">MARKET CAP</p>
                    <p className="text-lg font-bold">{formatCurrency(stats.currentBalance)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">AVG MONTHLY GROWING</p>
                    <p className="text-lg font-bold">{formatCurrency(stats.netProfit)}</p>
                  </div>

                  <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                    <Download className="h-4 w-4" />
                    Download Report
                  </Button>
                </div>
              </Card>

              {/* Center Chart */}
              <Card className="lg:col-span-6 p-6 bg-card/50 backdrop-blur-xl border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Active credit</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <DollarSign className="h-4 w-4" />
                  </Button>
                </div>
                <PerformanceChart data={stats.chartData} />
              </Card>

              {/* Right Score Card */}
              <Card className="lg:col-span-3 p-6 bg-card/50 backdrop-blur-xl border-primary/20">
                <h3 className="text-sm text-muted-foreground mb-6">Your credit score</h3>
                <div className="relative">
                  <WinRateChart wins={stats.wins} losses={stats.losses} />
                </div>
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground mb-2">Last Check on {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{Math.round(stats.winRate * 10)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Your credit score is average</p>
                </div>

                {/* Bitcoin Card */}
                <Card className="mt-6 p-4 bg-background/50 border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Bitcoin className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold">Bitcoin</p>
                      <p className="text-xs text-muted-foreground">BTC</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs text-muted-foreground">Reward Rate</p>
                      <p className="text-sm font-semibold">{stats.profitFactor.toFixed(2)}%</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{formatCurrency(stats.currentBalance)}</span>
                    <span className={`text-sm ${stats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stats.netProfit >= 0 ? '+' : ''}{((stats.netProfit / initialBalance) * 100).toFixed(2)}%
                    </span>
                  </div>
                </Card>
              </Card>
            </div>

            {/* Payment History Table */}
            <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20">
              <h3 className="text-xl font-bold mb-6">Payment History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left py-3 px-4 text-xs text-muted-foreground uppercase tracking-wider">NAME</th>
                      <th className="text-left py-3 px-4 text-xs text-muted-foreground uppercase tracking-wider">DATE</th>
                      <th className="text-left py-3 px-4 text-xs text-muted-foreground uppercase tracking-wider">PRICE</th>
                      <th className="text-left py-3 px-4 text-xs text-muted-foreground uppercase tracking-wider">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.filteredOperations.slice(0, 10).map((operation) => (
                      <tr key={operation.id} className="border-b border-border/10 hover:bg-white/5">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {operation.type === "profit" ? (
                              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{operation.note || 'Trading'}</p>
                              <p className={`text-sm ${operation.type === "profit" ? "text-green-500" : "text-red-500"}`}>
                                {operation.type === "profit" ? "+" : "-"}{((operation.value / stats.currentBalance) * 100).toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {new Date(operation.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {formatCurrency(operation.value)}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 text-green-500 text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            Successfully
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Operation Section */}
              <div className="mt-8 pt-6 border-t border-border/30">
                <h4 className="font-bold mb-4">Registrar Nova Operação</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="operation-date" className="text-xs">Data</Label>
                    <Input
                      id="operation-date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-white/5 border-primary/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="operation-value" className="text-xs">Valor</Label>
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
                  <div>
                    <Label htmlFor="operation-note" className="text-xs">Observação</Label>
                    <Input
                      id="operation-note"
                      type="text"
                      value={newOperationNote}
                      onChange={(e) => setNewOperationNote(e.target.value)}
                      className="bg-white/5 border-primary/20"
                      placeholder="Ex: EUR/USD"
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <Button
                      onClick={() => handleAddOperation("profit")}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Lucro
                    </Button>
                    <Button
                      onClick={() => handleAddOperation("loss")}
                      className="flex-1 bg-red-500 hover:bg-red-600"
                    >
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Prejuízo
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="initial-balance" className="text-xs">Banca Inicial</Label>
                  <Input
                    id="initial-balance"
                    type="number"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
                    className="bg-white/5 border-primary/20 max-w-xs"
                    placeholder="1000.00"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Planilha;
