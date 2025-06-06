// src/components/TelaDeTransicao.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TelaDeTransicao = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 10000); // 10 segundos

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-4">
      <img 
        src="/sucesso.png" // Coloque essa imagem na pasta `public/`
        alt="Orçamento enviado"
        className="w-32 h-32 mb-6 animate-pulse"
      />
      <h1 className="text-2xl font-bold text-green-700 mb-2">
        Orçamento Enviado com Sucesso!
      </h1>
      <p className="text-gray-600">Você será redirecionado para a tela inicial em alguns segundos...</p>
    </div>
  );
};

export default TelaDeTransicao;


