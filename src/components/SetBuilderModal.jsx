import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from './Modal';

const fieldClass =
  'w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm';

function validateSetItem(item) {
  return (
    item &&
    String(item.productId).trim() !== '' &&
    String(item.size).trim() !== '' &&
    String(item.color).trim() !== '' &&
    Number(item.quantity) >= 1
  );
}

export function SetBuilderModal({ isOpen, onClose, products, onAddSet }) {
  const [setName, setSetName] = useState('');
  const [setItems, setSetItems] = useState([]);
  const [validationError, setValidationError] = useState('');

  const addItemToSet = () => {
    setSetItems([...setItems, { productId: '', size: '', color: '', quantity: 1 }]);
    setValidationError('');
  };

  const updateSetItem = (index, field, value) => {
    const updated = [...setItems];
    updated[index] = { ...updated[index], [field]: value };
    setSetItems(updated);
    setValidationError('');
  };

  const removeSetItem = (index) => {
    setSetItems(setItems.filter((_, i) => i !== index));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const nameTrimmed = (setName || '').trim();
    if (!nameTrimmed) {
      setValidationError('Escribe el nombre del set.');
      return;
    }
    if (setItems.length === 0) {
      setValidationError('Agrega al menos un componente al set.');
      return;
    }

    const allValid = setItems.every(validateSetItem);
    if (!allValid) {
      setValidationError('Completa producto, medida, color y cantidad en todos los componentes.');
      return;
    }

    const normalizedItems = setItems.map((it) => ({
      productId: String(it.productId).trim(),
      size: String(it.size).trim(),
      color: String(it.color).trim(),
      quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
      unitPrice: typeof it.unitPrice === 'number' ? it.unitPrice : undefined,
    }));

    const newSet = {
      id: Date.now().toString(),
      name: nameTrimmed,
      items: normalizedItems,
    };

    onAddSet(newSet);
    setSetName('');
    setSetItems([]);
    setValidationError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear set personalizado">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Nombre del set</label>
          <input
            type="text"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            placeholder="Ej: Comedor Mesa + 4 Sillas"
            className={fieldClass}
            required
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-stone-700">Componentes</span>
            <button
              type="button"
              onClick={addItemToSet}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-100 text-teal-700 text-sm font-medium hover:bg-teal-200 transition-colors"
            >
              <Plus size={15} strokeWidth={2.2} /> Agregar
            </button>
          </div>

          {setItems.map((item, index) => {
            const selectedProduct = products.find((p) => p.id === item.productId);
            return (
              <div key={index} className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-stone-500">Componente {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeSetItem(index)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </div>
                <select
                  value={item.productId}
                  onChange={(e) => updateSetItem(index, 'productId', e.target.value)}
                  className={fieldClass}
                  required
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {selectedProduct && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={item.size}
                        onChange={(e) => updateSetItem(index, 'size', e.target.value)}
                        className={fieldClass}
                        required
                      >
                        <option value="">Medida</option>
                        {(selectedProduct.sizes || []).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <select
                        value={item.color}
                        onChange={(e) => updateSetItem(index, 'color', e.target.value)}
                        className={fieldClass}
                        required
                      >
                        <option value="">Color</option>
                        {(selectedProduct.colors || []).map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-stone-500 mb-0.5">Cantidad</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateSetItem(index, 'quantity', parseInt(e.target.value, 10) || 1)}
                          className={fieldClass}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-500 mb-0.5">Precio (opc.)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice ?? ''}
                          onChange={(e) => updateSetItem(index, 'unitPrice', e.target.value === '' ? undefined : Number(e.target.value))}
                          placeholder={selectedProduct.price || ''}
                          className={fieldClass}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {validationError && (
          <p className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">{validationError}</p>
        )}

        <button
          type="submit"
          disabled={!setName.trim() || setItems.length === 0}
          className="w-full py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Crear set y agregar al pedido
        </button>
      </form>
    </Modal>
  );
}
