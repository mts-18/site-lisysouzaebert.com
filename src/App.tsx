import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogEditor from "./pages/BlogEditor";
import Sobre from "./pages/Sobre";
import Servicos from "./pages/Servicos";
import Contato from "./pages/Contato";
import { AuthProvider } from "./providers/AuthProvider";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Rotas do Blog */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/novo" element={<BlogEditor />} />
            <Route path="/blog/editar/:id" element={<BlogEditor />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            
            {/* Rota de fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingWhatsApp />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
