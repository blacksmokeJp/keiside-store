import React from 'react';
import { 
  Sparkles, 
  Ruler, 
  Layers, 
  Droplets, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Maximize2,
  Cpu,
  Flame,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { SIZE_CHART } from '../data/mockData';

export const PrintTechGuide: React.FC = () => {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Guide Banner */}
      <div className="relative bg-[#0c0c0c] border border-white/10 p-8 sm:p-12 overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.3em] font-mono">
            <Sparkles className="w-3.5 h-3.5" /> GUIA TÉCNICO // ESTAMPARIA & MALHA
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tight">
            Padronização & Tecnologia de Estamparia Digital HD
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Conheça todos os detalhes sobre a nossa tecnologia de impressão direta no tecido (Kornit DTG Industrial), a malha pesada 100% algodão penteado 260 GSM e a tabela de medidas anatômica.
          </p>
        </div>
      </div>

      {/* Grid of Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Impressão DTG */}
        <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-4 hover:border-[#00E5FF]/50 transition-colors">
          <div className="w-12 h-12 bg-black border border-[#00E5FF]/40 text-[#00E5FF] flex items-center justify-center font-bold">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            Kornit Digital HD (DTG)
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Impressão direta no fio do algodão com tintas biodegradáveis à base d'água certificadas pela OEKO-TEX®. Toque zero, respirabilidade máxima e definição ultra-nítida de 1200 DPI que nunca descasca ou racha com lavagens.
          </p>
          <ul className="text-[11px] text-zinc-300 space-y-2 pt-2 border-t border-white/5">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> Gama de cores CMYK + Branco + Fixador
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> Dimensões de Estampa: A3 (297x420mm)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> Resistência a mais de 80 ciclos de lavagem
            </li>
          </ul>
        </div>

        {/* Card 2: Malha & Modelagem */}
        <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-4 hover:border-[#00E5FF]/50 transition-colors">
          <div className="w-12 h-12 bg-black border border-[#00E5FF]/40 text-[#00E5FF] flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            Malha Heavyweight 260 GSM
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            100% Algodão Penteado fio 20.1 de alta gramatura com acabamento peletizado (toque aveludado). Ribana canelada 2x1 de 3cm na gola que não deforma, além de costura reforçada ombro a ombro.
          </p>
          <ul className="text-[11px] text-zinc-300 space-y-2 pt-2 border-t border-white/5">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> Modelagem Oversized Box Fit autêntica
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> Pré-encolhida industrialmente (taxa &lt; 2%)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> Caimento estruturado no corpo
            </li>
          </ul>
        </div>

        {/* Card 3: Cuidados & Lavagem */}
        <div className="bg-[#0c0c0c] border border-white/10 p-6 space-y-4 hover:border-[#00E5FF]/50 transition-colors">
          <div className="w-12 h-12 bg-black border border-[#00E5FF]/40 text-[#00E5FF] flex items-center justify-center font-bold">
            <Droplets className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            Instruções de Lavagem
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Para garantir a longevidade da estampa e a maciez do algodão penteado ao longo dos anos, siga o protocolo de conservação:
          </p>
          <ul className="text-[11px] text-zinc-300 space-y-2 pt-2 border-t border-white/5">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> Lavar do lado avesso em água fria
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> Não utilizar alvejante ou cloro
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> Secar à sombra (evitar secadora em alta temp.)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" /> Passar ferro apenas pelo lado avesso da estampa
            </li>
          </ul>
        </div>
      </div>

      {/* Tabela de Medidas Completa (PP ao XGG) */}
      <div className="bg-[#0c0c0c] border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[#00E5FF]" />
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Tabela de Medidas Anatômica (Modelagem Streetwear Oversized)
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              Medidas em centímetros (cm). Tolerância de até ±1,5cm por peça.
            </p>
          </div>
          <span className="px-3 py-1 bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-mono uppercase font-bold tracking-widest self-start sm:self-center">
            Grade: PP ao XGG
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-black/50 text-zinc-400 uppercase text-[10px]">
                <th className="p-3">Tamanho</th>
                <th className="p-3">Largura / Tórax (A)</th>
                <th className="p-3">Comprimento / Altura (B)</th>
                <th className="p-3">Manga / Ombro (C)</th>
                <th className="p-3">Recomendação de Estatura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {SIZE_CHART.map((item) => (
                <tr key={item.size} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-black text-[#00E5FF] text-sm">{item.size}</td>
                  <td className="p-3">{item.width} cm</td>
                  <td className="p-3">{item.height} cm</td>
                  <td className="p-3">{item.sleeve} cm</td>
                  <td className="p-3 text-zinc-400 font-sans text-xs">
                    {item.size === 'PP' ? 'Até 1,65m (45-55kg)' :
                     item.size === 'P' ? '1,65m a 1,72m (55-68kg)' :
                     item.size === 'M' ? '1,73m a 1,80m (68-80kg)' :
                     item.size === 'G' ? '1,80m a 1,86m (80-92kg)' :
                     item.size === 'GG' ? '1,85m a 1,92m (90-105kg)' : 'Acima de 1,90m (+105kg)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
