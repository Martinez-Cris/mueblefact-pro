import React from 'react';
import { Users } from 'lucide-react';

const fieldClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm';

export function ClientForm({ clientForm, setClientForm }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-700">
            <Users size={20} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Datos del cliente</h2>
            <p className="text-xs text-stone-500">Completa la información para la factura</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Nombre completo / Razón social
          </label>
          <input
            type="text"
            value={clientForm.name}
            onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
            className={fieldClass}
            placeholder="Ej: Juan Pérez o Muebles S.A.S"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">C.C / NIT</label>
            <input
              type="text"
              value={clientForm.id}
              onChange={(e) => setClientForm({ ...clientForm, id: e.target.value })}
              className={fieldClass}
              placeholder="123456789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Teléfono</label>
            <input
              type="tel"
              value={clientForm.phone}
              onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
              className={fieldClass}
              placeholder="300 123 4567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Correo electrónico</label>
          <input
            type="email"
            value={clientForm.email}
            onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
            className={fieldClass}
            placeholder="cliente@ejemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Dirección</label>
          <input
            type="text"
            value={clientForm.address}
            onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
            className={fieldClass}
            placeholder="Calle 123 #45-67"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Ciudad / País</label>
          <input
            type="text"
            value={clientForm.location}
            onChange={(e) => setClientForm({ ...clientForm, location: e.target.value })}
            className={fieldClass}
            placeholder="Bogotá, Colombia"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Vendedor</label>
          <input
            type="text"
            value={clientForm.seller}
            onChange={(e) => setClientForm({ ...clientForm, seller: e.target.value })}
            className={fieldClass}
            placeholder="Nombre del vendedor"
          />
        </div>
      </div>
    </div>
  );
}
