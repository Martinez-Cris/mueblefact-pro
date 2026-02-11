import React, { useState } from 'react';
import { Modal } from './Modal';

const CATEGORIES = ['pvc','Cr15','Cr25','Triplex','TablonPino','Acero', 'Metal', 'Puff', 'Sofá', 'Butaco','Plastico','tapizado'];
const fieldClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm';

export function ProductCatalogModal({ isOpen, onClose, onAdd, onUpdate, productToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'pvc',
    sizes: '',
    colors: '',
    price: '',
  });

  React.useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || 'pvc',
        sizes: (productToEdit.sizes || []).join(', '),
        colors: (productToEdit.colors || []).join(', '),
        price: productToEdit.price || '',
      });
    } else {
      setFormData({ name: '', category: 'pvc', sizes: '', colors: '', price: '' });
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      category: formData.category,
      sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
      price: Number(formData.price) || 0,
    };

    if (productToEdit) {
      onUpdate({ ...productData, id: productToEdit.id });
    } else {
      onAdd({ ...productData, id: Date.now().toString() });
    }
    setFormData({ name: '', category: 'pvc', sizes: '', colors: '', price: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={productToEdit ? "Editar producto" : "Agregar producto al catálogo"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Nombre del producto</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={fieldClass}
            placeholder="Ej: Mesa de centro"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Categoría</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={fieldClass}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Medidas (separadas por comas)</label>
          <input
            type="text"
            value={formData.sizes}
            onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
            placeholder="120x80, 140x90"
            className={fieldClass}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Colores (separados por comas)</label>
          <input
            type="text"
            value={formData.colors}
            onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
            placeholder="Nogal, Roble, Blanco"
            className={fieldClass}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Precio unitario (opcional)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0"
            className={fieldClass}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors shadow-sm"
        >
          {productToEdit ? 'Guardar cambios' : 'Agregar producto'}
        </button>
      </form>
    </Modal>
  );
}
