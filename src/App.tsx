import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { BannerPromo } from './components/BannerPromo';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { InvoiceModal } from './components/InvoiceModal';
import { CustomerOrdersModal } from './components/CustomerOrdersModal';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductManagement } from './components/admin/ProductManagement';
import { InventoryManagement } from './components/admin/InventoryManagement';
import { OrderManagement } from './components/admin/OrderManagement';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { FinancialReports } from './components/admin/FinancialReports';

// Technical Guide & Sizing
import { PrintTechGuide } from './components/PrintTechGuide';

import { 
  Sparkles, 
  Search, 
  Flame, 
  Tag, 
  Layers, 
  SlidersHorizontal, 
  ShoppingBag, 
  ArrowRight,
  ShieldCheck,
  Ruler
} from 'lucide-react';
import { PrintCategory, ApparelType } from './types';

const MainContent: React.FC = () => {
  const { 
    products, 
    viewMode, 
    adminTab, 
    setAdminTab, 
    categoryFilter, 
    setCategoryFilter, 
    searchQuery, 
    setSearchQuery,
    setSelectedProduct
  } = useStore();

  const [apparelFilter, setApparelFilter] = useState<ApparelType | 'TODAS'>('TODAS');

  const apparelTypes: { id: ApparelType | 'TODAS'; label: string; icon: string }[] = [
    { id: 'TODAS', label: 'Todas as Peças', icon: '⚡' },
    { id: 'tshirt', label: 'Camisetas', icon: '👕' },
    { id: 'hoodie', label: 'Blusas / Moletons', icon: '🧥' },
    { id: 'pants', label: 'Calças Streetwear', icon: '👖' },
    { id: 'beanie', label: 'Toucas & Beanies', icon: '🧢' },
    { id: 'socks', label: 'Meias Streetwear', icon: '🧦' },
  ];

  const categories: Array<PrintCategory | 'TODAS'> = [
    'TODAS',
    'Cyberpunk',
    'Anime & Geek',
    'Animal',
    'Dark & Tattoo',
    'Retro & Vintage',
    'Streetwear',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesApparel = 
      apparelFilter === 'TODAS' || 
      (p.apparelType || 'tshirt') === apparelFilter;
    const matchesCat = 
      categoryFilter === 'ALL' || 
      categoryFilter === 'TODAS' || 
      p.printDesign.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.printDesign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesApparel && matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans selection:bg-[#00E5FF] selection:text-black">
      <Navbar />

      <main className="flex-1">
        {/* VIEW 1: STOREFRONT / VITRINE DE E-COMMERCE */}
        {viewMode === 'store' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Promotional Bar */}
            <BannerPromo />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {/* Hero Spotlight Section */}
              <div className="relative overflow-hidden bg-[#0c0c0c] border border-white/10 p-8 sm:p-12 text-left">
                <div className="relative z-10 max-w-2xl space-y-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.3em] font-mono">
                    <Flame className="w-3.5 h-3.5 text-[#00E5FF]" /> KEISIDE ® // STREETWEAR NACIONAL
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter leading-tight italic text-left uppercase">
                    CAMISETAS ESTAMPADAS <br /><span className="text-[#00E5FF]">AUTORAIS</span> & OVERSIZED
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl text-left">
                    Artes originais de alta definição em Silk Digital HD (Kornit DTG), malha pesada 100% algodão penteado e modelagem streetwear nacional de alta durabilidade.
                  </p>

                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <a
                      href="#catalogo"
                      className="px-8 py-3.5 bg-white hover:bg-[#00E5FF] text-black font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 group font-mono"
                    >
                      Explorar Catálogo
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <div className="text-xs text-zinc-400 flex items-center gap-2 pl-2 font-mono text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                      Garantia 30 dias • Frete Grátis Brasil
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Search Bar */}
              <div id="catalogo" className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                      Catálogo de Estampas Exclusivas
                    </h2>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">
                      Mostrando {filteredProducts.length} modelo(s) disponíveis em Silk Digital HD Kornit
                    </p>
                  </div>

                  {/* Search input */}
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar estampa, tema ou estilo..."
                      className="w-full bg-[#0c0c0c] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF] transition-colors"
                    />
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Apparel Type Filter Tabs (Camisetas, Blusas, Calças, Toucas, Meias) */}
                <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar border-b border-white/5 pb-3">
                  {apparelTypes.map((type) => {
                    const isSelected = apparelFilter === type.id;
                    return (
                      <motion.button
                        key={type.id}
                        type="button"
                        onClick={() => setApparelFilter(type.id)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                            : 'bg-[#080808] text-zinc-400 hover:text-white border-white/10 hover:border-white/30'
                        }`}
                      >
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Category Chips with Wave Hover Animation */}
                <div className="flex items-center gap-2 overflow-x-auto py-2 pb-3 no-scrollbar">
                  {categories.map((cat) => {
                    const isSelected = 
                      (cat === 'TODAS' && (categoryFilter === 'TODAS' || categoryFilter === 'ALL')) || 
                      categoryFilter === cat;
                    return (
                      <motion.button
                        key={cat}
                        onClick={() => setCategoryFilter(cat === 'TODAS' ? 'ALL' : cat)}
                        whileHover={{ 
                          scale: 1.1, 
                          y: -3, 
                          transition: { type: 'spring', stiffness: 450, damping: 17 } 
                        }}
                        whileTap={{ scale: 0.94 }}
                        className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 relative ${
                          isSelected
                            ? 'bg-[#00E5FF] text-black font-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                            : 'bg-[#0c0c0c] text-zinc-400 hover:text-white hover:bg-zinc-900 border border-white/10 hover:border-[#00E5FF]/40'
                        }`}
                      >
                        {cat === 'TODAS' ? '⚡ Todas as Estampas' : cat}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Products Grid with Appear/Disappear Animation */}
              {filteredProducts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-16 text-center bg-[#0c0c0c] border border-white/10 space-y-3"
                >
                  <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
                  <h3 className="text-base font-bold text-zinc-300">Nenhum produto encontrado</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Não encontramos camisetas para a busca "{searchQuery}". Tente limpar os filtros ou selecionar outra categoria.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('TODAS');
                    }}
                    className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-[#00E5FF]"
                  >
                    Limpar Filtros
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.88, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 15 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Promotional Upsell Banner */}
              <div className="p-6 sm:p-8 bg-[#0c0c0c] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 my-8">
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="px-2.5 py-0.5 bg-[#00E5FF] text-black text-[10px] font-black uppercase tracking-wider">
                    Oferta Especial de Upsell
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white italic tracking-tight">
                    Leve 2 ou mais camisetas e ganhe 10% de Desconto automático no carrinho!
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Aproveite para combinar diferentes artes e colecionar suas estampas favoritas com frete grátis para todo o Brasil.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const firstProd = products[0];
                    if (firstProd) setSelectedProduct(firstProd);
                  }}
                  className="px-8 py-3.5 bg-white hover:bg-[#00E5FF] text-black font-black text-xs uppercase tracking-widest whitespace-nowrap transition-colors"
                >
                  Montar Meu Combo →
                </button>
              </div>
            </div>

            <Footer />
          </div>
        )}

        {/* VIEW 2: CUSTOMER ORDERS & TRACKING */}
        {viewMode === 'my-orders' && (
          <div>
            <CustomerOrdersModal />
            <Footer />
          </div>
        )}

        {/* VIEW 3: ADMINISTRATIVE DASHBOARD & MANAGEMENT */}
        {viewMode === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            {/* Admin Subtabs Navigation Bar */}
            <div className="bg-[#0c0c0c] border border-white/10 p-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'dashboard', label: '📊 Visão Geral & KPIs' },
                { id: 'products', label: '👕 Produtos & Estampas' },
                { id: 'inventory', label: '📦 Estoque & Grade' },
                { id: 'orders', label: '🛍️ Pedidos & Despacho' },
                { id: 'customers', label: '👥 Clientes (CRM)' },
                { id: 'reports', label: '📈 Relatórios & DRE' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    adminTab === tab.id
                      ? 'bg-[#00E5FF] text-black font-black'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub-view switcher */}
            {adminTab === 'dashboard' && <AdminDashboard />}
            {adminTab === 'products' && <ProductManagement />}
            {adminTab === 'inventory' && <InventoryManagement />}
            {adminTab === 'orders' && <OrderManagement />}
            {adminTab === 'customers' && <CustomerManagement />}
            {adminTab === 'reports' && <FinancialReports />}
          </div>
        )}

        {/* VIEW 4: GUIA TÉCNICO & ESTAMPARIA HD */}
        {viewMode === 'guide' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fadeIn">
            <PrintTechGuide />
            <Footer />
          </div>
        )}
      </main>

      {/* Global Interactive Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <InvoiceModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
