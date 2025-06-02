import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Send, ArrowLeft, Wrench, Grid3X3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PanoLaje from "./PanoLaje";

interface PanoData {
  id: string;
  vao: string;
  largura: string;
  reforcoAdicional: boolean;
  quantidadeBarras: string;
  tipoAco: string;
}

interface LajeDetailsFormProps {
  nomeCliente: string;
  whatsapp: string;
  email: string;
  enderecoObra: string;
  onVoltar: () => void;
}

const LajeDetailsForm = ({ 
  nomeCliente, 
  whatsapp, 
  email, 
  enderecoObra, 
  onVoltar 
}: LajeDetailsFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Dados da laje
  const [modeloLaje, setModeloLaje] = useState("");
  const [tipoLaje, setTipoLaje] = useState("");
  const [incluirTela, setIncluirTela] = useState("");
  const [tipoTela, setTipoTela] = useState("");
  
  // Panos de laje
  const [panos, setPanos] = useState<PanoData[]>([]);

  const adicionarPano = () => {
    const novoPano: PanoData = {
      id: Date.now().toString(),
      vao: "",
      largura: "",
      reforcoAdicional: false,
      quantidadeBarras: "",
      tipoAco: ""
    };
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

  const enviarOrcamento = async () => {
    // Validação básica
    if (!modeloLaje || !tipoLaje || !incluirTela) {
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
    const savedWebhookEnviarUrl = localStorage.getItem("webhookEnviarUrl");
    if (!savedWebhookEnviarUrl) {
      toast({
        title: "Erro",
        description: "O administrador ainda não configurou a URL do webhook para enviar orçamento.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Converter os valores numéricos dos panos para decimais
    const panosFormatados = panos.map(pano => ({
      ...pano,
      vao: pano.vao ? parseFloat(pano.vao) : 0,
      largura: pano.largura ? parseFloat(pano.largura) : 0,
      quantidadeBarras: pano.quantidadeBarras ? parseInt(pano.quantidadeBarras) : 0
    }));

    const dadosOrcamento = {
      acao: "finalizar_orcamento",
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
      panos: panosFormatados,
      timestamp: new Date().toISOString()
    };

    try {
      console.log("Enviando dados finais para o webhook:", dadosOrcamento);

      await fetch(savedWebhookEnviarUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(dadosOrcamento),
      });

      const navigate = useNavigate();
      
      toast({
        title: "Orçamento enviado com sucesso!",
        description: "Você receberá uma resposta por WhatsApp e e-mail em breve.",
      });

      // Voltar para a primeira tela e limpar dados
      navigate("/login");

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onVoltar}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Dados do Cliente
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dados Técnicos
            </h1>
            <p className="text-gray-600">
              Orçamento para: <span className="font-semibold">{nomeCliente}</span>
            </p>
          </div>
        </div>

        {/* Card principal */}
        <Card className="shadow-xl border-0 overflow-hidden mb-6">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Wrench className="w-6 h-6" />
              Especificações da Laje
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Modelo e Tipo da Laje */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium text-gray-700">Modelo da Laje *</Label>
                <Select value={modeloLaje} onValueChange={setModeloLaje}>
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Selecione o modelo" />
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
                <Label className="text-base font-medium text-gray-700">Tipo de Laje *</Label>
                <Select value={tipoLaje} onValueChange={setTipoLaje}>
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Selecione o tipo" />
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
              <Label className="text-base font-medium text-gray-700 mb-3 block">
                Deseja incluir Tela (Malha)? *
              </Label>
              <RadioGroup value={incluirTela} onValueChange={setIncluirTela} className="flex gap-8">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="tela-sim" />
                  <Label htmlFor="tela-sim" className="text-base">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="tela-nao" />
                  <Label htmlFor="tela-nao" className="text-base">Não</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Tipo de Tela (condicional) */}
            {incluirTela === "sim" && (
              <div>
                <Label className="text-base font-medium text-gray-700">Tipo de Tela</Label>
                <Select value={tipoTela} onValueChange={setTipoTela}>
                  <SelectTrigger className="mt-2 h-12">
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
          </CardContent>
        </Card>

        {/* Panos de Laje */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Grid3X3 className="w-6 h-6" />
                Panos de Laje
              </CardTitle>
              <Button 
                onClick={adicionarPano} 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Pano
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {panos.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <Grid3X3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Nenhum pano adicionado</p>
                <p>Clique em "Adicionar Pano" para começar</p>
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
          </CardContent>
        </Card>

        {/* Botão de Envio */}
        <div className="mt-8">
          <Button 
            onClick={enviarOrcamento} 
            className="w-full h-14 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white text-lg font-semibold shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              "Enviando Orçamento..."
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Enviar Orçamento Final
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LajeDetailsForm;
