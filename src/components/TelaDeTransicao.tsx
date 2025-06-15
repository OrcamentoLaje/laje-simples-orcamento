// src/components/TelaDeTransicao.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const TelaDeTransicao = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Limpar localStorage IMEDIATAMENTE ao entrar na tela
    localStorage.removeItem("userEmail");
    localStorage.removeItem("keepLogin");
    
    // Opcional: limpar também os webhooks se necessário
    // localStorage.removeItem("webhookCriarUrl");
    // localStorage.removeItem("webhookEnviarUrl");
    
    // Configurar redirecionamento
    const timer = setTimeout(() => {
      navigate("/login");
    }, 10000); // 10 segundos
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  const handleExit = () => {
    navigate("/login");
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 text-center px-4">
      <div className="bg-green-100 p-6 rounded-full mb-6">
        <CheckCircle className="w-24 h-24 text-green-600 animate-pulse" />
      </div>
      <h1 className="text-3xl font-bold text-green-700 mb-3">
        Orçamento Enviado com Sucesso!
      </h1>
      <p className="text-gray-600 mb-8 text-lg">
        Você será redirecionado para a tela inicial em alguns segundos...
      </p>
      <Button
        onClick={handleExit}
        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
      >
        Voltar ao Login
      </Button>
    </div>
  );
};

export default TelaDeTransicao;
