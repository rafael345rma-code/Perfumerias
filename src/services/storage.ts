import { Perfume, Order, StoreSettings, PromoBannerConfig, OrderStatus } from '../types';
import { INITIAL_PERFUMES, INITIAL_ORDERS, INITIAL_SETTINGS, INITIAL_PROMO_BANNER } from '../data/initialData';

const PERFUMES_KEY = 'konig_wert_perfumes_v1';
const ORDERS_KEY = 'konig_wert_orders_v1';
const SETTINGS_KEY = 'konig_wert_settings_v1';
const BANNER_KEY = 'konig_wert_banner_v1';
const ADMIN_AUTH_KEY = 'konig_wert_admin_auth_v1';
const ADMIN_PASS_KEY = 'konig_wert_admin_password_v1';

// Custom event to notify all components about changes
const notifyChange = (eventType: string) => {
  window.dispatchEvent(new CustomEvent(`kw_storage_${eventType}`));
};

export const getPerfumes = (): Perfume[] => {
  try {
    const data = localStorage.getItem(PERFUMES_KEY);
    if (!data) {
      localStorage.setItem(PERFUMES_KEY, JSON.stringify(INITIAL_PERFUMES));
      return INITIAL_PERFUMES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_PERFUMES;
  }
};

export const savePerfumes = (perfumes: Perfume[]): void => {
  localStorage.setItem(PERFUMES_KEY, JSON.stringify(perfumes));
  notifyChange('perfumes');
};

export const addPerfume = (perfume: Omit<Perfume, 'id' | 'createdAt'>): Perfume => {
  const current = getPerfumes();
  const newPerfume: Perfume = {
    ...perfume,
    id: `kw-perf-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  savePerfumes([newPerfume, ...current]);
  return newPerfume;
};

export const updatePerfume = (id: string, updates: Partial<Perfume>): void => {
  const current = getPerfumes();
  const updated = current.map(p => (p.id === id ? { ...p, ...updates } : p));
  savePerfumes(updated);
};

export const deletePerfume = (id: string): void => {
  const current = getPerfumes();
  const updated = current.filter(p => p.id !== id);
  savePerfumes(updated);
};

// Orders
export const getOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    if (!data) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_ORDERS;
  }
};

export const saveOrders = (orders: Order[]): void => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  notifyChange('orders');
};

export const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order => {
  const current = getOrders();
  const orderNumber = `KW-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    orderNumber,
    createdAt: new Date().toISOString(),
    status: 'Pendiente',
  };

  saveOrders([newOrder, ...current]);

  // Decrease stock for ordered items
  const perfumes = getPerfumes();
  const updatedPerfumes = perfumes.map(p => {
    const orderedItem = newOrder.items.find(item => item.perfumeId === p.id);
    if (orderedItem) {
      const remainingStock = Math.max(0, p.stock - orderedItem.quantity);
      return {
        ...p,
        stock: remainingStock,
        status: remainingStock === 0 ? 'Agotado' : p.status,
      };
    }
    return p;
  });
  savePerfumes(updatedPerfumes);

  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: OrderStatus): void => {
  const current = getOrders();
  const updated = current.map(o => (o.id === orderId ? { ...o, status } : o));
  saveOrders(updated);
};

export const deleteOrder = (orderId: string): void => {
  const current = getOrders();
  const updated = current.filter(o => o.id !== orderId);
  saveOrders(updated);
};

// Settings
export const getSettings = (): StoreSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = (settings: StoreSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  notifyChange('settings');
};

// Promo Banner
export const getPromoBanner = (): PromoBannerConfig => {
  try {
    const data = localStorage.getItem(BANNER_KEY);
    if (!data) {
      localStorage.setItem(BANNER_KEY, JSON.stringify(INITIAL_PROMO_BANNER));
      return INITIAL_PROMO_BANNER;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_PROMO_BANNER;
  }
};

export const savePromoBanner = (banner: PromoBannerConfig): void => {
  localStorage.setItem(BANNER_KEY, JSON.stringify(banner));
  notifyChange('banner');
};

// Admin Auth
export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

export const setAdminAuthenticated = (value: boolean): void => {
  if (value) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
  notifyChange('auth');
};

// Owner Exclusive Mode (Only appears to the owner, invisible to visitors)
const OWNER_MODE_KEY = 'konig_wert_owner_device_unlocked_v1';

export const isOwnerModeUnlocked = (): boolean => {
  // If explicitly unlocked in localStorage
  if (localStorage.getItem(OWNER_MODE_KEY) === 'true') {
    return true;
  }
  // Check URL query parameters (e.g. ?owner=rafael, ?admin=true, #admin)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('owner') || params.get('admin') === 'true' || window.location.hash === '#admin') {
      localStorage.setItem(OWNER_MODE_KEY, 'true');
      return true;
    }
  }
  return false;
};

export const setOwnerModeUnlocked = (unlocked: boolean): void => {
  if (unlocked) {
    localStorage.setItem(OWNER_MODE_KEY, 'true');
  } else {
    localStorage.removeItem(OWNER_MODE_KEY);
  }
  notifyChange('owner_mode');
};

export const getAdminPassword = (): string => {
  return localStorage.getItem(ADMIN_PASS_KEY) || 'admin123';
};

export const setAdminPassword = (newPass: string): void => {
  localStorage.setItem(ADMIN_PASS_KEY, newPass);
};

// Reset to factory demo data if needed
export const resetToInitialData = (): void => {
  localStorage.setItem(PERFUMES_KEY, JSON.stringify(INITIAL_PERFUMES));
  localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(BANNER_KEY, JSON.stringify(INITIAL_PROMO_BANNER));
  notifyChange('all');
};
