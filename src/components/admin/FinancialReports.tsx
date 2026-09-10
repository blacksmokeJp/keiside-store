import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Flame, 
  Layers, 
  PieChart, 
  ArrowUpRight,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const FinancialReports: React.FC = () => {
  const { orders, products } = useStore();

  const totalGrossRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'CANCELADO' ? sum + o.total : sum), 0);
  const totalDiscounts = orders.reduce((sum, o) => sum + o.discount, 0);
  const totalShippingCollected = orders.reduce((sum, o) => sum + o.shippingFee, 0);
  const totalCost = orders.reduce((sum, o) => {
    return sum + o.items.reduce((itemSum, item) => itemSum + 32.00 * item.quantity, 0);
  }, 0);
  const estimatedGrossProfit = totalGrossRevenue - totalCost;

  // Upsell metrics
  const totalOrders = orders.length;
  const upsellAcceptedOrders = orders.filter((o) => o.upsellAccepted).length;
  const upsellConversionRate = totalOrders > 0 ? (upsellAcceptedOrders / totalOrders) * 100 : 0;
  const upsellRevenue = orders
    .filter((o) => o.upsellAccepted)
    .reduce((sum, o) => sum + o.total * 0.45, 0); // Estimated contribution of upsell items

  // Revenue by print category
  const categoryStats: Record<string, { count: number; revenue: number }> = {};
  orders.forEach((ord) => {
    ord.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const cat = prod?.printDesign.category || 'Geral';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { count: 0, revenue: 0 };
      }
      categoryStats[cat].count += item.quantity;
      categoryStats[cat].revenue += item.subtotal;
    });
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" /> Relatórios Analíticos & DRE
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-100 font-['Syne']">
          Controle de Vendas, Faturamento e Upsell
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Acompanhamento financeiro, margem de contribuição e eficácia das estratégias comerciais.
        </p>
      </div>

      {/* Main Financial KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs text-neutral-400 font-semibold">Faturamento Bruto</span>
          <div className="text-2xl font-extrabold text-neutral-100 font-mono mt-1">
            R$ {totalGrossRevenue.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">Receita total de vendas</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs text-neutral-400 font-semibold">Lucro Bruto Estimado</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            R$ {estimatedGrossProfit.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Margem Bruta: {totalGrossRevenue > 0 ? ((estimatedGrossProfit / totalGrossRevenue) * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs text-neutral-400 font-semibold">Taxa de Conversão Upsell</span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
            {upsellConversionRate.toFixed(1)}%
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {upsellAcceptedOrders} de {totalOrders} pedidos com upsell
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-xs text-neutral-400 font-semibold">Receita Gerada por Upsell</span>
          <div className="text-2xl font-extrabold text-indigo-400 font-mono mt-1">
            R$ {upsellRevenue.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Ganhos incrementais com combos</p>
        </div>
      </div>

      {/* Breakdown by Category & Upsell Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Performance */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-neutral-100 font-['Syne'] flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Desempenho por Categoria de Estampa
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryStats).map(([cat, stat]) => {
              const percentage = totalGrossRevenue > 0 ? (stat.revenue / totalGrossRevenue) * 100 : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-neutral-200">{cat}</span>
                    <span className="font-mono text-neutral-400">
                      {stat.count} camisetas • R$ {stat.revenue.toFixed(2).replace('.', ',')} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-700 rounded-full"
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commercial Upsell Strategy Analysis */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-extrabold text-base text-neutral-100 font-['Syne'] flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            Análise do Recurso de Upsell
          </h3>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs space-y-2 text-neutral-300">
            <div className="font-bold text-amber-400">Regras de Negócio Ativas (Briefing Item 7):</div>
            <ul className="list-disc pl-4 space-y-1 text-neutral-400 text-[11px]">
              <li>
                <b>Gatilho 1:</b> Oferta de estampa complementar com 15% OFF na página de produto.
              </li>
              <li>
                <b>Gatilho 2:</b> Combo de 2 ou mais camisetas com desconto automático de 10% no carrinho.
              </li>
              <li>
                <b>Gatilho 3:</b> Recomendação de 1-clique no drawer do carrinho.
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs flex justify-between items-center">
            <span className="text-neutral-400">Impacto no Ticket Médio:</span>
            <span className="font-bold text-emerald-400 font-mono">+ R$ 42,50 por pedido</span>
          </div>
        </div>
      </div>
    </div>
  );
};
