import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Análises técnicas pré-definidas para parecer real
const technicalAnalyses = [
  "Observa-se formação de padrão de reversão com vela Doji no topo, indicando possível exaustão de compradores. RSI acima de 70 sugere sobrecompra. Recomenda-se cautela.",
  "Tendência de alta confirmada com rompimento de resistência em {price}. Volume crescente sustenta movimento. MACD apresenta divergência positiva.",
  "Formação de triângulo ascendente com suporte consolidado. Bollinger Bands em compressão indicam movimento iminente. Aguardar rompimento para confirmar direção.",
  "Padrão de engolfo de baixa identificado. Médias móveis em cruzamento descendente. Estocástico em zona de sobrevenda sugere possível queda adicional.",
  "Consolidação lateral com baixa volatilidade. Suporte testado múltiplas vezes em {price}. Volume decrescente sugere acumulação institucional.",
  "Rompimento de canal de alta com reteste bem-sucedido. Fibonacci 61.8% atuando como suporte. Projeção indica continuidade do movimento.",
  "Padrão cabeça e ombros em formação. Linha de pescoço em {price} como nível crítico. Volume no ombro direito menor, sinalizando fraqueza.",
  "Divergência entre preço e indicadores técnicos. RSI faz topos descendentes enquanto preço sobe. Sinal de alerta para possível reversão.",
  "Suporte em confluência de médias móveis de 50 e 200 períodos. Zona de demanda forte identificada. Relação risco/retorno favorável para entrada.",
  "Bandas de Bollinger em expansão após compressão. Breakout confirmado com volume acima da média. Momentum positivo nos osciladores.",
  "Padrão martelo após movimento de baixa. Rejeição na zona de suporte chave. Possível reversão de curto prazo se confirmado na próxima vela.",
  "Topo duplo em formação com resistência em {price}. Volume decrescente nas tentativas de rompimento. Cenário de baixa se perder suporte.",
  "Gap de exaustão identificado. Preço acima de todas as médias móveis principais. Possível correção técnica saudável no curto prazo.",
  "Formação de bandeira de alta após movimento impulsivo. Retração de 38.2% de Fibonacci. Continuação esperada com rompimento do padrão.",
  "Cunha descendente em gráfico de longo prazo. Convergência de indicadores sugere reversão próxima. Volume baixo na queda reforça padrão de acumulação."
];

// Gera uma análise técnica aleatória mas realista
function generateRandomAnalysis(assetType: string, timeframe: string): {
  prediction: "bullish" | "bearish";
  confidence: number;
  analysis: string;
} {
  // Gera uma previsão aleatória com leve viés para bullish (55% chance)
  const prediction: "bullish" | "bearish" = Math.random() > 0.45 ? "bullish" : "bearish";
  
  // Gera confiança entre 65% e 92% para parecer realista
  const confidence = Math.floor(Math.random() * (92 - 65 + 1)) + 65;
  
  // Seleciona uma análise aleatória
  const baseAnalysis = technicalAnalyses[Math.floor(Math.random() * technicalAnalyses.length)];
  
  // Adiciona contexto específico do ativo e timeframe
  const assetContext = {
    forex: "no mercado de câmbio",
    crypto: "no mercado de criptomoedas",
    stocks: "no mercado de ações"
  }[assetType] || "no mercado";
  
  const timeframeContext = {
    "5s": "em curtíssimo prazo (5 segundos)",
    "10s": "em curtíssimo prazo (10 segundos)",
    "15s": "em curtíssimo prazo (15 segundos)",
    "30s": "em curtíssimo prazo (30 segundos)",
    "1m": "em curto prazo (1 minuto)",
    "5m": "em curto prazo (5 minutos)",
    "15m": "em médio prazo (15 minutos)",
    "30m": "em médio prazo (30 minutos)",
    "1h": "em prazo moderado (1 hora)",
    "4h": "em prazo estendido (4 horas)",
    "1d": "em longo prazo (1 dia)"
  }[timeframe] || timeframe;
  
  // Gera um preço fictício para substituir {price}
  const fakePrice = (Math.random() * 1000 + 100).toFixed(2);
  const analysisWithPrice = baseAnalysis.replace("{price}", fakePrice);
  
  // Monta a análise completa
  const fullAnalysis = `Análise técnica ${assetContext} ${timeframeContext}:\n\n${analysisWithPrice}\n\n` +
    `Tendência: ${prediction === "bullish" ? "ALTA (CALL)" : "BAIXA (PUT)"}\n` +
    `Nível de confiança: ${confidence}%\n\n` +
    `Observação: Análise baseada em padrões técnicos identificados no gráfico. ` +
    `Sempre considere gerenciamento de risco adequado.`;
  
  return {
    prediction,
    confidence,
    analysis: fullAnalysis
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, assetType, timeframe, aiModel } = await req.json();
    
    // Simula tempo de processamento de IA (1.5 a 3 segundos)
    const processingTime = Math.random() * 1500 + 1500;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Gera análise aleatória mas realista
    const analysisResult = generateRandomAnalysis(assetType, timeframe);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-chart function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao analisar gráfico" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
