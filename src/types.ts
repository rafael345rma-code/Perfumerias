export type Gender = 'Hombre' | 'Mujer' | 'Unisex';
export type PerfumeType = 'Parfum' | 'Eau de Parfum' | 'Eau de Toilette' | 'Extrait de Parfum';
export type ProductStatus = 'Disponible' | 'Agotado' | 'Oculto';

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  type: PerfumeType;
  gender: Gender;
  sizeMl: number;
  description: string;
  notes?: {
    salida?: string;
    corazon?: string;
    fondo?: string;
  };
  originalPrice?: number;
  price: number;
  discountPercent?: number;
  stock: number;
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isOffer?: boolean;
  status: ProductStatus;
  createdAt: string;
}

export type OrderStatus =
  | 'Pendiente'
  | 'Confirmado'
  | 'Preparando pedido'
  | 'En camino'
  | 'Entregado'
  | 'Cancelado';

export interface CartItem {
  perfume: Perfume;
  quantity: number;
}

export interface OrderItem {
  perfumeId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  clientName: string;
  whatsapp: string;
  deliveryDate: string;
  deliveryTime: string;
  city: string;
  address: string;
  reference: string;
  hasPaid: boolean;
  paymentProofUrl?: string; // base64 or URL
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  notes?: string;
}

export interface PromoBannerConfig {
  isActive: boolean;
  title: string;
  subtitle: string;
  discountText: string;
  buttonText: string;
  linkToOffer: boolean;
  startDate?: string;
  endDate?: string;
  backgroundColor: string;
}

export interface StoreSettings {
  whatsappNumber: string; // e.g. "51901697759"
  whatsappDisplay: string; // e.g. "901 697 759"
  instagramUrl: string;
  tiktokUrl: string;
  businessHours: string;
  deliveryZones: string;
  currency: string;
}
