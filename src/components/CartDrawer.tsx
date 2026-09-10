import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  Truck, 
  Flame,
  Check
} from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    cartDiscount, 
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    products,
    addToCart
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  // Free shipping threshold = R$ 199
  const freeShippingThreshold = 199;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  // Upsell suggestion for cart: suggest a product not already in cart
  const suggestedUpsell = useMemo(() => {
    const inCartIds = new Set(cart.map((item) => item.product.id));
    return products.find((p) => !inCartIds.has(p.id)) || products[0];
  }, [products, cart]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const result = applyCoupon(couponCode);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponError('');
      setCouponCode('');
    }
  };

  const handleAddUpsell = (product: Product) => {
    const availableSize = product.sizes.find((s) => (product.stockBySize[s] || 0) > 0) || 'M';
    addToCart(product, availableSize, product.colors[0], 1, true);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0c0c0c] border-l border-white/10 flex flex-col shadow-2xl animate-slideLeft">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-[#00E5FF]" />
              <h2 className="font-black text-base uppercase tracking-widest text-white">
                Seu Carrinho
              </h2>
              <span className="text-[10px] px-2 py-0.5 bg-white/5 text-[#00E5FF] font-mono font-bold border border-white/10">
                {cart.reduce((s, i) => s + i.quantity, 0)} ITENS
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 bg-[#080808] hover:bg-white hover:text-black text-zinc-400 flex items-center justify-center transition-colors border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-5 py-3 bg-[#080808] border-b border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-zinc-300 font-medium text-[10px] uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5 text-[#00E5FF]" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-[#00E5FF] font-bold">Parabéns! Frete Grátis Liberado! ⚡</span>
                ) : (
                  <span>
                    Faltam <b className="text-[#00E5FF] font-mono">R$ {remainingForFreeShipping.toFixed(2).replace('.', ',')}</b> p/ Frete Grátis
                  </span>
                )}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="w-full h-1 bg-zinc-900 overflow-hidden">
              <div
                className="h-full bg-[#00E5FF] transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-[#080808] border border-white/10 flex items-center justify-center text-zinc-600 mb-4">
                  <ShoppingBag className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">Seu carrinho está vazio</h3>
                <p className="text-xs text-zinc-500 max-w-xs mt-1">
                  Explore nosso catálogo com estampas autorais em Silk Digital HD e monte seu estilo!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-3 bg-white hover:bg-[#00E5FF] text-black font-black uppercase text-[10px] tracking-widest transition-colors"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#080808] border border-white/10 flex gap-3 relative group hover:border-white/20 transition-all"
                    >
                      <img
                        src={item.product.printDesign.imageUrl}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-24 object-cover bg-black border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-bold text-xs text-white uppercase tracking-wider line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                              title="Remover item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5 font-mono">
                            <span className="px-1.5 py-0.5 bg-black border border-white/10 text-zinc-200">
                              TAM: {item.size}
                            </span>
                            <span className="truncate uppercase">{item.color.name}</span>
                          </div>
                          {item.isUpsellItem && (
                            <span className="inline-block mt-1 text-[9px] font-black text-black bg-[#00E5FF] px-1.5 py-0.5 uppercase tracking-wider">
                              Oferta Upsell 15% OFF
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-black border border-white/10 p-0.5">
                            <button
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-mono font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right font-mono">
                            <div className="text-xs font-bold text-[#00E5FF]">
                              R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-[10px] text-zinc-500">
                                R$ {item.unitPrice.toFixed(2).replace('.', ',')} un
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upsell Opportunity in Cart (Briefing Section 7) */}
                {suggestedUpsell && (
                  <div className="p-3.5 bg-[#080808] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-[#00E5FF] uppercase tracking-widest">
                        <Flame className="w-3 h-3 text-[#00E5FF]" />
                        Combo Upsell (15% OFF)
                      </span>
                      <span className="text-[9px] bg-white text-black font-black px-1.5 py-0.5 uppercase">
                        Drop Extra
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={suggestedUpsell.printDesign.imageUrl}
                        alt={suggestedUpsell.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover border border-white/10 bg-black"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-[11px] font-bold text-white uppercase tracking-wider truncate">
                          {suggestedUpsell.name}
                        </h5>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#00E5FF]">
                          <span>R$ {(suggestedUpsell.price * 0.85).toFixed(2).replace('.', ',')}</span>
                          <span className="text-[10px] text-zinc-500 line-through">
                            R$ {suggestedUpsell.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddUpsell(suggestedUpsell)}
                        className="px-2.5 py-1.5 bg-[#00E5FF] hover:bg-white text-black font-black text-[10px] uppercase tracking-wider transition-colors shrink-0"
                      >
                        + Levar
                      </button>
                    </div>
                  </div>
                )}

                {/* Coupon Input */}
                <div className="pt-2">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-black border border-[#00E5FF]/40 text-xs text-[#00E5FF]">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5" />
                        <span className="uppercase text-[10px] font-bold tracking-wider">Cupom <b className="font-mono">{appliedCoupon}</b> aplicado!</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-zinc-500 hover:text-red-400 text-[10px] uppercase tracking-wider font-bold"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Cupom (ex: KEISIDE10)"
                          className="flex-1 bg-[#080808] border border-white/10 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF] uppercase font-mono"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-2 bg-white text-black hover:bg-[#00E5FF] text-[10px] font-black uppercase tracking-wider transition-colors"
                        >
                          Aplicar
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[10px] text-red-400 pl-1">{couponError}</p>
                      )}
                    </form>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#080808] border-t border-white/10 space-y-3">
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span className="text-[11px] uppercase tracking-wider">Subtotal:</span>
                  <span className="font-mono text-zinc-200">
                    R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#00E5FF] font-medium">
                    <span className="text-[11px] uppercase tracking-wider">Desconto Aplicado:</span>
                    <span className="font-mono">
                      - R$ {cartDiscount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[11px] uppercase tracking-wider">Frete:</span>
                  <span className="font-mono text-zinc-200">
                    {cartSubtotal >= freeShippingThreshold ? (
                      <span className="text-[#00E5FF] font-bold">GRÁTIS</span>
                    ) : (
                      'Calculado no checkout'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                  <span className="uppercase tracking-wider">Total Estimado:</span>
                  <span className="font-mono text-[#00E5FF]">
                    R$ {cartTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-6 bg-[#00E5FF] hover:bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Avançar para o Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-[10px] text-zinc-500 flex items-center justify-center gap-1 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#00E5FF]" />
                  Ambiente Seguro // NF-e Automática
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
