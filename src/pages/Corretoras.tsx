import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Settings, 
  FileSpreadsheet, 
  HelpCircle, 
  LogOut, 
  UserCircle, 
  BookOpen,
  Store,
  ExternalLink,
  TrendingUp,
  Star
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

interface Broker {
  name: string;
  description: string;
  features: string[];
  rating: number;
  category: string;
}

const brokers: Broker[] = [
  {
    name: "Quotex",
    description: "Plataforma moderna de opções binárias com interface intuitiva e depósito mínimo acessível.",
    features: ["Depósito mínimo $10", "Bônus de boas-vindas", "App mobile"],
    rating: 4.5,
    category: "Opções Binárias"
  },
  {
    name: "IQ Option",
    description: "Uma das maiores plataformas de trading do mundo, com milhões de usuários ativos.",
    features: ["Conta demo gratuita", "Torneios", "Indicadores técnicos"],
    rating: 4.8,
    category: "Multi-Ativos"
  },
  {
    name: "Binomo",
    description: "Corretora internacional com certificação e plataforma de fácil utilização.",
    features: ["Certificação IFC", "Suporte 24/7", "Materiais educativos"],
    rating: 4.3,
    category: "Opções Binárias"
  },
  {
    name: "Deriv",
    description: "Plataforma de trading com mais de 20 anos de experiência no mercado.",
    features: ["Regulamentada", "Forex & CFDs", "MetaTrader 5"],
    rating: 4.6,
    category: "Forex & CFDs"
  },
  {
    name: "Ebinex",
    description: "Corretora brasileira especializada em opções digitais e forex.",
    features: ["PIX instantâneo", "Suporte em PT-BR", "Cashback"],
    rating: 4.2,
    category: "Opções Digitais"
  },
  {
    name: "Pocket Option",
    description: "Plataforma de opções binárias com recursos sociais e torneios frequentes.",
    features: ["Copy trading", "Sinais gratuitos", "Bônus sem depósito"],
    rating: 4.4,
    category: "Opções Binárias"
  },
  {
    name: "Homebroker",
    description: "Acesso direto à Bolsa de Valores brasileira (B3) com taxas competitivas.",
    features: ["B3", "Ações e FIIs", "Análise fundamentalista"],
    rating: 4.7,
    category: "Bolsa de Valores"
  },
  {
    name: "Avalon",
    description: "Plataforma de trading com foco em tecnologia e análise avançada.",
    features: ["API trading", "Análise técnica", "Multi-telas"],
    rating: 4.1,
    category: "Trading Avançado"
  },
  {
    name: "Bullex",
    description: "Corretora moderna com interface gamificada e recursos educacionais.",
    features: ["Gamificação", "Cursos gratuitos", "Comunidade ativa"],
    rating: 4.0,
    category: "Educacional"
  },
  {
    name: "Polarium",
    description: "Plataforma de investimentos com foco em criptomoedas e ativos digitais.",
    features: ["Cripto trading", "Staking", "Carteira integrada"],
    rating: 4.3,
    category: "Criptomoedas"
  }
];

const Corretoras = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
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

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-primary/10">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <h1 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary tracking-tight px-1">
                deffy
              </h1>
              <div className="h-6 w-px bg-primary/20" />
              <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                AI Scanner
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-primary/20">
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/perfil")}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span className="font-bold tracking-wider uppercase text-xs">Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/planilha")}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span className="font-bold tracking-wider uppercase text-xs">Planilha</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/estudo")}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span className="font-bold tracking-wider uppercase text-xs">Estudo</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/corretoras")}>
                  <Store className="mr-2 h-4 w-4" />
                  <span className="font-bold tracking-wider uppercase text-xs">Corretoras</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/configuracoes")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="font-bold tracking-wider uppercase text-xs">Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/ajuda")}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span className="font-bold tracking-wider uppercase text-xs">Ajuda</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/20" />
                <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-bold tracking-wider uppercase text-xs">Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Store className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-wider uppercase text-primary">Marketplace</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary">
            Corretoras Recomendadas
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conheça as principais corretoras do mercado e escolha a melhor para o seu perfil de trading
          </p>
        </div>

        {/* Brokers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brokers.map((broker) => (
            <Card 
              key={broker.name}
              className="p-6 bg-card/50 backdrop-blur-xl border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black text-foreground mb-1 group-hover:text-primary transition-colors">
                      {broker.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {broker.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="w-4 h-4 fill-primary" />
                    <span className="text-sm font-bold">{broker.rating}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {broker.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {broker.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className="w-full font-bold tracking-wider uppercase group-hover:shadow-lg group-hover:shadow-primary/20 transition-all"
                  onClick={() => window.open('#', '_blank')}
                >
                  Acessar Corretora
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 rounded-2xl bg-card/30 backdrop-blur-xl border border-primary/10">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong className="text-foreground">Aviso Legal:</strong> O trading envolve riscos. 
            Certifique-se de entender os riscos envolvidos antes de investir. 
            As informações apresentadas não constituem recomendação de investimento.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Corretoras;
