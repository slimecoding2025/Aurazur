import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './lib/i18n';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import TransactionPage from './pages/TransactionPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:slug" element={<PropertyDetailPage />} />
              <Route path="/achat" element={<TransactionPage type="achat" />} />
              <Route path="/vente" element={<TransactionPage type="vente" />} />
              <Route path="/location-annuelle" element={<TransactionPage type="location_annuelle" />} />
              <Route path="/location-estivale" element={<TransactionPage type="location_estivale" />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
          <AIChat />
        </div>
      </BrowserRouter>
    </I18nProvider>
  );
}
