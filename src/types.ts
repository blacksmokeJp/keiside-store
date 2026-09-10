export type ApparelType = 'tshirt' | 'hoodie' | 'pants' | 'beanie' | 'socks';

export type ShirtSize = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG' | 'UNICO' | '38' | '40' | '42' | '44' | '46' | '35-39' | '40-44' | string;

export type PrintCategory = 'Cyberpunk' | 'Anime & Geek' | 'Animal' | 'Dark & Tattoo' | 'Retro & Vintage' | 'Streetwear';

export type ShirtColor = {
  id: string;
  name: string;
  hex: string;
  bgClass: string;
};

export type ShirtViewAngle = 'front' | 'right' | 'back' | 'left';

export interface PrintPlacementZone {
  id: string;
  angle: ShirtViewAngle;
  name: string;
  areaName: string;
  dimensions: string;
  description: string;
  badge: string;
  coordinates: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}

export interface PrintDesign {
  id: string;
  title: string;
  category: PrintCategory;
  imageUrl: string;
  mockupUrl: string;
  technique: string; // Silk Digital HD, DTG, Sublimação, etc.
  dimension: string; // A3, A4, Bolso
  designer: string;
  description: string;
  availablePlacements?: PrintPlacementZone[];
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  sizePurchased: ShirtSize;
  verifiedPurchase: boolean;
  createdAt: string;
  likesCount?: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  apparelType?: ApparelType;
  price: number;
  originalPrice?: number;
  costPrice: number;
  printId: string;
  printDesign: PrintDesign;
  colors: ShirtColor[];
  sizes: ShirtSize[];
  stockBySize: Record<ShirtSize, number>;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  description: string;
  material: string; // 100% Algodão Penteado 30.1
  tags: string[];
  averageRating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  id: string; // Unique cart item key (productId + size + color)
  product: Product;
  size: ShirtSize;
  color: ShirtColor;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isUpsellItem?: boolean;
}

export type OrderStatus = 
  | 'PENDENTE' 
  | 'PAGO' 
  | 'EM_PRODUCAO' 
  | 'ENVIADO' 
  | 'ENTREGUE' 
  | 'CANCELADO';

export type PaymentMethod = 'PIX' | 'CARTAO_CREDITO' | 'BOLETO';

export interface OrderItem {
  productId: string;
  productName: string;
  printName: string;
  size: ShirtSize;
  colorName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerPhone: string;
  shippingAddress: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'APROVADO' | 'AGUARDANDO' | 'RECUSADO';
  orderStatus: OrderStatus;
  trackingCode?: string;
  nfeKey?: string;
  nfeNumber?: string;
  nfeIssuedAt?: string;
  upsellAccepted: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  city: string;
  state: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  size: ShirtSize;
  type: 'ENTRADA' | 'SAIDA' | 'AJUSTE' | 'VENDA';
  quantity: number;
  reason: string;
  date: string;
  responsible: string;
}

export interface UpsellOffer {
  id: string;
  title: string;
  badge: string;
  description: string;
  discountPercentage: number;
  product: Product;
  suggestedSize?: ShirtSize;
}

export interface AppNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}
