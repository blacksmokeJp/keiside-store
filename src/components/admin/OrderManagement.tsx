import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { 
  PackageCheck, 
  Search, 
  FileText, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus, generateNFeForOrder, setViewingInvoiceOrder } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerCpf.includes(search);
    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && o.orderStatus !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PAGO':
        return <span className="px-2 py-0.5 bg-black text-[#00E5FF] border border-[#00E5FF]/30 text-[9px] font-black uppercase font-mono tracking-wider">Pago (Aprovado)</span>;
      case 'EM_PRODUCAO':
        return <span className="px-2 py-0.5 bg-black text-yellow-400 border border-yellow-500/30 text-[9px] font-black uppercase font-mono tracking-wider">Em Estamparia</span>;
      case 'ENVIADO':
        return <span className="px-2 py-0.5 bg-black text-purple-400 border border-purple-500/30 text-[9px] font-black uppercase font-mono tracking-wider">Enviado (Correios)</span>;
      case 'ENTREGUE':
        return <span className="px-2 py-0.5 bg-black text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase font-mono tracking-wider">Entregue</span>;
      case 'PENDENTE':
        return <span className="px-2 py-0.5 bg-black text-zinc-400 border border-white/10 text-[9px] font-black uppercase font-mono tracking-wider">Aguardando Pagamento</span>;
      case 'CANCELADO':
        return <span className="px-2 py-0.5 bg-black text-red-400 border border-red-500/30 text-[9px] font-black uppercase font-mono tracking-wider">Cancelado</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest mb-1">
            <PackageCheck className="w-3.5 h-3.5" /> Gestão de Vendas & Despacho
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tight uppercase">
            Gerenciamento de Pedidos
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Atualize o status dos pedidos, emita notas fiscais (NF-e) e despache mercadorias.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#080808] text-zinc-300 px-3 py-1.5 border border-white/10 font-mono font-bold uppercase tracking-wider">
            Total: {orders.length} pedidos
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por Nº do Pedido, Cliente ou CPF..."
            className="w-full bg-[#0c0c0c] border border-white/10 pl-9 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF]"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-zinc-500 uppercase font-mono text-[10px] mr-1">Status:</span>
          {(['ALL', 'PENDENTE', 'PAGO', 'EM_PRODUCAO', 'ENVIADO', 'ENTREGUE'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-wider transition-all border ${
                statusFilter === st
                  ? 'bg-[#00E5FF] text-black border-[#00E5FF]'
                  : 'bg-[#0c0c0c] text-zinc-400 hover:text-white border-white/10'
              }`}
            >
              {st === 'ALL' ? 'Todos' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0c0c0c] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#080808] text-zinc-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-4">Pedido / Data</th>
                <th className="py-3 px-4">Cliente & Cidade</th>
                <th className="py-3 px-4">Itens / Estampas</th>
                <th className="py-3 px-4 font-mono">Valor Total</th>
                <th className="py-3 px-4">Pagamento</th>
                <th className="py-3 px-4">Status Atual</th>
                <th className="py-3 px-4">Alterar Status</th>
                <th className="py-3 px-4 text-right">Nota Fiscal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold font-mono text-white text-xs">#{ord.orderNumber}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {new Date(ord.createdAt).toLocaleDateString('pt-BR')} {new Date(ord.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-white uppercase text-xs">{ord.customerName}</div>
                    <div className="text-[10px] text-zinc-400">{ord.shippingAddress.city} - {ord.shippingAddress.state}</div>
                    <div className="text-[10px] font-mono text-zinc-500">{ord.customerCpf}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-zinc-300 text-[11px]">
                      {ord.items.map((it) => (
                        <div key={it.productId + it.size} className="truncate max-w-[200px]">
                          {it.quantity}x {it.productName} ({it.size})
                        </div>
                      ))}
                    </div>
                    {ord.upsellAccepted && (
                      <span className="inline-block mt-1 text-[9px] font-bold text-[#00E5FF] bg-black px-1.5 py-0.2 border border-[#00E5FF]/30 uppercase font-mono">
                        + Upsell Adicional
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-white">
                    R$ {ord.total.toFixed(2).replace('.', ',')}
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold uppercase text-zinc-300 block font-mono">{ord.paymentMethod}</span>
                    <span className="text-[9px] text-[#00E5FF] font-mono font-bold">
                      {ord.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {getStatusBadge(ord.orderStatus)}
                  </td>

                  {/* Quick status selector */}
                  <td className="py-3 px-4">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="bg-[#080808] border border-white/10 px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#00E5FF] font-semibold uppercase font-mono"
                    >
                      <option value="PENDENTE">Pendente</option>
                      <option value="PAGO">Pago</option>
                      <option value="EM_PRODUCAO">Em Produção</option>
                      <option value="ENVIADO">Enviado (Correios)</option>
                      <option value="ENTREGUE">Entregue</option>
                      <option value="CANCELADO">Cancelar</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {ord.nfeNumber ? (
                      <button
                        onClick={() => setViewingInvoiceOrder(ord)}
                        className="px-2.5 py-1 bg-[#080808] hover:bg-white hover:text-black text-[#00E5FF] text-[10px] font-black uppercase tracking-wider border border-white/10 transition-colors inline-flex items-center gap-1"
                        title="Visualizar DANFE"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        DANFE
                      </button>
                    ) : (
                      <button
                        onClick={() => generateNFeForOrder(ord.id)}
                        className="px-2.5 py-1 bg-[#00E5FF]/10 hover:bg-[#00E5FF] text-[#00E5FF] hover:text-black text-[10px] font-black uppercase tracking-wider border border-[#00E5FF]/30 transition-colors inline-flex items-center gap-1"
                      >
                        Emitir NF-e
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
