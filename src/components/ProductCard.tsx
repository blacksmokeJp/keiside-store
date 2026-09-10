import React, { useState, useRef, useCallback } from 'react';
import { Product, ShirtSize } from '../types';
import { useStore } from '../context/StoreContext';
import { DEFAULT_PRINT_PLACEMENTS, getApparelPlacements } from '../data/mockData';
import { Eye, ShoppingCart, Sparkles, Layers, Check, Star, MapPin, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, getProductRating } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ShirtSize>(product.sizes[0] || 'M');
  const [justAdded, setJustAdded] = useState(false);
  const [hoveredZoneName, setHoveredZoneName] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const imageContainerRef = useRef<HTMLDivElement>(null);

  const ratingData = getProductRating(product.id);
  const placements = (product.printDesign.availablePlacements || getApparelPlacements(product.apparelType)).filter(
    (z) => z.angle === 'front'
  );

  // Total stock across sizes
  const stockNumbers = Object.values(product.stockBySize) as number[];
  const totalStock = stockNumbers.reduce((a, b) => a + b, 0);
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 10;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  }, []);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const available = product.stockBySize[selectedSize] || 0;
    if (available === 0) {
      // Find first available size
      const firstAvailable = product.sizes.find((s) => (product.stockBySize[s] || 0) > 0);
      if (firstAvailable) {
        setSelectedSize(firstAvailable);
        addToCart(product, firstAvailable, product.colors[0], 1);
      }
    } else {
      addToCart(product, selectedSize, product.colors[0], 1);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.div
      onClick={() => setSelectedProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredZoneName(null);
      }}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 22 } }}
      className="group relative bg-[#0c0c0c] border border-white/10 overflow-hidden hover:border-[#00E5FF]/80 transition-colors duration-300 flex flex-col cursor-pointer shadow-2xl"
    >
      {/* Product Image Stage with Zoom & Print Placements */}
      <div 
        ref={imageContainerRef}
        onMouseMove={handleMouseMove}
        className="relative aspect-[3/4] bg-[#080808] overflow-hidden select-none"
      >
        {/* Main Mockup Image with Dynamic Zoom on Mouse Hover */}
        <motion.img
          src={product.printDesign.mockupUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          style={{
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transform: isHovered ? 'scale(1.45)' : 'scale(1)',
            transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.3s ease-out',
          }}
          className="w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Interactive Print Placement Zones (Visible on Hover) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {placements.map((zone) => {
                const isZoneTargeted = hoveredZoneName === zone.name;
                return (
                  <div
                    key={zone.id}
                    style={{
                      top: zone.coordinates.top,
                      left: zone.coordinates.left,
                      width: zone.coordinates.width,
                      height: zone.coordinates.height,
                    }}
                    className={`absolute border transition-all duration-200 pointer-events-auto ${
                      isZoneTargeted
                        ? 'border-[#00E5FF] bg-[#00E5FF]/30 shadow-[0_0_12px_rgba(0,229,255,0.6)]'
                        : 'border-dashed border-[#00E5FF]/70 bg-[#00E5FF]/10'
                    }`}
                    onMouseEnter={() => setHoveredZoneName(zone.name)}
                    onMouseLeave={() => setHoveredZoneName(null)}
                  >
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-1 py-0.2 bg-black/90 text-[#00E5FF] border border-[#00E5FF]/40 text-[7px] font-mono font-bold whitespace-nowrap">
                      {zone.name.split(' (')[0]}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Print Design Art Overlay Badge (shows technique and art detail) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestSeller && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-2 py-0.5 bg-[#00E5FF] text-black text-[9px] font-black uppercase tracking-widest shadow-md"
            >
              Best Seller
            </motion.span>
          )}
          {product.isNew && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-2 py-0.5 bg-white text-black text-[9px] font-black uppercase tracking-widest"
            >
              Drop 2026
            </motion.span>
          )}
          {isLowStock && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider"
            >
              Poucas Peças
            </motion.span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3 z-10">
          <motion.span 
            whileHover={{ scale: 1.12, y: -1 }}
            className="inline-block px-2 py-0.5 bg-black/80 backdrop-blur-md text-zinc-300 border border-white/10 text-[9px] font-bold uppercase tracking-wider"
          >
            {product.printDesign.category}
          </motion.span>
        </div>

        {/* Hover Zoom & Placement Active Indicator */}
        {isHovered && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 bg-black/90 border border-[#00E5FF]/40 text-[8px] font-mono text-[#00E5FF] backdrop-blur-sm z-10 pointer-events-none">
            <span className="flex items-center gap-1 font-bold">
              <ZoomIn className="w-2.5 h-2.5" /> Zoom Ativo
            </span>
            <span className="text-zinc-300 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-[#00E5FF]" /> Zonas de Estampa
            </span>
          </div>
        )}

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-1.5 z-20">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-full py-2 text-[10px] font-black uppercase tracking-tight transition-colors flex items-center justify-center gap-1.5 shadow-lg ${
              justAdded
                ? 'bg-emerald-400 text-black'
                : isOutOfStock
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-[#00E5FF] hover:bg-white text-black'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Adicionado
              </>
            ) : isOutOfStock ? (
              'Esgotado'
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Adicionar • {selectedSize}
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#0c0c0c]">
        <div>
          {/* Print Technique & Rating */}
          <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1 uppercase tracking-wider">
            <span className="flex items-center gap-1 text-zinc-400 font-mono">
              <Layers className="w-3 h-3 text-[#00E5FF]" />
              {product.printDesign.technique}
            </span>

            {/* Stars Rating Score */}
            <div className="flex items-center gap-1 text-[#00E5FF]">
              <Star className="w-3 h-3 fill-[#00E5FF]" />
              <span className="font-mono font-bold text-white text-[10px]">
                {ratingData.average.toFixed(1)}
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">
                ({ratingData.total})
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-xs uppercase tracking-widest font-bold text-white group-hover:text-[#00E5FF] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-[10px] text-zinc-500 italic line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Sizes preview & stock indicator */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mr-1">Grade:</span>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((size) => {
              const inStock = (product.stockBySize[size] || 0) > 0;
              const isSelected = selectedSize === size;
              return (
                <motion.button
                  key={size}
                  type="button"
                  disabled={!inStock}
                  whileHover={inStock ? { scale: 1.25, y: -2, transition: { type: 'spring', stiffness: 500, damping: 15 } } : {}}
                  whileTap={inStock ? { scale: 0.9 } : {}}
                  onClick={() => setSelectedSize(size)}
                  className={`w-6 h-6 text-[9px] font-mono font-bold transition-colors flex items-center justify-center border ${
                    !inStock
                      ? 'bg-black text-zinc-700 border-zinc-800 line-through cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#00E5FF] text-black font-black border-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                      : 'bg-[#080808] text-zinc-300 hover:text-white border-white/10 hover:border-white/40'
                  }`}
                  title={inStock ? `${product.stockBySize[size]} disponíveis` : 'Esgotado'}
                >
                  {size}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Price & Cotton Info */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-[#00E5FF] font-mono">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] text-zinc-500 line-through font-mono">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-tight">
              3x R$ {(product.price / 3).toFixed(2).replace('.', ',')} s/ juros
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 uppercase tracking-widest font-medium">
              <Sparkles className="w-2.5 h-2.5 text-[#00E5FF]" />
              100% Algodão
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

