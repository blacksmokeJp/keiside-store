import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, PrintDesign, ShirtSize } from '../../types';
import { SHIRT_COLORS, PRINT_DESIGNS } from '../../data/mockData';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Layers, 
  Sparkles, 
  DollarSign, 
  X, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';

export const ProductManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState('89.90');
  const [formCostPrice, setFormCostPrice] = useState('32.00');
  const [formCategory, setFormCategory] = useState<PrintDesign['category']>('Cyberpunk');
  const [formPrintTitle, setFormPrintTitle] = useState('');
  const [formPrintImageUrl, setFormPrintImageUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
  const [formTechnique, setFormTechnique] = useState('Silk Digital HD (DTG Kornit)');
  const [formStock, setFormStock] = useState<Record<ShirtSize, number>>({
    PP: 5,
    P: 10,
    M: 15,
    G: 12,
    GG: 8,
    XGG: 4,
  });

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.printDesign.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingProductId(null);
    setFormName('Camiseta Nova Estampa Street');
    setFormSubtitle('Linha Urban Graphic Wear');
    setFormSku(`KSI-ST-${Math.floor(100 + Math.random() * 900)}`);
    setFormPrice('89.90');
    setFormCostPrice('32.00');
    setFormCategory('Cyberpunk');
    setFormPrintTitle('Nova Estampa Futurista');
    setFormPrintImageUrl('https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80');
    setFormTechnique('Silk Digital HD (DTG Kornit)');
    setFormStock({ PP: 5, P: 10, M: 15, G: 12, GG: 8, XGG: 4 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormName(prod.name);
    setFormSubtitle(prod.subtitle);
    setFormSku(prod.sku);
    setFormPrice(prod.price.toString());
    setFormCostPrice(prod.costPrice.toString());
    setFormCategory(prod.printDesign.category);
    setFormPrintTitle(prod.printDesign.title);
    setFormPrintImageUrl(prod.printDesign.imageUrl);
    setFormTechnique(prod.printDesign.technique);
    setFormStock({ ...prod.stockBySize });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice) || 89.90;
    const costNum = parseFloat(formCostPrice) || 32.00;

    const printDesignData: PrintDesign = {
      id: `print-${Date.now().toString().slice(-4)}`,
      title: formPrintTitle || formName,
      category: formCategory,
      imageUrl: formPrintImageUrl,
      mockupUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      technique: formTechnique,
      dimension: 'A3 (29,7 x 42 cm)',
      designer: 'KEISIDE Creative Lab',
      description: 'Estampa de alta resolução com acabamento profissional.',
    };

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formName,
        subtitle: formSubtitle,
        sku: formSku,
        price: priceNum,
        costPrice: costNum,
        printDesign: printDesignData,
        stockBySize: formStock,
      });
    } else {
      addProduct({
        sku: formSku,
        name: formName,
        subtitle: formSubtitle,
        price: priceNum,
        originalPrice: priceNum * 1.25,
        costPrice: costNum,
        printId: printDesignData.id,
        printDesign: printDesignData,
        colors: [SHIRT_COLORS[0], SHIRT_COLORS[1], SHIRT_COLORS[2]],
        sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
        stockBySize: formStock,
        description: 'Camiseta de alta qualidade confeccionada em 100% algodão penteado 30.1 com estampa em silk digital HD.',
        material: '100% Algodão Penteado 30.1 Premium (180g/m²)',
        tags: [formCategory, 'Streetwear'],
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tight uppercase">
            Gerenciamento de Produtos & Estampas
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cadastre novas camisetas estampadas, altere preços de venda e configure especificações.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#00E5FF] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center gap-1.5 transition-colors shadow-lg self-start"
        >
          <Plus className="w-3.5 h-3.5" /> Novo Produto
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, SKU ou categoria de estampa..."
            className="w-full bg-[#0c0c0c] border border-white/10 pl-9 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF]"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#0c0c0c] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#080808] text-zinc-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-4">Estampa / Produto</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Técnica</th>
                <th className="py-3 px-4 font-mono">Custo</th>
                <th className="py-3 px-4 font-mono">Preço Venda</th>
                <th className="py-3 px-4 font-mono">Margem</th>
                <th className="py-3 px-4 text-center">Estoque Total</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filtered.map((prod) => {
                const totalStock = (Object.values(prod.stockBySize) as number[]).reduce((a, b) => a + b, 0);
                const margin = ((prod.price - prod.costPrice) / prod.price) * 100;

                return (
                  <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.printDesign.imageUrl}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-14 object-cover border border-white/10 bg-black shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white uppercase tracking-wider text-xs">{prod.name}</div>
                          <div className="text-[10px] text-zinc-400">{prod.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400 text-xs">{prod.sku}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-black text-[#00E5FF] border border-[#00E5FF]/30 text-[9px] font-black uppercase tracking-wider font-mono">
                        {prod.printDesign.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[10px]">{prod.printDesign.technique}</td>
                    <td className="py-3 px-4 font-mono text-zinc-400">
                      R$ {prod.costPrice.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      R$ {prod.price.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#00E5FF] font-bold">
                      {margin.toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span className={`px-2 py-0.5 text-xs font-bold border ${totalStock <= 15 ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-black text-zinc-200 border-white/10'}`}>
                        {totalStock} un
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 bg-[#080808] hover:bg-white hover:text-black text-[#00E5FF] transition-colors border border-white/10"
                        title="Editar produto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja realmente excluir "${prod.name}"?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 bg-[#080808] hover:bg-red-500 hover:text-white text-red-400 transition-colors border border-white/10"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-white/20 shadow-2xl p-6 sm:p-8 space-y-5 my-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-black text-lg text-white italic tracking-tight uppercase">
                {editingProductId ? 'Editar Camiseta Estampada' : 'Cadastrar Nova Camiseta Estampada'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 bg-[#080808] hover:bg-white hover:text-black text-zinc-400 flex items-center justify-center border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-1">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#080808] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-1">Subtítulo / Linha</label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full bg-[#080808] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-1">Código SKU</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full bg-[#080808] border border-white/10 px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-1">Categoria de Estampa</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#080808] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
                  >
                    <option value="Cyberpunk">Cyberpunk</option>
                    <option value="Anime & Geek">Anime & Geek</option>
                    <option value="Minimalista">Minimalista</option>
                    <option value="Dark & Tattoo">Dark & Tattoo</option>
                    <option value="Retro & Vintage">Retro & Vintage</option>
                    <option value="Streetwear">Streetwear</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-1">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-[#080808] border border-white/10 px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-1">Preço de Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(e.target.value)}
                    className="w-full bg-[#080808] border border-white/10 px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-1">Técnica de Estamparia</label>
                <input
                  type="text"
                  value={formTechnique}
                  onChange={(e) => setFormTechnique(e.target.value)}
                  className="w-full bg-[#080808] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-1">URL da Imagem da Estampa</label>
                <input
                  type="url"
                  value={formPrintImageUrl}
                  onChange={(e) => setFormPrintImageUrl(e.target.value)}
                  className="w-full bg-[#080808] border border-white/10 px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {/* Stock breakdown per size */}
              <div>
                <label className="block text-zinc-300 font-bold uppercase text-[10px] tracking-wider mb-2">Grade de Estoque Inicial por Tamanho</label>
                <div className="grid grid-cols-6 gap-2">
                  {(['PP', 'P', 'M', 'G', 'GG', 'XGG'] as ShirtSize[]).map((size) => (
                    <div key={size} className="p-2 bg-[#080808] border border-white/10 text-center">
                      <span className="block font-bold text-zinc-300 mb-1 font-mono text-[10px]">{size}</span>
                      <input
                        type="number"
                        min="0"
                        value={formStock[size] || 0}
                        onChange={(e) =>
                          setFormStock({
                            ...formStock,
                            [size]: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full text-center bg-black border border-white/10 py-1 font-mono text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-[#080808] text-zinc-300 font-bold uppercase text-[10px] tracking-wider hover:bg-white hover:text-black border border-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#00E5FF] hover:bg-white text-black font-black uppercase text-[10px] tracking-widest transition-colors shadow-lg"
                >
                  {editingProductId ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
