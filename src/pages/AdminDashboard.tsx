import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { deleteLead, fetchLeads, type Lead } from "@/lib/api";
import { useAuthContext } from "@/providers/AuthProvider";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, LogOut, RefreshCw, Search, Trash2, Eye, MessageCircle } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Função para formatar número do WhatsApp para URL
const formatWhatsAppUrl = (whatsapp: string) => {
  // Remove todos os caracteres não numéricos
  const numbers = whatsapp.replace(/\D/g, '');
  
  // Se já tem código do país (11 dígitos), usa como está
  if (numbers.length === 11) {
    return `55${numbers}`;
  }
  // Se tem 10 dígitos, adiciona código do país
  if (numbers.length === 10) {
    return `55${numbers}`;
  }
  // Se tem 13 dígitos (já com 55), usa como está
  if (numbers.length === 13 && numbers.startsWith('55')) {
    return numbers;
  }
  // Fallback: adiciona 55 se não tiver
  return `55${numbers}`;
};

const AdminDashboard = () => {
  const { token, authenticated, clearToken } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const loadLeads = async (query?: string) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetchLeads(token, query);
      setLeads(response.data);
    } catch (error) {
      toast({
        title: "Erro ao carregar leads",
        description: error instanceof Error ? error.message : "Não foi possível carregar os dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authenticated || !token) {
      navigate("/admin", { replace: true });
      return;
    }

    void loadLeads();
  }, [authenticated, navigate, token]);

  const filteredLeads = useMemo(() => {
    if (!search) return leads;
    const normalized = search.toLowerCase();
    return leads.filter((lead) =>
      [lead.name, lead.email, lead.service].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [leads, search]);

  const totalLeads = leads.length;

  const handleLogout = () => {
    clearToken();
    navigate("/admin", { replace: true });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    void loadLeads(value);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    const confirmed = window.confirm("Tem certeza que deseja excluir este lead?");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await deleteLead(token, id);
      toast({ title: "Lead excluído", description: "O lead foi removido com sucesso." });
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch (error) {
      toast({
        title: "Erro ao excluir lead",
        description: error instanceof Error ? error.message : "Não foi possível excluir o lead",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border/60">
        <div className="container mx-auto px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/">← Home</Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gradient-gold">Painel Administrativo</h1>
              <p className="text-muted-foreground">Gerencie os leads recebidos pelo formulário de contato.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 border-violet-500 text-violet-600 hover:bg-violet-100"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-6">
        <Card className="bg-white/80 border-primary/20 shadow-lg">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Leads cadastrados</CardTitle>
              <CardDescription className="text-muted-foreground">
                Acompanhe e gerencie as mensagens recebidas.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, e-mail ou serviço"
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-10 w-72 bg-white/90 border-violet-300 focus-visible:ring-violet-500"
                />
              </div>
              <Badge className="bg-violet-600/90 text-white">Total de Leads: {totalLeads}</Badge>
              <Button
                variant="outline"
                onClick={() => loadLeads(search)}
                disabled={loading}
                className="flex items-center gap-2 border-violet-500 text-violet-600 hover:bg-violet-100"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <Table>
                <TableHeader className="bg-violet-50/80">
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Recebido em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex justify-center items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" /> Carregando leads...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        Nenhum lead encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-violet-50/50">
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>
                          <a href={`mailto:${lead.email}`} className="text-violet-600 hover:underline">
                            {lead.email}
                          </a>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{lead.whatsapp}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
                              onClick={() => window.open(`https://wa.me/${formatWhatsAppUrl(lead.whatsapp)}`, '_blank')}
                              title="Conversar no WhatsApp"
                            >
                              <WhatsAppIcon size={14} />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{lead.service}</TableCell>
                        <TableCell>
                          {format(new Date(lead.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => setSelectedLead(lead)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(lead.id)}
                            disabled={deletingId === lead.id}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {deletingId === lead.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={Boolean(selectedLead)} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">Detalhes do Lead</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Veja as informações completas do lead selecionado.
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Nome</h3>
                <p className="text-lg text-foreground">{selectedLead.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">E-mail</h3>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="text-lg text-violet-600 hover:underline"
                >
                  {selectedLead.email}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">WhatsApp</h3>
                <div className="flex items-center gap-3">
                  <span className="text-lg text-foreground">{selectedLead.whatsapp}</span>
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => window.open(`https://wa.me/${formatWhatsAppUrl(selectedLead.whatsapp)}`, '_blank')}
                  >
                    <WhatsAppIcon size={16} className="mr-2" />
                    Conversar
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Serviço</h3>
                <p className="text-lg text-foreground capitalize">{selectedLead.service}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Mensagem</h3>
                <p className="text-foreground leading-relaxed whitespace-pre-line">{selectedLead.message}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Recebido em</h3>
                <p className="text-foreground">
                  {format(new Date(selectedLead.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
