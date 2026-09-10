import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  FileText, 
  ChevronRight, 
  Search, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export const CustomerOrdersModal: React.FC = () => {
  const { orders, setViewingInvoiceOrder, setViewMode } = useStore();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      o.customerCpf.includes(filterQuery)
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PAGO':
        return <span className="px-2 py-0.5 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-[9px] font-black uppercase tracking-wider font-mono">Pago</span>;
      case 'EM_PRODUCAO':
        return <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[9px] font-black uppercase tracking-wider font-mono">Em Produção</span>;
      case 'ENVIADO':
        return <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[9px] font-black uppercase tracking-wider font-mono">Enviado</span>;
      case 'ENTREGUE':
        return <span className="px-2 py-0.5 bg-white text-black border border-white text-[9px] font-black uppercase tracking-wider font-mono">Entregue</span>;
      case 'PENDENTE':
        return <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 border border-white/10 text-[9px] font-black uppercase tracking-wider font-mono">Pendente</span>;
      case 'CANCELADO':
        return <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 text-[9px] font-black uppercase tracking-wider font-mono">Cancelado</span>;
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDENTE': return 0;
      case 'PAGO': return 1;
      case 'EM_PRODUCAO': return 2;
      case 'ENVIADO': return 3;
      case 'ENTREGUE': return 4;
      case 'CANCELADO': return -1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-[#00E5FF] uppercase font-bold tracking-widest mb-1">
            <Package className="w-3.5 h-3.5" /> Área do Cliente • Acompanhamento
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white italic tracking-tight uppercase">
            Meus Pedidos & Rastreio
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Acompanhe a produção das suas peças, código de envio postal e emissão de NF-e.
          </p>
        </div>

        <button
          onClick={() => setViewMode('store')}
          className="px-5 py-2.5 bg-[#00E5FF] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] transition-colors flex items-center gap-1.5 self-start shadow-lg"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Fazer Novo Pedido
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Orders List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Buscar por Nº do Pedido ou CPF..."
              className="w-full bg-[#0c0c0c] border border-white/10 pl-9 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF]"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-[#0c0c0c] border border-white/10 text-zinc-500 text-xs">
                Nenhum pedido encontrado.
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-4 border transition-all cursor-pointer flex flex-col gap-2.5 ${
                    selectedOrder?.id === ord.id
                      ? 'bg-[#0c0c0c] border-[#00E5FF]'
                      : 'bg-[#080808] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black font-mono text-xs text-white uppercase tracking-wider">
                      Pedido #{ord.orderNumber}
                    </span>
                    {getStatusBadge(ord.orderStatus)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-[10px] font-mono">
                      {new Date(ord.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="font-bold text-[#00E5FF] font-mono text-xs">
                      R$ {ord.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="text-[10px] text-zinc-500 truncate font-mono">
                    {ord.items.map((i) => `${i.quantity}x ${i.productName} (${i.size})`).join(', ')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Order Detail & Timeline Tracking */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="bg-[#0c0c0c] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Top Banner of Selected Order */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white font-mono uppercase">
                      Pedido #{selectedOrder.orderNumber}
                    </h2>
                    {getStatusBadge(selectedOrder.orderStatus)}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                    {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')} • {selectedOrder.customerName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingInvoiceOrder(selectedOrder)}
                  className="px-3.5 py-2 bg-[#080808] hover:bg-white hover:text-black text-zinc-200 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 border border-white/10 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#00E5FF]" />
                  Ver DANFE / NF-e
                </button>
              </div>

              {/* Step Tracking Timeline */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Linha do Tempo de Rastreamento
                </h3>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { title: '1. Recebido', desc: 'Pagamento OK', step: 1 },
                    { title: '2. Estamparia', desc: 'Produção Silk', step: 2 },
                    { title: '3. Em Trânsito', desc: 'Envio Correios', step: 3 },
                    { title: '4. Entregue', desc: 'Destinatário', step: 4 },
                  ].map((st) => {
                    const currentIdx = getStepIndex(selectedOrder.orderStatus);
                    const isPassed = currentIdx >= st.step;
                    const isCurrent = currentIdx === st.step;

                    return (
                      <div
                        key={st.step}
                        className={`p-3 border text-center transition-all ${
                          isCurrent
                            ? 'bg-black border-[#00E5FF] text-[#00E5FF]'
                            : isPassed
                            ? 'bg-[#080808] border-white/30 text-white'
                            : 'bg-[#080808] border-white/5 text-zinc-600 opacity-60'
                        }`}
                      >
                        <div className="w-5 h-5 mx-auto mb-1 flex items-center justify-center text-xs font-mono">
                          {isPassed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-zinc-600" />
                          )}
                        </div>
                        <div className="font-bold text-[10px] uppercase tracking-wider leading-tight">{st.title}</div>
                        <div className="text-[9px] text-zinc-500 mt-0.5 font-mono">{st.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tracking Code if available */}
              {selectedOrder.trackingCode && (
                <div className="p-4 bg-[#080808] border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#00E5FF]" />
                    <div>
                      <div className="font-bold text-white text-[11px] uppercase tracking-wider">
                        Rastreio Correios: <span className="font-mono text-[#00E5FF]">{selectedOrder.trackingCode}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500">Atualizações automáticas via integração postal</div>
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-400 bg-black px-2.5 py-1 border border-white/10 font-mono uppercase">
                    Expresso
                  </span>
                </div>
              )}

              {/* Items in order */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Itens do Pedido ({selectedOrder.items.length})
                </h3>

                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#080808] border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-14 object-cover border border-white/10 bg-black"
                        />
                        <div>
                          <div className="font-bold text-xs text-white uppercase tracking-wider">{item.productName}</div>
                          <div className="text-[10px] text-zinc-400">
                            Estampa: {item.printName} • Tam: <b className="text-[#00E5FF]">{item.size}</b> • Cor: {item.colorName}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            Qtd: {item.quantity} x R$ {item.unitPrice.toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                      </div>

                      <div className="font-mono font-bold text-xs text-white">
                        R$ {item.subtotal.toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Financial Recap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10 text-xs">
                <div className="p-3.5 bg-[#080808] border border-white/10 space-y-1">
                  <span className="font-bold text-zinc-300 text-[10px] uppercase tracking-wider block mb-1">Endereço de Entrega:</span>
                  <p className="text-zinc-400 text-[11px]">
                    {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.number} {selectedOrder.shippingAddress.complement || ''}
                  </p>
                  <p className="text-zinc-400 text-[11px]">
                    {selectedOrder.shippingAddress.neighborhood} - {selectedOrder.shippingAddress.city}/{selectedOrder.shippingAddress.state}
                  </p>
                  <p className="text-[#00E5FF] font-mono text-[11px]">CEP: {selectedOrder.shippingAddress.cep}</p>
                </div>

                <div className="p-3.5 bg-[#080808] border border-white/10 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal:</span>
                    <span>R$ {selectedOrder.subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-[#00E5FF]">
                      <span>Desconto:</span>
                      <span>- R$ {selectedOrder.discount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Frete:</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'GRÁTIS' : `R$ ${selectedOrder.shippingFee.toFixed(2).replace('.', ',')}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#00E5FF] pt-1 border-t border-white/10">
                    <span>Total:</span>
                    <span>R$ {selectedOrder.total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-[#0c0c0c] border border-white/10 text-zinc-500 text-xs">
              Selecione um pedido na lista ao lado para ver o rastreamento e a nota fiscal.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
