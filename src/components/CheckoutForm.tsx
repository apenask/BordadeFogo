import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin, CreditCard, MessageCircle, Store, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  total: number;
}

interface CustomerData {
  nome: string;
  telefone: string;
  email: string;
  // Endereço (apenas para entrega)
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  pontoReferencia: string;
  // Mesa (apenas para estabelecimento)
  numeroMesa: string;
  // Comum
  observacoes: string;
  formaPagamento: 'dinheiro' | 'pix' | 'cartao';
  trocoParaValor: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ isOpen, onClose, cartItems, total }) => {
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Detectar tipo de pedido baseado nos itens do carrinho
  const orderType = cartItems.length > 0 ? cartItems[0].orderType || 'entrega' : 'entrega';
  const isDelivery = orderType === 'entrega';
  const deliveryFee = isDelivery ? 5 : 0;
  const finalTotal = total - (isDelivery ? 0 : 5) + deliveryFee; // Ajustar total baseado no tipo
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    nome: '',
    telefone: '',
    email: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    pontoReferencia: '',
    numeroMesa: '',
    observacoes: '',
    formaPagamento: 'dinheiro',
    trocoParaValor: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!customerData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!customerData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (customerData.telefone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(customerData.telefone)) {
      newErrors.telefone = 'Formato: (11) 99999-9999';
    }
    
    // Para mesa, validar número da mesa
    if (!isDelivery) {
      if (!customerData.numeroMesa.trim()) {
        newErrors.numeroMesa = 'Número da mesa é obrigatório';
      } else if (!/^\d+$/.test(customerData.numeroMesa) || parseInt(customerData.numeroMesa) < 1 || parseInt(customerData.numeroMesa) > 30) {
        newErrors.numeroMesa = 'Mesa deve ser um número de 1 a 30';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (!isDelivery) return true; // Pular validação de endereço para mesa
    
    const newErrors: {[key: string]: string} = {};
    
    if (!customerData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!customerData.rua.trim()) newErrors.rua = 'Rua é obrigatória';
    if (!customerData.numero.trim()) newErrors.numero = 'Número é obrigatório';
    if (!customerData.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!customerData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    let formattedValue = value;
    
    if (field === 'telefone') {
      formattedValue = formatPhone(value);
    } else if (field === 'cep') {
      formattedValue = formatCEP(value);
    }
    
    setCustomerData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateWhatsAppMessage = () => {
    let message = isDelivery 
      ? "🏍️ *NOVO PEDIDO - ENTREGA*\n" 
      : "🏪 *NOVO PEDIDO - MESA*\n";
    message += "🍕 BORDA DE FOGO PIZZARIA\n";
    message += '"A Felicidade em Forma de Fatias"\n\n';
    
    // Customer data
    message += "👤 *DADOS DO CLIENTE:*\n";
    message += `Nome: ${customerData.nome}\n`;
    message += `Telefone: ${customerData.telefone}\n`;
    if (customerData.email) message += `E-mail: ${customerData.email}\n`;
    message += "\n";
    
    // Address or Table
    if (isDelivery) {
      message += "📍 *ENDEREÇO DE ENTREGA:*\n";
      message += `${customerData.rua}, ${customerData.numero}`;
      if (customerData.complemento) message += ` - ${customerData.complemento}`;
      message += `\nBairro: ${customerData.bairro} - ${customerData.cidade}\n`;
      message += `CEP: ${customerData.cep}\n`;
      if (customerData.pontoReferencia) message += `Ponto de Referência: ${customerData.pontoReferencia}\n`;
    } else {
      message += `🍽️ *MESA NÚMERO: ${customerData.numeroMesa}*\n`;
    }
    message += "\n";
    
    // Order details
    message += "📝 *PEDIDO DETALHADO:*\n\n";
    
    cartItems.forEach((item, index) => {
      if (item.type === 'pizza') {
        message += `🍕 Pizza ${item.size} (${item.slices} fatias)\n`;
        if (item.division === 'metade' && item.sabor2) {
          message += `  └ Metade/Metade\n`;
          message += `    ▫️ Metade 1: ${item.sabor1}\n`;
          message += `    ▫️ Metade 2: ${item.sabor2}\n`;
        } else {
          message += `  └ Sabor: ${item.sabor1}\n`;
        }
        if (item.massa && item.massa !== 'tradicional') {
          message += `  └ Massa: ${item.massa}\n`;
        }
      } else {
        message += `• ${item.name}\n`;
      }
      message += `  💵 Valor: R$ ${(item.price * item.quantity).toFixed(2)}\n`;
      if (item.quantity > 1) {
        message += `  📦 Quantidade: ${item.quantity}\n`;
      }
      message += "\n";
    });
    
    // Financial summary
    message += "💰 *RESUMO FINANCEIRO:*\n";
    message += `Subtotal: R$ ${(finalTotal - deliveryFee).toFixed(2)}\n`;
    if (isDelivery) {
      message += `🚚 Taxa de Entrega: R$ ${deliveryFee.toFixed(2)}\n`;
    }
    message += `*TOTAL GERAL: R$ ${finalTotal.toFixed(2)}*\n\n`;
    
    // Payment method
    message += "💳 *FORMA DE PAGAMENTO:*\n";
    if (customerData.formaPagamento === 'dinheiro') {
      message += "💵 Dinheiro";
      if (customerData.trocoParaValor) {
        message += ` - Troco para R$ ${customerData.trocoParaValor}`;
      }
    } else if (customerData.formaPagamento === 'pix') {
      message += "📱 PIX";
    } else {
      message += "💳 Cartão na entrega";
    }
    message += "\n\n";
    
    // Observations
    if (customerData.observacoes) {
      message += "📝 *OBSERVAÇÕES:*\n";
      message += `${customerData.observacoes}\n\n`;
    }
    
    // Time estimate
    if (isDelivery) {
      message += "⏰ *Tempo estimado: 35-45 minutos*\n\n";
    } else {
      message += "⏰ *Tempo de preparo: 15-20 minutos*\n\n";
    }
    
    message += "---\n";
    message += "Pedido realizado pelo site: bordadefogo.com";
    
    return message;
  };

  const handleFinalizePedido = async () => {
    if (isDelivery && !validateStep2()) return;
    if (!isDelivery && !validateStep1()) return;
    
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "5511999999999";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Clear cart and close modal
    clearCart();
    onClose();
    setIsProcessing(false);
    setCurrentStep(1);
    
    // Reset form
    setCustomerData({
      nome: '',
      telefone: '',
      email: '',
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      pontoReferencia: '',
      numeroMesa: '',
      observacoes: '',
      formaPagamento: 'dinheiro',
      trocoParaValor: ''
    });
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      if (isDelivery) {
        setCurrentStep(2);
      } else {
        setCurrentStep(3); // Pular endereço para mesa
      }
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      if (currentStep === 3 && !isDelivery) {
        setCurrentStep(1); // Voltar direto para dados pessoais se for mesa
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const totalSteps = isDelivery ? 3 : 2; // Mesa tem apenas 2 steps

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

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  {isDelivery ? (
                    <Truck className="w-6 h-6 text-red-500" />
                  ) : (
                    <Store className="w-6 h-6 text-red-500" />
                  )}
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      {isDelivery ? 'Finalizar Entrega' : 'Finalizar Pedido'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Passo {currentStep} de {totalSteps}
                    </p>
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

              {/* Progress Bar */}
              <div className="px-4 md:px-6 py-4">
                <div className="flex items-center space-x-4">
                  {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step <= currentStep ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {step}
                      </div>
                      {step < totalSteps && (
                        <div className={`flex-1 h-1 mx-2 ${
                          step < currentStep ? 'bg-red-500' : 'bg-gray-700'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 overflow-y-auto max-h-96">
                {/* Step 1: Personal Data + Mesa (if applicable) */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4 md:space-y-6"
                  >
                    <div className="flex items-center space-x-2 mb-6">
                      <User className="w-5 h-5 text-red-500" />
                      <h3 className="text-lg md:text-xl font-semibold text-white">
                        {isDelivery ? 'Dados Pessoais' : 'Dados do Pedido'}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-white font-semibold mb-2">Nome Completo *</label>
                        <input
                          type="text"
                          className={`w-full p-3 rounded-xl bg-gray-800 text-white border ${
                            errors.nome ? 'border-red-500' : 'border-gray-600'
                          } focus:border-red-500 focus:outline-none`}
                          value={customerData.nome}
                          onChange={(e) => handleInputChange('nome', e.target.value)}
                          placeholder="Digite seu nome completo"
                        />
                        {errors.nome && <p className="text-red-400 text-sm mt-1">{errors.nome}</p>}
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">Telefone/WhatsApp *</label>
                        <input
                          type="text"
                          className={`w-full p-3 rounded-xl bg-gray-800 text-white border ${
                            errors.telefone ? 'border-red-500' : 'border-gray-600'
                          } focus:border-red-500 focus:outline-none`}
                          value={customerData.telefone}
                          onChange={(e) => handleInputChange('telefone', e.target.value)}
                          placeholder="(11) 99999-9999"
                          maxLength={15}
                        />
                        {errors.telefone && <p className="text-red-400 text-sm mt-1">{errors.telefone}</p>}
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">E-mail (opcional)</label>
                        <input
                          type="email"
                          className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
                          value={customerData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    {/* Mesa Selection (only for establishment orders) */}
                    {!isDelivery && (
                      <div className="mt-6">
                        <label className="block text-white font-semibold mb-4">Número da Mesa *</label>
                        
                        {/* Mobile: Grid de mesas */}
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                          {Array.from({ length: 30 }, (_, i) => i + 1).map((mesa) => (
                            <motion.button
                              key={mesa}
                              className={`aspect-square rounded-lg border-2 font-semibold text-sm md:text-base ${
                                customerData.numeroMesa === mesa.toString()
                                  ? 'border-red-500 bg-red-500/20 text-white'
                                  : 'border-gray-600 hover:border-red-400 text-gray-300'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleInputChange('numeroMesa', mesa.toString())}
                            >
                              {mesa}
                            </motion.button>
                          ))}
                        </div>

                        {/* Input manual */}
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Ou digite o número:</label>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            className={`w-full p-3 rounded-xl bg-gray-800 text-white border ${
                              errors.numeroMesa ? 'border-red-500' : 'border-gray-600'
                            } focus:border-red-500 focus:outline-none`}
                            value={customerData.numeroMesa}
                            onChange={(e) => handleInputChange('numeroMesa', e.target.value)}
                            placeholder="1-30"
                          />
                          {errors.numeroMesa && <p className="text-red-400 text-sm mt-1">{errors.numeroMesa}</p>}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Address (only for delivery) */}
                {currentStep === 2 && isDelivery && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 mb-6">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <h3 className="text-xl font-semibold text-white">Endereço de Entrega</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">CEP *</label>
                        <input
                          type="text"
                          className={`w-full p-3 rounded-xl bg-gray-800 text-white border ${
                            errors.cep ? 'border-red-500' : 'border-gray-600'
                          } focus:border-red-500 focus:outline-none`}
                          value={customerData.cep}
                          onChange={(e) => handleInputChange('cep', e.target.value)}
                          placeholder="12345-678"
                          maxLength={9}
                        />
                        {errors.cep && <p className="text-red-400 text-sm mt-1">{errors.cep}</p>}
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">Número *</label>
                        <input
                          type="text"
                          className={`w-full p-3 rounded-xl bg-gray-800 text-white border ${
                            errors.numero ? 'border-red-500' : 'border-gray-600'
                          } focus:border-red-500 focus:outline-none`}
                          value={customerData.numero}
                          onChange={(e) => handleInputChange('numero', e.target.value)}
                          placeholder="123"
                        />
                        {errors.numero && <p className="text-red-400 text-sm mt-1">{errors.numero}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Rua/Avenida *</label>
                      <input
                        type="text"
                        className={`w-full p-3 rounded-xl bg-gray-800 text-white border ${
                          errors.rua ? 'border-red-500' : 'border-gray-600'
                        } focus:border-red-500 focus:outline-none`}
                        value={customerData.rua}
                        onChange={(e) => handleInputChange('rua', e.target.value)}
                        placeholder="Rua das Flores"
                      />
                      {errors.rua && <p className="text-red-400 text-sm mt-1">{errors.rua}</p>}
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Complemento</label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
                        value={customerData.complemento}
                        onChange={(e) => handleInputChange('complemento', e.target.value)}
                        placeholder="Apto 45, Bloco B"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">Bairro *</label>
                        <input
                          type="text"
                          className={`w-full p-3 rounded-xl bg-gray-800 text-white border ${
                            errors.bairro ? 'border-red-500' : 'border-gray-600'
                          } focus:border-red-500 focus:outline-none`}
                          value={customerData.bairro}
                          onChange={(e) => handleInputChange('bairro', e.target.value)}
                          placeholder="Centro"
                        />
                        {errors.bairro && <p className="text-red-400 text-sm mt-1">{errors.bairro}</p>}
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">Cidade *</label>
                        <input
                          type="text"
                          className={`w-full p-3 rounded-xl bg-gray-800 text-white border ${
                            errors.cidade ? 'border-red-500' : 'border-gray-600'
                          } focus:border-red-500 focus:outline-none`}
                          value={customerData.cidade}
                          onChange={(e) => handleInputChange('cidade', e.target.value)}
                          placeholder="São Paulo"
                        />
                        {errors.cidade && <p className="text-red-400 text-sm mt-1">{errors.cidade}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Ponto de Referência</label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
                        value={customerData.pontoReferencia}
                        onChange={(e) => handleInputChange('pontoReferencia', e.target.value)}
                        placeholder="Em frente ao banco Itaú"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment and Final (Step 2 for mesa) */}
                {((currentStep === 3 && isDelivery) || (currentStep === 2 && !isDelivery)) && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-2 mb-6">
                      <CreditCard className="w-5 h-5 text-red-500" />
                      <h3 className="text-xl font-semibold text-white">Pagamento e Observações</h3>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-white font-semibold mb-4">Forma de Pagamento</label>
                      <div className="space-y-3">
                        {[
                          { value: 'dinheiro', label: 'Dinheiro', icon: '💵' },
                          { value: 'pix', label: 'PIX', icon: '📱' },
                          { value: 'cartao', label: 'Cartão na entrega', icon: '💳' }
                        ].map((option) => (
                          <motion.label
                            key={option.value}
                            className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                              customerData.formaPagamento === option.value
                                ? 'border-red-500 bg-red-500/20'
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <input
                              type="radio"
                              name="formaPagamento"
                              value={option.value}
                              checked={customerData.formaPagamento === option.value}
                              onChange={(e) => handleInputChange('formaPagamento', e.target.value as any)}
                              className="sr-only"
                            />
                            <span className="text-2xl">{option.icon}</span>
                            <span className="text-white font-semibold">{option.label}</span>
                          </motion.label>
                        ))}
                      </div>

                      {customerData.formaPagamento === 'dinheiro' && (
                        <div className="mt-4">
                          <label className="block text-white font-semibold mb-2">Troco para quanto?</label>
                          <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:border-red-500 focus:outline-none"
                            value={customerData.trocoParaValor}
                            onChange={(e) => handleInputChange('trocoParaValor', e.target.value)}
                            placeholder="R$ 100,00"
                          />
                        </div>
                      )}
                    </div>

                    {/* Observations */}
                    <div>
                      <label className="block text-white font-semibold mb-2">Observações</label>
                      <textarea
                        className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:border-red-500 focus:outline-none resize-none"
                        rows={3}
                        value={customerData.observacoes}
                        onChange={(e) => handleInputChange('observacoes', e.target.value)}
                        placeholder={isDelivery 
                          ? "Instruções especiais para entrega, restrições alimentares, etc."
                          : "Observações sobre o pedido, restrições alimentares, etc."
                        }
                      />
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-800 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-3">Resumo do Pedido</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-300">
                          <span>Subtotal:</span>
                          <span>R$ {(finalTotal - deliveryFee).toFixed(2)}</span>
                        </div>
                        {isDelivery && (
                          <div className="flex justify-between text-gray-300">
                            <span>Taxa de entrega:</span>
                            <span>R$ {deliveryFee.toFixed(2)}</span>
                          </div>
                        )}
                        {!isDelivery && customerData.numeroMesa && (
                          <div className="flex justify-between text-green-400">
                            <span>Mesa {customerData.numeroMesa}:</span>
                            <span>Sem taxa de entrega</span>
                          </div>
                        )}
                        <div className="flex justify-between text-white font-bold text-lg border-t border-gray-700 pt-2">
                          <span>Total:</span>
                          <span className="text-red-400">R$ {finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 md:p-6 border-t border-gray-700">
                <div className="flex space-x-3">
                  {currentStep > 1 && (
                    <motion.button
                      className="px-4 md:px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={prevStep}
                    >
                      Voltar
                    </motion.button>
                  )}
                </div>

                <div className="flex space-x-3">
                  {((currentStep < 3 && isDelivery) || (currentStep < 2 && !isDelivery)) ? (
                    <motion.button
                      className="px-4 md:px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={nextStep}
                    >
                      Próximo
                    </motion.button>
                  ) : (
                    <motion.button
                      className="px-6 md:px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-colors flex items-center space-x-2 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleFinalizePedido}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Gerando Pedido...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-5 h-5" />
                          <span>Enviar pelo WhatsApp</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutForm;