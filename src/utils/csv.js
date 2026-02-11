export const generateCSV = (invoice, products) => {
  const headers = ['Número Orden', 'Fecha', 'Cliente', 'CC/NIT', 'Teléfono', 'Correo', 'Dirección', 'Ciudad/País', 'Vendedor', 'Tipo', 'Producto', 'Medida', 'Color', 'Cantidad', 'Precio Unit.', 'Subtotal', 'IVA'];

  const rows = [headers];

  invoice.items.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    const unitPrice = item.unitPrice ?? product?.price ?? 0;
    const subtotal = unitPrice * (item.quantity || 1);
    const iva = invoice.includeIVA ? subtotal * 0.19 : 0;
    rows.push([
      invoice.client.orderNumber || 'N/A',
      new Date(invoice.date).toLocaleDateString(),
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
      item.quantity,
      unitPrice.toFixed(2),
      subtotal.toFixed(2),
      iva.toFixed(2),
    ]);

    if (item.isSet && item.setItems) {
      item.setItems.forEach((setItem) => {
        const setProduct = products.find((p) => p.id === setItem.productId);
        const setUnitPrice = setItem.unitPrice ?? setProduct?.price ?? 0;
        const setSubtotal = setUnitPrice * (setItem.quantity || 1);
        const setIva = invoice.includeIVA ? setSubtotal * 0.19 : 0;
        rows.push([
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '  ↳ Componente',
          setProduct?.name || '',
          setItem.size || 'N/A',
          setItem.color || 'N/A',
          setItem.quantity,
          setUnitPrice.toFixed(2),
          setSubtotal.toFixed(2),
          setIva.toFixed(2),
        ]);
      });
    }
  });

  return rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
};

export const generateConsolidatedCSV = (invoices, products) => {
  const headers = ['Número Orden', 'Fecha', 'Cliente', 'CC/NIT', 'Teléfono', 'Correo', 'Dirección', 'Ciudad/País', 'Vendedor', 'Tipo', 'Producto', 'Medida', 'Color', 'Cantidad', 'Precio Unit.', 'Subtotal', 'IVA'];

  const rows = [headers];

  invoices.forEach((invoice) => {
    invoice.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      const unitPrice = item.unitPrice ?? product?.price ?? 0;
      const subtotal = unitPrice * (item.quantity || 1);
      const iva = invoice.includeIVA ? subtotal * 0.19 : 0;
      rows.push([
        invoice.client.orderNumber || 'N/A',
        new Date(invoice.date).toLocaleDateString(),
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
        item.quantity,
        unitPrice.toFixed(2),
        subtotal.toFixed(2),
        iva.toFixed(2),
      ]);

      if (item.isSet && item.setItems) {
        item.setItems.forEach((setItem) => {
          const setProduct = products.find((p) => p.id === setItem.productId);
          const setUnitPrice = setItem.unitPrice ?? setProduct?.price ?? 0;
          const setSubtotal = setUnitPrice * (setItem.quantity || 1);
          const setIva = invoice.includeIVA ? setSubtotal * 0.19 : 0;
          rows.push([
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '  ↳ Componente',
            setProduct?.name || '',
            setItem.size || 'N/A',
            setItem.color || 'N/A',
            setItem.quantity,
            setUnitPrice.toFixed(2),
            setSubtotal.toFixed(2),
            setIva.toFixed(2),
          ]);
        });
      }
    });
  });

  return rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
};

export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
