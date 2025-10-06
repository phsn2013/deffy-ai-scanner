import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User, Mail, Calendar, Camera, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface UserStats {
  totalAnalyses: number;
  bullishCount: number;
  bearishCount: number;
  avgConfidence: number;
  memberSince: string;
}

const Perfil = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [stats, setStats] = useState<UserStats>({
    totalAnalyses: 0,
    bullishCount: 0,
    bearishCount: 0,
    avgConfidence: 0,
    memberSince: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      loadProfile();
      loadStats();
    }
  }, [user, authLoading, navigate]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFullName(data.full_name || "");
        setEmail(data.email || user.email || "");
        setAvatarUrl(data.avatar_url || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!user) return;

    try {
      const { data: analyses, error } = await supabase
        .from("user_analyses")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      const bullishCount = analyses?.filter(a => a.prediction === "bullish").length || 0;
      const bearishCount = analyses?.filter(a => a.prediction === "bearish").length || 0;
      const avgConfidence = analyses?.length 
        ? Math.round(analyses.reduce((acc, a) => acc + Number(a.confidence), 0) / analyses.length)
        : 0;

      const { data: profile } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("id", user.id)
        .single();

      const memberSince = profile?.created_at 
        ? new Date(profile.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
        : "";

      setStats({
        totalAnalyses: analyses?.length || 0,
        bullishCount,
        bearishCount,
        avgConfidence,
        memberSince,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 2MB.");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success("Foto de perfil atualizada!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Erro ao fazer upload da foto");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          full_name: fullName,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                Meu Perfil
              </h1>
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Suas informações e métricas
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <Card className="p-8 bg-card/50 backdrop-blur-xl border-primary/20">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-primary/20">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                  <Camera className="h-8 w-8 text-white" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
            <h2 className="text-2xl font-bold mt-4">{fullName || "Usuário"}</h2>
            <p className="text-muted-foreground text-sm">{email}</p>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Nome Completo
              </Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/5 border-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-white/5 border-primary/20 opacity-60"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Membro desde
              </Label>
              <Input
                value={stats.memberSince || "Carregando..."}
                disabled
                className="bg-white/5 border-primary/20 opacity-60"
              />
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="w-full mt-8 bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 text-center">
            <p className="text-3xl font-bold text-primary">{stats.totalAnalyses}</p>
            <p className="text-sm text-muted-foreground mt-1">Análises Totais</p>
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 text-center">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-500" />
              <p className="text-3xl font-bold text-green-500">{stats.bullishCount}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Bullish</p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 text-center">
            <div className="flex items-center justify-center gap-2">
              <TrendingDown className="h-6 w-6 text-red-500" />
              <p className="text-3xl font-bold text-red-500">{stats.bearishCount}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Bearish</p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-xl border-primary/20 text-center">
            <p className="text-3xl font-bold text-primary">{stats.avgConfidence}%</p>
            <p className="text-sm text-muted-foreground mt-1">Confiança Média</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
