import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Broker {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  affiliate_link: string;
  features: string[];
  rating: number;
}

const Corretoras = () => {
  const navigate = useNavigate();
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrokers();
  }, []);

  const loadBrokers = async () => {
    try {
      const { data, error } = await supabase
        .from("brokers")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      setBrokers(data || []);
    } catch (error) {
      console.error("Error loading brokers:", error);
      toast.error("Erro ao carregar corretoras");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Corretoras Recomendadas</h1>
          </div>
        </div>
      </header>

      {/* Brokers Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brokers.map((broker) => (
            <Card key={broker.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <img
                    src={broker.logo_url}
                    alt={broker.name}
                    className="h-12 object-contain"
                  />
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{broker.rating}</span>
                  </div>
                </div>
                <CardTitle>{broker.name}</CardTitle>
                <CardDescription>{broker.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {broker.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(broker.website_url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visitar Site
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => window.open(broker.affiliate_link, "_blank")}
                  >
                    Começar Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Corretoras;
