import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutForm from './CheckoutForm';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleFinalizePedido = () => {
    if (cartItems.length === 0) return;
    setShowCheckout(true);
  };

  const formatPizzaDescription = (item: any) => {
    if (item.type === 'pizza') {
      let description = `Pizza ${item.size} (${item.slices} fatias)`;
      if (item.division === 'metade' && item.sabor2) {
        description += `\nMetade 1: ${item.sabor1}\nMetade 2: ${item.sabor2}`;
      } else {
        description += `\nSabor: ${item.sabor1}`;
      }
      if (item.massa && item.massa !== 'tradicional') {
        description += `\nMassa: ${item.massa}`;
      }
      return description;
    }
    return item.name;
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-2xl z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <ShoppingCart className="w-6 h-6 text-red-500" />
                <span>Seu Pedido</span>
              </h2>
              <motion.button
                className="text-gray-400 hover:text-white p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Seu carrinho está vazio</p>
                  <p className="text-sm">Adicione algumas pizzas deliciosas!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-gray-800 rounded-xl p-4 shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      layout
                    >
                      <div className="flex items-start space-x-4">
                        {/* Item Image */}
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <span className="text-2xl">🍕</span>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm mb-1">
                            {item.type === 'pizza' ? `Pizza ${item.size}` : item.name}
                          </h3>
                          <p className="text-gray-300 text-xs whitespace-pre-line mb-2">
                            {formatPizzaDescription(item)}
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </motion.button>
                              <span className="text-white font-semibold w-8 text-center">
                                {item.quantity}
                              </span>
                              <motion.button
                                className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </motion.button>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="text-red-400 font-bold">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </span>
                              <motion.button
                                className="text-gray-400 hover:text-red-400 p-1"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-700 p-6 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Subtotal:</span>
                  <span className="text-white font-semibold">R$ {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Taxa de entrega:</span>
                  <span className="text-white font-semibold">R$ 5,00</span>
                </div>
                <div className="flex justify-between items-center text-lg border-t border-gray-700 pt-4">
                  <span className="text-white font-bold">Total:</span>
                  <span className="text-red-400 font-bold">R$ {(getTotalPrice() + 5).toFixed(2)}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFinalizePedido}
                  >
                    Finalizar Pedido
                  </motion.button>
                  
                  <motion.button
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-xl font-semibold transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearCart}
                  >
                    Limpar Carrinho
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Form Modal */}
      <CheckoutForm 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
        cartItems={cartItems}
        total={getTotalPrice() + 5}
      />
    </>
  );
};

export default Cart;