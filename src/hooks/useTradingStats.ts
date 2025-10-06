import { useMemo } from "react";
import { Period } from "@/components/dashboard/PeriodFilter";

interface Operation {
  id: string;
  date: string;
  value: number;
  type: "profit" | "loss";
  note?: string;
}

export const useTradingStats = (
  operations: Operation[],
  initialBalance: number,
  selectedPeriod: Period
) => {
  return useMemo(() => {
    const now = new Date();
    const filterDate = new Date();

    switch (selectedPeriod) {
      case "day":
        filterDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredOperations = operations.filter(
      (op) => new Date(op.date) >= filterDate
    );

    const totalProfit = filteredOperations
      .filter((op) => op.type === "profit")
      .reduce((acc, op) => acc + op.value, 0);

    const totalLoss = filteredOperations
      .filter((op) => op.type === "loss")
      .reduce((acc, op) => acc + op.value, 0);

    const netProfit = totalProfit - totalLoss;
    const wins = filteredOperations.filter((op) => op.type === "profit").length;
    const losses = filteredOperations.filter((op) => op.type === "loss").length;
    const totalTrades = wins + losses;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

    const avgProfit = wins > 0 ? totalProfit / wins : 0;
    const avgLoss = losses > 0 ? totalLoss / losses : 0;

    const currentBalance = initialBalance + netProfit;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;

    // Prepare chart data
    const chartData: {
      date: string;
      balance: number;
      profit: number;
      loss: number;
    }[] = [];

    const dateGroups: { [key: string]: Operation[] } = {};
    filteredOperations.forEach((op) => {
      if (!dateGroups[op.date]) {
        dateGroups[op.date] = [];
      }
      dateGroups[op.date].push(op);
    });

    let runningBalance = initialBalance;
    const sortedDates = Object.keys(dateGroups).sort();

    sortedDates.forEach((date) => {
      const dayOps = dateGroups[date];
      const dayProfit = dayOps
        .filter((op) => op.type === "profit")
        .reduce((acc, op) => acc + op.value, 0);
      const dayLoss = dayOps
        .filter((op) => op.type === "loss")
        .reduce((acc, op) => acc + op.value, 0);

      runningBalance += dayProfit - dayLoss;

      chartData.push({
        date: new Date(date + 'T00:00:00').toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
        }),
        balance: runningBalance,
        profit: dayProfit,
        loss: dayLoss,
      });
    });

    // If no data, show initial balance
    if (chartData.length === 0) {
      chartData.push({
        date: new Date().toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
        }),
        balance: initialBalance,
        profit: 0,
        loss: 0,
      });
    }

    const roi = initialBalance > 0 ? ((currentBalance - initialBalance) / initialBalance) * 100 : 0;

    return {
      totalProfit,
      totalLoss,
      netProfit,
      wins,
      losses,
      totalTrades,
      winRate,
      avgProfit,
      avgLoss,
      currentBalance,
      profitFactor,
      chartData,
      roi,
      filteredOperations,
    };
  }, [operations, initialBalance, selectedPeriod]);
};
