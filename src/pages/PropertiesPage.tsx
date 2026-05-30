import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../lib/i18n';
import { getProperties } from '../lib/supabase';
import PropertyCard from '../components/PropertyCard';
import type { Property } from '../types';

export default function PropertiesPage() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    city: searchParams.get('city') ?? '',
    category: searchParams.get('category') ?? '',
    transaction_type: searchParams.get('transaction_type') ?? '',
    min_price: searchParams.get('min_price') ?? '',
    max_price: searchParams.get('max_price') ?? '',
    bedrooms: searchParams.get('bedrooms') ?? '',
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const params: Record<string, any> = {};
        if (filters.city) params.city = filters.city;
        if (filters.category) params.category = filters.category;
        if (filters.transaction_type) params.transaction_type = filters.transaction_type;
        if (filters.min_price) params.min_price = Number(filters.min_price);
        if (filters.max_price) params.max_price = Number(filters.max_price);
        if (filters.bedrooms) params.bedrooms = Number(filters.bedrooms);
        const data = await getProperties(params);
        setProperties(data);
      } catch {
        setError(t('error.loading'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters]);

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    const params: Record<string, string> = {};
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params);
  };

  const resetFilters = () => {
    const empty = { city: '', category: '', transaction_type: '', min_price: '', max_price: '', bedrooms: '' };
    setFilters(empty);
    setSearchParams({});
  };

  const selectClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white";

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-8">
          <h1 className="section-title mb-1">Tous les biens</h1>
          <p className="text-gray-500">
            {loading ? t('loading') : `${properties.length} ${t('properties.count')}`}
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900">{t('properties.filters')}</h2>
                <button onClick={resetFilters} className="text-xs text-primary hover:underline">
                  {t('properties.reset')}
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    {t('properties.city')}
                  </label>
                  <select className={selectClass} value={filters.city} onChange={(e) => applyFilters({ ...filters, city: e.target.value })}>
                    <option value="">{t('search.all')}</option>
                    <option value="Hammamet">{t('search.hammamet')}</option>
                    <option value="Nabeul">{t('search.nabeul')}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    {t('properties.category')}
                  </label>
                  <select className={selectClass} value={filters.category} onChange={(e) => applyFilters({ ...filters, category: e.target.value })}>
                    <option value="">{t('search.all')}</option>
                    <option value="villa">{t('search.villa')}</option>
                    <option value="appartement">{t('search.apartment')}</option>
                    <option value="penthouse">{t('search.penthouse')}</option>
                    <option value="duplex">{t('search.duplex')}</option>
                    <option value="terrain">{t('search.terrain')}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Transaction
                  </label>
                  <select className={selectClass} value={filters.transaction_type} onChange={(e) => applyFilters({ ...filters, transaction_type: e.target.value })}>
                    <option value="">{t('search.all')}</option>
                    <option value="achat">{t('search.buy')}</option>
                    <option value="vente">{t('search.sell')}</option>
                    <option value="location_annuelle">{t('search.annual')}</option>
                    <option value="location_estivale">{t('search.seasonal')}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    {t('properties.min_price')} (TND)
                  </label>
                  <input type="number" className={selectClass} value={filters.min_price} onChange={(e) => applyFilters({ ...filters, min_price: e.target.value })} placeholder="0" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    {t('properties.max_price')} (TND)
                  </label>
                  <input type="number" className={selectClass} value={filters.max_price} onChange={(e) => applyFilters({ ...filters, max_price: e.target.value })} placeholder="1 000 000" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    {t('detail.bedrooms')}
                  </label>
                  <select className={selectClass} value={filters.bedrooms} onChange={(e) => applyFilters({ ...filters, bedrooms: e.target.value })}>
                    <option value="">{t('search.all')}</option>
                    {[1,2,3,4,5,6].map(n => (
                      <option key={n} value={n}>{n}+</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <SlidersHorizontal size={16} />
                {t('properties.filters')}
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 text-gray-500">{error}</div>
            ) : properties.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Home size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('properties.empty')}</h3>
                <p className="text-gray-400 mb-6">{t('properties.empty.subtitle')}</p>
                <button onClick={resetFilters} className="btn-outline text-sm">
                  {t('properties.reset')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property, idx) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
