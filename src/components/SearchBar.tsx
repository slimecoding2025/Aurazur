import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export default function SearchBar() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: '',
    transaction_type: '',
    city: '',
    budget: '',
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.transaction_type) params.set('transaction_type', filters.transaction_type);
    if (filters.city) params.set('city', filters.city);
    if (filters.budget) params.set('max_price', filters.budget);
    navigate(`/properties?${params.toString()}`);
  };

  const selectClass = "w-full bg-transparent text-gray-700 text-sm focus:outline-none";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1">
        {/* Type de bien */}
        <div className="flex flex-col px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {t('search.type')}
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className={selectClass}
          >
            <option value="">{t('search.all')}</option>
            <option value="villa">{t('search.villa')}</option>
            <option value="appartement">{t('search.apartment')}</option>
            <option value="penthouse">{t('search.penthouse')}</option>
            <option value="duplex">{t('search.duplex')}</option>
            <option value="terrain">{t('search.terrain')}</option>
          </select>
        </div>

        {/* Séparateur */}
        <div className="hidden lg:block w-px bg-gray-200 self-stretch my-2" />

        {/* Transaction */}
        <div className="flex flex-col px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {t('search.transaction')}
          </label>
          <select
            value={filters.transaction_type}
            onChange={(e) => setFilters({ ...filters, transaction_type: e.target.value })}
            className={selectClass}
          >
            <option value="">{t('search.all')}</option>
            <option value="achat">{t('search.buy')}</option>
            <option value="vente">{t('search.sell')}</option>
            <option value="location_annuelle">{t('search.annual')}</option>
            <option value="location_estivale">{t('search.seasonal')}</option>
          </select>
        </div>

        {/* Séparateur */}
        <div className="hidden lg:block w-px bg-gray-200 self-stretch my-2" />

        {/* Localisation */}
        <div className="flex flex-col px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {t('search.location')}
          </label>
          <select
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className={selectClass}
          >
            <option value="">{t('search.all')}</option>
            <option value="Hammamet">{t('search.hammamet')}</option>
            <option value="Nabeul">{t('search.nabeul')}</option>
          </select>
        </div>

        {/* Séparateur */}
        <div className="hidden lg:block w-px bg-gray-200 self-stretch my-2" />

        {/* Budget */}
        <div className="flex flex-col px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {t('search.budget')}
          </label>
          <select
            value={filters.budget}
            onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
            className={selectClass}
          >
            <option value="">{t('search.all')}</option>
            <option value="100000">100 000 TND</option>
            <option value="200000">200 000 TND</option>
            <option value="300000">300 000 TND</option>
            <option value="500000">500 000 TND</option>
            <option value="1000000">1 000 000 TND</option>
          </select>
        </div>

        {/* Search button */}
        <div className="flex items-center px-2">
          <button
            onClick={handleSearch}
            className="w-full bg-primary hover:bg-primary-600 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Search size={18} />
            {t('search.button')}
          </button>
        </div>
      </div>
    </div>
  );
}
