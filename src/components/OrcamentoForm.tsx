import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Plus, Send, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PanoLaje from "./PanoLaje";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface PanoData {
  id: string;
  vao: string;
  largura: string;
  reforcoAdicional: boolean;
  quantidadeBarras: string;
  tipoAco: string;
}

const OrcamentoForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  
  // Estado para controle de admin
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [savedAdminPassword, setSavedAdminPassword] = useState("");
  
  // Dados do cliente
  const [nomeCliente, setNomeCliente] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [enderecoObra, setEnderecoObra] = useState("");
  
  // Dados da laje
  const [modeloLaje, setModeloLaje] = useState("");
  const [tipoLaje, setTipoLaje] = useState("");
  const [incluirTela, setIncluirTela] = useState("");
  const [tipoTela, setTipoTela] = useState("");
  
  // Panos de laje
  const [panos, setPanos] = useState<PanoData[]>([]);

  // Carregar configurações salvas
  useEffect(() => {
    const savedWebhookUrl = localStorage.getItem("webhookUrl");
    if (savedWebhookUrl) {
      setWebhookUrl(savedWebhookUrl);
    }
    
    const savedPassword = localStorage.getItem("adminPassword");
    if (savedPassword) {
      setSavedAdminPassword(savedPassword);
    }
  }, []);

  const adicionarPano = () => {
    const novoPano: PanoData = {
      id: Date.now().toString(),
      vao: "",
      largura: "",
      reforcoAdicional: false,
      quantidadeBarras: "",
      tipoAco: ""
    };
    // Adicionando o novo pano no início do array para exibição em ordem decrescente
    setPanos([novoPano, ...panos]);
  };

  const atualizarPano = (id: string, dadosAtualizados: Partial<PanoData>) => {
    setPanos(panos.map(pano => 
      pano.id === id ? { ...pano, ...dadosAtualizados } : pano
    ));
  };

  const removerPano = (id: string) => {
    setPanos(panos.filter(pano => pano.id !== id));
  };

  const verificarAdmin = () => {
    // Se a senha ainda não foi configurada, definir a primeira senha
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

  const salvarWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: "Erro",
        description: "Por favor, insira a URL do webhook.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("webhookUrl", webhookUrl);
    toast({
      title: "Configuração salva",
      description: "URL do webhook salva com sucesso.",
    });
  };

  const sairModoAdmin = () => {
    setIsAdminMode(false);
    setAdminPassword("");
  };

  const enviarOrcamento = async () => {
    // Validação básica
    if (!nomeCliente || !whatsapp || !email || !enderecoObra || !modeloLaje || !tipoLaje || !incluirTela) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (incluirTela === "sim" && !tipoTela) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o tipo de tela.",
        variant: "destructive",
      });
      return;
    }

    if (panos.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, adicione pelo menos um pano de laje.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o webhook está configurado
    const savedWebhookUrl = localStorage.getItem("webhookUrl");
    if (!savedWebhookUrl) {
      toast({
        title: "Erro",
        description: "O administrador ainda não configurou a URL do webhook.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const dadosOrcamento = {
      cliente: {
        nome: nomeCliente,
        whatsapp: whatsapp,
        email: email,
        enderecoObra: enderecoObra
      },
      laje: {
        modelo: modeloLaje,
        tipo: tipoLaje,
        incluirTela: incluirTela,
        tipoTela: incluirTela === "sim" ? tipoTela : null
      },
      panos: panos,
      timestamp: new Date().toISOString()
    };

    try {
      console.log("Enviando dados para o webhook:", dadosOrcamento);

      const response = await fetch(savedWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(dadosOrcamento),
      });

      toast({
        title: "Orçamento enviado com sucesso!",
        description: "Você receberá uma resposta por WhatsApp e e-mail em breve.",
      });

      // Limpar formulário
      setNomeCliente("");
      setWhatsapp("");
      setEmail("");
      setEnderecoObra("");
      setModeloLaje("");
      setTipoLaje("");
      setIncluirTela("");
      setTipoTela("");
      setPanos([]);

    } catch (error) {
      console.error("Erro ao enviar orçamento:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar orçamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full shadow-lg">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Dados para Orçamento</CardTitle>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="text-white hover:text-white hover:bg-blue-700">
                <Settings className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Configuração do Administrador</SheetTitle>
                <SheetDescription>
                  Configure as definições do aplicativo de orçamento.
                </SheetDescription>
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
                      <Label htmlFor="webhook">URL do Webhook n8n</Label>
                      <Input
                        id="webhook"
                        type="url"
                        placeholder="https://seu-n8n.com/webhook/orcamento"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={salvarWebhook} className="flex-1">
                        Salvar Configuração
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
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Dados do Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome do Cliente *</Label>
              <Input
                id="nome"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                placeholder="Digite o nome completo"
              />
            </div>
            
            <div>
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div>
              <Label htmlFor="endereco">Endereço da Obra *</Label>
              <Input
                id="endereco"
                value={enderecoObra}
                onChange={(e) => setEnderecoObra(e.target.value)}
                placeholder="Endereço completo da obra"
              />
            </div>
          </div>

          {/* Modelo da Laje */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Modelo da Laje *</Label>
              <Select value={modeloLaje} onValueChange={setModeloLaje}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo da laje" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="H8">Laje H8</SelectItem>
                  <SelectItem value="H12">Laje H12</SelectItem>
                  <SelectItem value="H16">Laje H16</SelectItem>
                  <SelectItem value="H20">Laje H20</SelectItem>
                  <SelectItem value="H25">Laje H25</SelectItem>
                  <SelectItem value="H30">Laje H30</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipo de Laje *</Label>
              <Select value={tipoLaje} onValueChange={setTipoLaje}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo da laje" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lajota-ceramica">Lajota Cerâmica</SelectItem>
                  <SelectItem value="eps">EPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Incluir Tela */}
          <div>
            <Label className="text-base font-medium">Deseja incluir Tela (Malha)? *</Label>
            <RadioGroup value={incluirTela} onValueChange={setIncluirTela} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="tela-sim" />
                <Label htmlFor="tela-sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="tela-nao" />
                <Label htmlFor="tela-nao">Não</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Tipo de Tela (condicional) */}
          {incluirTela === "sim" && (
            <div>
              <Label>Tipo de Tela</Label>
              <Select value={tipoTela} onValueChange={setTipoTela}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de tela" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q45">Tela Q45</SelectItem>
                  <SelectItem value="Q61">Tela Q61</SelectItem>
                  <SelectItem value="Q92">Tela Q92</SelectItem>
                  <SelectItem value="Q138">Tela Q138</SelectItem>
                  <SelectItem value="Q196">Tela Q196</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Panos de Laje */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-semibold">Panos de Laje</Label>
              <Button onClick={adicionarPano} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Pano
              </Button>
            </div>
            
            {panos.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                Nenhum pano adicionado. Clique em "Adicionar Pano" para começar.
              </div>
            ) : (
              <div className="space-y-4">
                {panos.map((pano, index) => (
                  <PanoLaje
                    key={pano.id}
                    pano={pano}
                    index={index}
                    totalPanos={panos.length}
                    onUpdate={(dados) => atualizarPano(pano.id, dados)}
                    onRemove={() => removerPano(pano.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Botão de Envio */}
          <Button 
            onClick={enviarOrcamento} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              "Enviando..."
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Enviar para Orçamento
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default OrcamentoForm;
