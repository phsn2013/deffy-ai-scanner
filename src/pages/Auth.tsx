import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
  fullName: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
});

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("Erro ao conectar com Google");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (isLogin) {
      handleLogin();
      return;
    }

    // Validate current step
    if (step === 1) {
      const nameValidation = z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }).safeParse(fullName);
      if (!nameValidation.success) {
        toast.error(nameValidation.error.issues[0].message);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const emailValidation = z.string().email({ message: "Email inválido" }).safeParse(email);
      if (!emailValidation.success) {
        toast.error(emailValidation.error.issues[0].message);
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleSignup();
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const validationData = { email, password };
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }).parse(validationData);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Login realizado com sucesso!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        toast.error("Erro ao processar autenticação");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);

    try {
      const validationData = { email, password, fullName };
      authSchema.parse(validationData);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("Este email já está cadastrado");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Cadastro realizado! Verifique seu email.");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        toast.error("Erro ao processar autenticação");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setStep(1);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNextStep();
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
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

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary tracking-tight">
              deffy
            </h1>
            <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mt-2">
              AI Scanner
            </p>
          </div>

          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            variant="outline"
            className="w-full mb-6 border-primary/20 hover:border-primary/60 hover:bg-primary/10"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-bold tracking-wider uppercase text-xs">
              Continuar com Google
            </span>
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground tracking-wider">Ou</span>
            </div>
          </div>

          {/* Funnel Form */}
          <div className="space-y-6">
            {isLogin ? (
              // Login Form
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold tracking-wider uppercase">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-black/20 border-primary/20 focus:border-primary/60"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-bold tracking-wider uppercase">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-black/20 border-primary/20 focus:border-primary/60 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Signup Funnel
              <>
                {step === 1 && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-bold tracking-wider uppercase">
                      Qual é o seu nome?
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-black/20 border-primary/20 focus:border-primary/60"
                      placeholder="Digite seu nome completo"
                      autoFocus
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Etapa 1 de 3
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-bold tracking-wider uppercase">
                      Qual é o seu email?
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-black/20 border-primary/20 focus:border-primary/60"
                      placeholder="seu@email.com"
                      autoFocus
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Etapa 2 de 3
                    </p>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-bold tracking-wider uppercase">
                      Crie uma senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="bg-black/20 border-primary/20 focus:border-primary/60 pr-10"
                        placeholder="Mínimo 6 caracteres"
                        autoFocus
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Etapa 3 de 3
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isLogin && step > 1 && (
                <Button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                  className="border-primary/20 hover:border-primary/60"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                onClick={handleNextStep}
                disabled={loading}
                className="flex-1 relative overflow-hidden bg-gradient-to-r from-primary via-primary-glow to-primary hover:opacity-90 transition-opacity"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <span className="font-bold tracking-[0.2em] uppercase">
                      {isLogin ? "Entrar" : step === 3 ? "Cadastrar" : "Continuar"}
                    </span>
                    {!isLogin && step < 3 && <ArrowRight className="ml-2 h-4 w-4" />}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={handleToggleMode}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? (
                <>
                  Não tem conta? <span className="font-bold">Cadastre-se</span>
                </>
              ) : (
                <>
                  Já tem conta? <span className="font-bold">Faça login</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
