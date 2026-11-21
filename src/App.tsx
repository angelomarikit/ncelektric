import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { useProducts } from './hooks/useProducts';
import { useCategories } from './hooks/useCategories';
import { useSiteContent } from './hooks/useSiteContent';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPage } from './pages/admin/AdminPage';
import type { QuoteSelection } from './types';

export default function App() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { content } = useSiteContent();
  const [selected, setSelected] = useState<QuoteSelection>(null);

  const categoryNames = categories.map((c) => c.name);

  return (
    <div className="min-h-screen flex flex-col w-full">
      <TopBar settings={content.settings} />
      <Header onQuote={setSelected} />
      <div className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage products={products} categories={categories} content={content} onQuote={setSelected} />} />
          <Route
            path="/products"
            element={<ProductsPage products={products} categories={categories} content={content} onQuote={setSelected} />}
          />
          <Route path="/collections" element={<CollectionsPage categories={categories} products={products} content={content} />} />
          <Route
            path="/products/:slug"
            element={<ProductDetailPage products={products} content={content} onQuote={setSelected} />}
          />
          <Route path="/about" element={<AboutPage content={content} onQuote={setSelected} />} />
          <Route path="/contact" element={<ContactPage content={content} onQuote={setSelected} />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/catalog" element={<Navigate to="/products" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer footer={content.footer} categories={categoryNames} onQuote={setSelected} />
      <QuoteModal selected={selected} settings={content.settings} onClose={() => setSelected(null)} />
    </div>
  );
}