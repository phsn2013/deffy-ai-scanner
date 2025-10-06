import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold glow-text">Deffy</h3>
            <p className="text-sm text-muted-foreground">
              Análise inteligente de gráficos com IA
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Links Rápidos</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="/planilha" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Planilha
              </Link>
              <Link to="/ajuda" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Ajuda
              </Link>
            </nav>
          </div>

          {/* Info Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Informações</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/configuracoes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Configurações
              </Link>
              <Link to="/perfil" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Perfil
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Deffy. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
