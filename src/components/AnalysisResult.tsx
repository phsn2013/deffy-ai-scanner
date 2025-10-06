import { TrendingUp, TrendingDown, Zap, Target } from "lucide-react";

interface AnalysisResultProps {
  prediction?: "bullish" | "bearish";
  confidence?: number;
  analysis?: string;
  isLoading?: boolean;
  capturedImage?: string | null;
}

export const AnalysisResult = ({ prediction, confidence, analysis, isLoading, capturedImage }: AnalysisResultProps) => {
  if (isLoading) {
    return (
      <div className="rounded-3xl bg-card border-2 border-primary/20 p-8 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <Zap className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-primary text-lg font-bold tracking-[0.3em] uppercase glow-text">
              Analyzing
            </p>
            <div className="flex gap-1 justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return null;
  }

  const isBullish = prediction === "bullish";
  const mainColor = isBullish ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)";
  const bgColor = isBullish ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)";
  const borderColor = isBullish ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)";
  const glowColor = isBullish 
    ? "0 0 30px rgba(34, 197, 94, 0.5), 0 0 60px rgba(34, 197, 94, 0.3)" 
    : "0 0 30px rgba(239, 68, 68, 0.5), 0 0 60px rgba(239, 68, 68, 0.3)";

  return (
    <div 
      className="rounded-3xl bg-gradient-to-br from-black via-card to-black border-4 border-muted-foreground/30 overflow-hidden relative"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: isBullish 
          ? 'repeating-linear-gradient(45deg, rgb(34, 197, 94) 0px, rgb(34, 197, 94) 2px, transparent 2px, transparent 10px)'
          : 'repeating-linear-gradient(45deg, rgb(239, 68, 68) 0px, rgb(239, 68, 68) 2px, transparent 2px, transparent 10px)'
      }} />

      {/* Main Prediction Card */}
      <div className="relative p-8 space-y-6">
        {/* Captured Chart Thumbnail */}
        {capturedImage && (
          <div className="mb-6">
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: borderColor }}>
              <img
                src={capturedImage}
                alt="Captured chart"
                className="w-full h-32 object-cover"
              />
            </div>
          </div>
        )}

        {/* Big Prediction Display */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <div 
              className="p-4 rounded-2xl animate-pulse"
              style={{ 
                backgroundColor: bgColor,
                border: `2px solid ${borderColor}`,
                boxShadow: glowColor
              }}
            >
              {isBullish ? (
                <TrendingUp className="h-12 w-12" style={{ color: mainColor }} />
              ) : (
                <TrendingDown className="h-12 w-12" style={{ color: mainColor }} />
              )}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-2">
              Next Candle Prediction
            </p>
            <h2 
              className="text-6xl md:text-7xl font-black tracking-wider animate-pulse"
              style={{ 
                color: mainColor,
                textShadow: `0 0 20px ${mainColor}, 0 0 40px ${mainColor}`
              }}
            >
              {isBullish ? "ALTA" : "BAIXA"}
            </h2>
          </div>
        </div>

        {/* Confidence Section */}
        {confidence && (
          <div className="space-y-4 p-6 rounded-2xl bg-black/50 backdrop-blur-sm border" style={{ borderColor: borderColor }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary">
                  Confidence Level
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span 
                  className="text-3xl font-black"
                  style={{ color: mainColor }}
                >
                  {confidence}
                </span>
                <span className="text-lg font-bold text-muted-foreground">%</span>
              </div>
            </div>
            
            <div className="relative h-4 bg-black rounded-full overflow-hidden border" style={{ borderColor: borderColor }}>
              <div
                className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{ 
                  width: `${confidence}%`,
                  backgroundColor: mainColor,
                  boxShadow: `0 0 20px ${mainColor}`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[slide-in-right_2s_ease-in-out_infinite]" />
              </div>
            </div>
            
            {/* Confidence Quality Indicator */}
            <div className="text-center">
              <span 
                className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-wider"
                style={{ 
                  backgroundColor: bgColor,
                  color: mainColor,
                  border: `1px solid ${borderColor}`
                }}
              >
                {confidence >= 80 ? "🔥 HIGH CONFIDENCE" : confidence >= 60 ? "✓ MODERATE" : "⚠ LOW CONFIDENCE"}
              </span>
            </div>
          </div>
        )}

        {/* Analysis Section */}
        {analysis && (
          <div className="space-y-3 p-6 bg-black/50 rounded-2xl border border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary">
                Technical Analysis
              </p>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed pl-3">
              {analysis}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
