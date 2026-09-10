import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, Search, ShoppingBag, DollarSign, Calendar, MapPin } from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const { customers, orders } = useStore();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.cpf.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest mb-1">
            <Users className="w-3.5 h-3.5" /> Gestão de Clientes & CRM
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tight uppercase">
            Base de Clientes KEISIDE
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Visualize dados cadastrais, histórico de compras e valor total gerado por cliente (LTV).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#080808] text-zinc-300 px-3 py-1.5 border border-white/10 font-mono font-bold uppercase tracking-wider">
            {customers.length} Clientes Ativos
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail, CPF ou cidade..."
          className="w-full bg-[#0c0c0c] border border-white/10 pl-9 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF]"
        />
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Customers Table */}
      <div className="bg-[#0c0c0c] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#080808] text-zinc-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-4">Nome do Cliente</th>
                <th className="py-3 px-4">CPF / Contato</th>
                <th className="py-3 px-4">Cidade / UF</th>
                <th className="py-3 px-4 text-center font-mono">Pedidos Realizados</th>
                <th className="py-3 px-4 font-mono">Total Gasto (LTV)</th>
                <th className="py-3 px-4">Última Compra</th>
                <th className="py-3 px-4">Cadastrado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white uppercase text-xs">{cust.name}</div>
                    <div className="text-[10px] text-zinc-400">{cust.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-zinc-300 text-xs">{cust.cpf}</div>
                    <div className="text-[10px] text-zinc-500">{cust.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#00E5FF]" />
                      <span className="text-xs">{cust.city} / {cust.state}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-zinc-200">
                    <span className="px-2.5 py-1 bg-black border border-white/10 text-xs font-mono">
                      {cust.ordersCount} pedidos
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-black text-[#00E5FF]">
                    R$ {cust.totalSpent.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3 px-4 text-zinc-400 text-[10px] font-mono">
                    {cust.lastOrderDate}
                  </td>
                  <td className="py-3 px-4 text-zinc-500 text-[10px] font-mono">
                    {cust.createdAt}
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
