import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2, Edit, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const { menuData, pizzeriaInfo, updateMenuItem, addMenuItem, removeMenuItem, updatePizzeriaInfo } = useAdmin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication (in production, use proper authentication)
    if (loginData.username === 'admin' && loginData.password === 'bordadefogo2024') {
      setIsAuthenticated(true);
    } else {
      alert('Credenciais inválidas!');
    }
  };

  const toggleItemAvailability = (category: string, itemId: string) => {
    const currentItem = menuData[category as keyof typeof menuData][itemId];
    updateMenuItem(category, itemId, { 
      ...currentItem, 
      disponivel: !currentItem.disponivel 
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-900/20 to-black flex items-center justify-center">
        <motion.div
          className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
            <p className="text-gray-300">Borda de Fogo Pizzaria</p>
            <p className="text-red-400 text-sm mt-2">A Felicidade em Forma de Fatias</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Usuário</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                placeholder="Digite seu usuário"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Senha</label>
              <input
                type="password"
                className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Digite sua senha"
              />
            </div>

            <motion.button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Entrar
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-red-400 hover:text-red-300 transition-colors">
              ← Voltar ao site
            </Link>
          </div>

          <div className="mt-8 p-4 bg-gray-700 rounded-xl">
            <p className="text-gray-300 text-sm text-center">
              <strong>Demo:</strong><br />
              Usuário: admin<br />
              Senha: bordadefogo2024
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const sections = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'pizzas', name: 'Pizzas', icon: '🍕' },
    { id: 'pasteis', name: 'Pastéis', icon: '🥟' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
    { id: 'combos', name: 'Combos', icon: '🎯' },
    { id: 'info', name: 'Informações', icon: '⚙️' },
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
          <h3 className="text-red-400 font-semibold mb-2">Pizzas Tradicionais</h3>
          <p className="text-3xl font-bold text-white">{Object.keys(menuData.pizzas_tradicionais).length}</p>
          <p className="text-sm text-gray-400 mt-1">
            {Object.values(menuData.pizzas_tradicionais).filter(p => p.disponivel !== false).length} disponíveis
          </p>
        </div>
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-6">
          <h3 className="text-orange-400 font-semibold mb-2">Pastéis</h3>
          <p className="text-3xl font-bold text-white">{Object.keys(menuData.pasteis_assados).length}</p>
          <p className="text-sm text-gray-400 mt-1">
            {Object.values(menuData.pasteis_assados).filter(p => p.disponivel !== false).length} disponíveis
          </p>
        </div>
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-blue-400 font-semibold mb-2">Bebidas</h3>
          <p className="text-3xl font-bold text-white">{Object.keys(menuData.bebidas).length}</p>
          <p className="text-sm text-gray-400 mt-1">
            {Object.values(menuData.bebidas).filter(b => b.disponivel !== false).length} disponíveis
          </p>
        </div>
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-green-400 font-semibold mb-2">Combos</h3>
          <p className="text-3xl font-bold text-white">{Object.keys(menuData.combos).length}</p>
          <p className="text-sm text-gray-400 mt-1">
            {Object.values(menuData.combos).filter(c => c.disponivel !== false).length} disponíveis
          </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Informações da Pizzaria</h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-300">
          <div>
            <strong>Nome:</strong> {pizzeriaInfo.nome}
          </div>
          <div>
            <strong>Telefone:</strong> {pizzeriaInfo.telefone}
          </div>
          <div>
            <strong>Horário:</strong> {pizzeriaInfo.horario}
          </div>
          <div>
            <strong>Taxa de Entrega:</strong> R$ {pizzeriaInfo.taxaEntrega.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">🔥 Controle de Disponibilidade</h3>
        <p className="text-gray-300 mb-4">
          Use os toggles nas seções de produtos para marcar itens como indisponíveis. 
          Produtos indisponíveis aparecerão cinza no site e não poderão ser adicionados ao carrinho.
        </p>
        <div className="flex items-center space-x-2 text-sm">
          <ToggleRight className="w-5 h-5 text-green-400" />
          <span className="text-green-400">Disponível</span>
          <span className="text-gray-400 mx-2">|</span>
          <ToggleLeft className="w-5 h-5 text-red-400" />
          <span className="text-red-400">Indisponível</span>
        </div>
      </div>
    </div>
  );

  const renderPizzas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Pizzas</h2>
        <motion.button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <Plus className="w-4 h-4" />
          <span>Nova Pizza</span>
        </motion.button>
      </div>

      <div className="grid gap-4">
        {Object.entries(menuData.pizzas_tradicionais).map(([key, pizza]) => (
          <div key={key} className={`rounded-xl p-6 flex items-center justify-between transition-all ${
            pizza.disponivel === false 
              ? 'bg-gray-700/50 border border-gray-600' 
              : 'bg-gray-800 border border-gray-700'
          }`}>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className={`text-xl font-bold ${
                  pizza.disponivel === false ? 'text-gray-400' : 'text-white'
                }`}>
                  {pizza.nome}
                </h3>
                {pizza.disponivel === false && (
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-semibold">
                    INDISPONÍVEL
                  </span>
                )}
              </div>
              <p className={`mb-2 ${
                pizza.disponivel === false ? 'text-gray-500' : 'text-gray-300'
              }`}>
                {pizza.ingredientes.join(', ')}
              </p>
              <div className="flex space-x-4 text-sm">
                <span className="text-red-400">P: R$ {pizza.precos.P}</span>
                <span className="text-red-400">M: R$ {pizza.precos.M}</span>
                <span className="text-red-400">G: R$ {pizza.precos.G}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Availability Toggle */}
              <motion.button
                className={`p-2 rounded-lg transition-colors ${
                  pizza.disponivel === false
                    ? 'text-red-400 hover:bg-red-500/20'
                    : 'text-green-400 hover:bg-green-500/20'
                }`}
                whileHover={{ scale: 1.1 }}
                onClick={() => toggleItemAvailability('pizzas_tradicionais', key)}
                title={pizza.disponivel === false ? 'Marcar como disponível' : 'Marcar como indisponível'}
              >
                {pizza.disponivel === false ? (
                  <ToggleLeft className="w-6 h-6" />
                ) : (
                  <ToggleRight className="w-6 h-6" />
                )}
              </motion.button>
              
              <motion.button
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                whileHover={{ scale: 1.1 }}
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                whileHover={{ scale: 1.1 }}
                onClick={() => removeMenuItem('pizzas_tradicionais', key)}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInfo = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Configurações da Pizzaria</h2>
      
      <div className="bg-gray-800 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-white font-semibold mb-2">Nome da Pizzaria</label>
          <input
            type="text"
            className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
            value={pizzeriaInfo.nome}
            onChange={(e) => updatePizzeriaInfo({ nome: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Slogan</label>
          <input
            type="text"
            className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
            value="A Felicidade em Forma de Fatias"
            readOnly
          />
          <p className="text-gray-400 text-sm mt-1">Slogan oficial da pizzaria</p>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Endereço</label>
          <input
            type="text"
            className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
            value={pizzeriaInfo.endereco}
            onChange={(e) => updatePizzeriaInfo({ endereco: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-semibold mb-2">Telefone</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
              value={pizzeriaInfo.telefone}
              onChange={(e) => updatePizzeriaInfo({ telefone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-2">WhatsApp</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
              value={pizzeriaInfo.whatsapp}
              onChange={(e) => updatePizzeriaInfo({ whatsapp: e.target.value })}
              placeholder="5511999999999"
            />
            <p className="text-gray-400 text-sm mt-1">Formato: 5511999999999 (sem espaços ou símbolos)</p>
          </div>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Horário de Funcionamento</label>
          <input
            type="text"
            className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
            value={pizzeriaInfo.horario}
            onChange={(e) => updatePizzeriaInfo({ horario: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-semibold mb-2">Taxa de Entrega (R$)</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
              value={pizzeriaInfo.taxaEntrega}
              onChange={(e) => updatePizzeriaInfo({ taxaEntrega: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-2">Tempo de Entrega</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
              value={pizzeriaInfo.tempoEntrega}
              onChange={(e) => updatePizzeriaInfo({ tempoEntrega: e.target.value })}
            />
          </div>
        </div>

        <motion.button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </motion.button>
      </div>

      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">📱 Configuração do WhatsApp</h3>
        <p className="text-gray-300 mb-4">
          O número do WhatsApp configurado acima será usado para receber os pedidos automaticamente.
          Certifique-se de que está no formato correto: 5511999999999
        </p>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Número atual:</p>
          <p className="text-white font-mono">{pizzeriaInfo.whatsapp}</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'pizzas':
        return renderPizzas();
      case 'info':
        return renderInfo();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-900/20 to-black">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-300 text-sm">Borda de Fogo</p>
            <p className="text-red-400 text-xs">A Felicidade em Forma de Fatias</p>
          </div>

          <nav className="space-y-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-red-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="mr-3">{section.icon}</span>
                {section.name}
              </motion.button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Site</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;