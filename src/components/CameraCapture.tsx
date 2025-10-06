import { useRef, useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

export const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const startCamera = async () => {
    setError("");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Seu navegador não suporta acesso à câmera");
      }

      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsReady(true);
      }
    } catch (err: any) {
      console.error("Erro ao acessar câmera:", err);
      let errorMessage = "Erro ao acessar a câmera";
      
      if (err.name === "NotAllowedError") {
        errorMessage = "Permissão de câmera negada. Por favor, permita o acesso à câmera.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "Nenhuma câmera encontrada no dispositivo.";
      } else if (err.name === "NotReadableError") {
        errorMessage = "Câmera já está em uso por outro aplicativo.";
      }
      
      setError(errorMessage);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && isReady) {
      setIsScanning(true);
      
      // Aguarda a animação do scanner completar antes de capturar
      setTimeout(() => {
        const video = videoRef.current!;
        const canvas = canvasRef.current!;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const imageData = canvas.toDataURL("image/jpeg", 0.95);
          
          setIsScanning(false);
          onCapture(imageData);
          
          toast({
            title: "Gráfico capturado!",
            description: "Analisando...",
          });
        }
      }, 2000); // Duração da animação do scanner
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
  };

  // Iniciar câmera automaticamente ao montar
  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  if (error) {
    return (
      <div className="space-y-4">
        <div className="p-6 bg-destructive/10 border border-destructive rounded-xl">
          <p className="text-sm text-destructive text-center">{error}</p>
        </div>
        <Button
          onClick={startCamera}
          className="w-full"
          size="lg"
        >
          <Camera className="mr-2 h-5 w-5" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative aspect-[9/16] bg-black rounded-3xl overflow-hidden border-2 border-primary/40 glow-border shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <Camera className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-primary text-sm font-bold tracking-[0.3em] uppercase glow-text">
                Scanner Online
              </p>
            </div>
          </div>
        )}
        
        {/* Scanning Animation Overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none bg-black/30 backdrop-blur-[1px]">
            {/* Animated Scanner Bar */}
            <div className="absolute w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_30px_rgba(255,215,0,0.8)] animate-[slide-down_2s_ease-in-out]" 
                 style={{ 
                   top: '0%',
                   animation: 'slide-down 2s ease-in-out forwards'
                 }} 
            />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255, 215, 0, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 215, 0, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
              animation: 'fade-in 0.3s ease-out'
            }} />
            
            {/* Scanning Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="px-6 py-3 bg-primary/20 backdrop-blur-xl border border-primary rounded-xl">
                <p className="text-primary text-sm font-bold tracking-[0.3em] uppercase animate-pulse">
                  SCANNING...
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Scanner Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Gradient */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
          
          {/* Scanning Line */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-[slide-in-right_3s_ease-in-out_infinite]" 
                 style={{ top: '50%' }} />
          </div>
          
          {/* Corner Brackets */}
          <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/60" />
          <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary/60" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary/60" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary/60" />
          
          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 space-y-4 z-20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/30">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
                  Point at Chart
                </p>
              </div>
            </div>
            
            {/* Capture Button */}
            <button
              onClick={captureImage}
              disabled={!isReady || isScanning}
              className="w-full relative group overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border-2 border-primary/30 p-1 transition-all duration-300 hover:border-primary/60 hover:bg-white/10 disabled:opacity-50 pointer-events-auto z-30"
            >
              <div className="px-8 py-4 transition-all duration-300">
                <div className="flex items-center justify-center gap-3">
                  <Camera className="h-5 w-5 text-primary transition-colors" />
                  <span className="text-lg font-bold tracking-[0.2em] uppercase text-primary transition-colors">
                    Capture
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
