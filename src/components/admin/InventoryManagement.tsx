import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShirtSize, Product } from '../../types';
import { 
  AlertTriangle, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  RotateCcw, 
  Search, 
  Layers, 
  Plus, 
  Minus,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const { products, stockMovements, adjustStock, lowStockItemsCount } = useStore();
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [search, setSearch] = useState('');

  // Quick Adjustment Modal State
  const [adjustingProd, setAdjustingProd] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<ShirtSize>('M');
  const [adjustType, setAdjustType] = useState<'ENTRADA' | 'SAIDA' | 'AJUSTE'>('ENTRADA');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('Reposição de lote de estamparia');

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(search.toLowerCase()) || prod.sku.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterLowStockOnly) {
      return (Object.values(prod.stockBySize) as number[]).some((qty) => qty > 0 && qty < 5);
    }
    return true;
  });

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProd) return;
    const delta = adjustType === 'SAIDA' ? -Math.abs(adjustQuantity) : Math.abs(adjustQuantity);
    adjustStock(adjustingProd.id, selectedSize, delta, adjustType, adjustReason);
    setAdjustingProd(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest mb-1">
            <Layers className="w-3.5 h-3.5" /> Controle Operacional
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tight uppercase">
            Gerenciamento de Estoque & Grade
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Monitore o saldo por tamanho, receba alertas de estoque crítico e registre entradas/saídas.
          </p>
        </div>

        {/* Low Stock Warning Badge */}
        <button
          onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
            filterLowStockOnly
              ? 'bg-red-500 text-white border-red-400 shadow-lg'
              : lowStockItemsCount > 0
              ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
              : 'bg-[#080808] text-zinc-400 border-white/10'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{lowStockItemsCount} Grades Críticas</span>
          {filterLowStockOnly && <span className="underline ml-1">(Filtrado)</span>}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por produto ou SKU..."
            className="w-full bg-[#0c0c0c] border border-white/10 pl-9 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF]"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Stock Matrix Table */}
      <div className="bg-[#0c0c0c] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#080808] text-zinc-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-4">Camiseta / Estampa</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-2 text-center">PP</th>
                <th className="py-3 px-2 text-center">P</th>
                <th className="py-3 px-2 text-center">M</th>
                <th className="py-3 px-2 text-center">G</th>
                <th className="py-3 px-2 text-center">GG</th>
                <th className="py-3 px-2 text-center">XGG</th>
                <th className="py-3 px-4 text-center font-mono">Total</th>
                <th className="py-3 px-4 text-right">Movimentação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredProducts.map((prod) => {
                const sizes: ShirtSize[] = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];
                const totalStock = (Object.values(prod.stockBySize) as number[]).reduce((a, b) => a + b, 0);

                return (
                  <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.printDesign.imageUrl}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-12 object-cover border border-white/10 bg-black"
                        />
                        <div>
                          <div className="font-bold text-white uppercase tracking-wider text-xs">{prod.name}</div>
                          <div className="text-[10px] text-zinc-400">{prod.printDesign.technique}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400 text-xs">{prod.sku}</td>

                    {/* Stock by size badges */}
                    {sizes.map((sz) => {
                      const qty = prod.stockBySize[sz] || 0;
                      const isZero = qty === 0;
                      const isLow = qty > 0 && qty < 5;

                      return (
                        <td key={sz} className="py-3 px-2 text-center">
                          <span
                            className={`inline-block w-8 py-1 font-mono font-bold text-xs border ${
                              isZero
                                ? 'bg-black text-zinc-600 border-white/5'
                                : isLow
                                ? 'bg-red-500/10 text-red-400 border-red-500/40 animate-pulse'
                                : 'bg-[#080808] text-zinc-200 border-white/10'
                            }`}
                            title={isLow ? 'Estoque baixo (< 5 unidades)' : `${qty} unidades`}
                          >
                            {qty}
                          </span>
                        </td>
                      );
                    })}

                    <td className="py-3 px-4 text-center font-mono font-black text-white">
                      {totalStock} un
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setAdjustingProd(prod);
                          setSelectedSize('M');
                          setAdjustType('ENTRADA');
                          setAdjustQuantity(10);
                        }}
                        className="px-3 py-1.5 bg-[#080808] hover:bg-white hover:text-black text-[#00E5FF] text-[10px] font-black uppercase tracking-wider border border-white/10 transition-colors inline-flex items-center gap-1"
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        Ajustar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movements Log History */}
      <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="font-black text-base text-white italic tracking-tight uppercase">
              Histórico de Movimentações (Auditoria)
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono uppercase">
            Últimas {stockMovements.length} operações
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-zinc-500 font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3">Data / Hora</th>
                <th className="py-2.5 px-3">Produto</th>
                <th className="py-2.5 px-3 text-center">Tam</th>
                <th className="py-2.5 px-3 text-center">Tipo</th>
                <th className="py-2.5 px-3 text-center font-mono">Qtd</th>
                <th className="py-2.5 px-3">Motivo / Documento</th>
                <th className="py-2.5 px-3">Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium text-zinc-300">
              {stockMovements.slice(0, 8).map((mov) => (
                <tr key={mov.id} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 text-zinc-400 font-mono text-[10px]">{mov.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-white uppercase text-xs">{mov.productName}</td>
                  <td className="py-2.5 px-3 text-center font-bold font-mono text-[#00E5FF]">{mov.size}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 text-[9px] font-black uppercase font-mono border ${
                        mov.type === 'ENTRADA'
                          ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'
                          : mov.type === 'VENDA'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {mov.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold">
                    <span className={mov.quantity > 0 ? 'text-[#00E5FF]' : 'text-zinc-400'}>
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400 text-[10px]">{mov.reason}</td>
                  <td className="py-2.5 px-3 text-zinc-500 text-[10px] font-mono">{mov.responsible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Quick Stock Adjustment */}
      {adjustingProd && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0c0c0c] border border-white/20 p-6 space-y-4 my-auto shadow-2xl">
            <h3 className="font-black text-base text-white italic tracking-tight uppercase">
              Movimentar Estoque: {adjustingProd.name}
            </h3>

            <form onSubmit={handleApplyAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-1">Tipo de Movimentação</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ENTRADA', 'SAIDA', 'AJUSTE'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAdjustType(t)}
                      className={`py-2 font-black uppercase text-[10px] tracking-wider border transition-all ${
                        adjustType === t
                          ? 'bg-[#00E5FF] text-black border-[#00E5FF]'
                          : 'bg-[#080808] text-zinc-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-1">Tamanho</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value as ShirtSize)}
                  className="w-full bg-[#080808] border border-white/10 px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                >
                  {(['PP', 'P', 'M', 'G', 'GG', 'XGG'] as ShirtSize[]).map((sz) => (
                    <option key={sz} value={sz}>
                      Tamanho {sz} (Atual: {adjustingProd.stockBySize[sz] || 0} un)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-1">Quantidade de Peças</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#080808] border border-white/10 px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-1">Motivo / Observação</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-[#080808] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAdjustingProd(null)}
                  className="px-4 py-2 bg-[#080808] text-zinc-300 font-bold uppercase text-[10px] tracking-wider hover:bg-white hover:text-black border border-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00E5FF] hover:bg-white text-black font-black uppercase text-[10px] tracking-widest shadow-lg"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
