import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Product, PrintPlacementZone, ShirtViewAngle, ApparelType } from '../types';
import { DEFAULT_PRINT_PLACEMENTS, getApparelPlacements } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ZoomIn, 
  Layers, 
  MapPin, 
  Crosshair,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Sparkles,
  Info,
  Check,
  Compass
} from 'lucide-react';

interface AngleConfig {
  angle: ShirtViewAngle;
  label: string;
  shortLabel: string;
  degrees: number;
  description: string;
  mockupUrl: string;
}

const APPAREL_ANGLES_MAP: Record<ApparelType, AngleConfig[]> = {
  tshirt: [
    {
      angle: 'front',
      label: 'Frente',
      shortLabel: 'Frente',
      degrees: 0,
      description: 'Visão Frontal — Peito central e área do bolso',
      mockupUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'right',
      label: 'Lado Direito (Manga)',
      shortLabel: 'Lado Dir.',
      degrees: 90,
      description: 'Visão Lateral Direita — Manga e ombro direito',
      mockupUrl: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'back',
      label: 'Costas',
      shortLabel: 'Costas',
      degrees: 180,
      description: 'Visão Traseira — Pôster dorsal oversized e escápulas',
      mockupUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'left',
      label: 'Lado Esquerdo (Manga)',
      shortLabel: 'Lado Esq.',
      degrees: 270,
      description: 'Visão Lateral Esquerda — Manga e ombro esquerdo',
      mockupUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
    },
  ],
  hoodie: [
    {
      angle: 'front',
      label: 'Frente (Peito / Bolso)',
      shortLabel: 'Frente',
      degrees: 0,
      description: 'Visão Frontal — Tórax central A3 e Bolso Canguru',
      mockupUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'right',
      label: 'Manga Direita Longa',
      shortLabel: 'Manga Dir.',
      degrees: 90,
      description: 'Visão Lateral Direita — Faixa vertical ao longo do braço',
      mockupUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'back',
      label: 'Costas (A3+ Master)',
      shortLabel: 'Costas',
      degrees: 180,
      description: 'Visão Traseira — Pôster dorsal imponente abaixo do capuz',
      mockupUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'left',
      label: 'Manga Esquerda Longa',
      shortLabel: 'Manga Esq.',
      degrees: 270,
      description: 'Visão Lateral Esquerda — Faixa vertical ao longo do braço',
      mockupUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    },
  ],
  pants: [
    {
      angle: 'front',
      label: 'Frente (Coxa / Perna)',
      shortLabel: 'Frente',
      degrees: 0,
      description: 'Visão Frontal — Estampa na coxa frontal e canela',
      mockupUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'right',
      label: 'Lateral Direita (Cargo)',
      shortLabel: 'Lado Dir.',
      degrees: 90,
      description: 'Visão Lateral Direita — Bolso cargo utilitário e faixa',
      mockupUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'back',
      label: 'Costas (Bolso / Panturrilha)',
      shortLabel: 'Costas',
      degrees: 180,
      description: 'Visão Traseira — Bolso traseiro e panturrilha dorsal',
      mockupUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'left',
      label: 'Lateral Esquerda (Cargo)',
      shortLabel: 'Lado Esq.',
      degrees: 270,
      description: 'Visão Lateral Esquerda — Bolso cargo utilitário e faixa',
      mockupUrl: 'https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&w=800&q=80',
    },
  ],
  beanie: [
    {
      angle: 'front',
      label: 'Frente (Dobra Canelada)',
      shortLabel: 'Frente',
      degrees: 0,
      description: 'Visão Frontal — Patch bordado/silk na dobra frontal',
      mockupUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'right',
      label: 'Lateral Direita (Tag Clip)',
      shortLabel: 'Lado Dir.',
      degrees: 90,
      description: 'Visão Lateral Direita — Tag de borracha/metal na borda',
      mockupUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'back',
      label: 'Traseira / Nuca',
      shortLabel: 'Costas',
      degrees: 180,
      description: 'Visão Traseira — Assinatura minimalista na dobra',
      mockupUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'left',
      label: 'Lateral Esquerda (Tag Clip)',
      shortLabel: 'Lado Esq.',
      degrees: 270,
      description: 'Visão Lateral Esquerda — Tag de autoridade na aba',
      mockupUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    },
  ],
  socks: [
    {
      angle: 'front',
      label: 'Frente (Canela / Peito do Pé)',
      shortLabel: 'Frente',
      degrees: 0,
      description: 'Visão Frontal — Logo no cano e selo no peito do pé',
      mockupUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'right',
      label: 'Lateral Externa (Cano Alto)',
      shortLabel: 'Lado Ext.',
      degrees: 90,
      description: 'Visão Lateral Externa — Faixa corrida esportiva',
      mockupUrl: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'back',
      label: 'Costas (Panturrilha Dorsal)',
      shortLabel: 'Costas',
      degrees: 180,
      description: 'Visão Traseira — Tipografia na panturrilha do cano',
      mockupUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    },
    {
      angle: 'left',
      label: 'Lateral Interna',
      shortLabel: 'Lado Int.',
      degrees: 270,
      description: 'Visão Lateral Interna — Mini selo discreto',
      mockupUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80',
    },
  ],
};

