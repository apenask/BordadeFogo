import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Store, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

interface PizzaConfig {
  size: 'P' | 'M' | 'G';
  division: 'inteira' | 'metade';
  sabor1: string;
  sabor2?: string;
  massa: string;
  quantity: number;
}

interface IngredientPosition {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  delay: number;
}

const PizzaBuilder: React.FC = () => {
  const { addToCart } = useCart();
  const { menuData } = useAdmin();
  const [config, setConfig] = useState<PizzaConfig>({
    size: 'M',
    division: 'inteira',
    sabor1: 'margherita',
    massa: 'tradicional',
    quantity: 1
  });

  const [orderType, setOrderType] = useState<'mesa' | 'entrega'>('entrega');
  const [ingredientPositions, setIngredientPositions] = useState<IngredientPosition[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeInfo = {
    P: { name: 'Pequena', slices: 6, price: 25, sliceAngle: 60, radius: 120 },
    M: { name: 'Média', slices: 8, price: 35, sliceAngle: 45, radius: 150 },
    G: { name: 'Grande', slices: 10, price: 45, sliceAngle: 36, radius: 180 }
  };

  const pizzaSabores = menuData.pizzas_tradicionais;
  const currentPrice = sizeInfo[config.size].price;
  const totalPrice = currentPrice * config.quantity;

  // Generate realistic ingredient positions
  const generateIngredientPositions = (count: number, radius: number, isHalf: boolean = false) => {
    const positions: IngredientPosition[] = [];
    const centerX = 50;
    const centerY = 50;
    const maxRadius = (radius / 320) * 35; // Convert to percentage
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * maxRadius * 0.8; // Keep ingredients away from edge
      
      let x = centerX + Math.cos(angle) * distance;
      let y = centerY + Math.sin(angle) * distance;
      
      // If it's half pizza, constrain to left or right side
      if (isHalf) {
        x = Math.max(centerX, x); // Right side only for second flavor
      }
      
      positions.push({
        x,
        y,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4,
        delay: i * 0.1
      });
    }
    
    return positions;
  };

  // Update ingredient positions when config changes
  useEffect(() => {
    setIsAnimating(true);
    const radius = sizeInfo[config.size].radius;
    const positions = generateIngredientPositions(8, radius);
    setIngredientPositions(positions);
    
    setTimeout(() => setIsAnimating(false), 1000);
  }, [config.size, config.sabor1, config.sabor2, config.division]);

  const handleAddToCart = () => {
    const pizza = {
      id: Date.now().toString(),
      type: 'pizza',
      name: `Pizza ${sizeInfo[config.size].name}`,
      size: config.size,
      division: config.division,
      sabor1: config.sabor1,
      sabor2: config.sabor2,
      massa: config.massa,
      price: currentPrice,
      quantity: config.quantity,
      image: '/api/placeholder/200/200',
      slices: sizeInfo[config.size].slices,
      orderType
    };
    
    addToCart(pizza);
    
    // Reset builder with animation
    setIsAnimating(true);
    setTimeout(() => {
      setConfig({
        size: 'M',
        division: 'inteira',
        sabor1: 'margherita',
        massa: 'tradicional',
        quantity: 1
      });
      setIsAnimating(false);
    }, 500);
  };

  // Generate slice lines based on pizza size
  const generateSliceLines = () => {
    const { slices, sliceAngle } = sizeInfo[config.size];
    const lines = [];
    
    for (let i = 0; i < slices; i++) {
      const angle = i * sliceAngle;
      const x1 = 50 + 45 * Math.cos((angle - 90) * Math.PI / 180);
      const y1 = 50 + 45 * Math.sin((angle - 90) * Math.PI / 180);
      
      lines.push(
        <motion.line
          key={i}
          x1="50%"
          y1="50%"
          x2={`${x1}%`}
          y2={`${y1}%`}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
        />
      );
    }
    
    return lines;
  };

  const renderIngredients = (side: 'left' | 'right' | 'full', sabor: string) => {
    const count = config.division === 'metade' ? 4 : 8;
    const positions = generateIngredientPositions(count, sizeInfo[config.size].radius, config.division === 'metade');
    
    return positions.map((pos, i) => {
      let adjustedX = pos.x;
      
      if (config.division === 'metade') {
        if (side === 'left') {
          adjustedX = Math.min(50, pos.x);
        } else if (side === 'right') {
          adjustedX = Math.max(50, pos.x);
        }
      }
      
      return (
        <motion.div
          key={`${sabor}-${side}-${i}`}
          className="absolute w-3 h-3 rounded-full shadow-sm"
          style={{
            left: `${adjustedX}%`,
            top: `${pos.y}%`,
            backgroundColor: side === 'right' ? '#10b981' : '#ef4444',
            transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${pos.scale})`,
          }}
          initial={{ scale: 0, y: -100 }}
          animate={{ scale: pos.scale, y: 0 }}
          transition={{
            delay: pos.delay,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        />
      );
    });
  };

  return (
    <section id="pizza-builder" className="py-12 md:py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Monte sua Pizza Perfeita
          </h2>
          <p className="text-lg md:text-xl text-gray-300">
            A Felicidade em Forma de Fatias
          </p>
        </motion.div>

        {/* Order Type Selection - Mobile First */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">
            Como você vai receber seu pedido?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <motion.button
              className={`p-4 md:p-6 rounded-2xl border-2 transition-all ${
                orderType === 'mesa'
                  ? 'border-red-500 bg-red-500/20 text-white'
                  : 'border-gray-600 hover:border-red-400 text-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOrderType('mesa')}
            >
              <Store className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3 text-red-500" />
              <div className="text-lg md:text-xl font-bold mb-2">Retirar no Local</div>
              <div className="text-sm md:text-base text-gray-400">Comer na pizzaria</div>
              <div className="text-xs md:text-sm text-green-400 mt-2">Sem taxa de entrega</div>
            </motion.button>

            <motion.button
              className={`p-4 md:p-6 rounded-2xl border-2 transition-all ${
                orderType === 'entrega'
                  ? 'border-red-500 bg-red-500/20 text-white'
                  : 'border-gray-600 hover:border-red-400 text-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOrderType('entrega')}
            >
              <Truck className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3 text-red-500" />
              <div className="text-lg md:text-xl font-bold mb-2">Entrega em Casa</div>
              <div className="text-sm md:text-base text-gray-400">Receber no endereço</div>
              <div className="text-xs md:text-sm text-orange-400 mt-2">+ R$ 5,00 entrega</div>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Pizza Preview - 3D Realistic */}
          <motion.div
            className="flex justify-center items-center order-1 lg:order-1"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative flex justify-center items-center">
              <motion.div
                className="relative overflow-hidden flex items-center justify-center"
                style={{
                  width: `${sizeInfo[config.size].radius * 2}px`,
                  height: `${sizeInfo[config.size].radius * 2}px`,
                  transform: 'perspective(800px) rotateX(15deg) rotateY(-5deg)',
                  transformStyle: 'preserve-3d'
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                animate={{ 
                  rotateZ: isAnimating ? [0, 360] : 0 
                }}
                transition={{ 
                  rotateZ: { duration: 2, ease: "easeInOut" }
                }}
                key={config.size}
                initial={{ scale: 0.8 }}
              >
                {/* Pizza Base with 3D effect */}
                <div 
                  className="absolute rounded-full shadow-2xl"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #d97706 0%, #ea580c 50%, #dc2626 100%)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 -10px 20px rgba(0, 0, 0, 0.2)'
                  }}
                />
                
                {/* Pizza Dough */}
                <div 
                  className="absolute rounded-full"
                  style={{
                    width: '85%',
                    height: '85%',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                    boxShadow: 'inset 0 5px 15px rgba(255, 255, 255, 0.3)'
                  }}
                />

                {/* SVG for slice lines and division */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  {generateSliceLines()}
                  
                  {/* Division Line for Metade */}
                  {config.division === 'metade' && (
                    <motion.line
                      x1="50%"
                      y1="7%"
                      x2="50%"
                      y2="93%"
                      stroke="rgba(255, 255, 255, 0.8)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    />
                  )}
                </svg>
                
                {/* Ingredients Layer 1 */}
                <div className={`absolute inset-0 rounded-full overflow-hidden ${
                  config.division === 'metade' ? 'clip-path-left' : ''
                }`}>
                  {renderIngredients('left', config.sabor1)}
                </div>

                {/* Ingredients Layer 2 (if metade) */}
                {config.division === 'metade' && config.sabor2 && (
                  <div className="absolute inset-0 rounded-full overflow-hidden clip-path-right">
                    {renderIngredients('right', config.sabor2)}
                  </div>
                )}

                {/* Cheese Gloss Effect */}
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
                  }}
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Steam Effect */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-6 bg-white/20 rounded-full"
                      style={{ left: `${i * 8 - 8}px` }}
                      animate={{
                        y: [-20, -40],
                        opacity: [0, 0.6, 0],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
              </motion.div>
              
              {/* Size and Slices indicator */}
              <motion.div 
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {sizeInfo[config.size].name} - {sizeInfo[config.size].slices} fatias
              </motion.div>
            </div>
          </motion.div>

          {/* Configuration Panel - Mobile Optimized */}
          <motion.div
            className="bg-gray-800 rounded-2xl p-4 md:p-8 shadow-2xl order-2 lg:order-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Size Selection - Mobile Grid */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Tamanho</h3>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {Object.entries(sizeInfo).map(([key, info]) => (
                  <motion.button
                    key={key}
                    className={`p-3 md:p-4 rounded-xl border-2 transition-all text-center ${
                      config.size === key
                        ? 'border-red-500 bg-red-500/20 text-white'
                        : 'border-gray-600 hover:border-red-400 text-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfig({ ...config, size: key as 'P' | 'M' | 'G' })}
                  >
                    <div className="text-base md:text-lg font-bold">{info.name}</div>
                    <div className="text-xs md:text-sm">{info.slices} fatias</div>
                    <div className="text-xs md:text-sm font-semibold text-red-400">R$ {info.price}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Division Selection - Mobile Optimized */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Divisão</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <motion.button
                  className={`p-4 rounded-xl border-2 transition-all ${
                    config.division === 'inteira'
                      ? 'border-red-500 bg-red-500/20 text-white'
                      : 'border-gray-600 hover:border-red-400 text-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConfig({ ...config, division: 'inteira', sabor2: undefined })}
                >
                  <div className="font-semibold">Pizza Inteira</div>
                  <div className="text-sm text-gray-400">Um sabor</div>
                </motion.button>
                <motion.button
                  className={`p-4 rounded-xl border-2 transition-all ${
                    config.division === 'metade'
                      ? 'border-red-500 bg-red-500/20 text-white'
                      : 'border-gray-600 hover:border-red-400 text-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConfig({ ...config, division: 'metade' })}
                >
                  <div className="font-semibold">Metade/Metade</div>
                  <div className="text-sm text-gray-400">Dois sabores</div>
                </motion.button>
              </div>
            </div>

            {/* Flavor Selection - Mobile Optimized */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
                {config.division === 'inteira' ? 'Sabor' : 'Primeira Metade'}
              </h3>
              <select
                className="w-full p-3 md:p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none text-sm md:text-base"
                value={config.sabor1}
                onChange={(e) => setConfig({ ...config, sabor1: e.target.value })}
              >
                {Object.entries(pizzaSabores).map(([key, sabor]) => (
                  <option key={key} value={key}>
                    {sabor.nome} - {sabor.ingredientes.join(', ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Second Flavor (if metade) */}
            {config.division === 'metade' && (
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Segunda Metade</h3>
                <select
                  className="w-full p-3 md:p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none text-sm md:text-base"
                  value={config.sabor2 || ''}
                  onChange={(e) => setConfig({ ...config, sabor2: e.target.value })}
                >
                  <option value="">Selecione o segundo sabor</option>
                  {Object.entries(pizzaSabores).map(([key, sabor]) => (
                    <option key={key} value={key}>
                      {sabor.nome} - {sabor.ingredientes.join(', ')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Massa Selection */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Tipo de Massa</h3>
              <select
                className="w-full p-3 md:p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none text-sm md:text-base"
                value={config.massa}
                onChange={(e) => setConfig({ ...config, massa: e.target.value })}
              >
                <option value="tradicional">Massa Tradicional</option>
                <option value="integral">Massa Integral</option>
                <option value="borda-recheada">Borda Recheada (+ R$ 5)</option>
              </select>
            </div>

            {/* Quantity and Price - Mobile Layout */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <span className="text-white font-semibold">Quantidade:</span>
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="w-10 h-10 md:w-12 md:h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setConfig({ ...config, quantity: Math.max(1, config.quantity - 1) })}
                  >
                    <Minus className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.button>
                  <span className="text-white text-xl font-bold w-8 text-center">{config.quantity}</span>
                  <motion.button
                    className="w-10 h-10 md:w-12 md:h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setConfig({ ...config, quantity: config.quantity + 1 })}
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.button>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-2xl md:text-3xl font-bold text-red-400">
                  R$ {totalPrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">
                  R$ {currentPrice.toFixed(2)} cada
                </div>
                {orderType === 'entrega' && (
                  <div className="text-xs text-orange-400">
                    + R$ 5,00 entrega
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Button - Mobile Optimized */}
            <motion.button
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-4 md:py-5 rounded-xl font-semibold text-lg md:text-xl flex items-center justify-center space-x-2 shadow-lg"
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(239, 68, 68, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              <span>Adicionar ao Carrinho</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PizzaBuilder;