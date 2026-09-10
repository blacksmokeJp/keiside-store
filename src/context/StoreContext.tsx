import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  Customer, 
  StockMovement, 
  ShirtSize, 
  ShirtColor, 
  OrderStatus, 
  AppNotification, 
  PaymentMethod,
  ProductReview
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_REVIEWS
} from '../data/mockData';

export type AppViewMode = 'store' | 'admin' | 'my-orders' | 'guide';

interface StoreContextType {
  // Navigation & View
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  adminTab: 'dashboard' | 'products' | 'inventory' | 'orders' | 'customers' | 'reports';
  setAdminTab: (tab: 'dashboard' | 'products' | 'inventory' | 'orders' | 'customers' | 'reports') => void;

  // Catalog & Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  selectedSizeFilter: ShirtSize | 'ALL';
  setSelectedSizeFilter: (size: ShirtSize | 'ALL') => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'bestseller';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'bestseller') => void;
  financialSummary: {
    grossRevenue: number;
    netProfit: number;
    averageTicket: number;
    totalOrders: number;
  };
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Reviews & Ratings
  reviews: ProductReview[];
  addProductReview: (reviewData: Omit<ProductReview, 'id' | 'createdAt' | 'likesCount'>) => void;
  likeProductReview: (reviewId: string) => void;
  getProductReviews: (productId: string) => ProductReview[];
  getProductRating: (productId: string) => { average: number; total: number; distribution: Record<number, number> };

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: ShirtSize, color: ShirtColor, quantity?: number, isUpsell?: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Checkout & Orders
  orders: Order[];
  createOrder: (orderData: {
    customer: { name: string; email: string; cpf: string; phone: string };
    address: Order['shippingAddress'];
    paymentMethod: PaymentMethod;
    shippingFee: number;
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  generateNFeForOrder: (orderId: string) => void;
  viewingOrder: Order | null;
  setViewingOrder: (order: Order | null) => void;
  viewingInvoiceOrder: Order | null;
  setViewingInvoiceOrder: (order: Order | null) => void;

  // Inventory & Stock Movements
  stockMovements: StockMovement[];
  adjustStock: (productId: string, size: ShirtSize, delta: number, type: 'ENTRADA' | 'SAIDA' | 'AJUSTE', reason: string) => void;
  lowStockItemsCount: number;

  // Customers
  customers: Customer[];

  // Notifications
  notifications: AppNotification[];
  addNotification: (message: string, type?: AppNotification['type']) => void;
  removeNotification: (id: string) => void;

  // Reset/Seed Data
  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'keiside_products_v1',
  ORDERS: 'keiside_orders_v1',
  CUSTOMERS: 'keiside_customers_v1',
  STOCK_MOVEMENTS: 'keiside_stock_movements_v1',
  CART: 'keiside_cart_v1',
  REVIEWS: 'keiside_reviews_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // App navigation state
  const [viewMode, setViewMode] = useState<AppViewMode>('store');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'inventory' | 'orders' | 'customers' | 'reports'>('dashboard');

  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Persist reviews
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews', e);
    }
  }, [reviews]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<ShirtSize | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'bestseller'>('featured');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [viewingInvoiceOrder, setViewingInvoiceOrder] = useState<Order | null>(null);

  // Customers state
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Stock movements
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STOCK_MOVEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
    } catch {
      return INITIAL_STOCK_MOVEMENTS;
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  const addNotification = (message: string, type: AppNotification['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newNotif: AppNotification = { id, type, message, timestamp: new Date().toLocaleTimeString('pt-BR') };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    let discount = 0;
    // Coupon discounts
    if (appliedCoupon === 'KEISIDE10') {
      discount += cartSubtotal * 0.10;
    } else if (appliedCoupon === 'PRIMEIRACOMPRA') {
      discount += 15.00;
    } else if (appliedCoupon === 'BLACK20') {
      discount += cartSubtotal * 0.20;
    }

    // Automatic discount: 2 or more t-shirts gets 10% OFF
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems >= 2 && !appliedCoupon) {
      discount += cartSubtotal * 0.10; // Automatic combo discount as per briefing item 7
    }

    return Math.min(discount, cartSubtotal);
  }, [cart, cartSubtotal, appliedCoupon]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscount);
  }, [cartSubtotal, cartDiscount]);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'KEISIDE10') {
      setAppliedCoupon('KEISIDE10');
      addNotification('Cupom KEISIDE10 aplicado! 10% de desconto.', 'success');
      return { success: true, message: '10% de desconto aplicado!' };
    }
    if (cleanCode === 'PRIMEIRACOMPRA') {
      setAppliedCoupon('PRIMEIRACOMPRA');
      addNotification('Cupom PRIMEIRACOMPRA aplicado! R$ 15,00 OFF.', 'success');
      return { success: true, message: 'R$ 15,00 de desconto aplicado!' };
    }
    if (cleanCode === 'BLACK20') {
      setAppliedCoupon('BLACK20');
      addNotification('Cupom BLACK20 aplicado! 20% de desconto.', 'success');
      return { success: true, message: '20% de desconto aplicado!' };
    }
    return { success: false, message: 'Cupom inválido ou expirado. Tente KEISIDE10 ou PRIMEIRACOMPRA.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addNotification('Cupom removido.', 'info');
  };

  const addToCart = (
    product: Product, 
    size: ShirtSize, 
    color: ShirtColor, 
    quantity: number = 1, 
    isUpsell: boolean = false
  ) => {
    // Check available stock
    const available = product.stockBySize[size] || 0;
    const currentInCart = cart.find(
      (item) => item.product.id === product.id && item.size === size && item.color.id === color.id
    )?.quantity || 0;

    if (currentInCart + quantity > available) {
      addNotification(`Estoque insuficiente para o tamanho ${size}. Restam apenas ${available} unidades.`, 'warning');
      return;
    }

    const cartItemId = `${product.id}-${size}-${color.id}`;
    // Upsell special price if applicable
    const unitPrice = isUpsell ? Number((product.price * 0.85).toFixed(2)) : product.price;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: updated[existingIndex].unitPrice * newQty,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          size,
          color,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
          isUpsellItem: isUpsell,
        };
        return [...prev, newItem];
      }
    });

    addNotification(
      isUpsell 
        ? `🔥 Oferta especial de ${product.name} (${size}) adicionada ao carrinho!`
        : `Camiseta ${product.name} (${size} - ${color.name}) adicionada ao carrinho!`,
      'success'
    );
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    addNotification('Item removido do carrinho.', 'info');
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const available = item.product.stockBySize[item.size] || 0;
            if (newQty > available) {
              addNotification(`Estoque máximo atingido (${available} un).`, 'warning');
              return item;
            }
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now().toString().slice(-4)}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    setProducts((prev) => [newProduct, ...prev]);
    addNotification(`Produto "${newProduct.name}" cadastrado com sucesso!`, 'success');
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
    addNotification('Produto atualizado com sucesso!', 'success');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addNotification(`Produto "${prod?.name || id}" excluído.`, 'info');
  };

  // Stock Adjustment
  const adjustStock = (
    productId: string, 
    size: ShirtSize, 
    delta: number, 
    type: 'ENTRADA' | 'SAIDA' | 'AJUSTE', 
    reason: string
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const current = prod.stockBySize[size] || 0;
          const newStock = Math.max(0, current + delta);
          return {
            ...prod,
            stockBySize: {
              ...prod.stockBySize,
              [size]: newStock,
            },
          };
        }
        return prod;
      })
    );

    const targetProd = products.find((p) => p.id === productId);
    const newMovement: StockMovement = {
      id: `mov-${Date.now().toString().slice(-5)}`,
      productId,
      productName: targetProd?.name || 'Produto',
      size,
      type,
      quantity: delta,
      reason,
      date: new Date().toLocaleString('pt-BR'),
      responsible: 'Admin KEISIDE',
    };
    setStockMovements((prev) => [newMovement, ...prev]);
    addNotification(`Estoque do tamanho ${size} atualizado (${delta > 0 ? '+' : ''}${delta} un).`, 'success');
  };

  // Count low stock
  const lowStockItemsCount = useMemo(() => {
    let count = 0;
    products.forEach((prod) => {
      Object.entries(prod.stockBySize).forEach(([_, qty]) => {
        const numQty = Number(qty);
        if (numQty > 0 && numQty < 5) count++;
      });
    });
    return count;
  }, [products]);

  // Order creation
  const createOrder = ({
    customer,
    address,
    paymentMethod,
    shippingFee,
  }: {
    customer: { name: string; email: string; cpf: string; phone: string };
    address: Order['shippingAddress'];
    paymentMethod: PaymentMethod;
    shippingFee: number;
  }): Order => {
    const orderNumCode = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `KSI-${orderNumCode}`;
    const orderId = `ord-${Date.now().toString().slice(-5)}`;
    const nowIso = new Date().toISOString();

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      printName: item.product.printDesign.title,
      size: item.size,
      colorName: item.color.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.totalPrice,
      imageUrl: item.product.printDesign.imageUrl,
    }));

    const finalSubtotal = cartSubtotal;
    const finalDiscount = cartDiscount;
    const finalTotal = finalSubtotal - finalDiscount + shippingFee;
    const hasUpsell = cart.some((item) => item.isUpsellItem);

    // Auto-generate invoice key
    const randomNfePart = Math.floor(100000000000 + Math.random() * 900000000000);
    const nfeKey = `35260904812345000199550010000${orderNumCode}${randomNfePart}`.slice(0, 44);

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      createdAt: nowIso,
      updatedAt: nowIso,
      customerId: `cust-${customer.cpf.replace(/\D/g, '').slice(0, 6)}`,
      customerName: customer.name,
      customerEmail: customer.email,
      customerCpf: customer.cpf,
      customerPhone: customer.phone,
      shippingAddress: address,
      items: orderItems,
      subtotal: finalSubtotal,
      discount: finalDiscount,
      shippingFee,
      total: finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'PIX' || paymentMethod === 'CARTAO_CREDITO' ? 'APROVADO' : 'AGUARDANDO',
      orderStatus: paymentMethod === 'BOLETO' ? 'PENDENTE' : 'PAGO',
      trackingCode: `BR${orderNumCode}KSI`,
      nfeKey,
      nfeNumber: `000.0${orderNumCode}`,
      nfeIssuedAt: nowIso,
      upsellAccepted: hasUpsell,
    };

    // Update stock for purchased items
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingCartItems = cart.filter((item) => item.product.id === prod.id);
        if (matchingCartItems.length === 0) return prod;

        const updatedStock = { ...prod.stockBySize };
        matchingCartItems.forEach((ci) => {
          updatedStock[ci.size] = Math.max(0, (updatedStock[ci.size] || 0) - ci.quantity);
        });
        return {
          ...prod,
          stockBySize: updatedStock,
        };
      })
    );

    // Record stock movements
    cart.forEach((ci) => {
      const movement: StockMovement = {
        id: `mov-sale-${Date.now().toString().slice(-5)}-${ci.size}`,
        productId: ci.product.id,
        productName: ci.product.name,
        size: ci.size,
        type: 'VENDA',
        quantity: -ci.quantity,
        reason: `Venda do Pedido #${orderNumber}`,
        date: new Date().toLocaleString('pt-BR'),
        responsible: 'Sistema E-commerce',
      };
      setStockMovements((prev) => [movement, ...prev]);
    });

    // Upsert customer in customer list
    setCustomers((prev) => {
      const cleanCpf = customer.cpf;
      const existing = prev.find((c) => c.cpf === cleanCpf || c.email === customer.email);
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalSpent: c.totalSpent + finalTotal,
                ordersCount: c.ordersCount + 1,
                lastOrderDate: nowIso.split('T')[0],
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now().toString().slice(-4)}`,
          name: customer.name,
          email: customer.email,
          cpf: customer.cpf,
          phone: customer.phone,
          city: address.city,
          state: address.state,
          totalSpent: finalTotal,
          ordersCount: 1,
          lastOrderDate: nowIso.split('T')[0],
          createdAt: nowIso.split('T')[0],
        };
        return [newCust, ...prev];
      }
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    addNotification(`Pedido #${orderNumber} realizado com sucesso!`, 'success');

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nowIso = new Date().toISOString();
          let tracking = ord.trackingCode;
          if (newStatus === 'ENVIADO' && !tracking) {
            tracking = `BR${ord.orderNumber.replace(/\D/g, '')}KSI`;
          }
          return {
            ...ord,
            orderStatus: newStatus,
            paymentStatus: newStatus === 'CANCELADO' ? 'RECUSADO' : 'APROVADO',
            updatedAt: nowIso,
            trackingCode: tracking,
          };
        }
        return ord;
      })
    );
    addNotification(`Status do pedido atualizado para "${newStatus}".`, 'info');
  };

  const generateNFeForOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId && !ord.nfeNumber) {
          const num = `000.0${ord.orderNumber.replace(/\D/g, '')}`;
          const nfeKey = `35260904812345000199550010000${ord.orderNumber.replace(/\D/g, '')}8899221144`.slice(0, 44);
          return {
            ...ord,
            nfeNumber: num,
            nfeKey,
            nfeIssuedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    addNotification('Nota Fiscal Eletrônica (NF-e) emitida e vinculada ao pedido!', 'success');
  };

  // Review operations
  const addProductReview = (reviewData: Omit<ProductReview, 'id' | 'createdAt' | 'likesCount'>) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      likesCount: 0,
    };

    setReviews((prev) => [newReview, ...prev]);

    // Update product calculated rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const productRevs = [newReview, ...reviews.filter((r) => r.productId === p.id)];
          const avg = productRevs.reduce((s, r) => s + r.rating, 0) / productRevs.length;
          return {
            ...p,
            averageRating: Number(avg.toFixed(1)),
            reviewsCount: productRevs.length,
          };
        }
        return p;
      })
    );

    addNotification('Sua avaliação foi enviada e publicada com sucesso! Obrigado pelo feedback.', 'success');
  };

  const likeProductReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, likesCount: (r.likesCount || 0) + 1 } : r))
    );
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const getProductRating = (productId: string) => {
    const prodReviews = reviews.filter((r) => r.productId === productId);
    if (prodReviews.length === 0) {
      return { average: 5.0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const sum = prodReviews.reduce((acc, r) => acc + r.rating, 0);
    const average = Number((sum / prodReviews.length).toFixed(1));
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    prodReviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });
    return { average, total: prodReviews.length, distribution };
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.STOCK_MOVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setCart([]);
    setReviews(INITIAL_REVIEWS);
    addNotification('Dados de demonstração restaurados com sucesso.', 'info');
  };

  const financialSummary = useMemo(() => {
    const validOrders = orders.filter((o) => o.orderStatus !== 'CANCELADO');
    const grossRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
    const totalCost = validOrders.reduce((sum, o) => {
      return sum + o.items.reduce((itemSum, item) => itemSum + 32.0 * item.quantity, 0);
    }, 0);
    const netProfit = grossRevenue - totalCost;
    const averageTicket = validOrders.length > 0 ? grossRevenue / validOrders.length : 0;

    return {
      grossRevenue,
      netProfit,
      averageTicket,
      totalOrders: orders.length,
    };
  }, [orders]);

  return (
    <StoreContext.Provider
      value={{
        viewMode,
        setViewMode,
        adminTab,
        setAdminTab,
        products,
        selectedProduct,
        setSelectedProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        categoryFilter: selectedCategory,
        setCategoryFilter: setSelectedCategory,
        selectedSizeFilter,
        setSelectedSizeFilter,
        sortBy,
        setSortBy,
        financialSummary,
        addProduct,
        updateProduct,
        deleteProduct,
        reviews,
        addProductReview,
        likeProductReview,
        getProductReviews,
        getProductRating,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orders,
        createOrder,
        updateOrderStatus,
        generateNFeForOrder,
        viewingOrder,
        setViewingOrder,
        viewingInvoiceOrder,
        setViewingInvoiceOrder,
        stockMovements,
        adjustStock,
        lowStockItemsCount,
        customers,
        notifications,
        addNotification,
        removeNotification,
        resetToDefaultData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
