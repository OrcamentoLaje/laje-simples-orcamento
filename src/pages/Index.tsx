
import OrcamentoForm from "@/components/OrcamentoForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Orçamento de Laje
            </h1>
            <p className="text-lg text-gray-600">
              Solicite seu orçamento de forma rápida e prática
            </p>
          </div>
          <OrcamentoForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
