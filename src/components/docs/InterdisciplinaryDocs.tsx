import React, { useState } from 'react';
import { 
  Database, 
  Code2, 
  Layers, 
  Workflow, 
  Copy, 
  Check, 
  FileText, 
  Server, 
  Sparkles, 
  CheckCircle2,
  TableProperties
} from 'lucide-react';

export const InterdisciplinaryDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'database' | 'sql' | 'backend' | 'flowchart'>('database');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedPython, setCopiedPython] = useState(false);

  const sqlDDL = `-- =======================================================
-- PROJETO INTERDISCIPLINAR: KEISIDE STORE
-- MODELAGEM DO BANCO DE DADOS RELACIONAL (MySQL 8.0+)
-- =======================================================

CREATE DATABASE IF NOT EXISTS keiside_store_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE keiside_store_db;

-- 1. TABELA DE CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE ESTAMPAS
CREATE TABLE IF NOT EXISTS estampas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    categoria ENUM('Cyberpunk', 'Anime & Geek', 'Minimalista', 'Dark & Tattoo', 'Retro & Vintage', 'Streetwear') NOT NULL,
    tecnica VARCHAR(100) DEFAULT 'Silk Digital HD',
    dimensao VARCHAR(50) DEFAULT 'A3',
    designer VARCHAR(100),
    descricao TEXT,
    imagem_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE PRODUTOS (CAMISETAS)
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(150) NOT NULL,
    subtitulo VARCHAR(200),
    preco_venda DECIMAL(10, 2) NOT NULL,
    preco_custo DECIMAL(10, 2) NOT NULL,
    material VARCHAR(150) DEFAULT '100% Algodão Penteado 30.1',
    estampa_id INT NOT NULL,
    is_destaque BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estampa_id) REFERENCES estampas(id) ON DELETE CASCADE
);

-- 4. TABELA DE TAMANHOS
CREATE TABLE IF NOT EXISTS tamanhos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sigla ENUM('PP', 'P', 'M', 'G', 'GG', 'XGG') NOT NULL UNIQUE,
    largura_cm DECIMAL(5, 2) NOT NULL,
    comprimento_cm DECIMAL(5, 2) NOT NULL,
    manga_cm DECIMAL(5, 2) NOT NULL
);

-- 5. TABELA DE ESTOQUE (GRADE MATRICIAL)
CREATE TABLE IF NOT EXISTS estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    tamanho_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    alerta_minimo INT DEFAULT 5,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    FOREIGN KEY (tamanho_id) REFERENCES tamanhos(id) ON DELETE CASCADE,
    UNIQUE KEY uq_produto_tamanho (produto_id, tamanho_id)
);

-- 6. TABELA DE PEDIDOS
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_pedido VARCHAR(30) NOT NULL UNIQUE,
    cliente_id INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    desconto DECIMAL(10, 2) DEFAULT 0.00,
    frete DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDENTE', 'PAGO', 'EM_PRODUCAO', 'ENVIADO', 'ENTREGUE', 'CANCELADO') DEFAULT 'PENDENTE',
    codigo_rastreio VARCHAR(50),
    upsell_aplicado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- 7. TABELA DE ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS itens_pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    tamanho_id INT NOT NULL,
    cor_nome VARCHAR(50) NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (tamanho_id) REFERENCES tamanhos(id)
);

-- 8. TABELA DE PAGAMENTOS
CREATE TABLE IF NOT EXISTS pagamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    metodo ENUM('PIX', 'CARTAO_CREDITO', 'BOLETO') NOT NULL,
    status ENUM('APROVADO', 'AGUARDANDO', 'RECUSADO') DEFAULT 'AGUARDANDO',
    transacao_id VARCHAR(100),
    data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- 9. TABELA DE FATURAMENTO & NOTA FISCAL ELETRÔNICA (NF-e)
CREATE TABLE IF NOT EXISTS faturamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL UNIQUE,
    numero_nfe VARCHAR(30) NOT NULL,
    chave_acesso VARCHAR(44) NOT NULL UNIQUE,
    base_icms DECIMAL(10, 2) NOT NULL,
    valor_icms DECIMAL(10, 2) NOT NULL,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);`;

  const pythonFlaskSnippet = `# =======================================================
# BACK-END EM PYTHON: KEISIDE STORE (FLASK / SQLALCHEMY)
# =======================================================

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://usuario:senha@localhost/keiside_store_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# MODELO PRODUTO
class Produto(db.Model):
    __tablename__ = 'produtos'
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    nome = db.Column(db.String(150), nullable=False)
    preco_venda = db.Column(db.Numeric(10, 2), nullable=False)
    estampa_id = db.Column(db.Integer, db.ForeignKey('estampas.id'), nullable=False)

# ENDPOINT: LISTAR PRODUTOS DO E-COMMERCE
@app.route('/api/produtos', methods=['GET'])
def listar_produtos():
    produtos = Produto.query.all()
    return jsonify([{
        'id': p.id,
        'sku': p.sku,
        'nome': p.nome,
        'preco': float(p.preco_venda)
    } for p in produtos])

# ENDPOINT: FINALIZAR PEDIDO COM GATILHO DE UPSELL
@app.route('/api/pedidos', methods=['POST'])
def criar_pedido():
    dados = request.json
    # Processa itens, calcula desconto de upsell e abate estoque
    return jsonify({'status': 'sucesso', 'numero_pedido': 'KSI-84920'})

if __name__ == '__main__':
    app.run(port=5000, debug=True)`;

  const copyToClipboard = (text: string, type: 'sql' | 'python') => {
    navigator.clipboard.writeText(text);
    if (type === 'sql') {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } else {
      setCopiedPython(true);
      setTimeout(() => setCopiedPython(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      {/* Header */}
      <div className="bg-[#0c0c0c] p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-[2px] bg-[#00E5FF]"></div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Documentação do Projeto Interdisciplinar
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white italic tracking-tight uppercase">
          KEISIDE Store • Modelagem & Engenharia
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl mt-2 leading-relaxed">
          Arquitetura completa do sistema web de e-commerce e gestão para a KEISIDE Store, abrangendo banco de dados relacional MySQL (9 entidades), fluxo do sistema e integração back-end em Python.
        </p>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 font-mono text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-2 border ${
              activeTab === 'database'
                ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-lg'
                : 'bg-[#080808] text-zinc-400 hover:text-white border-white/10'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5" />
            Entidades & Dicionário BD
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 font-mono text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-2 border ${
              activeTab === 'sql'
                ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-lg'
                : 'bg-[#080808] text-zinc-400 hover:text-white border-white/10'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Scripts DDL (MySQL)
          </button>

          <button
            onClick={() => setActiveTab('backend')}
            className={`px-4 py-2 font-mono text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-2 border ${
              activeTab === 'backend'
                ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-lg'
                : 'bg-[#080808] text-zinc-400 hover:text-white border-white/10'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Back-end Python (Flask/FastAPI)
          </button>

          <button
            onClick={() => setActiveTab('flowchart')}
            className={`px-4 py-2 font-mono text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-2 border ${
              activeTab === 'flowchart'
                ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-lg'
                : 'bg-[#080808] text-zinc-400 hover:text-white border-white/10'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            Fluxogramas do Briefing
          </button>
        </div>
      </div>

      {/* TAB 1: Database Dictionary / Entities */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white italic tracking-tight uppercase">
              Estrutura das 9 Tabelas Relacionais (Briefing Item 8)
            </h2>
            <span className="text-xs text-[#00E5FF] font-mono">
              Engine: InnoDB • Charset: UTF8MB4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'clientes',
                desc: 'Dados cadastrais, contato e endereço de entrega/faturamento.',
                fields: ['id (PK)', 'nome', 'email (UQ)', 'cpf (UQ)', 'telefone', 'cep', 'logradouro', 'numero', 'cidade', 'uf'],
              },
              {
                name: 'estampas',
                desc: 'Catálogo de artes gráficas, técnicas de impressão (Silk/DTG) e autoria.',
                fields: ['id (PK)', 'titulo', 'categoria (ENUM)', 'tecnica', 'dimensao', 'designer', 'imagem_url'],
              },
              {
                name: 'produtos',
                desc: 'Camisetas comercializadas com vinculação à estampa e preços.',
                fields: ['id (PK)', 'sku (UQ)', 'nome', 'subtitulo', 'preco_venda', 'preco_custo', 'material', 'estampa_id (FK)'],
              },
              {
                name: 'tamanhos',
                desc: 'Tabela de grade padrão (PP, P, M, G, GG, XGG) e guia de medidas em cm.',
                fields: ['id (PK)', 'sigla (ENUM)', 'largura_cm', 'comprimento_cm', 'manga_cm'],
              },
              {
                name: 'estoque',
                desc: 'Saldo físico em estoque por combinação de Produto x Tamanho.',
                fields: ['id (PK)', 'produto_id (FK)', 'tamanho_id (FK)', 'quantidade', 'alerta_minimo', 'updated_at'],
              },
              {
                name: 'pedidos',
                desc: 'Registro das compras realizadas, totais, descontos, frete e status.',
                fields: ['id (PK)', 'numero_pedido (UQ)', 'cliente_id (FK)', 'subtotal', 'desconto', 'frete', 'total', 'status (ENUM)', 'codigo_rastreio'],
              },
              {
                name: 'itens_pedidos',
                desc: 'Detalhamento dos produtos e tamanhos contidos em cada pedido.',
                fields: ['id (PK)', 'pedido_id (FK)', 'produto_id (FK)', 'tamanho_id (FK)', 'cor_nome', 'quantidade', 'preco_unitario', 'subtotal'],
              },
              {
                name: 'pagamentos',
                desc: 'Histórico de transações financeiras (PIX, Cartão de Crédito, Boleto).',
                fields: ['id (PK)', 'pedido_id (FK)', 'metodo (ENUM)', 'status (ENUM)', 'transacao_id', 'data_pagamento'],
              },
              {
                name: 'faturamento',
                desc: 'Módulo fiscal para emissão de Nota Fiscal Eletrônica (DANFE / NF-e).',
                fields: ['id (PK)', 'pedido_id (FK, UQ)', 'numero_nfe', 'chave_acesso (44 dígitos)', 'base_icms', 'valor_icms', 'data_emissao'],
              },
            ].map((table) => (
              <div key={table.name} className="p-5 bg-[#0c0c0c] border border-white/10 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#00E5FF]" />
                    <h3 className="font-mono font-bold text-sm text-white uppercase">{table.name}</h3>
                  </div>
                  <span className="text-[9px] bg-black text-[#00E5FF] border border-[#00E5FF]/30 px-2 py-0.5 font-mono font-bold">
                    TABELA
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{table.desc}</p>
                <div className="pt-1">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase block mb-1 font-mono">Colunas Principais:</span>
                  <div className="flex flex-wrap gap-1">
                    {table.fields.map((f) => (
                      <span
                        key={f}
                        className={`text-[9px] px-2 py-0.5 font-mono border ${
                          f.includes('PK')
                            ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30 font-bold'
                            : f.includes('FK')
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            : 'bg-black text-zinc-400 border-white/5'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SQL DDL Code */}
      {activeTab === 'sql' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white italic tracking-tight uppercase">
              Script DDL MySQL Completo (Criação de Tabelas e Chaves)
            </h2>
            <button
              onClick={() => copyToClipboard(sqlDDL, 'sql')}
              className="px-4 py-2 bg-[#00E5FF] hover:bg-white text-black font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5 transition-colors shadow-lg"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSql ? 'Copiado!' : 'Copiar Código SQL'}
            </button>
          </div>

          <div className="p-4 bg-[#080808] border border-white/10 overflow-x-auto shadow-2xl">
            <pre className="text-xs font-mono text-zinc-300 leading-relaxed">
              <code>{sqlDDL}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: Python Back-end Example */}
      {activeTab === 'backend' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white italic tracking-tight uppercase">
                Arquitetura Back-end em Python (Flask & SQLAlchemy)
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Exemplo de implementação da API REST para atendimento dos requisitos do briefing interdisciplinar.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(pythonFlaskSnippet, 'python')}
              className="px-4 py-2 bg-[#00E5FF] hover:bg-white text-black font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5 transition-colors shadow-lg"
            >
              {copiedPython ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedPython ? 'Copiado!' : 'Copiar Código Python'}
            </button>
          </div>

          <div className="p-4 bg-[#080808] border border-white/10 overflow-x-auto shadow-2xl">
            <pre className="text-xs font-mono text-[#00E5FF] leading-relaxed">
              <code>{pythonFlaskSnippet}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: Flowcharts */}
      {activeTab === 'flowchart' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Flow */}
          <div className="p-6 bg-[#0c0c0c] border border-white/10 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#00E5FF] font-black text-xs uppercase tracking-wider">
              <Workflow className="w-4 h-4" /> Fluxo do Cliente (Briefing Item 6)
            </div>
            <div className="space-y-2.5 text-xs text-zinc-300">
              {[
                { step: '1', title: 'Acessa o site', desc: 'Navegação pela vitrine de lançamentos e categorias de estampas' },
                { step: '2', title: 'Escolhe o produto', desc: 'Visualiza estampa em HD, técnica, guia de tamanhos e cores' },
                { step: '3', title: 'Adiciona ao carrinho', desc: 'Seleção do tamanho com verificação de estoque em tempo real' },
                { step: '4', title: 'Recebe sugestão de Upsell', desc: 'Oferta de 2ª camiseta com 15% OFF ou combo promocional' },
                { step: '5', title: 'Finaliza a compra', desc: 'Preenchimento de endereço e dados para emissão de NF-e' },
                { step: '6', title: 'Realiza o pagamento', desc: 'PIX dinâmico com QR Code, Cartão até 6x ou Boleto' },
                { step: '7', title: 'Acompanha o pedido', desc: 'Linha do tempo (Estamparia -> Enviado -> Entregue) e DANFE' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3 p-3 bg-[#080808] border border-white/10">
                  <span className="w-6 h-6 bg-[#00E5FF] text-black font-black flex items-center justify-center shrink-0 text-xs font-mono">
                    {s.step}
                  </span>
                  <div>
                    <div className="font-bold text-white uppercase text-xs">{s.title}</div>
                    <div className="text-[11px] text-zinc-400">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Flow */}
          <div className="p-6 bg-[#0c0c0c] border border-white/10 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#00E5FF] font-black text-xs uppercase tracking-wider">
              <Workflow className="w-4 h-4" /> Fluxo do Administrador (Briefing Item 6)
            </div>
            <div className="space-y-2.5 text-xs text-zinc-300">
              {[
                { step: '1', title: 'Acessa o painel', desc: 'Dashboard executivo com KPIs de faturamento e estoque crítico' },
                { step: '2', title: 'Gerencia produtos & estampas', desc: 'CRUD completo de camisetas, artes gráficas e preços' },
                { step: '3', title: 'Controla estoque por tamanho', desc: 'Grade matricial com alertas de estoque baixo (< 5 un)' },
                { step: '4', title: 'Acompanha pedidos em tempo real', desc: 'Pipeline de pedidos recebidos, pagos e em produção' },
                { step: '5', title: 'Atualiza status do pedido', desc: 'Transição: Pago -> Em Estamparia -> Enviado (Correios)' },
                { step: '6', title: 'Emissão fiscal de DANFE / NF-e', desc: 'Geração de chave de acesso de 44 dígitos e cálculo de ICMS' },
                { step: '7', title: 'Analisa relatórios & faturamento', desc: 'Desempenho de vendas, margem de lucro e eficácia de upsell' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3 p-3 bg-[#080808] border border-white/10">
                  <span className="w-6 h-6 bg-white text-black font-black flex items-center justify-center shrink-0 text-xs font-mono">
                    {s.step}
                  </span>
                  <div>
                    <div className="font-bold text-white uppercase text-xs">{s.title}</div>
                    <div className="text-[11px] text-zinc-400">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
