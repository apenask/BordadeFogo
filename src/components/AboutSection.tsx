import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Award, Clock, Users } from 'lucide-react';

const AboutSection: React.FC = () => {
  const stats = [
    { icon: Clock, value: '5+', label: 'Anos de Experiência' },
    { icon: Users, value: '10k+', label: 'Clientes Satisfeitos' },
    { icon: Award, value: '50+', label: 'Sabores Únicos' },
    { icon: Heart, value: '100%', label: 'Feito com Amor' },
  ];

  return (
    <section id="sobre" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nossa História de <span className="text-red-500">Paixão</span>
            </h2>
            
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Fundada em 2019, a Borda de Fogo nasceu do sonho de criar pizzas que realmente 
              fazem a diferença. Com receitas tradicionais passadas de geração em geração e 
              ingredientes selecionados, cada pizza é uma obra de arte culinária.
            </p>
            
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Nosso forno a lenha especial, importado diretamente da Itália, garante aquele 
              sabor único e inconfundível que conquistou o coração de milhares de clientes 
              em toda a região.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Chef Image Placeholder */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Placeholder for chef image */}
              <div className="w-full h-96 bg-gradient-to-br from-red-900 to-orange-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  👨‍🍳
                </div>
              </div>
              
              {/* Fire effect overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent rounded-2xl pointer-events-none"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Upload area indicator */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs">
                📷 Área para foto do chef
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-6 -left-6 w-12 h-12 bg-red-500 rounded-full opacity-20"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-6 -right-6 w-8 h-8 bg-orange-500 rounded-full opacity-30"
              animate={{ scale: [1, 1.3, 1], rotate: [360, 180, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔥</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Forno a Lenha</h3>
            <p className="text-gray-300">
              Sabor autêntico com nossa técnica tradicional de cozimento
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ingredientes Frescos</h3>
            <p className="text-gray-300">
              Selecionamos apenas os melhores ingredientes para nossas pizzas
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Entrega Rápida</h3>
            <p className="text-gray-300">
              Delivery eficiente para que você receba sua pizza quentinha
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;