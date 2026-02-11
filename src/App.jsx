import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { NewInvoiceView } from './views/NewInvoiceView';
import { InvoicesView } from './views/InvoicesView';
import { CatalogView } from './views/CatalogView';

function AppContent() {
  const [activeView, setActiveView] = useState('new-invoice');

  return (
    <div className="min-h-screen bg-stone-50/80">
      <Header activeView={activeView} setActiveView={setActiveView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeView === 'new-invoice' && <NewInvoiceView />}
        {activeView === 'invoices' && <InvoicesView />}
        {activeView === 'catalog' && <CatalogView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
