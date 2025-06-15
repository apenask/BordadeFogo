import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, ChefHat } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = 'Sabor que Incendeia seus Sentidos';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-red-900/20 to-black">
      {/* Background Fire Animation */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-t from-red-500 to-orange-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-10px',
            }}
            animate={{
              y: [-10, -window.innerHeight],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {text}
              <motion.span
                className="text-red-500"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                |
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-2xl text-red-400 mb-4 font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              A Felicidade em Forma de Fatias
            </motion.p>

            <motion.p
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Pizzas artesanais com ingredientes frescos e uma explosão de sabor em cada fatia.
              Feitas com amor e o toque especial do nosso forno a lenha.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center justify-center space-x-2 shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(239, 68, 68, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('pizza-builder')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ChefHat className="w-5 h-5" />
                <span>Monte sua Pizza</span>
              </motion.button>

              <motion.button
                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Cardápio
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Rotating Pizza */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative">
              <motion.div
                className="w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-yellow-600 via-orange-500 to-red-600 shadow-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {/* Pizza Toppings */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400">
                  {/* Pepperoni slices */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-8 h-8 bg-red-600 rounded-full"
                      style={{
                        top: `${30 + Math.sin(i * 0.785) * 25}%`,
                        left: `${30 + Math.cos(i * 0.785) * 25}%`,
                      }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                  
                  {/* Cheese bubbles */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-yellow-200 rounded-full opacity-80"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Fire glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;