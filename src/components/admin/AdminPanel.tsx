import React, { useState, useMemo } from 'react';
import { 
  Perfume, 
  Order, 
  OrderStatus, 
  StoreSettings, 
  PromoBannerConfig, 
  ProductStatus, 
  Gender, 
  PerfumeType 
} from '../../types';
import { 
  addPerfume, 
  updatePerfume, 
  deletePerfume, 
  updateOrderStatus, 
  deleteOrder, 
  saveSettings, 
  savePromoBanner, 
  setAdminAuthenticated,
  resetToInitialData,
  setAdminPassword
} from '../../services/storage';
import { formatAdminClientWhatsApp, getWhatsAppLink } from '../../utils/whatsapp';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Megaphone, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  Truck, 
  AlertTriangle, 
  X, 
  Upload, 
  MessageCircle, 
  ExternalLink,
  DollarSign,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

interface AdminPanelProps {
  perfumes: Perfume[];
  orders: Order[];
  settings: StoreSettings;
  promoBanner: PromoBannerConfig;
  onExitAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  perfumes,
  orders,
  settings,
  promoBanner,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pedidos' | 'productos' | 'banners' | 'configuracion'>('dashboard');

  // Search & Filters in Admin
  const [orderFilter, setOrderFilter] = useState<string>('todos');
  const [productSearch, setProductSearch] = useState<string>('');

  // Selected Order for viewing payment proof or full modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewingProofUrl, setViewingProofUrl] = useState<string | null>(null);

