import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Sparkles, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setViewMode } = useStore();

  return (
    <footer className="bg-[#080808] border-t border-white/5 pt-12 pb-8 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Value Props Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0c0c0c] border border-white/10 text-[#00E5FF] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">Envio para Todo o Brasil</div>
              <div className="text-[10px] text-zinc-500">Frete Grátis acima de R$ 199</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0c0c0c] border border-white/10 text-[#00E5FF] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">Silk Digital HD (DTG)</div>
              <div className="text-[10px] text-zinc-500">Impressão direta em alta resolução</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0c0c0c] border border-white/10 text-[#00E5FF] flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">Troca Fácil em 30 Dias</div>
              <div className="text-[10px] text-zinc-500">Garantia total de qualidade</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0c0c0c] border border-white/10 text-[#00E5FF] flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">PIX ou 6x Sem Juros</div>
              <div className="text-[10px] text-zinc-500">Checkout rápido e seguro</div>
            </div>
          </div>
        </div>

        {/* Links and Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#00E5FF] text-black flex items-center justify-center font-black text-xs">
                K
              </div>
              <span className="font-black text-sm tracking-widest text-white uppercase italic">
                KEISIDE <span className="text-[#00E5FF]">®</span>
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Marca autoral brasileira especializada em vestuário streetwear de alta gramatura, modelagens oversized e estampas exclusivas em Silk Digital HD Kornit.
            </p>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
              KEISIDE ® // STREETWEAR NACIONAL // CNPJ: 48.123.456/0001-99
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-widest mb-3 text-[10px] text-[#00E5FF]">
              Categorias
            </h4>
            <ul className="space-y-2 text-zinc-400 text-[11px]">
              <li>CYBERPUNK & SCI-FI</li>
              <li>ANIME & CULTURA GEEK</li>
              <li>MINIMALISTA & TIPOGRAFIA</li>
              <li>DARK & TATTOO ART</li>
              <li>STREETWEAR GRAPHIC</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-widest mb-3 text-[10px] text-[#00E5FF]">
              Plataforma
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => setViewMode('store')}
                  className="text-zinc-400 hover:text-[#00E5FF] text-left transition-colors uppercase"
                >
                  Vitrine da Loja
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('my-orders')}
                  className="text-zinc-400 hover:text-[#00E5FF] text-left transition-colors uppercase"
                >
                  Meus Pedidos & Rastreamento
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('admin')}
                  className="text-zinc-400 hover:text-[#00E5FF] text-left transition-colors uppercase font-bold"
                >
                  Painel Administrativo (ERP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('guide')}
                  className="hover:text-[#00E5FF] text-left transition-colors flex items-center gap-1 text-[#00E5FF] uppercase font-bold"
                >
                  <BookOpen className="w-3 h-3" />
                  Guia Técnico & Estamparia HD
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-widest mb-3 text-[10px] text-[#00E5FF]">
              Emissão Fiscal & Segurança
            </h4>
            <p className="text-zinc-400 text-xs leading-relaxed mb-3">
              Todos os pedidos possuem emissão automática de Nota Fiscal Eletrônica (DANFE / NF-e) com validação de SEFAZ.
            </p>
            <div className="flex items-center gap-2 text-white text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
              Ambiente Seguro com SSL 256-bit
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[10px] uppercase tracking-widest">
          <div>
            © {new Date().getFullYear()} KEISIDE Store. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1 font-mono text-zinc-500">
            <span>KEISIDE // STREETWEAR NACIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
