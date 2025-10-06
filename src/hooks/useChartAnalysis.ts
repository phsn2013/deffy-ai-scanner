import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { AssetType } from "@/components/AssetSelector";
import type { Timeframe } from "@/components/TimeframeSelector";
import type { AIModel } from "@/components/ModelSelector";

interface AnalysisResult {
  prediction: "bullish" | "bearish";
  confidence: number;
  analysis: string;
}

export const useChartAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeChart = async (
    imageData: string,
    assetType: AssetType,
    timeframe: Timeframe,
    aiModel: AIModel
  ) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-chart", {
        body: {
          image: imageData,
          assetType,
          timeframe,
          aiModel,
        },
      });

      if (error) throw error;

      setResult(data);

      // Save analysis to database
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from("user_analyses").insert({
          user_id: user.id,
          asset_type: assetType,
          timeframe,
          ai_model: aiModel,
          prediction: data.prediction,
          confidence: data.confidence,
        });
      }

      toast.success("Análise concluída!");
    } catch (error) {
      console.error("Error analyzing chart:", error);
      toast.error("Erro ao analisar o gráfico. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeChart, isAnalyzing, result };
};
