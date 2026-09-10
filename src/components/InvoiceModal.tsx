import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Printer, FileText, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { viewingInvoiceOrder, setViewingInvoiceOrder } = useStore();

  if (!viewingInvoiceOrder) return null;

  const order = viewingInvoiceOrder;
  const nfeKey = order.nfeKey || '35260904812345000199550010000849201084920188';
  const nfeNumber = order.nfeNumber || `000.0${order.orderNumber.replace(/\D/g, '')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-white text-neutral-900 border border-white/20 overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Non-printed) */}
        <div className="p-4 bg-[#080808] text-white flex items-center justify-between border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00E5FF]" />
            <span className="font-bold text-xs uppercase tracking-wider">
              Documento Auxiliar da Nota Fiscal Eletrônica (DANFE / NF-e)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#00E5FF] hover:bg-white text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir DANFE
            </button>
            <button
              onClick={() => setViewingInvoiceOrder(null)}
              className="w-7 h-7 bg-[#0c0c0c] hover:bg-white hover:text-black text-zinc-400 flex items-center justify-center transition-colors border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Realistic Brazilian DANFE Layout */}
        <div className="p-6 sm:p-8 overflow-y-auto font-sans text-xs space-y-4 print:p-0 print:text-[10px]">
          {/* Header Box */}
          <div className="border border-neutral-400 p-3 grid grid-cols-12 gap-3 items-center">
            {/* Emitente */}
            <div className="col-span-12 sm:col-span-5 border-b sm:border-b-0 sm:border-r border-neutral-300 pr-3">
              <h2 className="font-extrabold text-base tracking-tight font-['Syne']">
                KEISIDE STORE VESTUÁRIO LTDA
              </h2>
              <p className="text-[11px] text-neutral-700">Comércio Eletrônico de Camisetas & Moda</p>
              <p className="text-[10px] text-neutral-600 mt-1">
                Av. Paulista, 1000, 10º Andar - Bela Vista<br />
                São Paulo - SP • CEP 01310-100<br />
                CNPJ: 48.123.456/0001-99 • IE: 112.334.455.110
              </p>
            </div>

            {/* DANFE Box */}
            <div className="col-span-6 sm:col-span-3 text-center border-r border-neutral-300 pr-3">
              <span className="font-extrabold text-sm block">DANFE</span>
              <span className="text-[10px] text-neutral-600 block">
                Documento Auxiliar da<br />Nota Fiscal Eletrônica
              </span>
              <div className="mt-1 font-mono font-bold text-xs">
                0 - ENTRADA<br />
                <span className="text-sm font-extrabold bg-neutral-200 px-2 py-0.5 rounded">1 - SAÍDA [ 1 ]</span>
              </div>
              <div className="mt-1 font-bold text-[11px]">
                Nº {nfeNumber}<br />
                SÉRIE 1 • FOLHA 1/1
              </div>
            </div>

            {/* Barcode & Chave de Acesso */}
            <div className="col-span-6 sm:col-span-4 text-center">
              <div className="h-10 bg-neutral-900 text-white flex items-center justify-center font-mono text-[9px] tracking-widest px-2 mb-1">
                ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              </div>
              <span className="text-[9px] font-bold text-neutral-600 block">CHAVE DE ACESSO</span>
              <span className="font-mono text-[9px] font-bold tracking-tight block break-all text-neutral-800">
                {nfeKey}
              </span>
              <p className="text-[9px] text-neutral-500 mt-1">
                Consulta de autenticidade no portal nacional da NF-e
              </p>
            </div>
          </div>

          {/* Natureza da Operação */}
          <div className="border border-neutral-400 p-2 grid grid-cols-3 gap-2 text-[10px]">
            <div>
              <span className="text-neutral-500 block">NATUREZA DA OPERAÇÃO</span>
              <span className="font-bold">VENDA DE MERCADORIA ADQUIRIDA DE TERCEIROS</span>
            </div>
            <div>
              <span className="text-neutral-500 block">PROTOCOLO DE AUTORIZAÇÃO DE USO</span>
              <span className="font-bold font-mono">135260098492019 • 29/08/2026 14:30:12</span>
            </div>
            <div>
              <span className="text-neutral-500 block">INSCRIÇÃO ESTADUAL</span>
              <span className="font-bold font-mono">112.334.455.110</span>
            </div>
          </div>

          {/* Destinatário / Remetente */}
          <div className="border border-neutral-400 p-3 space-y-2">
            <div className="font-bold text-[11px] border-b border-neutral-200 pb-1 text-neutral-800 uppercase">
              DESTINATÁRIO / REMETENTE
            </div>
            <div className="grid grid-cols-12 gap-2 text-[10px]">
              <div className="col-span-8">
                <span className="text-neutral-500 block">NOME / RAZÃO SOCIAL</span>
                <span className="font-bold uppercase">{order.customerName}</span>
              </div>
              <div className="col-span-4">
                <span className="text-neutral-500 block">CNPJ / CPF</span>
                <span className="font-bold font-mono">{order.customerCpf}</span>
              </div>
              <div className="col-span-6">
                <span className="text-neutral-500 block">ENDEREÇO</span>
                <span className="font-medium">
                  {order.shippingAddress.street}, {order.shippingAddress.number} {order.shippingAddress.complement || ''}
                </span>
              </div>
              <div className="col-span-3">
                <span className="text-neutral-500 block">BAIRRO / DISTRITO</span>
                <span className="font-medium">{order.shippingAddress.neighborhood}</span>
              </div>
              <div className="col-span-3">
                <span className="text-neutral-500 block">CEP</span>
                <span className="font-bold font-mono">{order.shippingAddress.cep}</span>
              </div>
              <div className="col-span-6">
                <span className="text-neutral-500 block">MUNICÍPIO</span>
                <span className="font-medium">{order.shippingAddress.city}</span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-500 block">UF</span>
                <span className="font-bold">{order.shippingAddress.state}</span>
              </div>
              <div className="col-span-4">
                <span className="text-neutral-500 block">TELEFONE / E-MAIL</span>
                <span className="font-medium">{order.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Cálculo do Imposto */}
          <div className="border border-neutral-400 p-2 space-y-1 text-[10px]">
            <div className="font-bold text-[10px] border-b border-neutral-200 pb-0.5 text-neutral-800 uppercase">
              CÁLCULO DO IMPOSTO (SIMPLES NACIONAL / ICMS / PIS / COFINS)
            </div>
            <div className="grid grid-cols-6 gap-2 text-center pt-1 font-mono">
              <div>
                <span className="text-neutral-500 block text-[9px]">BASE CÁLC. ICMS</span>
                <span className="font-bold">R$ {order.total.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px]">VALOR DO ICMS</span>
                <span className="font-bold">R$ {(order.total * 0.12).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px]">VALOR DO FRETE</span>
                <span className="font-bold">R$ {order.shippingFee.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px]">DESCONTO</span>
                <span className="font-bold text-emerald-700">R$ {order.discount.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px]">OUTRAS DESP.</span>
                <span className="font-bold">R$ 0,00</span>
              </div>
              <div className="bg-neutral-100 p-1 rounded">
                <span className="text-neutral-700 block text-[9px] font-bold">TOTAL DA NOTA</span>
                <span className="font-extrabold text-xs text-neutral-900">
                  R$ {order.total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          {/* Dados dos Produtos / Serviços */}
          <div className="border border-neutral-400 overflow-hidden text-[10px]">
            <div className="bg-neutral-100 p-1.5 font-bold border-b border-neutral-300 uppercase">
              DADOS DOS PRODUTOS / SERVIÇOS
            </div>
            <table className="w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-300 text-[9px] text-neutral-600">
                <tr>
                  <th className="p-1">CÓDIGO</th>
                  <th className="p-1">DESCRIÇÃO DO PRODUTO / ESTAMPA</th>
                  <th className="p-1 text-center">NCM</th>
                  <th className="p-1 text-center">CST</th>
                  <th className="p-1 text-center">UN</th>
                  <th className="p-1 text-center">QTD</th>
                  <th className="p-1 text-right">VLR. UNIT</th>
                  <th className="p-1 text-right">VLR. TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-mono text-[9px]">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-1">{item.productId}</td>
                    <td className="p-1 font-sans">
                      <b className="font-semibold">{item.productName}</b> - Estampa: {item.printName} (Tam: {item.size}, Cor: {item.colorName})
                    </td>
                    <td className="p-1 text-center">6109.10.00</td>
                    <td className="p-1 text-center">0102</td>
                    <td className="p-1 text-center">UN</td>
                    <td className="p-1 text-center">{item.quantity}</td>
                    <td className="p-1 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                    <td className="p-1 text-right font-bold">R$ {item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Informações Complementares */}
          <div className="border border-neutral-400 p-2.5 text-[9px] text-neutral-600 space-y-1">
            <span className="font-bold block text-neutral-800 uppercase">DADOS ADICIONAIS / INFORMAÇÕES COMPLEMENTARES</span>
            <p>
              Documento emitido por ME ou EPP optante pelo Simples Nacional. Não gera direito a crédito fiscal de IPI.<br />
              Pedido E-commerce: <b>#{order.orderNumber}</b> • Forma de Pagamento: <b>{order.paymentMethod}</b>.<br />
              Transporte: Correios / Envio Expresso • Código de Rastreamento: <b>{order.trackingCode || 'Aguardando postagem'}</b>.<br />
              Sistema: <b>KEISIDE Store Management Platform 2026</b>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-300 flex items-center justify-between text-xs text-neutral-600 print:hidden">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Nota Fiscal Eletrônica válida e transmitida para SEFAZ
          </div>
          <button
            onClick={() => setViewingInvoiceOrder(null)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs transition-colors"
          >
            Fechar Visualização
          </button>
        </div>
      </div>
    </div>
  );
};
