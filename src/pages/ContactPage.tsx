import { useState, type FormEvent } from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { submitContact } from '../lib/supabase';

export default function ContactPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitContact(formData);
      setStatus('success');
      setFormData({ full_name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold">{t('contact.title')}</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">{t('contact.subtitle')}</h1>
            <p className="text-gray-600 leading-relaxed max-w-2xl">{t('contact.description')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('contact.address_title')}</p>
                    <p className="text-gray-500 text-sm">{t('contact.address')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('contact.email_title')}</p>
                    <p className="text-gray-500 text-sm">contact@aurazur.immo</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('contact.phone_title')}</p>
                    <p className="text-gray-500 text-sm">+216 28 210 870</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
            <h2 className="font-semibold text-2xl text-gray-900 mb-4">{t('contact.form_title')}</h2>
            <p className="text-gray-500 mb-8">{t('contact.form_text')}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={t('contact.name')}
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <input
                type="email"
                placeholder={t('contact.email')}
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <input
                type="tel"
                placeholder={t('contact.phone')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <textarea
                placeholder={t('contact.message')}
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
              {status === 'success' && (
                <p className="text-green-600 text-sm bg-green-50 px-4 py-3 rounded-2xl">{t('contact.success')}</p>
              )}
              {status === 'error' && (
                <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-2xl">{t('contact.error')}</p>
              )}
              <button type="submit" disabled={status === 'sending'} className="btn-primary w-full justify-center py-3.5 disabled:opacity-70">
                <Send size={18} />
                {status === 'sending' ? t('loading') : t('contact.send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
