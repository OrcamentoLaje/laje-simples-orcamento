import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search, LogOut, Menu, X } from "lucide-react";

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está logado
    const email = localStorage.getItem("userEmail");
    if (!email) {
      navigate("/login");
    } else {
      setUserEmail(email);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("keepLogin");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Sistema de Orçamentos
            </h1>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 px-2">{userEmail}</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 mb-2">
              Bem-vindo ao Sistema
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Escolha uma opção para continuar
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {/* Novo Orçamento Card */}
            <Card 
              className="group cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-blue-200 overflow-hidden"
              onClick={() => navigate("/orcamento")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="relative text-center p-6 md:p-8 lg:p-10">
                <div className="mx-auto mb-4 w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                </div>
                <CardTitle className="text-xl md:text-2xl lg:text-3xl mb-2 text-gray-800">
                  Novo Orçamento
                </CardTitle>
                <CardDescription className="text-sm md:text-base text-gray-600">
                  Criar um novo orçamento para seu cliente
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Consulta Orçamentos Card */}
            <Card 
              className="group cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-green-200 overflow-hidden"
              onClick={() => navigate("/consulta-orcamentos")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="relative text-center p-6 md:p-8 lg:p-10">
                <div className="mx-auto mb-4 w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                </div>
                <CardTitle className="text-xl md:text-2xl lg:text-3xl mb-2 text-gray-800">
                  Consulta Orçamentos
                </CardTitle>
                <CardDescription className="text-sm md:text-base text-gray-600">
                  Visualizar orçamentos criados anteriormente
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Footer Info */}
          <div className="mt-12 md:mt-16 text-center">
            <p className="text-xs md:text-sm text-gray-500">
              © 2025 Sistema de Orçamentos. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

