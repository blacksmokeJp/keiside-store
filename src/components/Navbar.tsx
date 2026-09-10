import React from 'react';
import { motion } from 'motion/react';
import { useStore, AppViewMode } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  LayoutDashboard, 
  PackageCheck, 
  FileCode2, 
  Store, 
  Sparkles,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    cart, 
    setIsCartOpen, 
    searchQuery, 
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    lowStockItemsCount,
    resetToDefaultData
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    { id: 'ALL', name: 'Todos os Lançamentos' },
    { id: 'Cyberpunk', name: 'Cyberpunk' },
    { id: 'Anime & Geek', name: 'Anime & Geek' },
    { id: 'Streetwear', name: 'Streetwear' },
    { id: 'Dark & Tattoo', name: 'Dark / Tattoo' },
    { id: 'Retro & Vintage', name: 'Retro 80s' },
    { id: 'Minimalista', name: 'Minimal' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-white/5 text-white">
      {/* Top utility bar */}
      <div className="bg-[#0c0c0c] border-b border-white/5 px-4 py-2 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#00E5FF] uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              KEISIDE Store // Streetwear Oficial
            </span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden md:inline text-zinc-400 text-[11px] uppercase tracking-wider">
              Camisetas Estampadas 100% Algodão Penteado • Silk Digital HD Kornit
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Deseja restaurar os dados de demonstração iniciais (produtos, pedidos e estoque)?')) {
                  resetToDefaultData();
                }
              }}
              className="hover:text-[#00E5FF] transition-colors flex items-center gap-1 text-[10px] uppercase tracking-widest text-zinc-400"
              title="Restaurar dados de demonstração"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo
            </button>
            <span className="text-white/20">|</span>
            <span className="text-zinc-400 text-[10px] uppercase tracking-widest hidden sm:inline">Entrega para todo o Brasil</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setViewMode('store')}
              className="text-left group flex flex-col justify-center focus:outline-none"
            >
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase italic">
                  KEISIDE <span className="text-xs text-[#00E5FF] not-italic font-mono">®</span>
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-400 font-bold -mt-1 font-mono">
                STREETWEAR NACIONAL
              </span>
            </button>
          </div>

          {/* Search bar (visible in store mode) */}
          {viewMode === 'store' && (
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar estampa, anime, cyberpunk, estilo..."
                  className="w-full bg-[#0c0c0c] border border-white/10 rounded-none pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF] transition-all font-sans"
                />
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mode Switchers & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Switcher Pills */}
            <div className="flex items-center bg-[#0c0c0c] p-1 border border-white/10">
              <button
                onClick={() => setViewMode('store')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-all ${
                  viewMode === 'store'
                    ? 'bg-[#00E5FF] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">E-commerce</span>
              </button>

              <button
                onClick={() => setViewMode('my-orders')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-all ${
                  viewMode === 'my-orders'
                    ? 'bg-[#00E5FF] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Meus Pedidos</span>
              </button>

              <button
                onClick={() => setViewMode('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-all relative ${
                  viewMode === 'admin'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-[#00E5FF]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Painel Admin</span>
                {lowStockItemsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title={`${lowStockItemsCount} itens com estoque baixo`} />
                )}
              </button>

              <button
                onClick={() => setViewMode('guide')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-all ${
                  viewMode === 'guide'
                    ? 'bg-[#00E5FF] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Guia de Estamparia, Tabela de Medidas e Tecnologia de Impressão"
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Guia & Estamparia</span>
              </button>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 bg-[#0c0c0c] hover:bg-zinc-900 border border-white/10 text-white hover:text-[#00E5FF] transition-all focus:outline-none"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#00E5FF] text-black text-[9px] font-black px-1.5 py-0.5 rounded-full border border-black animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar in Store Mode */}
        {viewMode === 'store' && (
          <div className="flex items-center justify-between py-2.5 border-t border-white/5 overflow-x-auto no-scrollbar gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500 flex items-center gap-1 mr-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                <SlidersHorizontal className="w-3 h-3 text-[#00E5FF]" /> Categorias:
              </span>
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  whileHover={{ 
                    scale: 1.08, 
                    y: -2, 
                    transition: { type: 'spring', stiffness: 450, damping: 17 } 
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 ${
                    selectedCategory === cat.id
                      ? 'bg-[#00E5FF] text-black font-black shadow-[0_0_12px_rgba(0,229,255,0.35)]'
                      : 'bg-[#0c0c0c] text-zinc-400 hover:text-white hover:bg-zinc-900 border border-white/10 hover:border-[#00E5FF]/40'
                  }`}
                >
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
