import React, { useState, useMemo } from 'react';
import { Product, ShirtSize, ProductReview } from '../types';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  ShieldCheck, 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  Sparkles,
  Filter,
  UserCheck
} from 'lucide-react';

interface ProductReviewsSectionProps {
  product: Product;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const { reviews, addProductReview, likeProductReview } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'ALL'>('ALL');

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [sizePurchased, setSizePurchased] = useState<ShirtSize>(product.sizes[0] || 'M');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filtered reviews for this specific product
  const productReviews = useMemo(() => {
    return reviews.filter((r) => r.productId === product.id);
  }, [reviews, product.id]);

  // Rating Stats Calculation
  const stats = useMemo(() => {
    if (productReviews.length === 0) {
      return {
        average: product.averageRating || 5.0,
        total: product.reviewsCount || 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recommendPercent: 98,
      };
    }

    const total = productReviews.length;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    const average = Number((sum / total).toFixed(1));

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    const positiveCount = (distribution[5] || 0) + (distribution[4] || 0);
    const recommendPercent = total > 0 ? Math.round((positiveCount / total) * 100) : 98;

    return {
      average,
      total,
      distribution,
      recommendPercent,
    };
  }, [productReviews, product.averageRating, product.reviewsCount]);

  const displayedReviews = useMemo(() => {
    if (selectedRatingFilter === 'ALL') return productReviews;
    return productReviews.filter((r) => r.rating === selectedRatingFilter);
  }, [productReviews, selectedRatingFilter]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    addProductReview({
      productId: product.id,
      authorName: authorName.trim(),
      rating,
      title: title.trim() || undefined,
      comment: comment.trim(),
      sizePurchased,
      verifiedPurchase: true,
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setAuthorName('');
      setTitle('');
      setComment('');
      setRating(5);
      setShowForm(false);
      setFormSubmitted(false);
    }, 1500);
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5: return 'Excelente / Perfeito ★★★★★';
      case 4: return 'Muito Bom ★★★★☆';
      case 3: return 'Bom ★★★☆☆';
      case 2: return 'Regular ★★☆☆☆';
      case 1: return 'Insatisfeito ★☆☆☆☆';
      default: return '';
    }
  };

  return (
    <div className="pt-8 border-t border-white/10 space-y-6">
      {/* Header & Overall Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-[#00E5FF] fill-[#00E5FF]" />
              Avaliações & Opiniões de Clientes
            </h3>
            <span className="px-2 py-0.5 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-[10px] font-mono font-bold">
              {stats.total} feedback(s)
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Opiniões reais de quem já comprou e testou o caimento e a estamparia
          </p>
        </div>

        {/* Action Button to Open Form */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-white hover:bg-[#00E5FF] text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-colors self-start sm:self-auto shadow-md"
        >
          <MessageSquare className="w-4 h-4" />
          {showForm ? 'Fechar Formulário' : 'Avaliar este Produto'}
        </motion.button>
      </div>

      {/* Ratings Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#080808] border border-white/10 p-6">
        {/* Overall Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-white/10">
          <div className="text-5xl font-black text-[#00E5FF] font-mono tracking-tight">
            {stats.average.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(stats.average)
                    ? 'text-[#00E5FF] fill-[#00E5FF]'
                    : 'text-zinc-700'
                }`}
              />
            ))}
          </div>
          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            {stats.total} avaliações verificadas
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            {stats.recommendPercent}% dos compradores recomendam
          </div>
        </div>

        {/* Distribution Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map((starVal) => {
            const count = stats.distribution[starVal] || 0;
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : starVal === 5 ? 85 : starVal === 4 ? 15 : 0;
            const isSelected = selectedRatingFilter === starVal;

            return (
              <button
                key={starVal}
                onClick={() => setSelectedRatingFilter(isSelected ? 'ALL' : starVal)}
                className={`flex items-center gap-3 text-xs w-full group py-1 px-2 transition-colors ${
                  isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-1 w-14 font-mono font-bold text-zinc-400 group-hover:text-white">
                  {starVal} <Star className="w-3 h-3 text-[#00E5FF] fill-[#00E5FF]" />
                </span>

                <div className="flex-1 h-2 bg-zinc-800 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full bg-[#00E5FF]"
                  />
                </div>

                <span className="w-10 text-right font-mono text-zinc-500 text-[11px] group-hover:text-zinc-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Write a Review Collapsible Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden bg-[#0c0c0c] border border-[#00E5FF]/40 p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                <h4 className="text-sm font-black uppercase tracking-wider text-white">
                  Escrever Avaliação para {product.name}
                </h4>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                Avaliação Pública e Verificada
              </span>
            </div>

            {formSubmitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-8 text-center space-y-2 bg-[#080808] border border-emerald-500/30"
              >
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <h5 className="text-base font-bold text-white">Obrigado pela sua avaliação!</h5>
                <p className="text-xs text-zinc-400">
                  Seu depoimento foi publicado e ajudará outros clientes na escolha do tamanho e modelo.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Sua Nota Geral: <span className="text-[#00E5FF]">{getRatingLabel(hoverRating || rating)}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <motion.button
                        key={val}
                        type="button"
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(val)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(val)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            val <= (hoverRating || rating)
                              ? 'text-[#00E5FF] fill-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]'
                              : 'text-zinc-700'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Seu Nome ou Apelido *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Ex: Lucas M. ou Carol Silva"
                      className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  {/* Size Purchased */}
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Tamanho Comprado / Testado
                    </label>
                    <select
                      value={sizePurchased}
                      onChange={(e) => setSizePurchased(e.target.value as ShirtSize)}
                      className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                    >
                      {product.sizes.map((s) => (
                        <option key={s} value={s}>
                          Tamanho {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Título do Comentário (Opcional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Caimento perfeito e estampa ultra nítida"
                    className="w-full bg-[#080808] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                {/* Detailed Comment */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Seu Depoimento sobre o Produto *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Fale sobre a maciez do algodão, fidelidade de cores da estampa, peso da malha ou dicas de caimento para outros clientes..."
                    className="w-full bg-[#080808] border border-white/10 p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-white/10 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2.5 bg-[#00E5FF] hover:bg-white text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Publicar Avaliação
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Chips if filter active */}
      {selectedRatingFilter !== 'ALL' && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400">Filtrando por:</span>
          <span className="px-2 py-1 bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 text-[11px] font-mono flex items-center gap-1.5 font-bold">
            {selectedRatingFilter} estrelas
            <button
              onClick={() => setSelectedRatingFilter('ALL')}
              className="hover:text-white ml-1 font-bold"
            >
              ✕
            </button>
          </span>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.length === 0 ? (
          <div className="p-8 text-center bg-[#080808] border border-white/10 text-zinc-400 space-y-2">
            <Star className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs">Nenhuma avaliação encontrada com o filtro selecionado.</p>
            <button
              onClick={() => setSelectedRatingFilter('ALL')}
              className="text-[#00E5FF] text-xs font-bold uppercase hover:underline"
            >
              Ver todas as avaliações
            </button>
          </div>
        ) : (
          displayedReviews.map((rev) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-[#080808] border border-white/10 hover:border-white/20 transition-colors space-y-3"
            >
              {/* Review Header: User info, Stars, Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {/* Avatar circle */}
                  <div className="w-8 h-8 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-bold font-mono text-xs flex items-center justify-center">
                    {rev.authorName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rev.authorName}</span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                          <ShieldCheck className="w-3 h-3" /> Compra Verificada
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-500 font-mono">
                      <span>Tamanho: <strong className="text-zinc-300 font-sans">{rev.sizePurchased}</strong></span>
                      <span>•</span>
                      <span>{rev.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Stars Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <Star
                      key={st}
                      className={`w-3.5 h-3.5 ${
                        st <= rev.rating
                          ? 'text-[#00E5FF] fill-[#00E5FF]'
                          : 'text-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Title & Comment Text */}
              <div className="space-y-1">
                {rev.title && (
                  <h5 className="text-xs font-bold text-zinc-200">
                    "{rev.title}"
                  </h5>
                )}
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Helpful Button / Like */}
              <div className="flex items-center justify-end pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => likeProductReview(rev.id)}
                  className="inline-flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-[#00E5FF] transition-colors py-1 px-2 rounded hover:bg-white/5"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Útil ({rev.likesCount || 0})</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
