import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShirtSize, ShirtColor, Product } from '../types';
import { SIZE_CHART, getApparelSizeChart } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { ProductImageZoomViewer } from './ProductImageZoomViewer';
import { ProductReviewsSection } from './ProductReviewsSection';
import { 
  X, 
  ShoppingCart, 
  Check, 
  Sparkles, 
  Ruler, 
  Truck, 
  ShieldCheck, 
  Layers, 
  Tag, 
  Plus, 
  Minus,
  Flame,
  Star
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, products, getProductRating } = useStore();

  const [activeTab, setActiveTab] = useState<'mockup' | 'artwork' | 'placement' | 'fabric'>('mockup');
  const [selectedColor, setSelectedColor] = useState<ShirtColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ShirtSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [cepInput, setCepInput] = useState('');
  const [shippingResult, setShippingResult] = useState<{ pac: string; sedex: string; prazo: string } | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Synchronize state when selectedProduct changes
  React.useEffect(() => {
    if (selectedProduct) {
      setActiveTab('mockup');
      setSelectedColor(selectedProduct.colors[0]);
      const defaultSize = selectedProduct.sizes.find((s) => (selectedProduct.stockBySize[s] || 0) > 0) || 'M';
      setSelectedSize(defaultSize);
      setQuantity(1);
      setShowSizeGuide(false);
      setShippingResult(null);
    }
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const currentColor = selectedColor || selectedProduct.colors[0];
  const currentSize = selectedSize || selectedProduct.sizes[0] || 'M';

  // Product rating stats
  const ratingData = getProductRating(selectedProduct.id);

  // Available stock for currently selected size
  const stockForSelectedSize = selectedProduct.stockBySize[currentSize] || 0;
  const isOutOfStock = stockForSelectedSize === 0;

  // Upsell Recommendation: find a related t-shirt for combo discount
  const upsellProduct = products.find(
    (p) => p.id !== selectedProduct.id && p.printDesign.category === selectedProduct.printDesign.category
  ) || products.find((p) => p.id !== selectedProduct.id);

  const handleSimulateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cepInput.replace(/\D/g, '').length >= 8) {
      setShippingResult({
        pac: selectedProduct.price >= 199 ? 'GRÁTIS' : 'R$ 14,90',
        sedex: 'R$ 24,90',
        prazo: '3 a 6 dias úteis',
      });
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    addToCart(selectedProduct, currentSize, currentColor, quantity);
    setTimeout(() => {
      setIsAdding(false);
      setSelectedProduct(null);
    }, 500);
  };

  const handleAddUpsell = (productToUpsell: Product) => {
    const availableSize = productToUpsell.sizes.find((s) => (productToUpsell.stockBySize[s] || 0) > 0) || 'M';
    addToCart(productToUpsell, availableSize, productToUpsell.colors[0], 1, true);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8"
        onClick={() => setSelectedProduct(null)}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 18 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#0c0c0c] border border-white/10 shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Sticky Header with Close Button */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-[#080808] z-20">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#00E5FF] font-mono uppercase tracking-widest font-bold">
                Kornit DTG HD Studio // {selectedProduct.printDesign.category}
              </span>
              <span className="hidden sm:inline text-zinc-600">•</span>
              <span className="hidden sm:inline text-zinc-400 text-xs font-bold uppercase truncate max-w-xs">
                {selectedProduct.name}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedProduct(null)}
              className="w-8 h-8 bg-white/5 hover:bg-[#00E5FF] hover:text-black text-zinc-300 flex items-center justify-center border border-white/10 transition-colors focus:outline-none"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Interactive Image Zoom & Placement Map */}
              <div className="lg:col-span-6">
                <ProductImageZoomViewer
                  product={selectedProduct}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>

              {/* Right Column: Product Config & Buy Actions */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 text-[10px] text-[#00E5FF] font-mono uppercase tracking-wider">
                      <span>SKU: {selectedProduct.sku}</span>
                      <span>•</span>
                      <span>{selectedProduct.printDesign.technique}</span>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1 bg-[#080808] px-2 py-0.5 border border-white/10 text-xs">
                      <Star className="w-3.5 h-3.5 text-[#00E5FF] fill-[#00E5FF]" />
                      <span className="font-mono font-bold text-white">{ratingData.average.toFixed(1)}</span>
                      <span className="text-[10px] text-zinc-500">({ratingData.total})</span>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white italic tracking-tight uppercase">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    {selectedProduct.subtitle}
                  </p>
                </div>

                {/* Pricing block */}
                <div className="p-4 bg-[#080808] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-extrabold text-[#00E5FF] font-mono">
                        R$ {selectedProduct.price.toFixed(2).replace('.', ',')}
                      </span>
                      {selectedProduct.originalPrice && (
                        <span className="text-xs text-zinc-500 line-through font-mono">
                          R$ {selectedProduct.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-tight mt-0.5">
                      ou 3x de R$ {(selectedProduct.price / 3).toFixed(2).replace('.', ',')} sem juros no cartão
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 bg-white/5 text-[#00E5FF] border border-[#00E5FF]/20 text-[10px] font-bold uppercase tracking-wider">
                      5% OFF no PIX
                    </span>
                  </div>
                </div>

                {/* Color selection with Wave Hover */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-2">
                    Cor da Camiseta: <span className="text-[#00E5FF]">{currentColor.name}</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    {selectedProduct.colors.map((color) => {
                      const isSelected = currentColor.id === color.id;
                      return (
                        <motion.button
                          key={color.id}
                          type="button"
                          whileHover={{ scale: 1.1, y: -2, transition: { type: 'spring', stiffness: 500, damping: 16 } }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setSelectedColor(color)}
                          className={`flex items-center gap-2 px-3.5 py-2 text-xs uppercase tracking-wider border transition-colors ${
                            isSelected
                              ? 'border-[#00E5FF] bg-black text-white shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                              : 'border-white/10 bg-[#080808] text-zinc-400 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 border border-zinc-700"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Size selection with live stock count & Wave Hover */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                      Tamanho: <span className="text-[#00E5FF]">{currentSize}</span>
                      {stockForSelectedSize > 0 ? (
                        <span className="text-zinc-500 text-[10px] font-normal ml-2 font-mono">
                          ({stockForSelectedSize} disponíveis)
                        </span>
                      ) : (
                        <span className="text-red-400 text-[10px] font-normal ml-2">
                          (Esgotado)
                        </span>
                      )}
                    </label>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-[10px] text-[#00E5FF] hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
                    >
                      <Ruler className="w-3 h-3" />
                      Tabela de Medidas
                    </motion.button>
                  </div>

                  <div className={`grid gap-2 ${selectedProduct.sizes.length <= 2 ? 'grid-cols-2' : selectedProduct.sizes.length <= 4 ? 'grid-cols-4' : 'grid-cols-3 sm:grid-cols-6'}`}>
                    {selectedProduct.sizes.map((size) => {
                      const stock = selectedProduct.stockBySize[size] || 0;
                      const inStock = stock > 0;
                      const isSelected = currentSize === size;
                      return (
                        <motion.button
                          key={size}
                          type="button"
                          disabled={!inStock}
                          whileHover={inStock ? { scale: 1.08, y: -2, transition: { type: 'spring', stiffness: 500, damping: 15 } } : {}}
                          whileTap={inStock ? { scale: 0.94 } : {}}
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 px-1 text-xs font-mono font-bold flex flex-col items-center justify-center gap-0.5 border transition-colors ${
                            !inStock
                              ? 'border-zinc-800 bg-black text-zinc-700 line-through opacity-40 cursor-not-allowed'
                              : isSelected
                              ? 'border-[#00E5FF] bg-[#00E5FF] text-black font-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                              : 'border-white/10 bg-[#080808] text-zinc-200 hover:border-white/40'
                          }`}
                        >
                          <span className="text-xs">{size}</span>
                          <span className={`text-[8px] ${isSelected ? 'text-black font-bold' : 'text-zinc-500'}`}>
                            {inStock ? `${stock}un` : '0'}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Size guide table collapsible */}
                  <AnimatePresence>
                    {showSizeGuide && (() => {
                      const chart = getApparelSizeChart(selectedProduct.apparelType);
                      return (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, y: -8 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -8 }}
                          className="mt-3 p-4 bg-[#080808] border border-white/10 text-xs overflow-hidden"
                        >
                          <div className="font-bold text-white mb-2 flex items-center gap-1.5 uppercase text-[10px] tracking-wider text-[#00E5FF]">
                            <Ruler className="w-3.5 h-3.5" />
                            Tabela de Medidas // {selectedProduct.name}
                          </div>
                          <table className="w-full text-center text-zinc-300 text-[11px]">
                            <thead>
                              <tr className="border-b border-white/10 text-zinc-500 font-semibold uppercase tracking-wider text-[9px]">
                                {chart.columns.map((col, i) => (
                                  <th key={i} className="py-1.5">{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono">
                              {chart.data.map((row: any, idx: number) => {
                                const isHighlighted = currentSize === row.size;
                                return (
                                  <tr key={idx} className={isHighlighted ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-bold' : ''}>
                                    <td className="py-1.5 font-sans font-bold">{row.size}</td>
                                    {chart.type === 'tshirt' && (
                                      <>
                                        <td className="py-1.5">{row.width} cm</td>
                                        <td className="py-1.5">{row.height} cm</td>
                                        <td className="py-1.5">{row.sleeve} cm</td>
                                      </>
                                    )}
                                    {chart.type === 'hoodie' && (
                                      <>
                                        <td className="py-1.5">{row.width} cm</td>
                                        <td className="py-1.5">{row.height} cm</td>
                                        <td className="py-1.5">{row.sleeve} cm</td>
                                      </>
                                    )}
                                    {chart.type === 'pants' && (
                                      <>
                                        <td className="py-1.5">{row.waist} cm</td>
                                        <td className="py-1.5">{row.hip} cm</td>
                                        <td className="py-1.5">{row.length} cm</td>
                                      </>
                                    )}
                                    {chart.type === 'beanie' && (
                                      <>
                                        <td className="py-1.5">{row.circum}</td>
                                        <td className="py-1.5">{row.height} cm</td>
                                        <td className="py-1.5">{row.cuff}</td>
                                      </>
                                    )}
                                    {chart.type === 'socks' && (
                                      <>
                                        <td className="py-1.5">{row.shoes}</td>
                                        <td className="py-1.5">{row.height} cm</td>
                                        <td className="py-1.5">{row.stretch}</td>
                                      </>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>

                {/* Quantity and Add to Cart Action */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#080808] border border-white/10 p-1">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </motion.button>
                    <span className="w-10 text-center font-mono font-bold text-xs text-white">
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      type="button"
                      disabled={quantity >= stockForSelectedSize}
                      onClick={() => setQuantity((q) => Math.min(stockForSelectedSize, q + 1))}
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    disabled={isOutOfStock || isAdding}
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
                      isOutOfStock
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-[#00E5FF] hover:bg-white text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    }`}
                  >
                    {isOutOfStock ? (
                      'Esgotado'
                    ) : isAdding ? (
                      <>
                        <Check className="w-4 h-4" /> Adicionando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> Adicionar • R$ {(selectedProduct.price * quantity).toFixed(2).replace('.', ',')}
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Smart Upsell Banner */}
                {upsellProduct && (
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="p-4 bg-[#080808] border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#00E5FF] uppercase tracking-widest">
                        <Flame className="w-3.5 h-3.5 text-[#00E5FF]" />
                        Combo Recomendado (15% OFF)
                      </span>
                      <span className="text-[9px] bg-[#00E5FF] text-black font-black px-1.5 py-0.5 uppercase">
                        Upsell
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={upsellProduct.printDesign.imageUrl}
                        alt={upsellProduct.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover border border-white/10 bg-[#080808]"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-[11px] font-bold text-white uppercase tracking-wider truncate">
                          {upsellProduct.name}
                        </h5>
                        <div className="flex items-center gap-2 mt-0.5 font-mono">
                          <span className="text-xs font-bold text-[#00E5FF]">
                            R$ {(upsellProduct.price * 0.85).toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-[10px] text-zinc-500 line-through">
                            R$ {upsellProduct.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        type="button"
                        onClick={() => handleAddUpsell(upsellProduct)}
                        className="px-3 py-2 bg-white hover:bg-[#00E5FF] text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors"
                      >
                        Adicionar +
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Shipping Simulator */}
                <div className="pt-4 border-t border-white/5">
                  <form onSubmit={handleSimulateShipping} className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                        <Truck className="w-3.5 h-3.5 text-[#00E5FF]" /> Calcular Frete e Prazo
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">Ex: 01310-100</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cepInput}
                        onChange={(e) => setCepInput(e.target.value)}
                        placeholder="Digite seu CEP"
                        maxLength={9}
                        className="flex-1 bg-[#080808] border border-white/10 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF]"
                      />
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-4 py-2 bg-white text-black hover:bg-[#00E5FF] text-[10px] font-black uppercase tracking-wider transition-colors"
                      >
                        Calcular
                      </motion.button>
                    </div>
                  </form>

                  <AnimatePresence>
                    {shippingResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="mt-3 p-3 bg-[#080808] border border-white/10 text-xs space-y-1.5"
                      >
                        <div className="flex justify-between text-zinc-300">
                          <span className="text-[11px]">PAC dos Correios ({shippingResult.prazo}):</span>
                          <span className="font-bold text-[#00E5FF] font-mono">{shippingResult.pac}</span>
                        </div>
                        <div className="flex justify-between text-zinc-300">
                          <span className="text-[11px]">Sedex Expresso (1 a 3 dias):</span>
                          <span className="font-bold text-white font-mono">{shippingResult.sedex}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Customer Reviews & Ratings Section */}
            <ProductReviewsSection product={selectedProduct} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


