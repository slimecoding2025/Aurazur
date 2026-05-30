import { useEffect, useState, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, ArrowLeft, MessageCircle, Phone, Share2, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { getPropertyBySlug, getRelatedProperties, submitContact } from '../lib/supabase';
import PropertyCard from '../components/PropertyCard';
import type { Property } from '../types';

const WHATSAPP = '+21628210870';

export default function PropertyDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { t } = useI18n();
  const [property, setProperty] = useState<Property | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!slug) return;
    async function load() {
      const localSlug = slug;
      if (!localSlug) return;
      try {
        const prop = await getPropertyBySlug(localSlug);
        setProperty(prop);
        if (prop) {
          const rel = await getRelatedProperties(prop.id, prop.category, prop.city);
          setRelated(rel);
        }
      } catch {
        setError(t('error.loading'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      await submitContact({ ...formData, property_id: property?.id });
      setFormStatus('success');
      setFormData({ full_name: '', email: '', phone: '', message: '' });
    } catch {
      setFormStatus('error');
    }
  };

  if (loading) return (
    <div className="pt-32 min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !property) return (
    <div className="pt-32 min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-lg">{error || 'Bien non trouvé'}</p>
      <Link to="/properties" className="btn-primary">
        <ArrowLeft size={16} />
        {t('detail.back')}
      </Link>
    </div>
  );

  const formatPrice = () => {
    if (property.price_on_request) return t('properties.on_request');
    if (!property.price) return t('properties.on_request');
    const suffix =
      property.transaction_type === 'location_annuelle' ? t('year') :
      property.transaction_type === 'location_estivale' ? t('month') : '';
    return `${property.price.toLocaleString('fr-TN')} ${t('tnd')}${suffix ? ' ' + suffix : ''}`;
  };

  const images = property.property_images ?? [];
  const whatsappMsg = encodeURIComponent(`Bonjour, je suis intéressé par le bien: ${property.title} - ${window.location.href}`);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-primary transition-colors">Biens</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Back button */}
        <Link to="/properties" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary text-sm mb-6 transition-colors">
          <ArrowLeft size={16} />
          {t('detail.back')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {images.length > 0 ? (
                <>
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={images[activeImage]?.image_url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 p-3 overflow-x-auto">
                      {images.map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={() => setActiveImage(idx)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            activeImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-400">Aucune image disponible</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 text-lg mb-4">{t('detail.description')}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-900 text-lg mb-4">{t('detail.amenities')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                      {a.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Property info card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="mb-2">
                <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {property.category}
                </span>
              </div>
              <h1 className="font-semibold text-gray-900 text-xl mt-3 mb-2">{property.title}</h1>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                <MapPin size={14} className="text-primary" />
                <span>{property.address || property.city}</span>
              </div>

              <div className="text-3xl font-bold text-primary mb-5">{formatPrice()}</div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {property.bedrooms != null && (
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Bed size={18} className="text-primary mx-auto mb-1" />
                    <p className="font-semibold text-gray-900 text-sm">{property.bedrooms}</p>
                    <p className="text-gray-500 text-xs">{t('detail.bedrooms')}</p>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Bath size={18} className="text-primary mx-auto mb-1" />
                    <p className="font-semibold text-gray-900 text-sm">{property.bathrooms}</p>
                    <p className="text-gray-500 text-xs">{t('detail.bathrooms')}</p>
                  </div>
                )}
                {property.area != null && (
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Square size={18} className="text-primary mx-auto mb-1" />
                    <p className="font-semibold text-gray-900 text-sm">{property.area}</p>
                    <p className="text-gray-500 text-xs">m²</p>
                  </div>
                )}
              </div>

              {/* CTA buttons */}
              <a
                href={`https://wa.me/${WHATSAPP}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mb-3 text-sm"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <a
                href="tel:+21628210870"
                className="w-full btn-outline justify-center text-sm py-3.5 mb-3"
              >
                <Phone size={16} />
                +216 28 210 870
              </a>
              <button
                onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <Share2 size={16} />
                {t('detail.share')}
              </button>
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-5">{t('detail.contact')}</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder={t('contact.name')}
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <input
                  type="email"
                  placeholder={t('contact.email')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <input
                  type="tel"
                  placeholder={t('contact.phone')}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <textarea
                  placeholder={t('contact.message')}
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
                {formStatus === 'success' && (
                  <p className="text-green-600 text-sm bg-green-50 px-4 py-3 rounded-xl">{t('contact.success')}</p>
                )}
                {formStatus === 'error' && (
                  <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{t('contact.error')}</p>
                )}
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full btn-primary justify-center disabled:opacity-60"
                >
                  {formStatus === 'sending' ? t('loading') : t('contact.send')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Related properties */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title mb-8">{t('detail.related')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
