import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Flame, 
  Package, 
  FileText,
  ArrowUpRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    orders, 
    products, 
    customers, 
    lowStockItemsCount, 
    setAdminTab, 
    setViewingInvoiceOrder 
  } = useStore();

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'CANCELADO' ? sum + o.total : sum), 0);
  const totalOrdersCount = orders.length;
  const paidOrders = orders.filter((o) => o.orderStatus !== 'CANCELADO' && o.orderStatus !== 'PENDENTE');
  const averageTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  
  // Upsell acceptance rate
  const upsellOrders = orders.filter((o) => o.upsellAccepted).length;
  const upsellRate = totalOrdersCount > 0 ? (upsellOrders / totalOrdersCount) * 100 : 0;

  // Pending production orders
  const pendingProductionOrders = orders.filter((o) => o.orderStatus === 'EM_PRODUCAO' || o.orderStatus === 'PAGO').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c0c0c] p-6 border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Gestão Operacional KEISIDE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white italic tracking-tight uppercase">
            Visão Geral & Faturamento
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Acompanhe em tempo real o fluxo de vendas, produção de estampas e reposição de estoque.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('products')}
            className="px-5 py-2.5 bg-[#00E5FF] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] transition-colors shadow-lg"
          >
            + Novo Produto
          </button>
          <button
            onClick={() => setAdminTab('inventory')}
            className="px-5 py-2.5 bg-[#080808] hover:bg-white hover:text-black text-zinc-200 font-bold uppercase tracking-wider text-[10px] border border-white/10 transition-colors"
          >
            Movimentar Estoque
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Faturamento Bruto */}
        <div className="p-5 bg-[#0c0c0c] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Faturamento Bruto</span>
            <div className="w-7 h-7 bg-black border border-white/10 text-[#00E5FF] flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-white font-mono">
              R$ {totalRevenue.toFixed(2).replace('.', ',')}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#00E5FF] font-mono mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+18.4% vs mês anterior</span>
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 font-mono uppercase">
            Total em {orders.length} pedidos
          </div>
        </div>

        {/* Card 2: Pedidos & Produção */}
        <div className="p-5 bg-[#0c0c0c] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Em Produção</span>
            <div className="w-7 h-7 bg-black border border-white/10 text-[#00E5FF] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-white font-mono">
              {pendingProductionOrders} <span className="text-xs font-normal text-zinc-500 uppercase">pedidos</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-1">
              Silk Digital HD ativo
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 font-mono uppercase">
            Tempo médio: 24h
          </div>
        </div>

        {/* Card 3: Ticket Médio & Upsell */}
        <div className="p-5 bg-[#0c0c0c] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Ticket Médio & Upsell</span>
            <div className="w-7 h-7 bg-black border border-white/10 text-[#00E5FF] flex items-center justify-center">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-white font-mono">
              R$ {averageTicket.toFixed(2).replace('.', ',')}
            </div>
            <div className="text-[10px] text-[#00E5FF] font-mono mt-1">
              Conversão Upsell: {upsellRate.toFixed(1)}%
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 font-mono uppercase">
            {upsellOrders} compras c/ combo
          </div>
        </div>

        {/* Card 4: Alertas de Estoque */}
        <div className="p-5 bg-[#0c0c0c] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Alertas de Estoque</span>
            <div className={`w-7 h-7 border flex items-center justify-center ${lowStockItemsCount > 0 ? 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse' : 'bg-black text-zinc-600 border-white/10'}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-white font-mono">
              {lowStockItemsCount} <span className="text-xs font-normal text-zinc-500 uppercase">críticos</span>
            </div>
            <div className={`text-[10px] font-mono mt-1 ${lowStockItemsCount > 0 ? 'text-red-400' : 'text-zinc-500'}`}>
              {lowStockItemsCount > 0 ? 'Reposição necessária (< 5 un)' : 'Estoque regular'}
            </div>
          </div>
          <button
            onClick={() => setAdminTab('inventory')}
            className="text-[10px] text-[#00E5FF] hover:underline text-left font-bold uppercase tracking-wider"
          >
            Ver grades críticas →
          </button>
        </div>
      </div>

      {/* Two columns: Recent Orders & Stock Quick Glance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-[#0c0c0c] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-white italic tracking-tight uppercase">
                Últimos Pedidos
              </h3>
              <p className="text-xs text-zinc-400">
                Gerencie o fluxo de aprovação e emissão de notas fiscais
              </p>
            </div>

            <button
              onClick={() => setAdminTab('orders')}
              className="text-[10px] text-[#00E5FF] hover:underline font-bold uppercase tracking-widest"
            >
              Ver todos ({orders.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-500 text-[10px] uppercase font-mono">
                  <th className="py-2.5 px-3">Pedido</th>
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Itens</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      #{ord.orderNumber}
                    </td>
                    <td className="py-3 px-3 text-zinc-300">
                      <div>{ord.customerName}</div>
                      <div className="text-[10px] text-zinc-500">{ord.shippingAddress.city}/{ord.shippingAddress.state}</div>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {ord.items.length} camiseta(s)
                      {ord.upsellAccepted && (
                        <span className="ml-1.5 text-[9px] bg-[#00E5FF]/10 text-[#00E5FF] px-1.5 py-0.2 border border-[#00E5FF]/30 font-bold uppercase">
                          Upsell
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 text-[9px] font-black font-mono uppercase bg-black text-[#00E5FF] border border-white/10">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      R$ {ord.total.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setViewingInvoiceOrder(ord)}
                        className="p-1.5 bg-[#080808] hover:bg-white hover:text-black text-zinc-200 transition-colors inline-flex items-center gap-1 border border-white/10"
                        title="Ver Nota Fiscal (DANFE)"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#00E5FF]" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">DANFE</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Best-selling Prints & Quick Stock glance */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-4">
            <h3 className="font-black text-base text-white italic tracking-tight uppercase flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#00E5FF]" />
              Mais Vendidas
            </h3>

            <div className="space-y-3">
              {products.slice(0, 4).map((prod, idx) => (
                <div key={prod.id} className="flex items-center gap-3 p-2.5 bg-[#080808] border border-white/10">
                  <span className="w-5 h-5 bg-black text-[#00E5FF] border border-white/10 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <img
                    src={prod.printDesign.imageUrl}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-cover border border-white/10 bg-black"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate uppercase tracking-wider">
                      {prod.printDesign.title}
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      {prod.printDesign.category} • R$ {prod.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-3">
            <h3 className="font-black text-base text-white italic tracking-tight uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00E5FF]" />
              Base de Clientes
            </h3>
            <p className="text-xs text-zinc-400">
              {customers.length} clientes na base com dados fiscais completos para faturamento e fidelização.
            </p>
            <button
              onClick={() => setAdminTab('customers')}
              className="w-full py-2.5 bg-[#080808] hover:bg-white hover:text-black text-zinc-200 text-[10px] font-black uppercase tracking-widest border border-white/10 transition-colors"
            >
              Acessar Módulo CRM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
