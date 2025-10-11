import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Users, Building2, BarChart3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Broker {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  affiliate_link: string;
  is_active: boolean;
  display_order: number;
  features: string[];
  rating: number;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  email?: string;
  full_name?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdmin();
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [users, setUsers] = useState<UserRole[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalAnalyses: 0, totalBrokers: 0 });
  const [editingBroker, setEditingBroker] = useState<Broker | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Acesso negado");
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    await Promise.all([loadBrokers(), loadUsers(), loadStats()]);
  };

  const loadBrokers = async () => {
    const { data, error } = await supabase
      .from("brokers")
      .select("*")
      .order("display_order");
    
    if (error) {
      toast.error("Erro ao carregar corretoras");
      return;
    }
    setBrokers(data || []);
  };

  const loadUsers = async () => {
    // Get all user roles with their profiles
    const { data: rolesData, error: rolesError } = await supabase
      .from("user_roles")
      .select("*");
    
    if (rolesError) {
      toast.error("Erro ao carregar usuários");
      return;
    }

    // Get all profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, full_name");

    if (profilesError) {
      toast.error("Erro ao carregar perfis");
      return;
    }

    // Merge the data
    const mergedData = rolesData?.map(role => {
      const profile = profilesData?.find(p => p.id === role.user_id);
      return {
        ...role,
        email: profile?.email || "",
        full_name: profile?.full_name || "",
      };
    }) || [];

    setUsers(mergedData);
  };

  const loadStats = async () => {
    const [usersRes, analysesRes, brokersRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("user_analyses").select("id", { count: "exact", head: true }),
      supabase.from("brokers").select("id", { count: "exact", head: true }),
    ]);

    setStats({
      totalUsers: usersRes.count || 0,
      totalAnalyses: analysesRes.count || 0,
      totalBrokers: brokersRes.count || 0,
    });
  };

  const saveBroker = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const brokerData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      logo_url: formData.get("logo_url") as string,
      website_url: formData.get("website_url") as string,
      affiliate_link: formData.get("affiliate_link") as string,
      is_active: formData.get("is_active") === "on",
      display_order: parseInt(formData.get("display_order") as string),
      features: (formData.get("features") as string).split(",").map(f => f.trim()),
      rating: parseFloat(formData.get("rating") as string),
    };

    if (editingBroker) {
      const { error } = await supabase
        .from("brokers")
        .update(brokerData)
        .eq("id", editingBroker.id);
      
      if (error) {
        toast.error("Erro ao atualizar corretora");
        return;
      }
      toast.success("Corretora atualizada!");
    } else {
      const { error } = await supabase
        .from("brokers")
        .insert(brokerData);
      
      if (error) {
        toast.error("Erro ao criar corretora");
        return;
      }
      toast.success("Corretora criada!");
    }

    setIsDialogOpen(false);
    setEditingBroker(null);
    loadBrokers();
  };

  const deleteBroker = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta corretora?")) return;

    const { error } = await supabase
      .from("brokers")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir corretora");
      return;
    }

    toast.success("Corretora excluída!");
    loadBrokers();
  };

  const updateUserRole = async (userId: string, newRole: "admin" | "user") => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", userId);

    if (error) {
      toast.error("Erro ao atualizar role");
      return;
    }

    toast.success("Role atualizada!");
    loadUsers();
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Análises</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Corretoras Ativas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBrokers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="brokers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="brokers">Corretoras</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="brokers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Corretoras</CardTitle>
                    <CardDescription>
                      Adicione, edite ou remova corretoras do sistema
                    </CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingBroker(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Corretora
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <form onSubmit={saveBroker}>
                        <DialogHeader>
                          <DialogTitle>
                            {editingBroker ? "Editar Corretora" : "Nova Corretora"}
                          </DialogTitle>
                          <DialogDescription>
                            Preencha os dados da corretora
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                              id="name"
                              name="name"
                              defaultValue={editingBroker?.name}
                              required
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                              id="description"
                              name="description"
                              defaultValue={editingBroker?.description}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="logo_url">URL do Logo</Label>
                            <Input
                              id="logo_url"
                              name="logo_url"
                              defaultValue={editingBroker?.logo_url}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="website_url">Site</Label>
                            <Input
                              id="website_url"
                              name="website_url"
                              type="url"
                              defaultValue={editingBroker?.website_url}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="affiliate_link">Link de Afiliado</Label>
                            <Input
                              id="affiliate_link"
                              name="affiliate_link"
                              type="url"
                              defaultValue={editingBroker?.affiliate_link}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="features">Características (separadas por vírgula)</Label>
                            <Input
                              id="features"
                              name="features"
                              defaultValue={editingBroker?.features?.join(", ")}
                              placeholder="Ex: App Mobile, Suporte 24/7, Análise Técnica"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="rating">Avaliação (0-5)</Label>
                              <Input
                                id="rating"
                                name="rating"
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                defaultValue={editingBroker?.rating}
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="display_order">Ordem</Label>
                              <Input
                                id="display_order"
                                name="display_order"
                                type="number"
                                defaultValue={editingBroker?.display_order || 0}
                              />
                            </div>

                            <div className="flex items-center space-x-2 pt-8">
                              <Switch
                                id="is_active"
                                name="is_active"
                                defaultChecked={editingBroker?.is_active ?? true}
                              />
                              <Label htmlFor="is_active">Ativa</Label>
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button type="submit">Salvar</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Avaliação</TableHead>
                      <TableHead>Ordem</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brokers.map((broker) => (
                      <TableRow key={broker.id}>
                        <TableCell className="font-medium">{broker.name}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              broker.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {broker.is_active ? "Ativa" : "Inativa"}
                          </span>
                        </TableCell>
                        <TableCell>{broker.rating}/5</TableCell>
                        <TableCell>{broker.display_order}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingBroker(broker);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteBroker(broker.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie as permissões dos usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userRole) => (
                      <TableRow key={userRole.id}>
                        <TableCell>{userRole.email}</TableCell>
                        <TableCell>{userRole.full_name || "-"}</TableCell>
                        <TableCell>
                          <Select
                            value={userRole.role}
                            onValueChange={(value) => updateUserRole(userRole.user_id, value as "admin" | "user")}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Usuário</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
