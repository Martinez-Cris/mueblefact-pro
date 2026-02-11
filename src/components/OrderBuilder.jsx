import React, { useMemo } from 'react';
import { Plus, Trash2, Save, Package, Layers } from 'lucide-react';

const inputClass =
  'px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm';
const selectClass =
  'w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm';

export function OrderBuilder({
  products,
  orderItems,
  setOrderItems,
  onSaveInvoice,
  onOpenSetClick,
  includeIVA,
  setIncludeIVA,
}) {
  const addProductToOrder = () => {
    setOrderItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        productId: '',
        size: '',
        color: '',
        quantity: 1,
        unitPrice: undefined,
        isSet: false,
      },
    ]);
  };

  const updateOrderItem = (id, field, value) => {
    setOrderItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeOrderItem = (id) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calcular totales
  const totals = useMemo(() => {
    const subtotal = orderItems.reduce((sum, item) => {
      const price = item.unitPrice ?? 0;
      const qty = item.quantity ?? 1;
      return sum + price * qty;
    }, 0);
    const iva = includeIVA ? subtotal * 0.19 : 0;
    const total = subtotal + iva;
    return { subtotal, iva, total };
  }, [orderItems, includeIVA]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-700">
            <Package size={20} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Pedido</h2>
            <p className="text-xs text-stone-500">Productos y sets de esta factura</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addProductToOrder}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm"
          >
            <Plus size={17} strokeWidth={2.2} />
            Producto
          </button>
          <button
            type="button"
            onClick={onOpenSetClick}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Layers size={17} strokeWidth={2.2} />
            Set
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col min-h-0">
        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
          {orderItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-4 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 text-center">
              <div className="w-14 h-14 rounded-2xl bg-stone-200/60 flex items-center justify-center mb-4">
                <Package size={28} className="text-stone-500" />
              </div>
              <p className="text-stone-600 font-medium">No hay ítems en el pedido</p>
              <p className="text-sm text-stone-500 mt-1">Añade productos o sets con los botones de arriba</p>
            </div>
          ) : (
            orderItems.map((item) => {
              if (item.isSet) {
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="shrink-0 px-2 py-0.5 rounded-md bg-teal-600 text-white text-xs font-medium">
                          SET
                        </span>
                        <span className="font-medium text-stone-800 truncate">{item.setName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOrderItem(item.id)}
                        className="shrink-0 p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Quitar set"
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </div>
                    <div className="pl-3 border-l-2 border-teal-300 space-y-1">
                      {(item.setItems || []).map((setItem, idx) => {
                        const product = products.find((p) => p.id === setItem.productId);
                        return (
                          <div key={idx} className="text-sm text-stone-600">
                            <span className="font-medium text-stone-700">{setItem.quantity}x {product?.name}</span>
                            <span className="text-stone-500"> — {setItem.size} / {setItem.color}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-stone-600">Cantidad</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateOrderItem(item.id, 'quantity', parseInt(e.target.value, 10) || 1)
                          }
                          className={`w-20 ${inputClass}`}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-stone-600">Precio (set)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice ?? ''}
                          onChange={(e) =>
                            updateOrderItem(
                              item.id,
                              'unitPrice',
                              e.target.value === '' ? undefined : Number(e.target.value)
                            )
                          }
                          className={`w-28 ${inputClass}`}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              const selectedProduct = products.find((p) => p.id === item.productId);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-stone-600">Producto individual</span>
                    <button
                      type="button"
                      onClick={() => removeOrderItem(item.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="Quitar producto"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>
                  <select
                    value={item.productId}
                    onChange={(e) => {
                      const pid = e.target.value;
                      const prod = products.find((p) => p.id === pid);
                      updateOrderItem(item.id, 'productId', pid);
                      if (prod && (item.unitPrice == null || item.unitPrice === ''))
                        updateOrderItem(item.id, 'unitPrice', prod.price);
                    }}
                    className={selectClass}
                  >
                    <option value="">Seleccionar producto</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category}){p.price ? ` — $${p.price}` : ''}
                      </option>
                    ))}
                  </select>
                  {selectedProduct && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={item.size}
                          onChange={(e) => updateOrderItem(item.id, 'size', e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Medida</option>
                          {(selectedProduct.sizes || []).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <select
                          value={item.color}
                          onChange={(e) => updateOrderItem(item.id, 'color', e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Color</option>
                          {(selectedProduct.colors || []).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium text-stone-600">Cant.</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateOrderItem(item.id, 'quantity', parseInt(e.target.value, 10) || 1)
                            }
                            className={`w-20 ${inputClass}`}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium text-stone-600">Precio unit.</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice ?? selectedProduct.price ?? ''}
                            onChange={(e) =>
                              updateOrderItem(
                                item.id,
                                'unitPrice',
                                e.target.value === '' ? undefined : Number(e.target.value)
                              )
                            }
                            className={`w-28 ${inputClass}`}
                            placeholder={selectedProduct.price || '0'}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {orderItems.length > 0 && (
          <>
            <div className="mt-5 pt-5 border-t border-stone-200 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-600">Subtotal:</span>
                <span className="font-semibold text-stone-800">
                  ${totals.subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeIVA}
                    onChange={(e) => setIncludeIVA(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 focus:ring-2"
                  />
                  <span className="text-sm text-stone-700">IVA (19%)</span>
                </label>
                {includeIVA && (
                  <span className="ml-auto text-sm font-semibold text-stone-800">
                    ${totals.iva.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                <span className="font-semibold text-stone-800">Total:</span>
                <span className="text-lg font-bold text-amber-700">
                  ${totals.total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onSaveInvoice}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors shadow-sm"
            >
              <Save size={20} strokeWidth={2} />
              Guardar factura
            </button>
          </>
        )}
      </div>
    </div>
  );
}
