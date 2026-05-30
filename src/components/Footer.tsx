import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useI18n } from '../lib/i18n';

const WHATSAPP = '+21628210870';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-display text-2xl font-semibold">Aurazur</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('footer.tagline')}
            </p>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: t('nav.home') },
                { href: '/achat', label: t('nav.buy') },
                { href: '/vente', label: t('nav.sell') },
                { href: '/location-annuelle', label: t('nav.annual') },
                { href: '/location-estivale', label: t('nav.seasonal') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{t('contact.address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <a href="tel:+21628210870" className="text-gray-400 hover:text-primary text-sm transition-colors">
                  +216 28 210 870
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <a href="mailto:aurazurtn@outlook.fr" className="text-gray-400 hover:text-primary text-sm transition-colors">
                  aurazurtn@outlook.fr
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.social')}</h3>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/aurazur.tn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com/AurazurTunisia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Aurazur. {t('footer.rights')}
          </p>
          <div className="flex gap-4">
            <Link to="/about" className="text-gray-500 hover:text-primary text-sm transition-colors">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="text-gray-500 hover:text-primary text-sm transition-colors">
              {t('nav.contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
