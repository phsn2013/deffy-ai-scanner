import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Operation {
  id: string;
  date: string;
  value: number;
  type: "profit" | "loss";
  note?: string;
}

const PlanilhaBackup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <button onClick={() => navigate("/")}>Go Back</button>
      <h1>Planilha Test</h1>
    </div>
  );
};

export default PlanilhaBackup;
