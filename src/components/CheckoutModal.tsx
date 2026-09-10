import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, Order } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Barcode, 
  Copy, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  FileText,
  Lock,
  Package
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartSubtotal, cartDiscount, cartTotal, createOrder, setViewingInvoiceOrder, setViewMode } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form states
  const [customer, setCustomer] = useState({
    name: 'João Pedro Oliveira',
    email: 'joao.pedro@email.com',
    cpf: '382.109.482-15',
    phone: '(11) 98765-4321',
  });

  const [address, setAddress] = useState({
    cep: '01310-100',
    street: 'Avenida Paulista',
    number: '1578',
    complement: 'Apto 104',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 8920',
    name: 'JOAO P OLIVEIRA',
    expiry: '12/28',
    cvv: '782',
    installments: '1',
  });

  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Free shipping check
  const shippingFee = cartSubtotal >= 199 ? 0 : 14.90;
  const grandTotal = cartTotal + shippingFee;

  if (!isOpen) return null;

  const handleCepLookup = () => {
    // Simulated CEP auto-fill for testing ease
    const cleanCep = address.cep.replace(/\D/g, '');
    if (cleanCep.length >= 8) {
      if (cleanCep.startsWith('0')) {
        setAddress((prev) => ({ ...prev, city: 'São Paulo', state: 'SP', neighborhood: 'Centro' }));
      } else if (cleanCep.startsWith('2')) {
        setAddress((prev) => ({ ...prev, city: 'Rio de Janeiro', state: 'RJ', neighborhood: 'Zona Sul' }));
      } else if (cleanCep.startsWith('3')) {
        setAddress((prev) => ({ ...prev, city: 'Belo Horizonte', state: 'MG', neighborhood: 'Savassi' }));
      } else if (cleanCep.startsWith('8')) {
        setAddress((prev) => ({ ...prev, city: 'Curitiba', state: 'PR', neighborhood: 'Batel' }));
      }
    }
  };

  const handleFinishPurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = createOrder({
        customer,
        address,
        paymentMethod,
        shippingFee,
      });
      setCreatedOrder(order);
      setStep(4);
      setIsProcessing(false);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
        });
      } catch {
        // Fallback silently if confetti blocked
      }
    }, 1000);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136keiside-store-pagamento-pix-992015204000053039865802BR5913KEISIDE STORE6009SAO PAULO62070503KSI630489A1');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-[#0c0c0c] border border-white/10 overflow-hidden shadow-2xl flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#080808]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-[#00E5FF] text-black font-black flex items-center justify-center text-xs tracking-tighter">
                K
              </span>
              <h2 className="font-black text-base text-white uppercase tracking-widest">
                Checkout Seguro • KEISIDE
              </h2>
            </div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
              Ambiente criptografado SSL com emissão de NF-e
            </p>
          </div>

          {step !== 4 && (
            <button
              onClick={onClose}
              className="w-8 h-8 bg-[#080808] hover:bg-white hover:text-black text-zinc-400 flex items-center justify-center transition-colors border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {step !== 4 && (
          <div className="bg-[#080808] px-6 py-3 border-b border-white/10 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-2 uppercase tracking-wider text-[10px] ${step >= 1 ? 'text-[#00E5FF] font-bold' : 'text-zinc-600'}`}>
              <span className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono ${step >= 1 ? 'bg-[#00E5FF] text-black font-black' : 'bg-black text-zinc-600 border border-white/10'}`}>
                1
              </span>
              <span>Identificação</span>
            </div>
            <div className="w-8 h-[1px] bg-white/10" />
            <div className={`flex items-center gap-2 uppercase tracking-wider text-[10px] ${step >= 2 ? 'text-[#00E5FF] font-bold' : 'text-zinc-600'}`}>
              <span className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono ${step >= 2 ? 'bg-[#00E5FF] text-black font-black' : 'bg-black text-zinc-600 border border-white/10'}`}>
                2
              </span>
              <span>Entrega</span>
            </div>
            <div className="w-8 h-[1px] bg-white/10" />
            <div className={`flex items-center gap-2 uppercase tracking-wider text-[10px] ${step >= 3 ? 'text-[#00E5FF] font-bold' : 'text-zinc-600'}`}>
              <span className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono ${step >= 3 ? 'bg-[#00E5FF] text-black font-black' : 'bg-black text-zinc-600 border border-white/10'}`}>
                3
              </span>
              <span>Pagamento</span>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 overflow-y-auto max-h-[75vh]">
          {/* STEP 1: Customer Info */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00E5FF]" /> 1. Dados Pessoais & NF-e
              </h3>
              <p className="text-[11px] text-zinc-400">
                Necessário para emissão legal da Nota Fiscal Eletrônica e garantia do seu pedido.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    required
                    className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">CPF (Nota Fiscal)</label>
                  <input
                    type="text"
                    value={customer.cpf}
                    onChange={(e) => setCustomer({ ...customer, cpf: e.target.value })}
                    required
                    className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">E-mail para Rastreio</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    required
                    className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    required
                    className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-[#00E5FF] hover:bg-white text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all"
                >
                  Continuar para Entrega <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Address */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#00E5FF]" /> 2. Endereço de Entrega
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">CEP</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={address.cep}
                      onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                      onBlur={handleCepLookup}
                      className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Logradouro / Rua</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Número</label>
                  <input
                    type="text"
                    value={address.number}
                    onChange={(e) => setAddress({ ...address, number: e.target.value })}
                    className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Complemento</label>
                  <input
                    type="text"
                    value={address.complement}
                    onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                    placeholder="Apto, Bloco, etc."
                    className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Bairro</label>
                  <input
                    type="text"
                    value={address.neighborhood}
                    onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                    className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Cidade</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Estado (UF)</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    maxLength={2}
                    className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00E5FF] uppercase"
                  />
                </div>
              </div>

              {/* Shipping Method Summary */}
              <div className="p-3.5 bg-[#080808] border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#00E5FF]" />
                  <div>
                    <div className="font-bold text-white uppercase text-[10px] tracking-wider">Envio Expresso KEISIDE (3 a 6 dias úteis)</div>
                    <div className="text-[10px] text-zinc-500">Rastreamento e seguro integral inclusos</div>
                  </div>
                </div>
                <div className="font-mono text-xs">
                  {shippingFee === 0 ? (
                    <span className="text-[#00E5FF] font-bold uppercase">GRÁTIS</span>
                  ) : (
                    <span className="text-white font-bold">R$ {shippingFee.toFixed(2).replace('.', ',')}</span>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-[#080808] border border-white/10 text-zinc-300 font-bold uppercase text-[10px] tracking-wider flex items-center gap-2 hover:bg-white hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-[#00E5FF] hover:bg-white text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all"
                >
                  Ir para Pagamento <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#00E5FF]" /> 3. Forma de Pagamento
              </h3>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-3.5 border text-center flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'PIX'
                      ? 'border-[#00E5FF] bg-black text-[#00E5FF]'
                      : 'border-white/10 bg-[#080808] text-zinc-400 hover:border-white/30'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#00E5FF]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">PIX Instantâneo</span>
                  <span className="text-[9px] text-[#00E5FF] font-mono">Aprovação Imediata</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARTAO_CREDITO')}
                  className={`p-3.5 border text-center flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'CARTAO_CREDITO'
                      ? 'border-[#00E5FF] bg-black text-[#00E5FF]'
                      : 'border-white/10 bg-[#080808] text-zinc-400 hover:border-white/30'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#00E5FF]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Cartão de Crédito</span>
                  <span className="text-[9px] text-zinc-500 font-mono">Até 6x sem juros</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('BOLETO')}
                  className={`p-3.5 border text-center flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'BOLETO'
                      ? 'border-[#00E5FF] bg-black text-[#00E5FF]'
                      : 'border-white/10 bg-[#080808] text-zinc-400 hover:border-white/30'
                  }`}
                >
                  <Barcode className="w-5 h-5 text-[#00E5FF]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Boleto Bancário</span>
                  <span className="text-[9px] text-zinc-500 font-mono">Compensação 1-2d</span>
                </button>
              </div>

              {/* PIX Interface */}
              {paymentMethod === 'PIX' && (
                <div className="p-5 bg-[#080808] border border-white/10 space-y-4 text-center animate-fadeIn">
                  <div className="inline-block p-3 bg-white text-black">
                    <div className="w-36 h-36 border-2 border-black flex flex-col items-center justify-center font-mono text-[9px] p-2 leading-tight">
                      <QrCode className="w-24 h-24 text-black mb-1" />
                      <span>KEISIDE PIX QR</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      Escaneie o QR Code ou copie a chave Pix:
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      Válido por 15 minutos • Identificação automática
                    </p>
                  </div>

                  <div className="flex gap-2 max-w-md mx-auto">
                    <input
                      type="text"
                      readOnly
                      value="00020126580014br.gov.bcb.pix0136keiside-store-pagamento-pix-992015204000053039865802BR5913KEISIDE STORE6009SAO PAULO62070503KSI630489A1"
                      className="flex-1 bg-black border border-white/10 px-3 py-2 text-[10px] font-mono text-zinc-400 truncate"
                    />
                    <button
                      type="button"
                      onClick={copyPixCode}
                      className="px-3.5 py-2 bg-white text-black hover:bg-[#00E5FF] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      {copiedPix ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedPix ? 'Copiado!' : 'Copiar Pix'}
                    </button>
                  </div>
                </div>
              )}

              {/* Credit Card Interface */}
              {paymentMethod === 'CARTAO_CREDITO' && (
                <div className="p-5 bg-[#080808] border border-white/10 space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Número do Cartão</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full bg-black border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Nome Impresso no Cartão</label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                        className="w-full bg-black border border-white/10 px-3.5 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Validade</label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-full bg-black border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">CVV</label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full bg-black border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Parcelamento</label>
                      <select
                        value={cardData.installments}
                        onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                        className="w-full bg-black border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF] font-mono"
                      >
                        <option value="1">1x de R$ {grandTotal.toFixed(2).replace('.', ',')} (sem juros)</option>
                        <option value="2">2x de R$ {(grandTotal / 2).toFixed(2).replace('.', ',')} (sem juros)</option>
                        <option value="3">3x de R$ {(grandTotal / 3).toFixed(2).replace('.', ',')} (sem juros)</option>
                        <option value="4">4x de R$ {(grandTotal / 4).toFixed(2).replace('.', ',')} (sem juros)</option>
                        <option value="5">5x de R$ {(grandTotal / 5).toFixed(2).replace('.', ',')} (sem juros)</option>
                        <option value="6">6x de R$ {(grandTotal / 6).toFixed(2).replace('.', ',')} (sem juros)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Boleto Interface */}
              {paymentMethod === 'BOLETO' && (
                <div className="p-5 bg-[#080808] border border-white/10 space-y-3 text-center animate-fadeIn">
                  <Barcode className="w-12 h-12 text-[#00E5FF] mx-auto" />
                  <p className="text-xs text-white uppercase tracking-wider font-bold">
                    O boleto bancário será gerado após a finalização da compra.
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    O prazo de produção e entrega inicia após a compensação bancária (até 48h úteis).
                  </p>
                </div>
              )}

              {/* Order Summary in Step 3 */}
              <div className="p-4 bg-[#080808] border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400 text-[11px] uppercase tracking-wider">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} itens):</span>
                  <span className="font-mono text-white">R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#00E5FF] text-[11px] uppercase tracking-wider">
                    <span>Desconto Aplicado:</span>
                    <span className="font-mono">- R$ {cartDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400 text-[11px] uppercase tracking-wider">
                  <span>Frete:</span>
                  <span className="font-mono text-white">
                    {shippingFee === 0 ? <span className="text-[#00E5FF] font-bold uppercase">GRÁTIS</span> : `R$ ${shippingFee.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/10">
                  <span className="uppercase tracking-wider">Total Final:</span>
                  <span className="font-mono text-[#00E5FF] text-base">
                    R$ {grandTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 bg-[#080808] border border-white/10 text-zinc-300 font-bold uppercase text-[10px] tracking-wider flex items-center gap-2 hover:bg-white hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleFinishPurchase}
                  className="px-8 py-3.5 bg-[#00E5FF] hover:bg-white text-black font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-xl"
                >
                  {isProcessing ? 'Processando...' : 'Concluir Compra & Emitir NF-e'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Confirmation */}
          {step === 4 && createdOrder && (
            <div className="text-center py-6 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 bg-black border border-[#00E5FF] text-[#00E5FF] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase tracking-widest">
                  Pedido Confirmado com Sucesso!
                </span>
                <h3 className="text-2xl font-black text-white italic tracking-tight uppercase mt-1">
                  Pedido #{createdOrder.orderNumber}
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1.5">
                  Obrigado por comprar na <b>KEISIDE Store</b>! Enviamos a confirmação detalhada para <b>{createdOrder.customerEmail}</b>.
                </p>
              </div>

              {/* Order quick overview */}
              <div className="p-4 bg-[#080808] border border-white/10 text-left max-w-lg mx-auto space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-zinc-400 uppercase text-[10px] tracking-wider">Status do Pedido:</span>
                  <span className="font-bold text-[#00E5FF] font-mono uppercase text-[10px]">
                    {createdOrder.orderStatus}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-zinc-400 uppercase text-[10px] tracking-wider">Código de Rastreamento:</span>
                  <span className="font-mono text-white font-bold">{createdOrder.trackingCode}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-zinc-400 uppercase text-[10px] tracking-wider">Nota Fiscal Eletrônica (NF-e):</span>
                  <span className="font-mono text-[#00E5FF] font-bold">Nº {createdOrder.nfeNumber}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-zinc-400 uppercase text-[10px] tracking-wider">Total Pago:</span>
                  <span className="font-mono font-extrabold text-[#00E5FF] text-sm">
                    R$ {createdOrder.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewingInvoiceOrder(createdOrder);
                  }}
                  className="px-5 py-2.5 bg-[#080808] hover:bg-white hover:text-black text-zinc-200 font-black text-[10px] uppercase tracking-wider flex items-center gap-2 border border-white/10 transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#00E5FF]" />
                  Visualizar DANFE / Nota Fiscal
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setViewMode('my-orders');
                  }}
                  className="px-5 py-2.5 bg-[#00E5FF] hover:bg-white text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors shadow-lg"
                >
                  <Package className="w-4 h-4" />
                  Acompanhar Meus Pedidos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
