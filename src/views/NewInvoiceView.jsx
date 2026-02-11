import React, { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { ClientForm } from '../components/ClientForm';
import { OrderBuilder } from '../components/OrderBuilder';
import { SetSelectorModal } from '../components/SetSelectorModal';
import { SetBuilderModal } from '../components/SetBuilderModal';

const emptyClient = {
  name: '',
  id: '',
  phone: '',
  email: '',
  address: '',
  location: '',
  seller: '',
  orderNumber: '',
};

export function NewInvoiceView() {
  const { state, dispatch } = useApp();
  const [clientForm, setClientForm] = useState(emptyClient);
  const [orderItems, setOrderItems] = useState([]);
  const [includeIVA, setIncludeIVA] = useState(false);
  const [showSetSelector, setShowSetSelector] = useState(false);
  const [showSetBuilder, setShowSetBuilder] = useState(false);

  const addSetToOrder = useCallback((set) => {
    const setCopy = {
      id: set.id,
      name: set.name,
      items: (set.items || []).map((it) => ({ ...it })),
    };
    setOrderItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        isSet: true,
        setId: setCopy.id,
        setName: setCopy.name,
        setItems: setCopy.items,
        quantity: 1,
        unitPrice: undefined,
      },
    ]);
  }, []);

  const saveInvoice = useCallback(() => {
    if (!clientForm.name || orderItems.length === 0) {
      alert('Por favor completa los datos del cliente y agrega al menos un producto');
      return;
    }

    const invoice = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      client: clientForm,
      items: orderItems,
      includeIVA,
    };

    dispatch({ type: 'ADD_INVOICE', payload: invoice });
    setClientForm(emptyClient);
    setOrderItems([]);
    setIncludeIVA(false);
    alert('✅ Factura guardada exitosamente');
  }, [clientForm, orderItems, includeIVA, dispatch]);

  const handleAddSetFromBuilder = useCallback(
    (set) => {
      dispatch({ type: 'ADD_SET', payload: set });
      addSetToOrder(set);
      setShowSetBuilder(false);
    },
    [dispatch, addSetToOrder]
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
      <ClientForm clientForm={clientForm} setClientForm={setClientForm} />

      <OrderBuilder
        products={state.products}
        orderItems={orderItems}
        setOrderItems={setOrderItems}
        onSaveInvoice={saveInvoice}
        onOpenSetClick={() => setShowSetSelector(true)}
        includeIVA={includeIVA}
        setIncludeIVA={setIncludeIVA}
      />

      <SetSelectorModal
        isOpen={showSetSelector}
        onClose={() => setShowSetSelector(false)}
        sets={state.sets}
        products={state.products}
        onSelectSet={(set) => {
          addSetToOrder(set);
          setShowSetSelector(false);
        }}
        onCreateNew={() => {
          setShowSetSelector(false);
          setShowSetBuilder(true);
        }}
      />

      <SetBuilderModal
        isOpen={showSetBuilder}
        onClose={() => setShowSetBuilder(false)}
        products={state.products}
        onAddSet={handleAddSetFromBuilder}
      />
    </div>
  );
}
