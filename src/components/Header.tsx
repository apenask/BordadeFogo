import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ShoppingCart, Phone, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/95 backdrop-blur-md shadow-xl' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Flame className="w-10 h-10 text-red-500" />
                <motion.div
                  className="absolute inset-0 bg-orange-400 rounded-full blur-md opacity-30"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Borda de Fogo</h1>
                <p className="text-sm text-red-400">A Felicidade em Forma de Fatias</p>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <motion.a
                href="#home"
                className="text-white hover:text-red-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Início
              </motion.a>
              <motion.a
                href="#cardapio"
                className="text-white hover:text-red-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Cardápio
              </motion.a>
              <motion.a
                href="#sobre"
                className="text-white hover:text-red-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Sobre
              </motion.a>
              <motion.a
                href="#contato"
                className="text-white hover:text-red-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Contato
              </motion.a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* WhatsApp Button */}
              <motion.a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:block">Pedidos</span>
              </motion.a>

              {/* Cart Button */}
              <motion.button
                className="relative bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    {itemCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;