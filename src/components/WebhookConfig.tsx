import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

const WebhookConfig = () => {
  const [webhookCriar, setWebhookCriar] = useState("");
  const [webhookEnviar, setWebhookEnviar] = useState("");

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuração de Webhooks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhookCriar">Webhook para criar orçamento</Label>
          <Input
            id="webhookCriar"
            type="url"
            placeholder=""
            value={webhookCriar}
            onChange={(e) => setWebhookCriar(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhookEnviar">Webhook para enviar orçamento</Label>
          <Input
            id="webhookEnviar"
            type="url"
            placeholder=""
            value={webhookEnviar}
            onChange={(e) => setWebhookEnviar(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfig;
