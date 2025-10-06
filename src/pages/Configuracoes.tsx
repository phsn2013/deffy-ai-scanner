import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Bell, Moon, Sun, Volume2, Globe, Shield, Palette } from "lucide-react";
import { toast } from "sonner";

const Configuracoes = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    darkMode: false,
    language: "pt-BR",
    soundVolume: 30,
    autoAnalysis: false,
    saveHistory: true,
    theme: "gold",
  });

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const handleReset = () => {
    setSettings({
      notifications: true,
      soundEffects: true,
      darkMode: false,
      language: "pt-BR",
      soundVolume: 30,
      autoAnalysis: false,
      saveHistory: true,
      theme: "gold",
    });
    toast.success("Configurações restauradas para o padrão!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-primary/10">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary tracking-tight">
                Configurações
              </h1>
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Personalize sua experiência
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Aparência
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    Modo Escuro
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar tema escuro para melhor visualização noturna
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Tema de Cor</Label>
                <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                  <SelectTrigger className="bg-white/5 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-xl border-primary/20">
                    <SelectItem value="gold">Dourado (Padrão)</SelectItem>
                    <SelectItem value="blue">Azul</SelectItem>
                    <SelectItem value="purple">Roxo</SelectItem>
                    <SelectItem value="green">Verde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notificações
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber alertas sobre análises e atualizações
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                />
              </div>
            </div>
          </Card>

          {/* Sound Settings */}
          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Sons
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Efeitos Sonoros</Label>
                  <p className="text-sm text-muted-foreground">
                    Sons de clique e feedback ao interagir
                  </p>
                </div>
                <Switch
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => setSettings({ ...settings, soundEffects: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Volume dos Efeitos</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.soundVolume]}
                    onValueChange={(value) => setSettings({ ...settings, soundVolume: value[0] })}
                    max={100}
                    step={1}
                    className="flex-1"
                    disabled={!settings.soundEffects}
                  />
                  <span className="text-sm font-bold w-12 text-right">{settings.soundVolume}%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Language Settings */}
          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Idioma
            </h3>
            <div className="space-y-2">
              <Label>Idioma do Aplicativo</Label>
              <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                <SelectTrigger className="bg-white/5 border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-primary/20">
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacidade e Dados
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Salvar Histórico de Análises</Label>
                  <p className="text-sm text-muted-foreground">
                    Manter registro de todas as análises realizadas
                  </p>
                </div>
                <Switch
                  checked={settings.saveHistory}
                  onCheckedChange={(checked) => setSettings({ ...settings, saveHistory: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Análise Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Iniciar análise automaticamente ao capturar imagem
                  </p>
                </div>
                <Switch
                  checked={settings.autoAnalysis}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoAnalysis: checked })}
                />
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Salvar Configurações
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 border-primary/20 hover:bg-primary/10"
            >
              Restaurar Padrão
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
