import React from 'react';
import { Plus, Layers } from 'lucide-react';
import { Modal } from './Modal';

export function SetSelectorModal({ isOpen, onClose, sets, products, onSelectSet, onCreateNew }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agregar set al pedido">
      <div className="space-y-4">
        <p className="text-sm text-stone-600">
          Elige un set guardado o crea uno nuevo. Los sets se guardan para reutilizarlos.
        </p>

        {sets.length > 0 && (
          <div className="space-y-2">
            <span className="block text-sm font-medium text-stone-700">Sets guardados</span>
            <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {sets.map((set) => (
                <li key={set.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSet(set);
                      onClose();
                    }}
                    className="w-full text-left p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 hover:border-teal-300 hover:bg-teal-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-teal-600 text-white text-xs font-medium">
                        SET
                      </span>
                      <span className="font-medium text-stone-800">{set.name}</span>
                    </div>
                    <div className="text-sm text-stone-600 pl-4 border-l-2 border-teal-200 space-y-0.5">
                      {(set.items || []).map((it, idx) => {
                        const p = products.find((pr) => pr.id === it.productId);
                        return (
                          <div key={idx}>
                            {it.quantity}x {p?.name ?? 'Producto'}
                            {it.size && ` — ${it.size}`}
                            {it.color && ` / ${it.color}`}
                          </div>
                        );
                      })}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            onClose();
            onCreateNew();
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-dashed border-teal-300 bg-teal-50/50 text-teal-700 font-medium hover:bg-teal-100 hover:border-teal-400 transition-colors"
        >
          <Plus size={18} strokeWidth={2} />
          Crear nuevo set
        </button>
      </div>
    </Modal>
  );
}
