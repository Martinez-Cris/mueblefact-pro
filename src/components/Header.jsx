import React from 'react';
import { Package, FileText, ShoppingCart } from 'lucide-react';

const navItems = [
  { id: 'new-invoice', label: 'Nueva Factura', icon: ShoppingCart },
  { id: 'invoices', label: 'Facturas', icon: FileText },
  { id: 'catalog', label: 'Catálogo', icon: Package },
];

export function Header({ activeView, setActiveView }) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-600 text-white shadow-sm">
              <Package size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-800">
                MuebleFact Pro
              </h1>
              <p className="text-xs text-stone-500 hidden sm:block">
                Facturación y producción
              </p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex items-center gap-1 sm:gap-2" role="tablist" aria-label="Secciones">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeView === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={label}
                  onClick={() => setActiveView(id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span className="hidden xs:inline sm:inline">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
