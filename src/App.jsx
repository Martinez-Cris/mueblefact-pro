import React, { useState, useEffect, useReducer } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  FileText, 
  Download,
  Package,
  Users,
  ShoppingCart,
  X,
  Edit2,
  Check
} from 'lucide-react';

// ============================================================================
// REDUCERS Y ESTADO
// ============================================================================

const initialState = {
  clients: [],
  products: [
    { id: '1', name: 'Mesa Comedor', category: 'Mesa', sizes: ['120x80', '140x90', '160x100'], colors: ['Nogal', 'Roble', 'Blanco', 'Negro'] },
    { id: '2', name: 'Silla Moderna', category: 'Silla', sizes: ['Estándar'], colors: ['Nogal', 'Roble', 'Blanco', 'Negro', 'Gris'] },
    { id: '3', name: 'Puff Redondo', category: 'Puff', sizes: ['40cm', '50cm', '60cm'], colors: ['Beige', 'Gris', 'Azul', 'Verde'] },
    { id: '4', name: 'Sofá Modular', category: 'Sofá', sizes: ['2 Puestos', '3 Puestos', 'L-Shape'], colors: ['Beige', 'Gris', 'Azul Marino'] },
    { id: '5', name: 'Butaco Bar', category: 'Butaco', sizes: ['Alto', 'Medio'], colors: ['Negro', 'Blanco', 'Cromado'] },
  ],
  invoices: [],
  sets: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] };
    case 'DELETE_INVOICE':
      return { ...state, invoices: state.invoices.filter(i => i.id !== action.payload) };
    case 'ADD_SET':
      return { ...state, sets: [...state.sets, action.payload] };
    case 'DELETE_SET':
      return { ...state, sets: state.sets.filter(s => s.id !== action.payload) };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// ============================================================================
// UTILIDADES
// ============================================================================

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const generateCSV = (invoice, products) => {
  const headers = ['Cliente', 'CC/NIT', 'Teléfono', 'Correo', 'Dirección', 'Ciudad/País', 'Vendedor', 'Tipo', 'Producto', 'Medida', 'Color', 'Cantidad'];
  
  const rows = [headers];
  
  invoice.items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    rows.push([
      invoice.client.name,
      invoice.client.id,
      invoice.client.phone,
      invoice.client.email,
      invoice.client.address,
      invoice.client.location,
      invoice.client.seller,
      item.isSet ? 'SET' : 'INDIVIDUAL',
      item.isSet ? item.setName : product?.name || '',
      item.size || 'N/A',
      item.color || 'N/A',
      item.quantity
    ]);
    
    if (item.isSet && item.setItems) {
      item.setItems.forEach(setItem => {
        const setProduct = products.find(p => p.id === setItem.productId);
        rows.push([
          '', '', '', '', '', '', '',
          '  ↳ Componente',
          setProduct?.name || '',
          setItem.size || 'N/A',
          setItem.color || 'N/A',
          setItem.quantity
        ]);
      });
    }
  });
  
  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
};

const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ============================================================================
// COMPONENTES
// ============================================================================

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function ProductCatalogModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Mesa',
    sizes: '',
    colors: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      sizes: formData.sizes.split(',').map(s => s.trim()),
      colors: formData.colors.split(',').map(c => c.trim())
    };
    onAdd(newProduct);
    setFormData({ name: '', category: 'Mesa', sizes: '', colors: '' });
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agregar Producto al Catálogo">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Producto</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
          >
            <option>Mesa</option>
            <option>Silla</option>
            <option>Puff</option>
            <option>Sofá</option>
            <option>Butaco</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Medidas (separadas por comas)</label>
          <input
            type="text"
            value={formData.sizes}
            onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
            placeholder="120x80, 140x90, 160x100"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Colores (separados por comas)</label>
          <input
            type="text"
            value={formData.colors}
            onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
            placeholder="Nogal, Roble, Blanco"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-bold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
        >
          Agregar Producto
        </button>
      </form>
    </Modal>
  );
}

