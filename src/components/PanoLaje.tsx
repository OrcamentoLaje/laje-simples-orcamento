import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PanoData {
  id: string;
  nome: string;
  numeroSequencial: number;
  vao: string;
  largura: string;
  reforcoAdicional: boolean;
  quantidadeBarras: string;
  tipoAco: string;
}

interface PanoLajeProps {
  pano: PanoData;
  index: number;
  totalPanos: number;
  onUpdate: (dados: Partial<PanoData>) => void;
  onRemove: () => void;
  displayLabel?: string;
}

const PanoLaje = ({ pano, index, totalPanos, onUpdate, onRemove, displayLabel }: PanoLajeProps) => {
  const tiposAco = [
    { categoria: "CA60", opcoes: ["4.2mm", "5.0mm", "6.0mm", "7.0mm", "8.0mm"] },
    { categoria: "CA50", opcoes: ["6.3mm", "8.0mm", "10.0mm", "12.5mm", "16mm"] }
  ];

  // Calcula o título do pano
  const panelTitle = displayLabel || `Pano ${totalPanos - index}`;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">{panelTitle}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`vao-${pano.id}`}>Vão (m)</Label>
            <Input
              id={`vao-${pano.id}`}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={pano.vao}
              onChange={(e) => onUpdate({ vao: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor={`largura-${pano.id}`}>Largura (m)</Label>
            <Input
              id={`largura-${pano.id}`}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={pano.largura}
              onChange={(e) => onUpdate({ largura: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`reforco-${pano.id}`}
            checked={pano.reforcoAdicional}
            onCheckedChange={(checked) => onUpdate({ reforcoAdicional: checked })}
          />
          <Label htmlFor={`reforco-${pano.id}`} className="font-medium">
            Deseja reforço adicional?
          </Label>
        </div>

        {pano.reforcoAdicional && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <Label htmlFor={`quantidade-${pano.id}`}>Quantidade de barras</Label>
              <Input
                id={`quantidade-${pano.id}`}
                type="number"
                placeholder="0"
                value={pano.quantidadeBarras}
                onChange={(e) => onUpdate({ quantidadeBarras: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Tipo de aço</Label>
              <Select
                value={pano.tipoAco}
                onValueChange={(value) => onUpdate({ tipoAco: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de aço" />
                </SelectTrigger>
                <SelectContent>
                  {tiposAco.map((categoria) => (
                    <div key={categoria.categoria}>
                      {categoria.opcoes.map((opcao) => (
                        <SelectItem 
                          key={`${categoria.categoria}-${opcao}`} 
                          value={`${categoria.categoria}: ${opcao}`}
                        >
                          {categoria.categoria}: {opcao}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PanoLaje;
