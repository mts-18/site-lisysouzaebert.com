import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { adminLogin } from "@/lib/api";
import { useAuthContext } from "@/providers/AuthProvider";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setToken, authenticated } = useAuthContext();

  useEffect(() => {
    if (authenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [authenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await adminLogin({ username, password });
      setToken(result.token, result.expiresInHours);
      toast({ title: "Login realizado", description: "Bem-vindo ao painel administrativo" });
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      toast({
        title: "Erro de login",
        description: error instanceof Error ? error.message : "Não foi possível autenticar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild>
          <Link to="/">← Home</Link>
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Painel Administrativo</CardTitle>
          <CardDescription className="text-muted-foreground">
            Acesse com suas credenciais de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="username">
                Usuário
              </label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Digite seu usuário"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="password">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-glow text-primary-foreground transition-smooth"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
