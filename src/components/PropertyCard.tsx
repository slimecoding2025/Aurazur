import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Heart, MessageCircle } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import type { Property } from '../types';

const WHATSAPP = '+21628210870';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { t } = useI18n();
  const [liked, setLiked] = useState(false);

  const primaryImage = property.property_images?.find((img) => img.is_primary)
    ?? property.property_images?.[0];

  const getBadge = () => {
    switch (property.transaction_type) {
      case 'achat': return { label: t('properties.for_sale'), color: 'bg-primary text-white' };
      case 'vente': return { label: t('properties.for_sale'), color: 'bg-primary text-white' };
      case 'location_annuelle': return { label: t('properties.annual_rent'), color: 'bg-blue-600 text-white' };
      case 'location_estivale': return { label: t('properties.seasonal_rent'), color: 'bg-amber-500 text-white' };
      default: return { label: '', color: '' };
    }
  };

  const formatPrice = () => {
    if (property.price_on_request) return t('properties.on_request');
    if (!property.price) return t('properties.on_request');
    const suffix =
      property.transaction_type === 'location_annuelle' ? t('year') :
      property.transaction_type === 'location_estivale' ? t('month') : '';
    return `${property.price.toLocaleString('fr-TN')} ${t('tnd')}${suffix ? ' ' + suffix : ''}`;
  };

  const badge = getBadge();
  const whatsappMsg = encodeURIComponent(`Bonjour, je suis intéressé par le bien: ${property.title}`);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-400">
              <Square size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">Aucune image</p>
            </div>
          </div>
        )}

        {/* Badge */}
        {badge.label && (
          <div className={`absolute top-3 left-3 ${badge.color} text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide`}>
            {badge.label}
          </div>
        )}

        {/* Status badge */}
        {property.status !== 'available' && (
          <div className="absolute top-3 right-12 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {property.status === 'sold' ? t('detail.sold') : t('detail.rented')}
          </div>
        )}

        {/* Heart */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart
            size={16}
            className={liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start gap-1 text-gray-500 text-xs mb-2">
          <MapPin size={13} className="mt-0.5 flex-shrink-0 text-primary" />
          <span>{property.address || property.city}</span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {property.bedrooms != null && (
            <div className="flex items-center gap-1.5">
              <Bed size={15} className="text-primary" />
              <span>{property.bedrooms} {t('properties.bedrooms')}</span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center gap-1.5">
              <Bath size={15} className="text-primary" />
              <span>{property.bathrooms} {t('properties.bathrooms')}</span>
            </div>
          )}
          {property.area != null && (
            <div className="flex items-center gap-1.5">
              <Square size={15} className="text-primary" />
              <span>{property.area} {t('properties.area')}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-primary leading-tight">{formatPrice()}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/${WHATSAPP}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-green-50 hover:bg-green-500 text-green-600 hover:text-white rounded-lg flex items-center justify-center transition-colors"
              title={t('properties.whatsapp')}
            >
              <MessageCircle size={17} />
            </a>
            <Link
              to={`/properties/${property.slug}`}
              className="btn-primary text-xs px-4 py-2"
            >
              {t('properties.details')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