  // Product Add / Edit Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form states for Product
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<PerfumeType>('Eau de Parfum');
  const [formGender, setFormGender] = useState<Gender>('Unisex');
  const [formSizeMl, setFormSizeMl] = useState<number>(100);
  const [formPrice, setFormPrice] = useState<number>(350);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(450);
  const [formStock, setFormStock] = useState<number>(10);
  const [formStatus, setFormStatus] = useState<ProductStatus>('Disponible');
  const [formIsNew, setFormIsNew] = useState(false);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formIsOffer, setFormIsOffer] = useState(true);
  const [formMainImage, setFormMainImage] = useState('');
  const [formSalida, setFormSalida] = useState('');
  const [formCorazon, setFormCorazon] = useState('');
  const [formFondo, setFormFondo] = useState('');

  // Settings form states
  const [setWhatsappNum, setSetWhatsappNum] = useState(settings.whatsappNumber);
  const [setWhatsappDisp, setSetWhatsappDisp] = useState(settings.whatsappDisplay);
  const [setInsta, setSetInsta] = useState(settings.instagramUrl);
  const [setTikTok, setSetTikTok] = useState(settings.tiktokUrl);
  const [setHours, setSetHours] = useState(settings.businessHours);
  const [setZones, setSetZones] = useState(settings.deliveryZones);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // Promo Banner form states
  const [bannerActive, setBannerActive] = useState(promoBanner.isActive);
  const [bannerTitle, setBannerTitle] = useState(promoBanner.title);
  const [bannerSub, setBannerSub] = useState(promoBanner.subtitle);
  const [bannerDiscount, setBannerDiscount] = useState(promoBanner.discountText);
  const [bannerBtn, setBannerBtn] = useState(promoBanner.buttonText);
  const [bannerSavedMsg, setBannerSavedMsg] = useState(false);

  // Dashboard Metrics
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.createdAt.startsWith(todayStr));
    const salesToday = todayOrders.reduce((sum, o) => sum + (o.status !== 'Cancelado' ? o.total : 0), 0);

    const pendingCount = orders.filter(o => o.status === 'Pendiente').length;
    const preparingCount = orders.filter(o => o.status === 'Preparando pedido').length;
    const deliveredCount = orders.filter(o => o.status === 'Entregado').length;
    const outOfStockCount = perfumes.filter(p => p.stock <= 0 || p.status === 'Agotado').length;
    const availableCount = perfumes.filter(p => p.stock > 0 && p.status === 'Disponible').length;

    return {
      salesToday,
      pendingCount,
      preparingCount,
      deliveredCount,
      outOfStockCount,
      availableCount,
      totalOrders: orders.length,
    };
  }, [orders, perfumes]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderFilter === 'todos') return orders;
    return orders.filter(o => o.status === orderFilter);
  }, [orders, orderFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return perfumes;
    const q = productSearch.toLowerCase();
    return perfumes.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) || 
      p.gender.toLowerCase().includes(q)
    );
  }, [perfumes, productSearch]);

  const handleLogout = () => {
    setAdminAuthenticated(false);
    onExitAdmin();
  };

  // Open Product Modal (New or Edit)
  const handleOpenProductModal = (perfume?: Perfume) => {
    if (perfume) {
      setEditingProductId(perfume.id);
      setFormName(perfume.name);
      setFormBrand(perfume.brand);
      setFormDescription(perfume.description);
      setFormType(perfume.type);
      setFormGender(perfume.gender);
      setFormSizeMl(perfume.sizeMl);
      setFormPrice(perfume.price);
      setFormOriginalPrice(perfume.originalPrice || Math.round(perfume.price * 1.2));
      setFormStock(perfume.stock);
      setFormStatus(perfume.status);
      setFormIsNew(!!perfume.isNew);
      setFormIsBestSeller(!!perfume.isBestSeller);
      setFormIsOffer(!!perfume.isOffer);
      setFormMainImage(perfume.images?.[0] || '');
      setFormSalida(perfume.notes?.salida || '');
      setFormCorazon(perfume.notes?.corazon || '');
      setFormFondo(perfume.notes?.fondo || '');
    } else {
      setEditingProductId(null);
      setFormName('');
      setFormBrand('');
      setFormDescription('');
      setFormType('Eau de Parfum');
      setFormGender('Hombre');
      setFormSizeMl(100);
      setFormPrice(350);
      setFormOriginalPrice(420);
      setFormStock(10);
      setFormStatus('Disponible');
      setFormIsNew(true);
      setFormIsBestSeller(false);
      setFormIsOffer(true);
      setFormMainImage('');
      setFormSalida('');
      setFormCorazon('');
      setFormFondo('');
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const discountPercent = formOriginalPrice > formPrice
      ? Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100)
      : undefined;

    const productPayload = {
      name: formName.trim(),
      brand: formBrand.trim(),
      description: formDescription.trim(),
      type: formType,
      gender: formGender,
      sizeMl: Number(formSizeMl),
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice),
      discountPercent,
      stock: Number(formStock),
      status: formStatus,
      isNew: formIsNew,
      isBestSeller: formIsBestSeller,
      isOffer: formIsOffer,
      images: formMainImage ? [formMainImage] : [],
      notes: {
        salida: formSalida.trim(),
        corazon: formCorazon.trim(),
        fondo: formFondo.trim(),
      },
    };

    if (editingProductId) {
      updatePerfume(editingProductId, productPayload);
    } else {
      addPerfume(productPayload);
    }

    setIsProductModalOpen(false);
  };

  // Image Upload in Product Form
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormMainImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings({
      whatsappNumber: setWhatsappNum.trim(),
      whatsappDisplay: setWhatsappDisp.trim(),
      instagramUrl: setInsta.trim(),
      tiktokUrl: setTikTok.trim(),
      businessHours: setHours.trim(),
      deliveryZones: setZones.trim(),
      currency: 'S/',
    });

    if (newAdminPass.trim()) {
      setAdminPassword(newAdminPass.trim());
      setNewAdminPass('');
    }

    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 2500);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    savePromoBanner({
      ...promoBanner,
      isActive: bannerActive,
      title: bannerTitle.trim(),
      subtitle: bannerSub.trim(),
      discountText: bannerDiscount.trim(),
      buttonText: bannerBtn.trim(),
    });
    setBannerSavedMsg(true);
    setTimeout(() => setBannerSavedMsg(false), 2500);
  };

  const handleContactCustomerWhatsApp = (order: Order) => {
    const msg = formatAdminClientWhatsApp(order);
    const link = getWhatsAppLink(order.whatsapp, msg);
    window.open(link, '_blank');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pendiente':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm text-xs font-semibold">🟡 Pendiente</span>;
      case 'Confirmado':
        return <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-sm text-xs font-semibold">🔵 Confirmado</span>;
      case 'Preparando pedido':
        return <span className="text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-sm text-xs font-semibold">🟠 Preparando pedido</span>;
      case 'En camino':
        return <span className="text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-sm text-xs font-semibold">🟣 En camino</span>;
      case 'Entregado':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm text-xs font-semibold">🟢 Entregado</span>;
      case 'Cancelado':
        return <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-sm text-xs font-semibold">🔴 Cancelado</span>;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-zinc-950 text-white px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-sm">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 block">
              Panel Administrativo Privado
            </span>
            <h1 className="font-brand text-xl font-bold tracking-wider">
              KÖNIG WERT
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Tienda Pública</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Main Admin Navigation */}
      <nav className="bg-white border-b border-zinc-200 px-4 sm:px-8 flex items-center gap-1 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-3.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'border-zinc-950 text-zinc-950'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('pedidos')}
          className={`py-3.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'pedidos'
              ? 'border-zinc-950 text-zinc-950'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pedidos</span>
          {stats.pendingCount > 0 && (
            <span className="w-5 h-5 bg-amber-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center tabular-nums">
              {stats.pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('productos')}
          className={`py-3.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'productos'
              ? 'border-zinc-950 text-zinc-950'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Gestión de Perfumes</span>
          <span className="text-[11px] text-zinc-400 tabular-nums">({perfumes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`py-3.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'banners'
              ? 'border-zinc-950 text-zinc-950'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Banners & Ofertas</span>
        </button>

        <button
          onClick={() => setActiveTab('configuracion')}
          className={`py-3.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'configuracion'
              ? 'border-zinc-950 text-zinc-950'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Ajustes & WhatsApp</span>
        </button>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 border border-zinc-200 rounded-sm shadow-xs space-y-1">
                <span className="text-[11px] uppercase font-semibold text-zinc-400">Ventas de hoy</span>
                <p className="text-xl sm:text-2xl font-bold text-zinc-950 tabular-nums">
                  S/ {stats.salesToday.toFixed(0)}
                </p>
                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span>Pedidos hoy</span>
                </span>
              </div>

              <div className="bg-white p-4 border border-zinc-200 rounded-sm shadow-xs space-y-1">
                <span className="text-[11px] uppercase font-semibold text-zinc-400">Pedidos pendientes</span>
                <p className="text-xl sm:text-2xl font-bold text-amber-600 tabular-nums">
                  {stats.pendingCount}
                </p>
                <span className="text-[11px] text-zinc-500">Por confirmar</span>
              </div>

              <div className="bg-white p-4 border border-zinc-200 rounded-sm shadow-xs space-y-1">
                <span className="text-[11px] uppercase font-semibold text-zinc-400">En preparación</span>
                <p className="text-xl sm:text-2xl font-bold text-orange-600 tabular-nums">
                  {stats.preparingCount}
                </p>
                <span className="text-[11px] text-zinc-500">Empacando</span>
              </div>

              <div className="bg-white p-4 border border-zinc-200 rounded-sm shadow-xs space-y-1">
                <span className="text-[11px] uppercase font-semibold text-zinc-400">Entregados</span>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600 tabular-nums">
                  {stats.deliveredCount}
                </p>
                <span className="text-[11px] text-zinc-500">Completados</span>
              </div>

              <div className="bg-white p-4 border border-zinc-200 rounded-sm shadow-xs space-y-1">
                <span className="text-[11px] uppercase font-semibold text-zinc-400">Disponibles</span>
                <p className="text-xl sm:text-2xl font-bold text-zinc-900 tabular-nums">
                  {stats.availableCount}
                </p>
                <span className="text-[11px] text-zinc-500">Con stock activo</span>
              </div>

              <div className="bg-white p-4 border border-zinc-200 rounded-sm shadow-xs space-y-1">
                <span className="text-[11px] uppercase font-semibold text-zinc-400">Sin stock</span>
                <p className="text-xl sm:text-2xl font-bold text-red-600 tabular-nums">
                  {stats.outOfStockCount}
                </p>
                <span className="text-[11px] text-zinc-500">Por reponer</span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Table */}
            <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <h3 className="font-brand text-lg font-bold text-zinc-950">
                    Últimos Pedidos Registrados
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Monitorea en tiempo real los pedidos realizados por tus clientes.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('pedidos')}
                  className="text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
                >
                  Ver todos los pedidos →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-4">Pedido / Fecha</th>
                      <th className="py-3 px-4">Cliente / Celular</th>
                      <th className="py-3 px-4">Perfume(s)</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Pago</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-zinc-900">{order.orderNumber}</span>
                          <span className="block text-[11px] text-zinc-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-zinc-900">{order.clientName}</span>
                          <span className="block text-[11px] text-zinc-500">{order.whatsapp}</span>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate">
                          {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                        </td>
                        <td className="py-3 px-4 font-bold text-zinc-950 tabular-nums">
                          S/ {order.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          {order.hasPaid ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Pagado</span>
                            </span>
                          ) : (
                            <span className="text-amber-700 font-medium">Por coordinar</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded cursor-pointer"
                            title="Ver detalles"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleContactCustomerWhatsApp(order)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded cursor-pointer"
                            title="Contactar por WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PEDIDOS */}
        {activeTab === 'pedidos' && (
          <div className="space-y-4">
            <div className="bg-white p-4 sm:p-6 border border-zinc-200 rounded-sm shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-brand text-xl font-bold text-zinc-950">
                  Control de Pedidos
                </h3>
                <p className="text-xs text-zinc-500">
                  Cambia manualmente el estado de cada pedido y revisa los comprobantes adjuntos.
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(['todos', 'Pendiente', 'Confirmado', 'Preparando pedido', 'En camino', 'Entregado', 'Cancelado'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-sm whitespace-nowrap cursor-pointer transition-colors ${
                        orderFilter === st
                          ? 'bg-zinc-950 text-white'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {st === 'todos' ? 'Todos' : st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
                    <tr>
                      <th className="py-3.5 px-4">Pedido / Fecha</th>
                      <th className="py-3.5 px-4">Cliente / Contacto</th>
                      <th className="py-3.5 px-4">Entrega</th>
                      <th className="py-3.5 px-4">Detalle Items</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Comprobante</th>
                      <th className="py-3.5 px-4">Cambiar Estado</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-zinc-400">
                          No hay pedidos con el estado seleccionado.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-zinc-900 block">{order.orderNumber}</span>
                            <span className="text-[11px] text-zinc-400">
                              {new Date(order.createdAt).toLocaleString()}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-zinc-900 block">{order.clientName}</span>
                            <span className="text-zinc-500">{order.whatsapp}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-zinc-800 font-medium">
                              {order.deliveryDate} ({order.deliveryTime})
                            </div>
                            <div className="text-[11px] text-zinc-500 truncate max-w-xs" title={`${order.address}, ${order.city}`}>
                              {order.address}, {order.city}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {order.items.map((it, i) => (
                              <div key={i} className="text-zinc-700">
                                • {it.name} <span className="font-bold">x{it.quantity}</span>
                              </div>
                            ))}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-zinc-950 tabular-nums">
                            S/ {order.total.toFixed(2)}
                          </td>

                          <td className="py-3.5 px-4">
                            {order.paymentProofUrl ? (
                              <button
                                onClick={() => setViewingProofUrl(order.paymentProofUrl!)}
                                className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Ver Voucher</span>
                              </button>
                            ) : (
                              <span className="text-zinc-400 italic text-[11px]">
                                {order.hasPaid ? 'Marcó Pagado (Sin voucher)' : 'No pagado aún'}
                              </span>
                            )}
                          </td>

                          {/* Quick Status Dropdown */}
                          <td className="py-3.5 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="px-2 py-1 text-xs border border-zinc-300 rounded-sm bg-white font-medium focus:outline-none focus:border-zinc-950"
                            >
                              <option value="Pendiente">🟡 Pendiente</option>
                              <option value="Confirmado">🔵 Confirmado</option>
                              <option value="Preparando pedido">🟠 Preparando pedido</option>
                              <option value="En camino">🟣 En camino</option>
                              <option value="Entregado">🟢 Entregado</option>
                              <option value="Cancelado">🔴 Cancelado</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded cursor-pointer"
                              title="Ver ficha completa"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleContactCustomerWhatsApp(order)}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded cursor-pointer"
                              title="Escribir al cliente por WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar pedido ${order.orderNumber}?`)) {
                                  deleteOrder(order.id);
                                }
                              }}
                              className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded cursor-pointer"
                              title="Eliminar pedido"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTOS */}
        {activeTab === 'productos' && (
          <div className="space-y-4">
            <div className="bg-white p-4 sm:p-6 border border-zinc-200 rounded-sm shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-brand text-xl font-bold text-zinc-950">
                  Inventario de Perfumes
                </h3>
                <p className="text-xs text-zinc-500">
                  Agrega, edita o retira perfumes del catálogo público de König Wert.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar perfume..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <button
                  onClick={() => handleOpenProductModal()}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>AGREGAR PERFUME</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-4">Foto / Perfume</th>
                      <th className="py-3 px-4">Marca / Género</th>
                      <th className="py-3 px-4">Precio Actual</th>
                      <th className="py-3 px-4">Precio Orig. / Desc.</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Etiquetas</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredProducts.map((p) => {
                      const img = p.images?.[0] || '';
                      return (
                        <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-sm p-1 shrink-0 flex items-center justify-center">
                              {img ? (
                                <img src={img} alt={p.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-[10px] text-zinc-400">Sin foto</span>
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-zinc-950 block">{p.name}</span>
                              <span className="text-[11px] text-zinc-400">{p.type} · {p.sizeMl} ml</span>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-zinc-800 block">{p.brand}</span>
                            <span className="text-[11px] text-zinc-500">{p.gender}</span>
                          </td>

                          <td className="py-3 px-4 font-bold text-zinc-950 tabular-nums">
                            S/ {p.price.toFixed(2)}
                          </td>

                          <td className="py-3 px-4">
                            {p.originalPrice ? (
                              <div>
                                <span className="line-through text-zinc-400 tabular-nums">
                                  S/ {p.originalPrice.toFixed(2)}
                                </span>
                                {p.discountPercent && (
                                  <span className="ml-1.5 text-red-600 font-bold">
                                    -{p.discountPercent}%
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-zinc-400">-</span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`font-semibold tabular-nums ${p.stock <= 2 ? 'text-red-600' : 'text-zinc-800'}`}>
                              {p.stock} unids.
                            </span>
                          </td>

                          <td className="py-3 px-4 space-x-1">
                            {p.isOffer && (
                              <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                OFERTA
                              </span>
                            )}
                            {p.isBestSeller && (
                              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                MÁS VENDIDO
                              </span>
                            )}
                            {p.isNew && (
                              <span className="bg-zinc-100 text-zinc-800 border border-zinc-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                NUEVO
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`text-xs font-semibold ${
                              p.status === 'Disponible' 
                                ? 'text-emerald-700' 
                                : p.status === 'Agotado' 
                                ? 'text-red-600' 
                                : 'text-zinc-400'
                            }`}>
                              {p.status}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenProductModal(p)}
                              className="p-1.5 text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded cursor-pointer"
                              title="Editar producto"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar ${p.name}?`)) {
                                  deletePerfume(p.id);
                                }
                              }}
                              className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded cursor-pointer"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BANNERS & OFERTAS */}
        {activeTab === 'banners' && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 border border-zinc-200 rounded-sm shadow-xs space-y-6">
            <div>
              <h3 className="font-brand text-xl font-bold text-zinc-950">
                Banner Promocional Superior
              </h3>
              <p className="text-xs text-zinc-500">
                Personaliza la barra de ofertas que se muestra a los visitantes en la parte superior.
              </p>
            </div>

            {bannerSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Configuración de banner actualizada correctamente.</span>
              </div>
            )}

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="bannerActiveCheck"
                  checked={bannerActive}
                  onChange={(e) => setBannerActive(e.target.checked)}
                  className="w-4 h-4 accent-zinc-950 cursor-pointer"
                />
                <label htmlFor="bannerActiveCheck" className="text-xs font-semibold text-zinc-800 cursor-pointer">
                  Activar banner de ofertas en la tienda
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Texto de Descuento (Destacado)
                </label>
                <input
                  type="text"
                  value={bannerDiscount}
                  onChange={(e) => setBannerDiscount(e.target.value)}
                  placeholder="Ej. Hasta 30% OFF"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Título del Banner
                </label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="Ej. OFERTA ESPECIAL DE TEMPORADA"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Subtítulo / Detalle
                </label>
                <input
                  type="text"
                  value={bannerSub}
                  onChange={(e) => setBannerSub(e.target.value)}
                  placeholder="Ej. Envío preferencial a todo el Perú y muestra de regalo"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={bannerBtn}
                  onChange={(e) => setBannerBtn(e.target.value)}
                  placeholder="VER OFERTAS"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Guardar Cambios del Banner
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: CONFIGURACIÓN */}
        {activeTab === 'configuracion' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 sm:p-8 border border-zinc-200 rounded-sm shadow-xs space-y-6">
              <div>
                <h3 className="font-brand text-xl font-bold text-zinc-950">
                  Configuración de Contacto & WhatsApp
                </h3>
                <p className="text-xs text-zinc-500">
                  Este número recibirá todos los pedidos y consultas de los clientes.
                </p>
              </div>

              {settingsSavedMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Ajustes guardados correctamente.</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Número de WhatsApp (con código de país, sin espacios)
                  </label>
                  <input
                    type="text"
                    required
                    value={setWhatsappNum}
                    onChange={(e) => setSetWhatsappNum(e.target.value)}
                    placeholder="Ej. 51901697759"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950 font-mono"
                  />
                  <span className="text-[11px] text-zinc-400">
                    Número oficial actual de König Wert: 901 697 759 (51901697759)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    WhatsApp para Mostrar en Pantalla
                  </label>
                  <input
                    type="text"
                    value={setWhatsappDisp}
                    onChange={(e) => setSetWhatsappDisp(e.target.value)}
                    placeholder="Ej. 901 697 759"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    value={setHours}
                    onChange={(e) => setSetHours(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Zonas de Despacho
                  </label>
                  <input
                    type="text"
                    value={setZones}
                    onChange={(e) => setSetZones(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      URL de Instagram
                    </label>
                    <input
                      type="text"
                      value={setInsta}
                      onChange={(e) => setSetInsta(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      URL de TikTok
                    </label>
                    <input
                      type="text"
                      value={setTikTok}
                      onChange={(e) => setSetTikTok(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Cambiar Contraseña de Administrador (Opcional)
                  </label>
                  <input
                    type="password"
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    placeholder="Nueva contraseña"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    Guardar Ajustes
                  </button>
                </div>
              </form>
            </div>

            {/* Maintenance & Demo Reset */}
            <div className="bg-white p-6 sm:p-8 border border-zinc-200 rounded-sm shadow-xs space-y-6">
              <div>
                <h3 className="font-brand text-xl font-bold text-zinc-950">
                  Mantenimiento del Sistema
                </h3>
                <p className="text-xs text-zinc-500">
                  Acciones administrativas y restablecimiento del catálogo.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-zinc-600" />
                  Restablecer Catálogo Demo
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Si deseas volver a cargar los productos iniciales (Dior Sauvage, Chanel Coco Mademoiselle, Baccarat Rouge, Creed Aventus, etc.) con sus fotos y precios de muestra.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Restablecer el catálogo y pedidos con los datos demo oficiales de König Wert?')) {
                      resetToInitialData();
                      alert('Datos demo restablecidos con éxito.');
                    }
                  }}
                  className="px-4 py-2 border border-zinc-400 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-sm transition-colors cursor-pointer"
                >
                  Restablecer a Datos Iniciales
                </button>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-2 text-xs text-zinc-600">
                <span className="font-bold text-zinc-900 block">Identidad de Marca:</span>
                <p>• Razón Social: König Wert Perfumes</p>
                <p>• Moneda: Soles Peruanos (S/)</p>
                <p>• Teléfono oficial: 901 697 759</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div 
            className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden my-6 border border-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-zinc-950 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                  Inventario König Wert
                </span>
                <h3 className="font-brand text-lg font-bold">
                  {editingProductId ? 'Editar Perfume' : 'Agregar Nuevo Perfume'}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Nombre del Perfume *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Sauvage"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Marca *
                  </label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Ej. Dior"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Categoría / Tipo
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as PerfumeType)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-sm bg-white focus:outline-none focus:border-zinc-950"
                  >
                    <option value="Eau de Parfum">Eau de Parfum (EDP)</option>
                    <option value="Eau de Toilette">Eau de Toilette (EDT)</option>
                    <option value="Parfum">Parfum</option>
                    <option value="Extrait de Parfum">Extrait de Parfum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Género
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as Gender)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-sm bg-white focus:outline-none focus:border-zinc-950"
                  >
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Tamaño (ml)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={formSizeMl}
                    onChange={(e) => setFormSizeMl(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-3 gap-3 bg-zinc-50 p-3 rounded-sm border border-zinc-200">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Precio Actual (S/) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-sm bg-white focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Precio Original (S/)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-sm bg-white focus:outline-none focus:border-zinc-950"
                  />
                  {formOriginalPrice > formPrice && (
                    <span className="text-[10px] text-red-600 font-bold block mt-0.5">
                      -{Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100)}% de descuento
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Stock en Unidades
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-sm bg-white focus:outline-none focus:border-zinc-950"
                  />
                </div>
              </div>

              {/* Status and Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Disponibilidad / Estado
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ProductStatus)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-sm bg-white focus:outline-none focus:border-zinc-950"
                  >
                    <option value="Disponible">Disponible (En venta)</option>
                    <option value="Agotado">Agotado</option>
                    <option value="Oculto">Oculto (Borrador)</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-4 sm:pt-6">
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsOffer}
                      onChange={(e) => setFormIsOffer(e.target.checked)}
                      className="accent-zinc-950"
                    />
                    <span>Oferta</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsBestSeller}
                      onChange={(e) => setFormIsBestSeller(e.target.checked)}
                      className="accent-zinc-950"
                    />
                    <span>Más Vendido</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsNew}
                      onChange={(e) => setFormIsNew(e.target.checked)}
                      className="accent-zinc-950"
                    />
                    <span>Nuevo</span>
                  </label>
                </div>
              </div>

              {/* Image Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-700">
                  Fotografía Principal del Perfume
                </label>
                <div className="flex items-center gap-4">
                  <label className="px-4 py-2 border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold rounded-sm cursor-pointer transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Subir Imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    value={formMainImage.startsWith('data:') ? '(Imagen cargada localmente)' : formMainImage}
                    onChange={(e) => setFormMainImage(e.target.value)}
                    placeholder="O pega URL directa de la imagen..."
                    className="flex-1 px-3 py-2 text-xs border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />

                  {formMainImage && (
                    <div className="w-10 h-10 border border-zinc-300 rounded overflow-hidden shrink-0">
                      <img src={formMainImage} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalles sobre el aroma, longevidad y estela..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                />
              </div>

              {/* Olfactory Notes */}
              <div className="space-y-2 pt-2 border-t border-zinc-200">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 block">
                  Pirámide Olfativa (Opcional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={formSalida}
                    onChange={(e) => setFormSalida(e.target.value)}
                    placeholder="Salida (ej. Bergamota)"
                    className="px-2.5 py-1.5 text-xs border border-zinc-300 rounded-sm"
                  />
                  <input
                    type="text"
                    value={formCorazon}
                    onChange={(e) => setFormCorazon(e.target.value)}
                    placeholder="Corazón (ej. Lavanda)"
                    className="px-2.5 py-1.5 text-xs border border-zinc-300 rounded-sm"
                  />
                  <input
                    type="text"
                    value={formFondo}
                    onChange={(e) => setFormFondo(e.target.value)}
                    placeholder="Fondo (ej. Cedro, Ámbar)"
                    className="px-2.5 py-1.5 text-xs border border-zinc-300 rounded-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 text-xs font-semibold rounded-sm hover:bg-zinc-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Guardar Perfume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div 
            className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden border border-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-zinc-950 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                  Ficha de Pedido
                </span>
                <h3 className="font-brand text-lg font-bold">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-sm border border-zinc-200">
                <span className="font-semibold text-zinc-700">Estado actual:</span>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-zinc-800 uppercase tracking-wider text-[11px]">Cliente</span>
                <p className="text-zinc-900 font-semibold text-sm">{selectedOrder.clientName}</p>
                <p className="text-zinc-600">WhatsApp: {selectedOrder.whatsapp}</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-zinc-100">
                <span className="font-bold text-zinc-800 uppercase tracking-wider text-[11px]">Entrega</span>
                <p className="text-zinc-700">Fecha solicitada: <span className="font-semibold">{selectedOrder.deliveryDate}</span> ({selectedOrder.deliveryTime})</p>
                <p className="text-zinc-700">Dirección: {selectedOrder.address}, {selectedOrder.city}</p>
                {selectedOrder.reference && (
                  <p className="text-zinc-500">Ref: {selectedOrder.reference}</p>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <span className="font-bold text-zinc-800 uppercase tracking-wider text-[11px]">Productos</span>
                {selectedOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between items-center py-1">
                    <span>{it.name} (x{it.quantity})</span>
                    <span className="font-bold tabular-nums">S/ {(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-zinc-200 font-bold text-sm text-zinc-950">
                  <span>Total:</span>
                  <span className="tabular-nums font-brand">S/ {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.paymentProofUrl && (
                <div className="pt-2 border-t border-zinc-100">
                  <span className="font-bold text-zinc-800 uppercase tracking-wider text-[11px] block mb-1">Comprobante de Pago</span>
                  <img
                    src={selectedOrder.paymentProofUrl}
                    alt="Comprobante"
                    className="max-h-48 rounded border border-zinc-200 object-contain cursor-pointer hover:opacity-90"
                    onClick={() => setViewingProofUrl(selectedOrder.paymentProofUrl!)}
                  />
                </div>
              )}

              {selectedOrder.notes && (
                <div className="pt-2 border-t border-zinc-100">
                  <span className="font-bold text-zinc-800 uppercase tracking-wider text-[11px] block">Notas del Cliente:</span>
                  <p className="text-zinc-600 italic">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => handleContactCustomerWhatsApp(selectedOrder)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Escribir por WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PAYMENT PROOF VIEWER */}
      {viewingProofUrl && (
        <div 
          className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setViewingProofUrl(null)}
        >
          <div className="relative max-w-xl max-h-[90vh] bg-white p-2 rounded shadow-2xl">
            <button
              onClick={() => setViewingProofUrl(null)}
              className="absolute -top-3 -right-3 p-1.5 bg-zinc-950 text-white rounded-full hover:bg-zinc-800 cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={viewingProofUrl}
              alt="Comprobante de pago"
              className="max-h-[85vh] w-auto mx-auto object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};
