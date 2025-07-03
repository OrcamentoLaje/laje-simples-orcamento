// 1. ADICIONE NO IMPORT (no topo do arquivo, junto com os outros imports)
import ProdutoAvulsoItem from "./ProdutoAvulsoItem";
import { Plus, Send, ArrowLeft, Wrench, Grid3X3, Package } from "lucide-react"; // Adicione Package

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Send, ArrowLeft, Wrench, Grid3X3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PanoLaje from "./PanoLaje";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input"; //adicionado

//ANTIGO CODIGO PANO
//interface PanoData {
  //id: string;
  //vao: string;
  //largura: string;
  //reforcoAdicional: boolean;
  //quantidadeBarras: string;
  //tipoAco: string;
//}

//NOVO CODIGO PANO
interface PanoData {
  id: string;
  nome: string; // ← NOVO
  numeroSequencial: number; // ← NOVO
  vao: string;
  largura: string;
  reforcoAdicional: boolean;
  quantidadeBarras: string;
  tipoAco: string;
  precoReforco?: string; // ← ADICIONAR ESTA LINHA
}

// 2. ADICIONE A INTERFACE (após a interface PanoData)
interface ProdutoAvulso {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: string;
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

  const navigate = useNavigate();
  
  // Dados da laje
  const [modeloLaje, setModeloLaje] = useState("");
  const [tipoLaje, setTipoLaje] = useState("");
  const [precoLaje, setPrecoLaje] = useState(""); // ← ADICIONAR
  const [incluirTela, setIncluirTela] = useState("");
  const [tipoTela, setTipoTela] = useState("");
  const [precoTela, setPrecoTela] = useState(""); // ← ADICIONAR
  
  // Panos de laje
  const [panos, setPanos] = useState<PanoData[]>([]);
  // ADICIONADO:
  const [proximoNumero, setProximoNumero] = useState(1);

  // 3. ADICIONE OS ESTADOS (após os outros useState, por volta da linha 60)
  const [incluirProdutosAvulsos, setIncluirProdutosAvulsos] = useState("");
  const [produtosAvulsos, setProdutosAvulsos] = useState<ProdutoAvulso[]>([]);


