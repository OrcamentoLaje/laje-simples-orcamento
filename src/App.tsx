import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TelaDeTransicao from "@/components/TelaDeTransicao";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
// Você precisará criar este componente ou usar um existente
// import ConsultaOrcamentos from "./pages/ConsultaOrcamentos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orcamento" element={<Index />} />
          <Route path="/transicao" element={<TelaDeTransicao />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Adicione esta rota quando criar o componente ConsultaOrcamentos */}
          {/* <Route path="/consulta-orcamentos" element={<ConsultaOrcamentos />} /> */}
          
          {/* Rota temporária para consulta-orcamentos até criar o componente */}
          <Route path="/consulta-orcamentos" element={<div className="p-8 text-center"><h1>Página de Consulta de Orçamentos em desenvolvimento</h1></div>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
