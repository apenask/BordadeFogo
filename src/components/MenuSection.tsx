import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

const MenuSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('pizzas');
  const { addToCart } = useCart();
  const { menuData } = useAdmin();

  const categories = [
    { id: 'pizzas', name: 'Pizzas', icon: '🍕' },
    { id: 'pasteis', name: 'Pastéis Assados', icon: '🥟' },
    { id: 'pasteis-premium', name: 'Pastéis Premium', icon: '⭐' },
    { id: 'calzones', name: 'Calzones', icon: '🌮' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
    { id: 'combos', name: 'Combos', icon: '🎯' },
  ];

  const handleAddToCart = (item: any, size: string = 'M') => {
    const cartItem = {
      id: Date.now().toString(),
      type: activeCategory,
      name: item.nome,
      size,
      price: typeof item.preco === 'number' ? item.preco : item.precos?.[size] || 0,
      quantity: 1,
      image: '/api/placeholder/200/200',
      ...item
    };
    addToCart(cartItem);
  };

  const renderPizzas = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Object.entries(menuData.pizzas_tradicionais).map(([key, pizza]) => (
        <motion.div
          key={key}
          className="bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
          whileHover={{ scale: 1.02, y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="aspect-square bg-gradient-to-br from-yellow-600 to-orange-500 rounded-xl mb-4 relative overflow-hidden">
            <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg">
              {pizza.ingredientes.slice(0, 4).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-red-500 rounded-full"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                />
              ))}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{pizza.nome}</h3>
          <p className="text-gray-300 text-sm mb-4">{pizza.ingredientes.join(', ')}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              {Object.entries(pizza.precos).map(([size, price]) => (
                <div key={size} className="text-center">
                  <div className="text-xs text-gray-400">{size}</div>
                  <div className="text-sm font-semibold text-red-400">R$ {price}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            {Object.keys(pizza.precos).map((size) => (
              <motion.button
                key={size}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddToCart(pizza, size)}
              >
                + {size}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderPasteis = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Object.entries(menuData.pasteis_assados).map(([key, pastel]) => (
        <motion.div
          key={key}
          className="bg-gray-800 rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all"
          whileHover={{ scale: 1.02, y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="aspect-[4/3] bg-gradient-to-br from-yellow-600 to-orange-500 rounded-lg mb-3 relative overflow-hidden">
            <div className="absolute inset-1 bg-gradient-to-br from-yellow-400 to-orange-400 rounded" />
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2">{pastel.nome}</h3>
          <p className="text-gray-300 text-sm mb-3">{pastel.ingredientes.join(', ')}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-red-400">R$ {pastel.preco.toFixed(2)}</span>
            <motion.button
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAddToCart(pastel)}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderBebidas = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Object.entries(menuData.bebidas).map(([key, bebida]) => (
        <motion.div
          key={key}
          className="bg-gray-800 rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all"
          whileHover={{ scale: 1.02, y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="aspect-[3/4] bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg mb-3 relative overflow-hidden">
            <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-2xl">🥤</span>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2">{bebida.nome}</h3>
          <p className="text-gray-300 text-sm mb-3">{bebida.tamanho}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-red-400">R$ {bebida.preco.toFixed(2)}</span>
            <motion.button
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAddToCart(bebida)}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderCombos = () => (
    <div className="grid md:grid-cols-2 gap-8">
      {Object.entries(menuData.combos).map(([key, combo]) => (
        <motion.div
          key={key}
          className="bg-gradient-to-br from-red-900 to-orange-900 rounded-2xl p-6 shadow-xl border border-red-500/30"
          whileHover={{ scale: 1.02, y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">🎯</span>
            <h3 className="text-2xl font-bold text-white">{combo.nome}</h3>
            <span className="ml-auto bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              COMBO
            </span>
          </div>
          
          <div className="space-y-2 mb-6">
            {combo.itens.map((item: string, index: number) => (
              <div key={index} className="flex items-center text-gray-200">
                <span className="text-green-400 mr-2">✓</span>
                {item}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-bold text-green-400">R$ {combo.preco.toFixed(2)}</span>
              <div className="text-sm text-gray-300">Economia garantida!</div>
            </div>
            <motion.button
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddToCart(combo)}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Adicionar</span>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'pizzas':
        return renderPizzas();
      case 'pasteis':
        return renderPasteis();
      case 'pasteis-premium':
        return renderPasteis(); // Same rendering for now
      case 'calzones':
        return renderPizzas(); // Similar to pizzas
      case 'bebidas':
        return renderBebidas();
      case 'combos':
        return renderCombos();
      default:
        return renderPizzas();
    }
  };

  return (
    <section id="cardapio" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nosso Cardápio Completo
          </h2>
          <p className="text-xl text-gray-300">
            Sabores únicos que fazem a diferença
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeCategory === category.id
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Menu Content */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;