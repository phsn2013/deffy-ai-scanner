import { useState, useEffect } from "react";

export const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="sticky bottom-0 w-full border-t border-border/50 bg-card/20 backdrop-blur-sm z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Live Clock */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">
                AO VIVO
              </span>
            </div>
            <div className="h-4 w-px bg-border/50"></div>
            <time className="text-sm font-mono font-bold text-foreground">
              {formatTime(currentTime)}
            </time>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {currentYear} Deffy - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};
