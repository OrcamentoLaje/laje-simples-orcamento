
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [manterSalvo, setManterSalvo] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verifica se já existe um email salvo
    const savedEmail = localStorage.getItem("userEmail");
    const keepLogin = localStorage.getItem("keepLogin") === "true";
    
    if (savedEmail && keepLogin) {
      // Se tem email salvo e usuário quer manter salvo, redireciona direto
      navigate("/orcamento");
    } else if (savedEmail) {
      // Se tem email mas não quer manter salvo, apenas preenche o campo
      setEmail(savedEmail);
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, digite seu email",
        variant: "destructive",
      });
      return;
    }

    // Salva o email no localStorage
    localStorage.setItem("userEmail", email);
    localStorage.setItem("keepLogin", manterSalvo.toString());
    
    toast({
      title: "Login realizado",
      description: "Bem-vindo ao sistema!",
    });

    // Redireciona para a página de orçamento
    navigate("/orcamento");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Login</CardTitle>
          <CardDescription className="text-gray-600">
            Digite seu email para acessar o sistema de orçamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 text-base"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="manterSalvo"
                checked={manterSalvo}
                onCheckedChange={(checked) => setManterSalvo(checked as boolean)}
              />
              <Label htmlFor="manterSalvo" className="text-sm text-gray-600">
                Manter-me conectado
              </Label>
            </div>
            
            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base font-semibold">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
