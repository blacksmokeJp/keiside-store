import React from 'react';
import { Sparkles, Truck, ShieldCheck, Tag, ArrowRight } from 'lucide-react';

export const BannerPromo: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-[#0c0c0c] border-b border-white/5 py-8 px-4 sm:px-6 lg:px-8 mb-8">
      {/* Streetwear National Marquee Ticker */}
      <div className="overflow-hidden whitespace-nowrap border-b border-white/10 pb-4 mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="inline-flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400 font-mono animate-pulse">
          <span className="text-[#00E5FF]">KEISIDE ®</span>
          <span>STREETWEAR NACIONAL</span>
          <span>•</span>
          <span>HEAVYWEIGHT COTTON 260 GSM</span>
          <span>•</span>
          <span>SILK DIGITAL HD (KORNIT DTG)</span>
          <span>•</span>
          <span>MODELAGEM OVERSIZED BOX FIT</span>
          <span>•</span>
          <span className="text-[#00E5FF]">DROP 2026 EXCLUSIVO</span>
          <span>•</span>
          <span>ENVIOS PARA TODO BRASIL</span>
          <span>•</span>
          <span className="text-[#00E5FF]">KEISIDE ®</span>
          <span>STREETWEAR NACIONAL</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Headline - SHUI Streetwear aesthetic with text-left */}
        <div className="lg:col-span-7 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black border border-white/10 text-[10px] uppercase tracking-[0.3em] text-[#00E5FF] font-black font-mono">
            <span>KEISIDE ®</span>
            <span className="text-zinc-600">/</span>
            <span className="text-white">STREETWEAR NACIONAL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tighter italic text-white text-left uppercase">
            STREETWEAR<br />
            <span className="text-[#00E5FF]">NACIONAL</span> ®<br />
            <span className="text-zinc-500 text-2xl sm:text-4xl">ESSENTIALS // 2026</span>
          </h1>

          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg text-left">
            Camisetas em malha pesada 100% algodão penteado com modelagem oversized, ribana canelada estruturada e estampas autorais em Silk Digital HD de alta definição que não racham.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#catalogo"
              className="px-8 py-3.5 bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-[#00E5FF] transition-colors inline-flex items-center gap-2 group"
            >
              Explorar Drop
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="h-10 border border-white/10 px-4 flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-400 font-mono">
              PRODUÇÃO NACIONAL // BR
            </div>
          </div>
        </div>

        {/* Right Streetwear Technical & Promo Highlights */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#080808] border border-white/10 p-5 flex flex-col justify-between group hover:border-[#00E5FF]/60 transition-all">
            <div className="flex items-center justify-between text-[#00E5FF] mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono">
                <Tag className="w-3.5 h-3.5" /> Combo Drop
              </span>
              <span className="text-[9px] bg-[#00E5FF]/10 text-[#00E5FF] px-1.5 py-0.5 font-mono font-bold">10% OFF</span>
            </div>
            <div className="text-base font-black tracking-tight text-white uppercase">2 Peças = 10% OFF</div>
            <p className="text-[10px] text-zinc-500 mt-1">Desconto aplicado automaticamente no carrinho</p>
          </div>

          <div className="bg-[#080808] border border-white/10 p-5 flex flex-col justify-between group hover:border-[#00E5FF]/60 transition-all">
            <div className="flex items-center justify-between text-white mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono">
                <Truck className="w-3.5 h-3.5 text-[#00E5FF]" /> Frete Grátis
              </span>
              <span className="text-[9px] bg-white/10 text-white px-1.5 py-0.5 font-mono font-bold">Brasil</span>
            </div>
            <div className="text-base font-black tracking-tight text-white uppercase">Acima de R$ 199</div>
            <p className="text-[10px] text-zinc-500 mt-1">Envio seguro Correios com código de rastreamento</p>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
          <span className="text-[10px] uppercase tracking-wider font-mono">Silk Digital HD Kornit</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
          <span className="text-[10px] uppercase tracking-wider font-mono">Garantia Troca 30 Dias</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
          <span className="text-[10px] uppercase tracking-wider font-mono">Cupom: <b className="text-white">KEISIDE10</b></span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
          <span className="text-[10px] uppercase tracking-wider font-mono">Emissão de DANFE / NF-e</span>
        </div>
      </div>
    </div>
  );
};

