import React, { useState } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCatalogModal } from '../components/ProductCatalogModal';

export function CatalogView() {
  const { state, dispatch } = useApp();
  const [showProductModal, setShowProductModal] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-700">
            <Package size={20} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Catálogo de productos</h2>
            <p className="text-xs text-stone-500">Gestiona productos, medidas y colores</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowProductModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm"
        >
          <Plus size={18} strokeWidth={2} />
          Nuevo producto
        </button>
      </div>

      <div className="p-5">
        {state.products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/30 text-center">
            <div className="w-14 h-14 rounded-2xl bg-stone-200/60 flex items-center justify-center mb-4">
              <Package size={28} className="text-stone-500" />
            </div>
            <p className="text-stone-600 font-medium">No hay productos en el catálogo</p>
            <p className="text-sm text-stone-500 mt-1">Añade el primero con el botón de arriba</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.products.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/30 hover:border-stone-300 hover:bg-stone-50/50 transition-all"
              >
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-stone-800 truncate">{product.name}</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-medium">
                      {product.category}
                    </span>
                    {typeof product.price === 'number' && product.price > 0 && (
                      <p className="mt-2 text-sm font-medium text-stone-700">
                        ${Number(product.price).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Eliminar "${product.name}"?`)) {
                        dispatch({ type: 'DELETE_PRODUCT', payload: product.id });
                      }
                    }}
                    className="shrink-0 p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    aria-label={`Eliminar ${product.name}`}
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-stone-500 mb-1">Medidas</p>
                    <div className="flex flex-wrap gap-1">
                      {(product.sizes || []).map((size) => (
                        <span
                          key={size}
                          className="px-2 py-0.5 rounded bg-white border border-stone-200 text-xs text-stone-700"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-stone-500 mb-1">Colores</p>
                    <div className="flex flex-wrap gap-1">
                      {(product.colors || []).map((color) => (
                        <span
                          key={color}
                          className="px-2 py-0.5 rounded bg-white border border-stone-200 text-xs text-stone-700"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductCatalogModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onAdd={(product) => dispatch({ type: 'ADD_PRODUCT', payload: product })}
      />
    </div>
  );
}
