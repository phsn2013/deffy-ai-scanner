import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { AssetSelector, AssetType } from "@/components/AssetSelector";
import { TimeframeSelector, Timeframe } from "@/components/TimeframeSelector";
import { ModelSelector, AIModel } from "@/components/ModelSelector";
import { CameraCapture } from "@/components/CameraCapture";
import { ImageUpload } from "@/components/ImageUpload";
import { AnalysisResult } from "@/components/AnalysisResult";
import { useChartAnalysis } from "@/hooks/useChartAnalysis";
import { Sparkles, User, Settings, FileSpreadsheet, HelpCircle, LogOut, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [assetType, setAssetType] = useState<AssetType>("crypto");
  const [timeframe, setTimeframe] = useState<Timeframe>("1m");
  const [aiModel, setAiModel] = useState<AIModel>("deepseek");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { analyzeChart, isAnalyzing, result } = useChartAnalysis();
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleImageCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    await analyzeChart(imageData, assetType, timeframe, aiModel);
  };

  useEffect(() => {
    if (isAnalyzing && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isAnalyzing]);

  useEffect(() => {
    if (result && resultRef.current && !isAnalyzing) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [result, isAnalyzing]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(hsl(48 100% 50% / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(48 100% 50% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-primary/10">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left Side */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary tracking-tight px-1">
                deffy
              </h1>
              <div className="h-6 w-px bg-primary/20" />
              <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                AI Scanner
              </p>
            </div>

            {/* User Avatar - Right Side */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-card/95 backdrop-blur-xl border-primary/20 z-[100]"
              >
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
                  onClick={() => navigate("/perfil")}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span className="font-bold tracking-wider uppercase text-xs">Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
                  onClick={() => navigate("/planilha")}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span className="font-bold tracking-wider uppercase text-xs">Planilha</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
                  onClick={() => navigate("/configuracoes")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="font-bold tracking-wider uppercase text-xs">Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
                  onClick={() => navigate("/ajuda")}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span className="font-bold tracking-wider uppercase text-xs">Ajuda</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/20" />
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-bold tracking-wider uppercase text-xs">Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-8 relative z-10">

        {/* Scanner Section with Overlay Controls */}
        <div className="mb-8 relative">
          {isMobile === undefined ? (
            <div className="h-[500px] flex items-center justify-center bg-card rounded-2xl border border-primary/20">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground text-sm tracking-wider">INITIALIZING...</p>
              </div>
            </div>
          ) : isMobile ? (
            <>
              <CameraCapture onCapture={handleImageCapture} />
              {/* Control Panel Overlay */}
              <div className="absolute top-4 left-4 right-4 z-10 p-3 rounded-2xl bg-white/5 border border-primary/10 backdrop-blur-xl shadow-2xl">
                <div className="grid grid-cols-3 gap-3">
                  <AssetSelector value={assetType} onChange={setAssetType} />
                  <TimeframeSelector value={timeframe} onChange={setTimeframe} />
                  <ModelSelector value={aiModel} onChange={setAiModel} />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {/* Control Panel Above for Desktop */}
              <div className="p-4 rounded-2xl bg-white/5 border border-primary/10 backdrop-blur-xl shadow-2xl">
                <div className="grid grid-cols-3 gap-4">
                  <AssetSelector value={assetType} onChange={setAssetType} />
                  <TimeframeSelector value={timeframe} onChange={setTimeframe} />
                  <ModelSelector value={aiModel} onChange={setAiModel} />
                </div>
              </div>
              
              {/* Upload Area */}
              <ImageUpload onUpload={handleImageCapture} />
            </div>
          )}
        </div>

        {/* Analysis Result */}
        <div ref={resultRef}>
          <AnalysisResult
            prediction={result?.prediction}
            confidence={result?.confidence}
            analysis={result?.analysis}
            isLoading={isAnalyzing}
            capturedImage={capturedImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