const getApparelName = (type: ApparelType = 'tshirt') => {
  switch (type) {
    case 'hoodie': return 'Moletom / Blusa';
    case 'pants': return 'Calça Streetwear';
    case 'beanie': return 'Touca / Beanie';
    case 'socks': return 'Meia Streetwear';
    case 'tshirt':
    default: return 'Camiseta';
  }
};

interface ProductImageZoomViewerProps {
  product: Product;
  activeTab: 'mockup' | 'artwork' | 'placement' | 'fabric';
  setActiveTab: (tab: 'mockup' | 'artwork' | 'placement' | 'fabric') => void;
}

export const ProductImageZoomViewer: React.FC<ProductImageZoomViewerProps> = ({
  product,
  activeTab,
  setActiveTab,
}) => {
  const [currentAngleIndex, setCurrentAngleIndex] = useState<number>(0);
  const [rotationDirection, setRotationDirection] = useState<'left' | 'right'>('right');
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [showPlacementGuides, setShowPlacementGuides] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const apparelType = product.apparelType || 'tshirt';
  const anglesConfig = APPAREL_ANGLES_MAP[apparelType] || APPAREL_ANGLES_MAP.tshirt;
  const currentAngleConfig = anglesConfig[currentAngleIndex] || anglesConfig[0];
  const currentAngle = currentAngleConfig.angle;

  const allPlacements = product.printDesign.availablePlacements || getApparelPlacements(apparelType);
  // Filter only zones that belong to the current rotated position
  const activeAnglePlacements = allPlacements.filter((zone) => zone.angle === currentAngle);

  const [selectedZone, setSelectedZone] = useState<PrintPlacementZone | null>(
    activeAnglePlacements[0] || allPlacements[0]
  );

  // When angle changes or product changes, update selected zone
  useEffect(() => {
    if (activeAnglePlacements.length > 0) {
      setSelectedZone(activeAnglePlacements[0]);
    }
  }, [currentAngleIndex, product.id]);

  // Auto rotation timer
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotationDirection('right');
      setCurrentAngleIndex((prev) => (prev + 1) % anglesConfig.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isAutoRotating, anglesConfig.length]);

  const handleNextAngle = () => {
    setIsAutoRotating(false);
    setRotationDirection('right');
    setCurrentAngleIndex((prev) => (prev + 1) % anglesConfig.length);
  };

  const handlePrevAngle = () => {
    setIsAutoRotating(false);
    setRotationDirection('left');
    setCurrentAngleIndex((prev) => (prev - 1 + anglesConfig.length) % anglesConfig.length);
  };

  const handleSelectAngleIndex = (index: number) => {
    setIsAutoRotating(false);
    setRotationDirection(index > currentAngleIndex ? 'right' : 'left');
    setCurrentAngleIndex(index);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  }, []);

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  // Get image for the active angle
  const getAngleImageUrl = () => {
    if (currentAngle === 'front') {
      return product.printDesign.mockupUrl;
    }
    return currentAngleConfig.mockupUrl;
  };

  return (
    <div className="space-y-3 select-none">
      {/* 360 Rotation Control Bar */}
      <div className="flex items-center justify-between bg-[#080808] border border-white/10 p-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#00E5FF] uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 animate-pulse" />
            Girar {getApparelName(apparelType)}:
          </span>
          <span className="px-2 py-0.5 bg-white/10 text-white font-mono font-black text-[10px] uppercase border border-white/10">
            {currentAngleConfig.degrees}° • {currentAngleConfig.label}
          </span>
        </div>

        {/* 4 Position Direct Selector Buttons */}
        <div className="flex items-center gap-1">
          {anglesConfig.map((item, idx) => {
            const isActive = idx === currentAngleIndex;
            return (
              <button
                key={item.angle}
                type="button"
                onClick={() => handleSelectAngleIndex(idx)}
                className={`px-2 py-1 text-[9px] font-mono font-bold uppercase transition-all ${
                  isActive
                    ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : 'bg-[#121212] text-zinc-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
                title={item.description}
              >
                {item.shortLabel}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1 border text-[10px] font-mono transition-colors ml-1 ${
              isAutoRotating
                ? 'bg-[#00E5FF] text-black border-[#00E5FF]'
                : 'bg-[#121212] text-zinc-400 border-white/10 hover:text-white'
            }`}
            title={isAutoRotating ? 'Pausar Rotação 360°' : 'Girar Automaticamente 360°'}
          >
            <RotateCw className={`w-3 h-3 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Visualizer Stage Container */}
      <div 
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="relative aspect-[4/5] bg-[#080808] overflow-hidden border border-white/10 group cursor-crosshair select-none shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {/* 1. MOCKUP VIEW WITH 4-POSITION 360 ROTATION */}
          {activeTab === 'mockup' && (
            <motion.div
              key={`mockup-${currentAngleIndex}`}
              initial={{ 
                opacity: 0.7, 
                rotateY: rotationDirection === 'right' ? 25 : -25,
                scale: 0.98 
              }}
              animate={{ 
                opacity: 1, 
                rotateY: 0,
                scale: 1 
              }}
              exit={{ 
                opacity: 0.7, 
                rotateY: rotationDirection === 'right' ? -25 : 25,
                scale: 0.98 
              }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full h-full relative overflow-hidden"
            >
              {/* Product Mockup at Current Rotated Angle */}
              <motion.img
                src={getAngleImageUrl()}
                alt={`${product.name} - ${currentAngleConfig.label}`}
                referrerPolicy="no-referrer"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZooming ? 'scale(2.2)' : 'scale(1)',
                  transition: isZooming ? 'transform 0.08s ease-out' : 'transform 0.25s ease-out',
                }}
                className="w-full h-full object-cover object-center pointer-events-none"
              />

              {/* Front Art preview on shirt if on front angle */}
              {currentAngle === 'front' && !isZooming && (
                <div className="absolute top-[28%] left-[30%] w-[40%] h-[38%] pointer-events-none opacity-90 mix-blend-screen flex items-center justify-center">
                  <img
                    src={product.printDesign.imageUrl}
                    alt=""
                    className="max-w-full max-h-full object-contain filter drop-shadow-md"
                  />
                </div>
              )}

              {/* Back Art preview on shirt if on back angle */}
              {currentAngle === 'back' && !isZooming && (
                <div className="absolute top-[22%] left-[26%] w-[48%] h-[48%] pointer-events-none opacity-90 mix-blend-screen flex items-center justify-center">
                  <img
                    src={product.printDesign.imageUrl}
                    alt=""
                    className="max-w-full max-h-full object-contain filter drop-shadow-md"
                  />
                </div>
              )}

              {/* Print Placement Zones specific to THIS CURRENT ANGLE ONLY */}
              {showPlacementGuides && !isZooming && (
                <div className="absolute inset-0 pointer-events-none">
                  {activeAnglePlacements.map((zone) => {
                    const isZoneActive = selectedZone?.id === zone.id;
                    return (
                      <div
                        key={zone.id}
                        style={{
                          top: zone.coordinates.top,
                          left: zone.coordinates.left,
                          width: zone.coordinates.width,
                          height: zone.coordinates.height,
                        }}
                        className={`absolute border transition-all duration-300 pointer-events-auto cursor-pointer ${
                          isZoneActive
                            ? 'border-[#00E5FF] bg-[#00E5FF]/25 shadow-[0_0_18px_rgba(0,229,255,0.6)]'
                            : 'border-dashed border-[#00E5FF]/70 bg-[#00E5FF]/10 hover:border-[#00E5FF] hover:bg-[#00E5FF]/20'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedZone(zone);
                        }}
                      >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-black/95 text-[#00E5FF] border border-[#00E5FF]/50 text-[8px] font-mono font-bold whitespace-nowrap shadow-md">
                          {zone.name.split(' (')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Live Zoom Lens HUD Indicator */}
              {isZooming && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/90 text-[#00E5FF] border border-[#00E5FF]/50 text-[9px] font-mono font-bold flex items-center gap-1.5 backdrop-blur-md pointer-events-none shadow-lg">
                  <Crosshair className="w-3.5 h-3.5 text-[#00E5FF] animate-spin" />
                  Zoom HD 2.2x [{Math.round(zoomPos.x)}%, {Math.round(zoomPos.y)}%]
                </div>
              )}
            </motion.div>
          )}

          {/* 2. HIGH-RES ARTWORK PREVIEW */}
          {activeTab === 'artwork' && (
            <motion.div
              key="artwork-img"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full p-6 flex flex-col items-center justify-center bg-[#060606] relative"
            >
              <img
                src={product.printDesign.imageUrl}
                alt="Arte da Estampa em Alta Resolução"
                referrerPolicy="no-referrer"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZooming ? 'scale(2.4)' : 'scale(1)',
                  transition: isZooming ? 'transform 0.08s ease-out' : 'transform 0.25s ease-out',
                }}
                className="max-h-full max-w-full object-contain shadow-2xl"
              />
              {!isZooming && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 border border-white/10 text-[9px] text-zinc-300 font-mono uppercase tracking-widest pointer-events-none">
                  Arte Vetorial & Raster Kornit HD // {product.printDesign.dimension}
                </div>
              )}
            </motion.div>
          )}

          {/* 3. PRINT PLACEMENT MAP & ROTATION */}
          {activeTab === 'placement' && (
            <motion.div
              key={`placement-map-${currentAngleIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative bg-[#060606] flex items-center justify-center p-4"
            >
              <img
                src={getAngleImageUrl()}
                alt="Mapa de Posicionamento"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-35 blur-[1px]"
              />

              {/* Interactive Placement Zone Hotspots for current angle only */}
              <div className="absolute inset-0 p-4">
                {activeAnglePlacements.map((zone) => {
                  const isZoneActive = selectedZone?.id === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZone(zone)}
                      style={{
                        top: zone.coordinates.top,
                        left: zone.coordinates.left,
                        width: zone.coordinates.width,
                        height: zone.coordinates.height,
                      }}
                      className={`absolute border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center p-1 text-center group ${
                        isZoneActive
                          ? 'border-[#00E5FF] bg-[#00E5FF]/25 shadow-[0_0_20px_rgba(0,229,255,0.5)] z-20'
                          : 'border-dashed border-white/40 bg-white/10 hover:border-[#00E5FF]/80 hover:bg-[#00E5FF]/10 z-10'
                      }`}
                    >
                      <span className={`text-[9px] font-bold font-mono px-1 py-0.5 uppercase ${
                        isZoneActive ? 'bg-[#00E5FF] text-black' : 'bg-black/90 text-white'
                      }`}>
                        {zone.name}
                      </span>
                      <span className="text-[8px] font-mono text-zinc-300 mt-0.5">
                        {zone.dimensions}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 4. FABRIC & DTG SPECIFICATION */}
          {activeTab === 'fabric' && (
            <motion.div
              key="fabric-specs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full h-full p-6 flex flex-col justify-center bg-[#080808] text-zinc-300 space-y-4"
            >
              <div className="p-4 bg-[#0c0c0c] border border-white/10">
                <h4 className="text-[#00E5FF] font-bold text-xs uppercase tracking-wider mb-1">Qualidade da Malha</h4>
                <p className="text-xs text-zinc-300">{product.material}</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Gramatura Heavyweight 260 GSM, 100% algodão penteado fio 30.1 com toque macio e sem encolhimento.
                </p>
              </div>
              <div className="p-4 bg-[#0c0c0c] border border-white/10">
                <h4 className="text-[#00E5FF] font-bold text-xs uppercase tracking-wider mb-1">Tecnologia da Estampa</h4>
                <p className="text-xs text-zinc-300">{product.printDesign.technique}</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Impressão digital direta no tecido com tintas ecológicas Kornit NeoPigment. Toque zero que respira com a fibra.
                </p>
              </div>
              <div className="p-4 bg-[#0c0c0c] border border-white/10">
                <h4 className="text-[#00E5FF] font-bold text-xs uppercase tracking-wider mb-1">Autoria e Design</h4>
                <p className="text-xs text-zinc-300">{product.printDesign.designer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ROTATION ARROW BUTTONS (CLICK NA SETA GIRA A ROUPA) */}
        <div className="absolute inset-y-0 left-2 flex items-center z-30">
          <motion.button
            whileHover={{ scale: 1.15, x: -2 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevAngle();
            }}
            className="w-9 h-9 bg-black/85 hover:bg-[#00E5FF] text-white hover:text-black border border-white/20 hover:border-[#00E5FF] flex items-center justify-center transition-colors shadow-xl"
            title={`Girar ${getApparelName(apparelType)} para a Esquerda (←)`}
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        </div>

        <div className="absolute inset-y-0 right-2 flex items-center z-30">
          <motion.button
            whileHover={{ scale: 1.15, x: 2 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNextAngle();
            }}
            className="w-9 h-9 bg-black/85 hover:bg-[#00E5FF] text-white hover:text-black border border-white/20 hover:border-[#00E5FF] flex items-center justify-center transition-colors shadow-xl"
            title={`Girar ${getApparelName(apparelType)} para a Direita (→)`}
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        </div>

        {/* Angle Badge Overlay on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-[#00E5FF] text-black text-[9px] font-black uppercase tracking-widest shadow-md">
              {currentAngleConfig.label} ({currentAngleConfig.degrees}°)
            </span>
            <span className="px-1.5 py-0.5 bg-black/90 text-[#00E5FF] border border-[#00E5FF]/40 text-[8px] font-mono font-bold">
              {currentAngleIndex + 1} de {anglesConfig.length}
            </span>
          </div>
          {!isZooming && (
            <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm text-zinc-300 border border-white/10 text-[8px] font-mono flex items-center gap-1">
              <ZoomIn className="w-2.5 h-2.5 text-[#00E5FF]" /> Zoom ao passar o mouse
            </span>
          )}
        </div>

        {/* Toggle Guides Button (When in Mockup Mode) */}
        {activeTab === 'mockup' && (
          <div className="absolute top-3 right-3 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPlacementGuides(!showPlacementGuides);
              }}
              className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border transition-colors ${
                showPlacementGuides
                  ? 'bg-[#00E5FF] text-black border-[#00E5FF]'
                  : 'bg-black/80 text-zinc-400 border-white/10 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3" />
              {showPlacementGuides ? 'Zonas: ON' : 'Zonas: OFF'}
            </button>
          </div>
        )}
      </div>

      {/* Selected Placement Zone Info Panel (Filtered cleanly for this angle) */}
      {selectedZone ? (
        <div className="p-3.5 bg-[#080808] border border-white/10 text-xs flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#00E5FF] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Posição de Estampa ({currentAngleConfig.label}):
              </span>
              <strong className="text-white text-xs">{selectedZone.name}</strong>
              <span className="px-1.5 py-0.2 bg-white/10 text-[#00E5FF] text-[8px] font-mono font-bold">
                {selectedZone.dimensions}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              {selectedZone.description}
            </p>
          </div>
          <span className="px-2 py-0.5 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-[9px] font-bold uppercase whitespace-nowrap self-center">
            {selectedZone.badge}
          </span>
        </div>
      ) : (
        <div className="p-3 bg-[#080808] border border-white/10 text-xs text-zinc-400">
          Esta posição de {getApparelName(apparelType).toLowerCase()} está sem estampa configurada. Gire para outra posição com as setas para ver as áreas de estampa.
        </div>
      )}

      {/* Tabs Switcher Controls */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {[
          { id: 'mockup', label: 'No Modelo (360°)' },
          { id: 'placement', label: 'Zonas do Ângulo' },
          { id: 'artwork', label: 'Arte HD' },
          { id: 'fabric', label: 'Tecido & Silk' },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            type="button"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-2 border text-center font-bold text-[9px] sm:text-[10px] uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.35)] font-black'
                : 'bg-[#080808] border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
