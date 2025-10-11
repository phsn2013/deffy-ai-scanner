import { useState, useEffect } from "react";
import { Headphones, Volume2, Settings, VolumeX, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";
import { useAdmin } from "@/hooks/useAdmin";

export const Footer = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { isAdmin } = useAdmin();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase();
    const time = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return `${day} ${month}, ${time}`;
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="sticky bottom-0 w-full border-t border-border/50 bg-card backdrop-blur-sm z-40">
      <div className="w-full px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Left - Support */}
          <div className="flex items-center gap-3">
            <Button 
              variant="default" 
              size="sm"
              className="gap-2 text-xs font-bold bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                window.location.href = 'mailto:support@deffy.com.br';
              }}
            >
              <Headphones className="w-4 h-4" />
              SUPORTE
            </Button>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              support@deffy.com.br
            </span>
          </div>

          {/* Center - Slogan */}
          <div className="hidden md:block">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">
              AI Trading Scanner Technology
            </p>
          </div>

          {/* Right - Info */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Powered by
              </span>
              <span className="text-xs font-bold text-foreground">
                Deffy © {currentYear}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => {
                  updateSettings({ soundEffects: !settings.soundEffects });
                  toast.success(settings.soundEffects ? "Sons desativados" : "Sons ativados");
                }}
              >
                {settings.soundEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => navigate('/configuracoes')}
              >
                <Settings className="w-4 h-4" />
              </Button>
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-primary"
                  onClick={() => navigate('/admin')}
                  title="Painel Admin"
                >
                  <Shield className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="h-4 w-px bg-border/50 hidden sm:block"></div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-foreground uppercase">
                Hora Atual:{" "}
              </span>
              <time className="text-xs font-mono font-bold text-primary">
                {formatDateTime(currentTime)} (UTC-3)
              </time>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
