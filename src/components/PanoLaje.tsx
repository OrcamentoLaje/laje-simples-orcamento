
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Save, X } from "lucide-react";

interface PanoData {
  id: string;
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
}

const PanoLaje = ({ pano, index, totalPanos, onUpdate, onRemove }: PanoLajeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<PanoData>(pano);

  const tiposAco = [
    { categoria: "CA60", opcoes: ["4.2mm", "5.0mm", "6.0mm", "7.0mm", "8.0mm"] },
    { categoria: "CA50", opcoes: ["6.3mm", "8.0mm", "10.0mm", "12.5mm", "16mm"] }
  ];

  // Calcula o número do pano na sequência ascendente
  const panelNumber = totalPanos - index;

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(pano);
  };

  const handleSave = () => {
    onUpdate(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(pano);
    setIsEditing(false);
  };

  const updateTempData = (field: keyof PanoData, value: any) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Pano {panelNumber}</CardTitle>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-green-500 hover:text-green-700 hover:bg-green-50"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
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
              value={isEditing ? tempData.vao : pano.vao}
              onChange={(e) => isEditing ? updateTempData('vao', e.target.value) : onUpdate({ vao: e.target.value })}
              disabled={!isEditing && pano.vao !== ""}
            />
          </div>
          
          <div>
            <Label htmlFor={`largura-${pano.id}`}>Largura (m)</Label>
            <Input
              id={`largura-${pano.id}`}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={isEditing ? tempData.largura : pano.largura}
              onChange={(e) => isEditing ? updateTempData('largura', e.target.value) : onUpdate({ largura: e.target.value })}
              disabled={!isEditing && pano.largura !== ""}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`reforco-${pano.id}`}
            checked={isEditing ? tempData.reforcoAdicional : pano.reforcoAdicional}
            onCheckedChange={(checked) => isEditing ? updateTempData('reforcoAdicional', checked) : onUpdate({ reforcoAdicional: checked })}
            disabled={!isEditing && (pano.vao !== "" || pano.largura !== "")}
          />
          <Label htmlFor={`reforco-${pano.id}`} className="font-medium">
            Deseja reforço adicional?
          </Label>
        </div>

        {(isEditing ? tempData.reforcoAdicional : pano.reforcoAdicional) && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <Label htmlFor={`quantidade-${pano.id}`}>Quantidade de barras</Label>
              <Input
                id={`quantidade-${pano.id}`}
                type="number"
                placeholder="0"
                value={isEditing ? tempData.quantidadeBarras : pano.quantidadeBarras}
                onChange={(e) => isEditing ? updateTempData('quantidadeBarras', e.target.value) : onUpdate({ quantidadeBarras: e.target.value })}
                disabled={!isEditing && pano.quantidadeBarras !== ""}
              />
            </div>
            
            <div>
              <Label>Tipo de aço</Label>
              <Select
                value={isEditing ? tempData.tipoAco : pano.tipoAco}
                onValueChange={(value) => isEditing ? updateTempData('tipoAco', value) : onUpdate({ tipoAco: value })}
                disabled={!isEditing && pano.tipoAco !== ""}
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
