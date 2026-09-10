import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  Database, 
  Cpu, 
  Layers, 
  FileJson, 
  Sparkles, 
  Activity, 
  Search, 
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';

interface CodeInspectorHUDProps {
  onClose?: () => void;
}

export const CodeInspectorHUD: React.FC<CodeInspectorHUDProps> = () => {
  const { 
    products, 
    cart, 
    orders, 
    customers, 
    categoryFilter, 
    searchQuery, 
    selectedProduct,
    financialSummary
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'state' | 'types' | 'stock' | 'api' | 'telemetry'>('products');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterCodeText, setFilterCodeText] = useState('');
  const [logs, setLogs] = useState<Array<{ timestamp: string; event: string; payload: string }>>([
    {
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      event: 'SYSTEM_INIT',
      payload: 'Keiside Store State Engine Mounted. 8 Products, 6 Sizes, 6 Categories Loaded.',
    }
  ]);

  // Log store events
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setLogs((prev) => [
      {
        timestamp,
        event: 'CATEGORY_FILTER_CHANGE',
        payload: `categoryFilter: "${categoryFilter}", searchQuery: "${searchQuery}"`,
      },
      ...prev.slice(0, 49)
    ]);
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    if (cart.length > 0) {
      const timestamp = new Date().toLocaleTimeString('pt-BR');
      setLogs((prev) => [
        {
          timestamp,
          event: 'CART_UPDATE',
          payload: `cartItemsCount: ${cart.reduce((acc, item) => acc + item.quantity, 0)}, totalValue: R$ ${cart.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2)}`,
        },
        ...prev.slice(0, 49)
      ]);
    }
  }, [cart]);

  // Generate code representations
  const getCodeContent = () => {
    switch (activeTab) {
      case 'products':
        return JSON.stringify(
          products.map((p) => ({
            id: p.id,
            sku: p.sku,
            name: p.name,
            price_brl: p.price,
            cost_brl: p.costPrice,
            category: p.printDesign.category,
            print_technique: p.printDesign.technique,
            print_dimension: p.printDesign.dimension,
            designer: p.printDesign.designer,
            material: p.material,
            stock_by_size: p.stockBySize,
            total_stock: (Object.values(p.stockBySize) as number[]).reduce((a, b) => a + b, 0),
            colors: p.colors.map((c) => ({ name: c.name, hex: c.hex })),
            is_best_seller: p.isBestSeller || false,
            is_new: p.isNew || false,
          })),
          null,
          2
        );

      case 'state':
        return JSON.stringify(
          {
            app_runtime: {
              environment: 'production-react-19',
              timestamp: new Date().toISOString(),
              total_products_count: products.length,
              active_category_filter: categoryFilter,
              active_search_query: searchQuery,
              selected_product_sku: selectedProduct ? selectedProduct.sku : null,
            },
            cart_state: {
              items_count: cart.reduce((acc, item) => acc + item.quantity, 0),
              distinct_items: cart.length,
              subtotal_brl: cart.reduce((acc, item) => acc + item.totalPrice, 0),
              has_upsell_discount: cart.length >= 2,
              items: cart.map((i) => ({
                id: i.id,
                sku: i.product.sku,
                name: i.product.name,
                size: i.size,
                color: i.color.name,
                qty: i.quantity,
                unit_price: i.unitPrice,
                total_price: i.totalPrice,
              })),
            },
            database_metrics: {
              total_orders: orders.length,
              total_customers: customers.length,
              gross_revenue_brl: financialSummary.grossRevenue,
              net_profit_brl: financialSummary.netProfit,
              average_ticket_brl: financialSummary.averageTicket,
            }
          },
          null,
          2
        );

      case 'stock':
        const stockMatrix = products.map((p) => {
          const totalStock = (Object.values(p.stockBySize) as number[]).reduce((a, b) => a + b, 0);
          return {
            sku: p.sku,
            name: p.name,
            category: p.printDesign.category,
            stock: p.stockBySize,
            total: totalStock,
            status: totalStock < 15 ? 'LOW_STOCK_ALERT' : 'OPTIMAL_INVENTORY',
          };
        });
        return `// KEISIDE INVENTORY STOCK MATRIX DATA\n// Exported: ${new Date().toISOString()}\n\nexport const STOCK_MATRIX = ${JSON.stringify(stockMatrix, null, 2)};`;

      case 'types':
        return `// TYPESCRIPT TYPE DEFINITIONS // KEISIDE STORE
export type ShirtSize = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG';

export type PrintCategory = 
  | 'Cyberpunk' 
  | 'Anime & Geek' 
  | 'Minimalista' 
  | 'Dark & Tattoo' 
  | 'Retro & Vintage' 
  | 'Streetwear';

export interface ShirtColor {
  id: string;
  name: string;
  hex: string;
  bgClass: string;
}

export interface PrintDesign {
  id: string;
  title: string;
  category: PrintCategory;
  imageUrl: string;
  mockupUrl: string;
  technique: 'Silk Digital HD' | 'Kornit DTG Industrial' | 'Sublimação Premium';
  dimension: 'A3 (297x420mm)' | 'A4 (210x297mm)' | 'Pocket (100x100mm)';
  designer: string;
  description: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  costPrice: number;
  printId: string;
  printDesign: PrintDesign;
  colors: ShirtColor[];
  sizes: ShirtSize[];
  stockBySize: Record<ShirtSize, number>;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  description: string;
  material: string;
  tags: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  size: ShirtSize;
  color: ShirtColor;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isUpsellItem?: boolean;
}`;

      case 'api':
        return `// KEISIDE REST & GRAPHQL API SPECIFICATION
// Base URL: https://api.keiside.com.br/v1

/**
 * GET /api/v1/catalog/products
 * Headers: { 'Authorization': 'Bearer {API_KEY}', 'Content-Type': 'application/json' }
 * Query Params: ?category=${encodeURIComponent(categoryFilter)}&search=${encodeURIComponent(searchQuery)}
 */
export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/v1/catalog/products');
  return response.json();
}

/**
 * POST /api/v1/checkout/orders
 * Payload: CreateOrderPayload
 */
export async function createOrder(payload: {
  items: Array<{ sku: string; size: string; color: string; qty: number }>;
  paymentMethod: 'PIX' | 'CARTAO_CREDITO' | 'BOLETO';
  shippingAddress: { cep: string; street: string; number: string; city: string; state: string };
}) {
  return await fetch('/api/v1/checkout/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}`;

      case 'telemetry':
        return `// REAL-TIME EVENT STREAM TELEMETRY BUS (STDOUT)
${logs.map((l) => `[${l.timestamp}] [EVENT: ${l.event}] -> ${l.payload}`).join('\n')}`;

      default:
        return '';
    }
  };

  const rawCode = getCodeContent();
  const filteredCode = filterCodeText
    ? rawCode
        .split('\n')
        .filter((line) => line.toLowerCase().includes(filterCodeText.toLowerCase()))
        .join('\n')
    : rawCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#070707] border border-white/10 overflow-hidden font-mono shadow-2xl relative my-6">
      {/* HUD Header */}
      <div className="bg-[#0f0f0f] border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black border border-[#00E5FF]/40 text-[#00E5FF] text-[10px] font-black uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            KEISIDE_CODE_HUD // v2.6.4
          </div>
          <span className="text-xs text-zinc-400 font-bold hidden sm:inline">
            Todas as Informações em Código & JSON em Tempo Real
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Search inside code */}
          <div className="relative">
            <input
              type="text"
              value={filterCodeText}
              onChange={(e) => setFilterCodeText(e.target.value)}
              placeholder="Filtrar código..."
              className="bg-black/70 border border-white/10 pl-7 pr-2 py-1 text-[11px] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF] w-32 sm:w-44"
            />
            <Search className="w-3 h-3 text-zinc-500 absolute left-2 top-1/2 -translate-y-1/2" />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="px-3 py-1 bg-white hover:bg-[#00E5FF] text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            title="Copiar código formatado"
          >
            {copied ? <Check className="w-3 h-3 text-black" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copiado!' : 'Copiar Código'}
          </motion.button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 bg-black hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition-colors"
            title={isExpanded ? 'Recolher' : 'Expandir'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#0a0a0a] border-b border-white/10 px-2 py-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'products', label: '1. Produtos (JSON)', icon: FileJson, badge: `${products.length} itens` },
          { id: 'state', label: '2. Estado & Carrinho (State)', icon: Activity, badge: `${cart.length} no carrinho` },
          { id: 'stock', label: '3. Estoque Grade (Matrix)', icon: Database, badge: 'PP-XGG' },
          { id: 'types', label: '4. Tipos TypeScript (.d.ts)', icon: Code2, badge: 'Strict' },
          { id: 'api', label: '5. APIs & Endpoints (REST)', icon: Cpu, badge: 'v1' },
          { id: 'telemetry', label: '6. Terminal Logs (Events)', icon: Terminal, badge: `${logs.length} logs` },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap border transition-colors ${
                isActive
                  ? 'bg-[#00E5FF] text-black border-[#00E5FF] font-black shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                  : 'bg-black/60 text-zinc-400 hover:text-white border-white/10 hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
              <span className={`text-[8px] px-1 py-0.2 font-mono ${isActive ? 'bg-black text-[#00E5FF]' : 'bg-white/10 text-zinc-400'}`}>
                {tab.badge}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Code Editor Body */}
      <div className={`relative bg-[#050505] p-4 text-xs overflow-auto font-mono ${isExpanded ? 'max-h-[700px]' : 'max-h-[380px]'}`}>
        {/* Line numbers and code preview */}
        <pre className="text-zinc-300 leading-relaxed overflow-x-auto selection:bg-[#00E5FF] selection:text-black">
          <code>
            {filteredCode.split('\n').map((line, idx) => {
              // Simple syntax color highlights
              let lineColored = line;
              let isKey = line.includes('":');
              let isComment = line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*');

              return (
                <div key={idx} className="flex hover:bg-white/5 py-0.5 px-1 rounded transition-colors">
                  <span className="w-10 text-zinc-600 select-none text-right pr-4 text-[11px] font-mono shrink-0">
                    {idx + 1}
                  </span>
                  <span
                    className={`flex-1 font-mono text-[11px] whitespace-pre ${
                      isComment
                        ? 'text-zinc-500 italic'
                        : isKey
                        ? 'text-[#00E5FF]'
                        : line.includes('http')
                        ? 'text-yellow-400'
                        : line.includes('true') || line.includes('false')
                        ? 'text-emerald-400'
                        : 'text-zinc-300'
                    }`}
                  >
                    {line}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Code HUD Footer */}
      <div className="bg-[#0a0a0a] border-t border-white/10 px-4 py-2 flex flex-wrap items-center justify-between text-[10px] text-zinc-500 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[#00E5FF] font-bold">● UTF-8</span>
          <span>TypeScript / JSON</span>
          <span>Tamanho: {(new Blob([rawCode]).size / 1024).toFixed(1)} KB</span>
          <span>Linhas: {rawCode.split('\n').length}</span>
        </div>
        <div className="text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#00E5FF]" />
          Informações sincronizadas reativamente com o estado da loja
        </div>
      </div>
    </div>
  );
};