  // Função para formatar valor monetário
  const formatarValorMonetario = (valor: string) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    let valorLimpo = valor.replace(/[^\d.,]/g, '');
    // Substitui vírgula por ponto para cálculo
    valorLimpo = valorLimpo.replace(',', '.');
    return valorLimpo;
  };
  
  const adicionarPano = () => {
    //NOVO NOVO PANO
    const novoPano: PanoData = {
      id: Date.now().toString(),
      nome: `L${proximoNumero}`, // ← NOVO
      numeroSequencial: proximoNumero, // ← NOVO
      vao: "",
      largura: "",
      reforcoAdicional: false,
      quantidadeBarras: "",
      tipoAco: "",
      precoReforco: "" // ← ADICIONAR ESTA LINHA
    };

    //ANTIGO NOVO PANO
    //const novoPano: PanoData = {
      //id: Date.now().toString(),
      //vao: "",
      //largura: "",
      //reforcoAdicional: false,
      //quantidadeBarras: "",
      //tipoAco: ""
    //};
    
    //setPanos([...panos, novoPano]); // ← Esta é a linha alterada
    setPanos([novoPano, ...panos]);
    setProximoNumero(proximoNumero + 1); //ADICIONADO
  };

  const atualizarPano = (id: string, dadosAtualizados: Partial<PanoData>) => {
    setPanos(panos.map(pano => 
      pano.id === id ? { ...pano, ...dadosAtualizados } : pano
    ));
  };

  const removerPano = (id: string) => {
    setPanos(panos.filter(pano => pano.id !== id));
  };

  // 4. ADICIONE AS FUNÇÕES (após a função removerPano)
  const adicionarProdutoAvulso = () => {
    const novoProduto: ProdutoAvulso = {
      id: Date.now().toString(),
      nome: "",
      quantidade: 1,
      valorUnitario: ""
    };
    setProdutosAvulsos([...produtosAvulsos, novoProduto]);
  };

    const atualizarProdutoAvulso = (id: string, dadosAtualizados: Partial<ProdutoAvulso>) => {
    setProdutosAvulsos(produtosAvulsos.map(produto => 
      produto.id === id ? { ...produto, ...dadosAtualizados } : produto
    ));
  };

  const removerProdutoAvulso = (id: string) => {
    setProdutosAvulsos(produtosAvulsos.filter(produto => produto.id !== id));
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

    // Converter os valores numéricos dos panos para decimais e adicionar nome do pano
// Inverter a ordem para que a numeração fique correta (primeiro adicionado = Pano 1)
    //const panosFormatados = [...panos].reverse().map((pano, index) => ({
      //...pano,
      //nome: `Pano ${index + 1}`,
      //vao: pano.vao ? parseFloat(pano.vao) : 0,
      //largura: pano.largura ? parseFloat(pano.largura) : 0,
      //quantidadeBarras: pano.quantidadeBarras ? parseInt(pano.quantidadeBarras) : 0
    //}));

    // DEPOIS:
  const panosOrdenados = [...panos].sort((a, b) => a.numeroSequencial - b.numeroSequencial);
  const panosFormatados = panosOrdenados.map((pano) => ({
  ...pano,
  vao: pano.vao ? parseFloat(pano.vao) : 0,
  largura: pano.largura ? parseFloat(pano.largura) : 0,
  quantidadeBarras: pano.quantidadeBarras ? parseInt(pano.quantidadeBarras) : 0,
  precoReforco: pano.precoReforco ? parseFloat(pano.precoReforco) : undefined // ← ADICIONAR
}));

    const produtosFormatados = produtosAvulsos.map(produto => ({
  ...produto,
  quantidade: produto.quantidade,
  valorUnitario: produto.valorUnitario ? parseFloat(produto.valorUnitario.replace(',', '.')) : 0
}));
    
    // Converter os valores numéricos dos panos para decimais e adicionar nome do pano
    //const panosFormatados = panos.map((pano, index) => ({
      //...pano,
      //nome: `Pano ${index + 1}`,
      //vao: pano.vao ? parseFloat(pano.vao) : 0,
      //largura: pano.largura ? parseFloat(pano.largura) : 0,
      //quantidadeBarras: pano.quantidadeBarras ? parseInt(pano.quantidadeBarras) : 0
    //}));

    // Converter os valores numéricos dos panos para decimais
    //const panosFormatados = panos.map(pano => ({
      //...pano,
      //vao: pano.vao ? parseFloat(pano.vao) : 0,
      //largura: pano.largura ? parseFloat(pano.largura) : 0,
      //quantidadeBarras: pano.quantidadeBarras ? parseInt(pano.quantidadeBarras) : 0
    //}));

    const dadosOrcamento = {
       emailUsuario: localStorage.getItem("userEmail"),  // ← ADICIONE SÓ ISSO!
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
        precoM2: precoLaje ? parseFloat(precoLaje) : 0, // ← ADICIONAR
        incluirTela: incluirTela,
        tipoTela: incluirTela === "sim" ? tipoTela : null,
        precoPeca: incluirTela === "sim" && precoTela ? parseFloat(precoTela) : undefined // ← ADICIONAR
      },
      //laje: {
        //modelo: modeloLaje,
        //tipo: tipoLaje,
        //incluirTela: incluirTela,
        //tipoTela: incluirTela === "sim" ? tipoTela : null
      //},
      panos: panosFormatados,
      produtosAvulsos: incluirProdutosAvulsos === "sim" ? produtosFormatados : [], // ADICIONE ESTA LINHA
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
           
      toast({
        title: "Orçamento enviado com sucesso!",
        description: "Você receberá uma resposta por WhatsApp e e-mail em breve.",
      });

       // Limpar todos os dados salvos após envio bem-sucedido
      //localStorage.removeItem("userEmail");
      //localStorage.removeItem("keepLogin");
      //localStorage.removeItem("webhookCriarUrl");
      //localStorage.removeItem("webhookEnviarUrl");
  
      // Voltar para a primeira tela e limpar dados
      navigate("/transicao");

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

            {/* NOVO - Campo de Preço da Laje */}
            <div>
              <Label htmlFor="preco-laje" className="text-base font-medium text-gray-700">Preço R$ m²</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                <Input
                  id="preco-laje"
                  type="text"
                  placeholder="0,00"
                  value={precoLaje}
                  onChange={(e) => setPrecoLaje(formatarValorMonetario(e.target.value))}
                  className="pl-10 h-12"
                />
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

            {/* Tipo de Tela e Preço (condicional) */}
            {incluirTela === "sim" && (
              <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
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
            
                {/* NOVO - Campo de Preço da Tela */}
                <div>
                  <Label htmlFor="preco-tela" className="text-base font-medium text-gray-700">Preço R$ pç</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                    <Input
                      id="preco-tela"
                      type="text"
                      placeholder="0,00"
                      value={precoTela}
                      onChange={(e) => setPrecoTela(formatarValorMonetario(e.target.value))}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
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
                    displayLabel={pano.nome} // ← ADICIONAR ESTA LINHA
                  />
                ))}
              </div>
            )}
            
          </CardContent>
        </Card>

  {/* Produtos Avulsos */}
<Card className="shadow-xl border-0 overflow-hidden mt-6">
  <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
    <CardTitle className="flex items-center gap-3 text-xl">
      <Package className="w-6 h-6" />
      Produtos Avulsos
    </CardTitle>
  </CardHeader>
  
  <CardContent className="p-6 space-y-6">
    {/* Opção de incluir produtos avulsos */}
    <div>
      <Label className="text-base font-medium text-gray-700 mb-3 block">
        Deseja incluir produtos avulsos?
      </Label>
      <RadioGroup value={incluirProdutosAvulsos} onValueChange={setIncluirProdutosAvulsos} className="flex gap-8">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sim" id="produtos-sim" />
          <Label htmlFor="produtos-sim" className="text-base">Sim</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="nao" id="produtos-nao" />
          <Label htmlFor="produtos-nao" className="text-base">Não</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Lista de produtos avulsos (condicional) */}
    {incluirProdutosAvulsos === "sim" && (
      <div className="space-y-4">
        <Button 
          onClick={adicionarProdutoAvulso} 
          variant="outline" 
          size="sm"
          className="w-full border-2 border-dashed border-amber-300 hover:border-amber-400 text-amber-600 hover:text-amber-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Produto
        </Button>

        {produtosAvulsos.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Nenhum produto adicionado</p>
            <p className="text-sm">Clique em "Adicionar Produto" para incluir produtos avulsos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {produtosAvulsos.map((produto) => (
              <ProdutoAvulsoItem
                key={produto.id}
                produto={produto}
                onUpdate={(dados) => atualizarProdutoAvulso(produto.id, dados)}
                onRemove={() => removerProdutoAvulso(produto.id)}
              />
            ))}
          </div>
        )}
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
