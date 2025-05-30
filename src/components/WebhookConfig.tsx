
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Settings, CheckCircle } from "lucide-react";

const WebhookConfig = () => {
  const [webhookCriar, setWebhookCriar] = useState("");
  const [webhookEnviar, setWebhookEnviar] = useState("");
  const [linksAutoAtualizados, setLinksAutoAtualizados] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Carrega os webhooks salvos no localStorage
    const savedWebhookCriar = localStorage.getItem("webhookCriar");
    const savedWebhookEnviar = localStorage.getItem("webhookEnviar");
    
    if (savedWebhookCriar) {
      setWebhookCriar(savedWebhookCriar);
      setLinksAutoAtualizados(true);
    }
    if (savedWebhookEnviar) {
      setWebhookEnviar(savedWebhookEnviar);
      setLinksAutoAtualizados(true);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("webhookCriar", webhookCriar);
    localStorage.setItem("webhookEnviar", webhookEnviar);
    
    toast({
      title: "Configurações salvas",
      description: "Links de webhook foram salvos com sucesso!",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuração de Webhooks
          {linksAutoAtualizados && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              Links atualizados automaticamente
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhookCriar">Webhook para criar orçamento</Label>
          <Input
            id="webhookCriar"
            type="url"
            placeholder="https://webhook.dev.atendeobra.com.br/webhook-criar"
            value={webhookCriar}
            onChange={(e) => setWebhookCriar(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="webhookEnviar">Webhook para enviar orçamento</Label>
          <Input
            id="webhookEnviar"
            type="url"
            placeholder="https://webhook.dev.atendeobra.com.br/webhook-enviar"
            value={webhookEnviar}
            onChange={(e) => setWebhookEnviar(e.target.value)}
          />
        </div>
        
        <Button onClick={handleSave} className="w-full">
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};

export default WebhookConfig;
