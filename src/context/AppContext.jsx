import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage';

const initialState = {
  clients: [],
  products: [
    { id: '1', name: 'Mesa Comedor', category: 'Mesa', sizes: ['120x80', '140x90', '160x100'], colors: ['Nogal', 'Roble', 'Blanco', 'Negro'], price: 0 },
    { id: '2', name: 'Silla Moderna', category: 'Silla', sizes: ['Estándar'], colors: ['Nogal', 'Roble', 'Blanco', 'Negro', 'Gris'], price: 0 },
    { id: '3', name: 'Puff Redondo', category: 'Puff', sizes: ['40cm', '50cm', '60cm'], colors: ['Beige', 'Gris', 'Azul', 'Verde'], price: 0 },
    { id: '4', name: 'Sofá Modular', category: 'Sofá', sizes: ['2 Puestos', '3 Puestos', 'L-Shape'], colors: ['Beige', 'Gris', 'Azul Marino'], price: 0 },
    { id: '5', name: 'Butaco Bar', category: 'Butaco', sizes: ['Alto', 'Medio'], colors: ['Negro', 'Blanco', 'Cromado'], price: 0 },
  ],
  invoices: [],
  sets: [],
};

function ensureProductPrice(p) {
  return { ...p, price: typeof p.price === 'number' ? p.price : 0 };
}

function ensureSetItemsPrices(items) {
  return (items || []).map((it) => ({ ...it, unitPrice: typeof it.unitPrice === 'number' ? it.unitPrice : undefined }));
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter((p) => p.id !== action.payload) };
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] };
    case 'DELETE_INVOICE':
      return { ...state, invoices: state.invoices.filter((i) => i.id !== action.payload) };
    case 'ADD_SET':
      return { ...state, sets: [...state.sets, action.payload] };
    case 'DELETE_SET':
      return { ...state, sets: state.sets.filter((s) => s.id !== action.payload) };
    case 'LOAD_STATE': {
      const payload = action.payload || {};
      const products = (payload.products || state.products).map(ensureProductPrice);
      const sets = (payload.sets || state.sets).map((s) => ({
        ...s,
        items: ensureSetItemsPrices(s.items),
      }));
      return {
        ...state,
        ...payload,
        products,
        sets,
      };
    }
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved && (saved.products?.length || saved.invoices?.length || saved.sets?.length)) {
      dispatch({ type: 'LOAD_STATE', payload: saved });
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}
