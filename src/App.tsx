import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AdminPanel from './pages/AdminPanel';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import './index.css';

function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-black">
            <Routes>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/*" element={
                <>
                  <Header />
                  <HomePage />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;