import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Package } from "lucide-react";

interface ProdutoAvulso {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: string;
}

interface ProdutoAvulsoItemProps {
  produto: ProdutoAvulso;
  index: number;
  totalProdutos: number;
  onUpdate: (dados: Partial<ProdutoAvulso>) => void;
  onRemove: () => void;
}

const PRODUTOS_DISPONIVEIS = [
  "Lajota cerâmica (pç)",
  "EPS (pç)",
  "Vigota treliçada (m)",
  "Treliça H8 (m)",
  "Treliça H12 (m)",
  "Treliça H16 (m)",
  "Laje pré-moldada H8 (m²)",
  "Laje pré-moldada H12 (m²)",
  "Laje pré-moldada com reforço (m²)",
  "Caixa de luz de teto (pç)",
  "Canaleta nervura laje (pç)",
  "Tela Q45 20x20 3.4-2x3 (pç)",
  "Tela Q61 15x15 3.4-2x3 (pç)",
  "Tela Q69 20x20 4.2-2x3 (pç)",
  "Tela Q92 15x15 4.2-2x3 (pç)",
  "Tela Q138 10x10 4.2-2x3 (pç)",
  "Tela Q196 10x10 5.0-2x3 (pç)",
  "Tela Q61 15x15 3.4-2,45x6 (pç)",
  "Tela Q92 15x15 4.2-2,45x6 (pç)",
  "Tela Q138 10x10 4.2-2,45x6 (pç)",
  "Tela Q196 10x10 5.0-2,45x6 (pç)"
];

const ProdutoAvulsoItem = ({ produto, index, totalProdutos, onUpdate, onRemove }: ProdutoAvulsoItemProps) => {
  // Função para formatar valor monetário
  const formatarValorMonetario = (valor: string) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    let valorLimpo = valor.replace(/[^\d.,]/g, '');
    // Substitui vírgula por ponto para cálculo
    valorLimpo = valorLimpo.replace(',', '.');
    return valorLimpo;
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Material Avulso {totalProdutos - index}
        </h3>
        {totalProdutos > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remover
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Seleção do Produto */}
        <div className="md:col-span-1">
          <Label className="text-sm font-medium text-gray-700">Material</Label>
          <Select 
            value={produto.nome} 
            onValueChange={(value) => onUpdate({ nome: value })}
          >
            <SelectTrigger className="mt-1 bg-white">
              <SelectValue placeholder="Selecione o material" />
            </SelectTrigger>
            <SelectContent>
              {PRODUTOS_DISPONIVEIS.map((prod) => (
                <SelectItem key={prod} value={prod}>
                  {prod}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quantidade */}
        <div>
          <Label htmlFor={`quantidade-${produto.id}`} className="text-sm font-medium text-gray-700">
            Quantidade
          </Label>
          <Input
            id={`quantidade-${produto.id}`}
            type="number"
            min="0"
            value={produto.quantidade}
            onChange={(e) => onUpdate({ quantidade: parseInt(e.target.value) || 1 })}
            className="mt-1 bg-white"
            placeholder="0"
          />
        </div>

        {/* Valor Unitário */}
        <div>
          <Label htmlFor={`valor-${produto.id}`} className="text-sm font-medium text-gray-700">
            Valor Unitário
          </Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
            <Input
              id={`valor-${produto.id}`}
              type="text"
              placeholder="0,00"
              value={produto.valorUnitario}
              onChange={(e) => onUpdate({ valorUnitario: formatarValorMonetario(e.target.value) })}
              className="pl-10 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdutoAvulsoItem;
