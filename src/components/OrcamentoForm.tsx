import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Settings, User, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import LajeDetailsForm from "./LajeDetailsForm";

type OrcamentoFormProps = {
  planilha?: string;
  orcamento?: string;
};

const OrcamentoForm = ({ planilha = "", orcamento = "" }: OrcamentoFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<"cliente" | "laje">("cliente");
  const [isLoading, setIsLoading] = useState(false);

  // Inicializa com as props ou com string vazia, para serem atualizados pelo useEffect se necessário
  const [webhookCriarUrl, setWebhookCriarUrl] = useState(planilha);
  const [webhookEnviarUrl, setWebhookEnviarUrl] = useState(orcamento);

  // Estado para controle de admin
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [savedAdminPassword, setSavedAdminPassword] = useState("");

  // Dados do cliente
  const [nomeCliente, setNomeCliente] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [enderecoObra, setEnderecoObra] = useState("");

  // Carregar configurações salvas e atualizar webhooks se props vazias
  useEffect(() => {
    const savedPassword = localStorage.getItem("adminPassword");
    if (savedPassword) {
      setSavedAdminPassword(savedPassword);
    }

    if (!planilha) {
      const savedCriar = localStorage.getItem("webhookCriarUrl");
      if (savedCriar) setWebhookCriarUrl(savedCriar);
    }
    if (!orcamento) {
      const savedEnviar = localStorage.getItem("webhookEnviarUrl");
      if (savedEnviar) setWebhookEnviarUrl(savedEnviar);
    }
  }, [planilha, orcamento]);

  // Atualizar estados se as props mudarem dinamicamente
  useEffect(() => {
    if (planilha) setWebhookCriarUrl(planilha);
  }, [planilha]);

  useEffect(() => {
    if (orcamento) setWebhookEnviarUrl(orcamento);
  }, [orcamento]);

  const verificarAdmin = () => {
    if (!savedAdminPassword) {
      localStorage.setItem("adminPassword", adminPassword);
      setSavedAdminPassword(adminPassword);
      setIsAdminMode(true);
      toast({
        title: "Configuração de Administrador",
        description: "Senha de administrador configurada com sucesso.",
      });
    } else if (adminPassword === savedAdminPassword) {
      setIsAdminMode(true);
      toast({
        title: "Modo Administrador",
        description: "Você está agora no modo administrador.",
      });
    } else {
      toast({
        title: "Erro",
        description: "Senha de administrador incorreta.",
        variant: "destructive",
      });
    }
  };

  const salvarWebhooks = () => {
    if (!webhookCriarUrl || !webhookEnviarUrl) {
      toast({
        title: "Erro",
        description: "Por favor, insira ambas as URLs dos webhooks.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("webhookCriarUrl", webhookCriarUrl);
    localStorage.setItem("webhookEnviarUrl", webhookEnviarUrl);
    toast({
      title: "Configurações salvas",
      description: "URLs dos webhooks salvas com sucesso.",
    });
  };

  const sairModoAdmin = () => {
    setIsAdminMode(false);
    setAdminPassword("");
  };

  const criarOrcamento = async () => {
    // Validação dos dados do cliente
    if (!nomeCliente || !whatsapp || !email || !enderecoObra) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos do cliente.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Verificar se o webhook está configurado
    const savedWebhookCriarUrl = localStorage.getItem("webhookCriarUrl");
    if (!savedWebhookCriarUrl) {
      toast({
        title: "Erro",
        description: "O administrador ainda não configurou a URL do webhook para criar orçamento.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const dadosCliente = {
      acao: "criar_planilha",
      cliente: {
        nome: nomeCliente,
        whatsapp: whatsapp,
        email: email,
        enderecoObra: enderecoObra,
      },
      timestamp: new Date().toISOString(),
    };

    try {
      console.log("Criando nova planilha para o cliente:", dadosCliente);

      await fetch(savedWebhookCriarUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(dadosCliente),
      });

      toast({
        title: "Orçamento iniciado!",
        description: "Agora preencha os dados técnicos da laje.",
      });

      setCurrentStep("laje");
    } catch (error) {
      console.error("Erro ao criar orçamento:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar orçamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetarFormulario = () => {
    setCurrentStep("cliente");
    setNomeCliente("");
    setWhatsapp("");
    setEmail("");
    setEnderecoObra("");
  };

  if (currentStep === "laje") {
    return (
      <LajeDetailsForm
        nomeCliente={nomeCliente}
        whatsapp={whatsapp}
        email={email}
        enderecoObra={enderecoObra}
        onVoltar={resetarFormulario}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header com configurações */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Orçamento de Laje</h1>
            <p className="text-gray-600">Solicite seu orçamento facilmente</p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                <Settings className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Configuração do Administrador</SheetTitle>
                <SheetDescription>Configure as definições do aplicativo de orçamento.</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {!isAdminMode ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="adminPassword">Senha do Administrador</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Digite a senha de administrador"
                      />
                    </div>
                    <Button onClick={verificarAdmin} className="w-full">
                      {savedAdminPassword ? "Entrar como Admin" : "Configurar Senha"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="webhookCriar">Webhook para Criar Orçamento</Label>
                      <Input
                        id="webhookCriar"
                        type="url"
                        placeholder=""
                        value={webhookCriarUrl}
                        onChange={(e) => setWebhookCriarUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="webhookEnviar">Webhook para Enviar Orçamento</Label>
                      <Input
                        id="webhookEnviar"
                        type="url"
                        placeholder=""
                        value={webhookEnviarUrl}
                        onChange={(e) => setWebhookEnviarUrl(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={salvarWebhooks} className="flex-1">
                        Salvar Configurações
                      </Button>
                      <Button onClick={sairModoAdmin} variant="outline" className="flex-1">
                        Sair do Modo Admin
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Card principal */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center gap-3 text-xl">
              <User className="w-6 h-6" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome" className="text-base font-medium text-gray-700">
                  Nome Completo *
                </Label>
                <Input
                  id="nome"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="mt-2 h-12 text-base"
                />
              </div>

              <div>
                <Label htmlFor="whatsapp" className="text
