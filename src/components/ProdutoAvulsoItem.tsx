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
  onUpdate: (dados: Partial<ProdutoAvulso>) => void;
  onRemove: () => void;
}

const PRODUTOS_DISPONIVEIS = [
  "Lajota cerâmica",
  "EPS",
  "Vigota treliçada",
  "Treliça H8",
  "Treliça H12",
  "Treliça H16",
  "Laje pré-moldada H8 m²",
  "Laje pré-moldada H12 m²",
  "Laje pré-moldada com reforço",
  "Caixa de luz de teto",
  "Canaleta nervura laje",
  "Tela Q45 20x20 3.4-2x3",
  "Tela Q61 15x15 3.4-2x3",
  "Tela Q69 20x20 4.2-2x3",
  "Tela Q92 15x15 4.2-2x3",
  "Tela Q138 10x10 4.2-2x3",
  "Tela Q196 10x10 5.0-2x3",
  "Tela Q61 15x15 3.4-2,45x6",
  "Tela Q92 15x15 4.2-2,45x6",
  "Tela Q138 10x10 4.2-2,45x6",
  "Tela Q196 10x10 5.0-2,45x6"
];

const ProdutoAvulsoItem = ({ produto, onUpdate, onRemove }: ProdutoAvulsoItemProps) => {
  // Função para formatar valor monetário
  const formatarValorMonetario = (valor: string) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    let valorLimpo = valor.replace(/[^\d.,]/g, '');
    // Substitui vírgula por ponto para cálculo
    valorLimpo = valorLimpo.replace(',', '.');
    return valorLimpo;
  };

  // Função para calcular o valor total
  const calcularValorTotal = () => {
    const quantidade = produto.quantidade || 0;
    const valorUnitario = produto.valorUnitario ? parseFloat(produto.valorUnitario.replace(',', '.')) : 0;
    const total = quantidade * valorUnitario;
    return total.toFixed(2).replace('.', ',');
  };

  return (
    <Card className="border-2 border-gray-200 hover:border-amber-300 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-amber-600">
            <Package className="w-5 h-5" />
            <span className="font-semibold">Produto Avulso</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Seleção do Produto */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Produto</Label>
            <Select 
              value={produto.nome} 
              onValueChange={(value) => onUpdate({ nome: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o produto" />
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

          {/* Quantidade e Valor Unitário */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`quantidade-${produto.id}`} className="text-sm font-medium text-gray-700">
                Quantidade
              </Label>
              <Input
                id={`quantidade-${produto.id}`}
                type="number"
                min="1"
                value={produto.quantidade}
                onChange={(e) => onUpdate({ quantidade: parseInt(e.target.value) || 1 })}
                className="mt-1"
              />
            </div>

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
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Valor Total */}
          {produto.nome && produto.quantidade && produto.valorUnitario && (
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Valor Total:</span>
                <span className="text-lg font-bold text-amber-600">
                  R$ {calcularValorTotal()}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProdutoAvulsoItem;
