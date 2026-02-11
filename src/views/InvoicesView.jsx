import React from 'react';
import { FileText, Download, Trash2, FileDown, FileType } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateCSV, generateConsolidatedCSV, downloadCSV } from '../utils/csv';
import { downloadInvoicePdf } from '../utils/invoicePdf';

export function InvoicesView() {
  const { state, dispatch } = useApp();

  const exportToCSV = (invoice) => {
    const csv = generateCSV(invoice, state.products);
    const fileName = `orden_produccion_${invoice.client.name.replace(/\s/g, '_')}_${new Date(invoice.date).toLocaleDateString()}.csv`;
    downloadCSV(csv, fileName);
  };

  const exportConsolidatedCSV = () => {
    if (state.invoices.length === 0) {
      alert('No hay facturas para exportar');
      return;
    }
    const csv = generateConsolidatedCSV(state.invoices, state.products);
    const fileName = `ordenes_produccion_consolidado_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, fileName);
  };

  const downloadPdf = (invoice) => {
    const fileName = `factura_${(invoice.client?.name || 'cliente').replace(/\s/g, '_')}_${new Date(invoice.date).toISOString().split('T')[0]}.pdf`;
    downloadInvoicePdf(invoice, state.products, fileName);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-700">
              <FileText size={20} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-800">Facturas generadas</h2>
              <p className="text-xs text-stone-500">Exporta a CSV o elimina facturas</p>
            </div>
          </div>
          {state.invoices.length > 0 && (
            <button
              type="button"
              onClick={exportConsolidatedCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm"
            >
              <FileDown size={18} strokeWidth={2} />
              Exportar CSV consolidado
            </button>
          )}
        </div>
      </div>

      <div className="p-5">
        {state.invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/30 text-center">
            <div className="w-14 h-14 rounded-2xl bg-stone-200/60 flex items-center justify-center mb-4">
              <FileText size={28} className="text-stone-500" />
            </div>
            <p className="text-stone-600 font-medium">No hay facturas registradas</p>
            <p className="text-sm text-stone-500 mt-1">Las facturas que guardes aparecerán aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/80">
                  <th className="px-4 py-3 text-left font-medium text-stone-600">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium text-stone-600">Cliente</th>
                  <th className="px-4 py-3 text-left font-medium text-stone-600 hidden sm:table-cell">CC/NIT</th>
                  <th className="px-4 py-3 text-left font-medium text-stone-600 hidden md:table-cell">Teléfono</th>
                  <th className="px-4 py-3 text-left font-medium text-stone-600">Vendedor</th>
                  <th className="px-4 py-3 text-left font-medium text-stone-600">Items</th>
                  <th className="px-4 py-3 text-right font-medium text-stone-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {state.invoices.map((invoice, index) => (
                  <tr
                    key={invoice.id}
                    className={`border-b border-stone-100 hover:bg-stone-50/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'
                    }`}
                  >
                    <td className="px-4 py-3 text-stone-700">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-800">{invoice.client.name}</td>
                    <td className="px-4 py-3 text-stone-600 hidden sm:table-cell">{invoice.client.id}</td>
                    <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{invoice.client.phone}</td>
                    <td className="px-4 py-3 text-stone-600">{invoice.client.seller}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                        {invoice.items.length} ítems
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => downloadPdf(invoice)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors"
                          title="Descargar PDF para el cliente"
                        >
                          <FileType size={14} strokeWidth={2} />
                          PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => exportToCSV(invoice)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700 transition-colors"
                        >
                          <Download size={14} strokeWidth={2} />
                          CSV
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('¿Eliminar esta factura?')) {
                              dispatch({ type: 'DELETE_INVOICE', payload: invoice.id });
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Eliminar factura"
                        >
                          <Trash2 size={16} strokeWidth={2} />
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
    </div>
  );
}