function SetBuilderModal({ isOpen, onClose, products, onAddSet }) {
  const [setName, setSetName] = useState('');
  const [setItems, setSetItems] = useState([]);
  
  const addItemToSet = () => {
    setSetItems([...setItems, { productId: '', size: '', color: '', quantity: 1 }]);
  };
  
  const updateSetItem = (index, field, value) => {
    const updated = [...setItems];
    updated[index][field] = value;
    setSetItems(updated);
  };
  
  const removeSetItem = (index) => {
    setSetItems(setItems.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (setName && setItems.length > 0) {
      onAddSet({
        id: Date.now().toString(),
        name: setName,
        items: setItems
      });
      setSetName('');
      setSetItems([]);
      onClose();
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Set Personalizado">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Set</label>
          <input
            type="text"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            placeholder="Ej: Comedor Mesa + 4 Sillas"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
            required
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">Componentes del Set</label>
            <button
              type="button"
              onClick={addItemToSet}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
            >
              <Plus size={16} /> Agregar
            </button>
          </div>
          
          {setItems.map((item, index) => {
            const selectedProduct = products.find(p => p.id === item.productId);
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-600">Componente {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeSetItem(index)}
                    className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <select
                  value={item.productId}
                  onChange={(e) => updateSetItem(index, 'productId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  required
                >
                  <option value="">Seleccionar Producto</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                
                {selectedProduct && (
                  <>
                    <select
                      value={item.size}
                      onChange={(e) => updateSetItem(index, 'size', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                      required
                    >
                      <option value="">Seleccionar Medida</option>
                      {selectedProduct.sizes.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    
                    <select
                      value={item.color}
                      onChange={(e) => updateSetItem(index, 'color', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                      required
                    >
                      <option value="">Seleccionar Color</option>
                      {selectedProduct.colors.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateSetItem(index, 'quantity', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                      placeholder="Cantidad"
                      required
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        <button
          type="submit"
          disabled={!setName || setItems.length === 0}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-bold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Crear Set
        </button>
      </form>
    </Modal>
  );
}

// ============================================================================
// APLICACIÓN PRINCIPAL
// ============================================================================

export default function FurnitureBillingApp() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [activeView, setActiveView] = useState('new-invoice');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSetModal, setShowSetModal] = useState(false);
  
  // Estado del formulario de cliente
  const [clientForm, setClientForm] = useState({
    name: '',
    id: '',
    phone: '',
    email: '',
    address: '',
    location: '',
    seller: ''
  });
  
  // Estado de items del pedido
  const [orderItems, setOrderItems] = useState([]);
  
  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedData = loadFromLocalStorage('furnitureBillingApp');
    if (savedData) {
      dispatch({ type: 'LOAD_STATE', payload: savedData });
    }
  }, []);
  
  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    saveToLocalStorage('furnitureBillingApp', state);
  }, [state]);
  
  const addProductToOrder = () => {
    setOrderItems([...orderItems, {
      id: Date.now().toString(),
      productId: '',
      size: '',
      color: '',
      quantity: 1,
      isSet: false
    }]);
  };
  
  const addSetToOrder = (set) => {
    setOrderItems([...orderItems, {
      id: Date.now().toString(),
      isSet: true,
      setId: set.id,
      setName: set.name,
      setItems: set.items,
      quantity: 1
    }]);
  };
  
  const updateOrderItem = (id, field, value) => {
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  
  const removeOrderItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };
  
  const saveInvoice = () => {
    if (!clientForm.name || orderItems.length === 0) {
      alert('Por favor completa los datos del cliente y agrega al menos un producto');
      return;
    }
    
    const invoice = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      client: clientForm,
      items: orderItems
    };
    
    dispatch({ type: 'ADD_INVOICE', payload: invoice });
    
    // Limpiar formulario
    setClientForm({
      name: '',
      id: '',
      phone: '',
      email: '',
      address: '',
      location: '',
      seller: ''
    });
    setOrderItems([]);
    
    alert('✅ Factura guardada exitosamente');
  };
  
  const exportToCSV = (invoice) => {
    const csv = generateCSV(invoice, state.products);
    const fileName = `orden_produccion_${invoice.client.name.replace(/\s/g, '_')}_${new Date(invoice.date).toLocaleDateString()}.csv`;
    downloadCSV(csv, fileName);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 text-white shadow-2xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Package size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">MuebleFact Pro</h1>
                <p className="text-amber-100 text-sm font-medium">Sistema de Facturación & Producción</p>
              </div>
            </div>
            
            <nav className="flex gap-3">
              <button
                onClick={() => setActiveView('new-invoice')}
                className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                  activeView === 'new-invoice' 
                    ? 'bg-white text-amber-700 shadow-lg' 
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  <span>Nueva Factura</span>
                </div>
              </button>
              <button
                onClick={() => setActiveView('invoices')}
                className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                  activeView === 'invoices' 
                    ? 'bg-white text-amber-700 shadow-lg' 
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <span>Facturas</span>
                </div>
              </button>
              <button
                onClick={() => setActiveView('catalog')}
                className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                  activeView === 'catalog' 
                    ? 'bg-white text-amber-700 shadow-lg' 
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package size={18} />
                  <span>Catálogo</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeView === 'new-invoice' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Columna Izquierda: Datos del Cliente */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-amber-100 h-fit">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-xl">
                  <Users size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-800">Datos del Cliente</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo / Razón Social</label>
                  <input
                    type="text"
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors font-medium"
                    placeholder="Ej: Juan Pérez / Muebles S.A.S"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">C.C / NIT</label>
                    <input
                      type="text"
                      value={clientForm.id}
                      onChange={(e) => setClientForm({ ...clientForm, id: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors font-medium"
                      placeholder="123456789"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={clientForm.phone}
                      onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors font-medium"
                      placeholder="300 123 4567"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors font-medium"
                    placeholder="cliente@ejemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Dirección</label>
                  <input
                    type="text"
                    value={clientForm.address}
                    onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors font-medium"
                    placeholder="Calle 123 #45-67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ciudad / País</label>
                  <input
                    type="text"
                    value={clientForm.location}
                    onChange={(e) => setClientForm({ ...clientForm, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors font-medium"
                    placeholder="Bogotá, Colombia"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Vendedor</label>
                  <input
                    type="text"
                    value={clientForm.seller}
                    onChange={(e) => setClientForm({ ...clientForm, seller: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors font-medium"
                    placeholder="Nombre del vendedor"
                  />
                </div>
              </div>
            </div>
            
            {/* Columna Derecha: Constructor de Pedidos */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-orange-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-xl">
                    <ShoppingCart size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-800">Pedido</h2>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={addProductToOrder}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all font-bold shadow-md hover:shadow-lg"
                  >
                    <Plus size={18} />
                    Producto
                  </button>
                  <button
                    onClick={() => setShowSetModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-bold shadow-md hover:shadow-lg"
                  >
                    <Plus size={18} />
                    Set
                  </button>
                </div>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {orderItems.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Package size={64} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-bold">No hay productos en el pedido</p>
                    <p className="text-sm">Agrega productos individuales o sets personalizados</p>
                  </div>
                ) : (
                  orderItems.map((item) => {
                    if (item.isSet) {
                      return (
                        <div key={item.id} className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">SET</span>
                                <span className="font-bold text-gray-800">{item.setName}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeOrderItem(item.id)}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                          <div className="space-y-2 pl-4 border-l-4 border-orange-300 ml-2 mb-3">
                            {item.setItems.map((setItem, idx) => {
                              const product = state.products.find(p => p.id === setItem.productId);
                              return (
                                <div key={idx} className="text-sm text-gray-700">
                                  <span className="font-semibold">{setItem.quantity}x {product?.name}</span>
                                  <span className="text-gray-500"> - {setItem.size} / {setItem.color}</span>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-gray-700">Cantidad de Sets:</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateOrderItem(item.id, 'quantity', parseInt(e.target.value))}
                              className="w-20 px-3 py-1.5 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none font-bold"
                            />
                          </div>
                        </div>
                      );
                    } else {
                      const selectedProduct = state.products.find(p => p.id === item.productId);
                      return (
                        <div key={item.id} className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-700">Producto Individual</span>
                            <button
                              onClick={() => removeOrderItem(item.id)}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                          <select
                            value={item.productId}
                            onChange={(e) => updateOrderItem(item.id, 'productId', e.target.value)}
                            className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none font-medium"
                          >
                            <option value="">Seleccionar Producto</option>
                            {state.products.map(p => (
                              <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                            ))}
                          </select>
                          
                          {selectedProduct && (
                            <>
                              <select
                                value={item.size}
                                onChange={(e) => updateOrderItem(item.id, 'size', e.target.value)}
                                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none font-medium"
                              >
                                <option value="">Seleccionar Medida</option>
                                {selectedProduct.sizes.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              
                              <select
                                value={item.color}
                                onChange={(e) => updateOrderItem(item.id, 'color', e.target.value)}
                                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none font-medium"
                              >
                                <option value="">Seleccionar Color</option>
                                {selectedProduct.colors.map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                              
                              <div className="flex items-center gap-3">
                                <label className="text-sm font-bold text-gray-700">Cantidad:</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateOrderItem(item.id, 'quantity', parseInt(e.target.value))}
                                  className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none font-bold"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      );
                    }
                  })
                )}
              </div>
              
              {orderItems.length > 0 && (
                <button
                  onClick={saveInvoice}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-black text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                >
                  <Save size={24} />
                  Guardar Factura
                </button>
              )}
            </div>
          </div>
        )}
        
        {activeView === 'invoices' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-amber-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-xl">
                <FileText size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-800">Facturas Generadas</h2>
            </div>
            
            {state.invoices.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FileText size={64} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-bold">No hay facturas registradas</p>
                <p className="text-sm">Las facturas que guardes aparecerán aquí</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-amber-100 to-orange-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-black text-gray-700">Fecha</th>
                      <th className="px-4 py-3 text-left font-black text-gray-700">Cliente</th>
                      <th className="px-4 py-3 text-left font-black text-gray-700">CC/NIT</th>
                      <th className="px-4 py-3 text-left font-black text-gray-700">Teléfono</th>
                      <th className="px-4 py-3 text-left font-black text-gray-700">Vendedor</th>
                      <th className="px-4 py-3 text-left font-black text-gray-700">Items</th>
                      <th className="px-4 py-3 text-center font-black text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.invoices.map((invoice, index) => (
                      <tr key={invoice.id} className={`border-b-2 ${index % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'} hover:bg-amber-50 transition-colors`}>
                        <td className="px-4 py-3 font-medium text-gray-700">
                          {new Date(invoice.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-800">{invoice.client.name}</td>
                        <td className="px-4 py-3 font-medium text-gray-600">{invoice.client.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-600">{invoice.client.phone}</td>
                        <td className="px-4 py-3 font-medium text-gray-600">{invoice.client.seller}</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                            {invoice.items.length} items
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => exportToCSV(invoice)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-bold shadow-md hover:shadow-lg"
                            >
                              <Download size={16} />
                              CSV
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('¿Eliminar esta factura?')) {
                                  dispatch({ type: 'DELETE_INVOICE', payload: invoice.id });
                                }
                              }}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeView === 'catalog' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-amber-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-xl">
                  <Package size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-800">Catálogo de Productos</h2>
              </div>
              
              <button
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-bold shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Nuevo Producto
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.products.map((product) => (
                <div key={product.id} className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 hover:border-amber-400 transition-all shadow-md hover:shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-gray-800">{product.name}</h3>
                      <span className="inline-block mt-1 px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-bold">
                        {product.category}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar ${product.name}?`)) {
                          dispatch({ type: 'DELETE_PRODUCT', payload: product.id });
                        }
                      }}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-1">Medidas:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map(size => (
                          <span key={size} className="px-2 py-1 bg-white rounded text-xs font-semibold text-gray-700 border border-amber-200">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-1">Colores:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.colors.map(color => (
                          <span key={color} className="px-2 py-1 bg-white rounded text-xs font-semibold text-gray-700 border border-orange-200">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Modales */}
      <ProductCatalogModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onAdd={(product) => dispatch({ type: 'ADD_PRODUCT', payload: product })}
      />
      
      <SetBuilderModal
        isOpen={showSetModal}
        onClose={() => setShowSetModal(false)}
        products={state.products}
        onAddSet={addSetToOrder}
      />
      
      {/* Estilos adicionales */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        /* Scrollbar personalizada */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #f59e0b;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #d97706;
        }
      `}</style>
    </div>
  );
}

