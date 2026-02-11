import { jsPDF } from 'jspdf';

/**
 * Genera un PDF con el resumen de la factura para entregar al cliente.
 * @param {Object} invoice - Factura { date, client, items, includeIVA }
 * @param {Array} products - Lista de productos del catálogo
 */
export function generateInvoicePdf(invoice, products) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 20;

  // --- Encabezado ---
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text('MuebleFact Pro', 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Resumen de orden / Factura para el cliente', 20, y);
  y += 18;

  // --- Datos del cliente ---
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Datos del cliente', 20, y);
  y += 7;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const client = invoice.client || {};
  doc.text(`Nombre / Razón social: ${client.name || '—'}`, 20, y);
  y += 6;
  doc.text(`C.C / NIT: ${client.id || '—'}`, 20, y);
  y += 6;
  doc.text(`Teléfono: ${client.phone || '—'}`, 20, y);
  y += 6;
  doc.text(`Correo: ${client.email || '—'}`, 20, y);
  y += 6;
  doc.text(`Dirección: ${client.address || '—'}`, 20, y);
  y += 6;
  doc.text(`Ciudad / País: ${client.location || '—'}`, 20, y);
  y += 6;
  doc.text(`Vendedor: ${client.seller || '—'}`, 20, y);
  y += 10;

  // --- Orden y fecha ---
  doc.setFont(undefined, 'bold');
  doc.text(`Número de orden: ${client.orderNumber || '—'}`, 20, y);
  y += 6;
  doc.text(`Fecha: ${new Date(invoice.date).toLocaleDateString('es-CO', { dateStyle: 'long' })}`, 20, y);
  y += 14;

  // --- Tabla de ítems ---
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Detalle del pedido', 20, y);
  y += 8;

  const colDesc = 22;
  const colCant = 95;
  const colPrecio = 115;
  const colSubtotal = 155;
  const colEnd = 195;

  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text('Producto / Descripción', colDesc, y);
  doc.text('Cant.', colCant, y);
  doc.text('Precio unit.', colPrecio, y);
  doc.text('Subtotal', colSubtotal, y);
  doc.line(20, y + 2, colEnd, y + 2);
  y += 8;

  doc.setFont(undefined, 'normal');

  let subtotalGeneral = 0;

  (invoice.items || []).forEach((item) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    const unitPrice = item.unitPrice ?? 0;
    const qty = item.quantity ?? 1;
    const subtotal = unitPrice * qty;
    subtotalGeneral += subtotal;

    let desc = '';
    if (item.isSet) {
      desc = `Set: ${item.setName || '—'}`;
      doc.text(desc, colDesc, y);
      doc.text(String(qty), colCant, y);
      doc.text(formatMoney(unitPrice), colPrecio, y);
      doc.text(formatMoney(subtotal), colSubtotal, y);
      y += 6;

      (item.setItems || []).forEach((setItem) => {
        const p = products.find((pr) => pr.id === setItem.productId);
        const subDesc = `  ${setItem.quantity}x ${p?.name || 'Producto'} (${setItem.size || ''} / ${setItem.color || ''})`;
        doc.setFont(undefined, 'normal');
        doc.text(subDesc, colDesc, y);
        y += 5;
      });
      y += 2;
    } else {
      const p = products.find((pr) => pr.id === item.productId);
      desc = `${p?.name || 'Producto'} ${item.size ? `- ${item.size}` : ''} ${item.color ? `/ ${item.color}` : ''}`;
      doc.text(desc, colDesc, y);
      doc.text(String(qty), colCant, y);
      doc.text(formatMoney(unitPrice), colPrecio, y);
      doc.text(formatMoney(subtotal), colSubtotal, y);
      y += 8;
    }
  });

  y += 6;

  // --- Totales ---
  doc.setFont(undefined, 'bold');
  doc.text('Subtotal:', colSubtotal - 50, y);
  doc.text(formatMoney(subtotalGeneral), colSubtotal, y);
  y += 8;

  if (invoice.includeIVA) {
    const iva = subtotalGeneral * 0.19;
    doc.text('IVA (19%):', colSubtotal - 50, y);
    doc.text(formatMoney(iva), colSubtotal, y);
    y += 8;
    doc.setFontSize(11);
    doc.text('Total:', colSubtotal - 50, y);
    doc.text(formatMoney(subtotalGeneral + iva), colSubtotal, y);
  } else {
    doc.setFontSize(11);
    doc.text('Total:', colSubtotal - 50, y);
    doc.text(formatMoney(subtotalGeneral), colSubtotal, y);
  }

  // Pie de página
  y = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('Documento generado por MuebleFact Pro. Este es un resumen para el cliente.', 20, y);
  doc.text(`Generado el ${new Date().toLocaleDateString('es-CO')} ${new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`, 20, y + 4);

  return doc;
}

function formatMoney(value) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

/**
 * Genera el PDF y lo descarga con el nombre de archivo indicado.
 */
export function downloadInvoicePdf(invoice, products, filename) {
  const doc = generateInvoicePdf(invoice, products);
  doc.save(filename || `factura_${(invoice.client?.name || 'cliente').replace(/\s/g, '_')}_${new Date(invoice.date).toISOString().split('T')[0]}.pdf`);
}
