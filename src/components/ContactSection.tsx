import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Instagram, Facebook, Star, Play } from 'lucide-react';
import DeliveryTracker from './DeliveryTracker';

const ContactSection: React.FC = () => {
  const [showTracker, setShowTracker] = useState(false);

  const reviews = [
    {
      name: "Maria Silva",
      rating: 5,
      comment: "Melhor pizza da região! Massa perfeita e ingredientes frescos.",
      date: "2 dias atrás"
    },
    {
      name: "João Santos",
      rating: 5,
      comment: "Atendimento excelente e entrega super rápida. Recomendo!",
      date: "1 semana atrás"
    },
    {
      name: "Ana Costa",
      rating: 5,
      comment: "Pizza de calabresa espetacular! Virou nosso lugar favorito.",
      date: "2 semanas atrás"
    }
  ];

  const mockOrderData = {
    id: "BF2025001",
    customerName: "João Silva",
    address: "Rua das Flores, 123 - Centro",
    phone: "(11) 99999-9999",
    estimatedTime: 35
  };

  return (
    <section id="contato" className="py-12 md:py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Faça seu Pedido Agora!
          </h2>
          <p className="text-lg md:text-xl text-gray-300">
            Estamos prontos para atender você
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">Informações de Contato</h3>
            
            <div className="space-y-4 md:space-y-6">
              <motion.div
                className="flex items-start space-x-4"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-red-500/20 p-3 rounded-full flex-shrink-0">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Endereço</h4>
                  <p className="text-gray-300 text-sm md:text-base">
                    Rua das Pizzas, 123<br />
                    Centro - Sua Cidade/SP<br />
                    CEP: 12345-678
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-4"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-red-500/20 p-3 rounded-full flex-shrink-0">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Horário de Funcionamento</h4>
                  <p className="text-gray-300 text-sm md:text-base">
                    Segunda a Domingo<br />
                    18h00 às 23h30<br />
                    <span className="text-green-400 text-sm">● Aberto agora</span>
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-4"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-red-500/20 p-3 rounded-full flex-shrink-0">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Telefone/WhatsApp</h4>
                  <p className="text-gray-300 text-sm md:text-base">
                    (11) 99999-9999<br />
                    <span className="text-sm text-gray-400">Pedidos via WhatsApp</span>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Social Media */}
            <div className="mt-8 md:mt-12">
              <h4 className="text-white font-semibold mb-4">Siga-nos nas Redes Sociais</h4>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full text-white hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Instagram className="w-5 h-5 md:w-6 md:h-6" />
                </motion.a>
                <motion.a
                  href="#"
                  className="bg-blue-600 p-3 rounded-full text-white hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Facebook className="w-5 h-5 md:w-6 md:h-6" />
                </motion.a>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <motion.a
              href="https://wa.me/5511999999999?text=Olá! Gostaria de fazer um pedido."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 md:mt-8 bg-green-500 hover:bg-green-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-colors shadow-lg w-full md:w-auto text-center"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 Peça pelo WhatsApp
            </motion.a>
          </motion.div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">O que nossos clientes dizem</h3>
            
            <div className="space-y-4 md:space-y-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Stars */}
                  <div className="flex space-x-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 mb-4 italic text-sm md:text-base">"{review.comment}"</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-semibold text-sm md:text-base">{review.name}</h4>
                      <p className="text-gray-400 text-xs md:text-sm">Cliente verificado</p>
                    </div>
                    <span className="text-gray-400 text-xs md:text-sm">{review.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Google Reviews CTA */}
            <motion.div
              className="mt-6 md:mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 md:p-6 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-white font-bold mb-2">Avalie nossa pizzaria!</h4>
              <p className="text-blue-100 text-sm mb-4">
                Sua opinião é muito importante para nós
              </p>
              <motion.button
                className="bg-white text-blue-600 px-4 md:px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⭐ Avaliar no Google
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Delivery Map Visualization */}
        <motion.div
          className="mt-12 md:mt-20 bg-gray-800 rounded-2xl p-4 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">Área de Entrega</h3>
          
          <div className="relative bg-gray-700 rounded-xl h-48 md:h-64 overflow-hidden">
            {/* Map placeholder with animated delivery bike */}
            <div className="w-full h-full bg-gradient-to-br from-red-900/20 to-orange-900/20 flex items-center justify-center relative">
              <div className="text-center">
                <motion.div
                  className="text-4xl md:text-6xl mb-4"
                  animate={{ x: [-20, 20, -20] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  🏍️
                </motion.div>
                <p className="text-white font-semibold text-sm md:text-base">Entregamos em toda a região!</p>
                <p className="text-gray-300 text-xs md:text-sm">Taxa de entrega: R$ 5,00</p>
                
                {/* Demo Tracker Button */}
                <motion.button
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTracker(true)}
                >
                  <Play className="w-4 h-4" />
                  <span>Ver Demo do Rastreamento</span>
                </motion.button>
              </div>
              
              {/* Animated route lines */}
              <motion.div
                className="absolute inset-0 opacity-30"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-full h-full">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M50 50 Q150 100 250 80 T350 120"
                    stroke="url(#routeGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-red-400">30-45min</div>
              <div className="text-sm md:text-base text-gray-300">Tempo de entrega</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-red-400">R$ 5,00</div>
              <div className="text-sm md:text-base text-gray-300">Taxa fixa</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-red-400">5km</div>
              <div className="text-sm md:text-base text-gray-300">Raio de entrega</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delivery Tracker Demo */}
      <DeliveryTracker 
        isOpen={showTracker}
        onClose={() => setShowTracker(false)}
        orderData={mockOrderData}
      />
    </section>
  );
};

export default ContactSection;