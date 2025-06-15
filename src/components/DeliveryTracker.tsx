import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Phone, MessageCircle } from 'lucide-react';

interface DeliveryTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: {
    id: string;
    customerName: string;
    address: string;
    phone: string;
    estimatedTime: number;
  };
}

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({ isOpen, onClose, orderData }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [bikePosition, setBikePosition] = useState({ x: 10, y: 50 });

  const phases = [
    { id: 0, name: 'Preparando', description: 'Sua pizza está sendo preparada', duration: 20, icon: '🍕' },
    { id: 1, name: 'Saindo', description: 'Pedido saiu para entrega', duration: 5, icon: '🏍️' },
    { id: 2, name: 'A caminho', description: 'Entregador a caminho', duration: 65, icon: '🛣️' },
    { id: 3, name: 'Chegou', description: 'Entregador chegou!', duration: 10, icon: '🏠' }
  ];

  const landmarks = [
    { x: 25, y: 45, name: 'Semáforo Principal', icon: '🚦' },
    { x: 45, y: 35, name: 'Supermercado Central', icon: '🏪' },
    { x: 65, y: 55, name: 'Praça da Cidade', icon: '🌳' },
    { x: 85, y: 40, name: 'Seu Bairro', icon: '🏘️' }
  ];

  // Simulate delivery progress
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 1, 100);
        
        // Update current phase based on progress
        if (newProgress <= 20) setCurrentPhase(0);
        else if (newProgress <= 25) setCurrentPhase(1);
        else if (newProgress <= 90) setCurrentPhase(2);
        else setCurrentPhase(3);

        // Update bike position during delivery phase
        if (newProgress > 25 && newProgress <= 90) {
          const deliveryProgress = (newProgress - 25) / 65;
          setBikePosition({
            x: 10 + (deliveryProgress * 75),
            y: 50 + Math.sin(deliveryProgress * Math.PI * 3) * 10
          });
        }

        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isOpen]);

  const generateRoute = () => {
    const points = [
      { x: 10, y: 50 }, // Pizzaria
      { x: 25, y: 45 }, // Semáforo
      { x: 45, y: 35 }, // Supermercado
      { x: 65, y: 55 }, // Praça
      { x: 85, y: 40 }, // Destino
    ];

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` Q ${points[i-1].x + 5} ${points[i-1].y - 5} ${points[i].x} ${points[i].y}`;
    }

    return path;
  };

  if (!orderData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Tracker Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🍕</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Acompanhe seu Pedido</h2>
                    <p className="text-gray-400">Pedido #{orderData.id}</p>
                  </div>
                </div>
                <motion.button
                  className="text-gray-400 hover:text-white p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Map and Progress */}
              <div className="p-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Interactive Map */}
                  <div className="lg:col-span-2">
                    <div className="bg-gray-800 rounded-xl p-4 h-80 relative overflow-hidden">
                      <h3 className="text-white font-semibold mb-4">Rota de Entrega</h3>
                      
                      {/* Map Background */}
                      <div className="absolute inset-4 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          {/* Route Path */}
                          <motion.path
                            d={generateRoute()}
                            stroke="#ef4444"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: Math.min(progress / 100, 0.9) }}
                            transition={{ duration: 0.5 }}
                          />

                          {/* Landmarks */}
                          {landmarks.map((landmark, index) => (
                            <motion.g key={index}>
                              <circle
                                cx={landmark.x}
                                cy={landmark.y}
                                r="3"
                                fill="#f59e0b"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.2 }}
                              />
                              <text
                                x={landmark.x}
                                y={landmark.y - 5}
                                textAnchor="middle"
                                className="text-xs fill-white"
                              >
                                {landmark.icon}
                              </text>
                            </motion.g>
                          ))}

                          {/* Pizzaria */}
                          <circle cx="10" cy="50" r="4" fill="#dc2626" />
                          <text x="10" y="45" textAnchor="middle" className="text-sm fill-white font-bold">
                            🏪
                          </text>

                          {/* Destination */}
                          <circle cx="85" cy="40" r="4" fill="#16a34a" />
                          <text x="85" y="35" textAnchor="middle" className="text-sm fill-white font-bold">
                            🏠
                          </text>

                          {/* Delivery Bike */}
                          {currentPhase >= 1 && (
                            <motion.g
                              animate={{
                                x: bikePosition.x,
                                y: bikePosition.y
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              <motion.text
                                textAnchor="middle"
                                className="text-lg fill-white"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                🏍️
                              </motion.text>
                              
                              {/* Smoke trail */}
                              {currentPhase === 2 && (
                                <motion.circle
                                  cx="-2"
                                  cy="1"
                                  r="1"
                                  fill="rgba(255,255,255,0.5)"
                                  animate={{
                                    scale: [0, 1, 0],
                                    opacity: [0, 0.5, 0]
                                  }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                />
                              )}
                            </motion.g>
                          )}
                        </svg>
                      </div>

                      {/* Traffic Lights Animation */}
                      {currentPhase === 2 && progress > 40 && progress < 50 && (
                        <motion.div
                          className="absolute top-16 left-1/4 bg-gray-700 rounded p-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="text-center text-white text-xs mb-1">Semáforo</div>
                          <div className="flex flex-col space-y-1">
                            <motion.div
                              className="w-3 h-3 rounded-full bg-red-500"
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                            <div className="w-3 h-3 rounded-full bg-gray-600" />
                            <div className="w-3 h-3 rounded-full bg-gray-600" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Status Panel */}
                  <div className="space-y-4">
                    {/* Current Status */}
                    <div className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-3xl">{phases[currentPhase].icon}</div>
                        <div>
                          <h4 className="text-white font-semibold">{phases[currentPhase].name}</h4>
                          <p className="text-gray-400 text-sm">{phases[currentPhase].description}</p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <motion.div
                          className="bg-red-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="text-right text-sm text-gray-400">{progress}%</div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-gray-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span className="text-white text-sm">
                          Previsão: {Math.max(0, orderData.estimatedTime - Math.floor(progress * orderData.estimatedTime / 100))} min
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="text-white text-sm">{orderData.address}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-red-500" />
                        <span className="text-white text-sm">João Silva - Entregador</span>
                      </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="space-y-2">
                      <motion.button
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Falar com Entregador</span>
                      </motion.button>
                      
                      <motion.button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Phone className="w-4 h-4" />
                        <span>Ligar para Pizzaria</span>
                      </motion.button>
                    </div>

                    {/* Delivery Stats */}
                    <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-3">Estatísticas da Entrega</h4>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-red-400">2.5km</div>
                          <div className="text-xs text-gray-400">Distância</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-400">35km/h</div>
                          <div className="text-xs text-gray-400">Velocidade</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase Timeline */}
                <div className="mt-6 bg-gray-800 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-4">Linha do Tempo</h4>
                  <div className="flex items-center justify-between">
                    {phases.map((phase, index) => (
                      <div key={phase.id} className="flex flex-col items-center flex-1">
                        <motion.div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                            index <= currentPhase
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-700 text-gray-400'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {phase.icon}
                        </motion.div>
                        <div className="text-center mt-2">
                          <div className={`text-sm font-semibold ${
                            index <= currentPhase ? 'text-white' : 'text-gray-400'
                          }`}>
                            {phase.name}
                          </div>
                          <div className="text-xs text-gray-500">{phase.description}</div>
                        </div>
                        
                        {index < phases.length - 1 && (
                          <motion.div
                            className={`absolute h-1 ${
                              index < currentPhase ? 'bg-red-500' : 'bg-gray-700'
                            }`}
                            style={{
                              left: `${(index + 1) * 25}%`,
                              width: '25%',
                              top: '24px'
                            }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: index < currentPhase ? 1 : 0 }}
                            transition={{ delay: index * 0.2 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeliveryTracker;