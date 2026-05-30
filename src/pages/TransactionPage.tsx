import { useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { Building, Search, ArrowRightCircle } from 'lucide-react';

interface TransactionPageProps {
  type?: 'achat' | 'vente' | 'location_annuelle' | 'location_estivale';
}

export default function TransactionPage({ type = 'achat' }: TransactionPageProps) {
  const { t } = useI18n();
  const [transactionType, setTransactionType] = useState<'achat' | 'vente' | 'location_annuelle' | 'location_estivale'>(type);

  useEffect(() => {
    setTransactionType(type);
  }, [type]);

  const steps = [
    { label: t('transaction.step1'), description: t('transaction.step1_desc') },
    { label: t('transaction.step2'), description: t('transaction.step2_desc') },
    { label: t('transaction.step3'), description: t('transaction.step3_desc') },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Building size={24} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold mb-1">{t('transaction.title')}</p>
                  <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">{t('transaction.subtitle')}</h1>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-8">{t('transaction.description')}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { value: 'achat', label: t('transaction.buy') },
                  { value: 'vente', label: t('transaction.sell') },
                  { value: 'location_annuelle', label: t('transaction.annual') },
                  { value: 'location_estivale', label: t('transaction.seasonal') },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTransactionType(option.value as typeof transactionType)}
                    className={`rounded-3xl border p-5 text-left transition-all ${transactionType === option.value ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-primary/5'}`}
                  >
                    <p className="font-semibold mb-1">{option.label}</p>
                    <p className="text-sm text-gray-500">{t(`transaction.${option.value}_desc`)}</p>
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 rounded-3xl p-8">
                <h2 className="font-semibold text-xl text-gray-900 mb-4">{t('transaction.how_it_works')}</h2>
                <div className="space-y-4">
                  {steps.map((step, idx) => (
                    <div key={step.label} className="flex gap-4">
                      <div className="min-w-[44px] h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-semibold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{step.label}</p>
                        <p className="text-gray-500 text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Search size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-primary font-semibold">{t('transaction.help')}</p>
                  <h3 className="text-lg font-semibold text-gray-900">{t('transaction.consult')}</h3>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{t('transaction.help_desc')}</p>
              <a href="/contact" className="btn-primary w-full justify-center">
                {t('transaction.contact')}
                <ArrowRightCircle size={18} />
              </a>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary-700 text-white rounded-3xl p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] font-semibold mb-3">{t('transaction.offer')}</p>
              <h3 className="text-2xl font-semibold mb-4">{t('transaction.offer_title')}</h3>
              <p className="text-sm leading-relaxed opacity-90">{t('transaction.offer_desc')}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
