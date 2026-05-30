import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Home, TrendingUp, Calendar, Waves, CheckCircle2, Star, Users, Award } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { getFeaturedProperties, getTestimonials } from '../lib/supabase';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import type { Property, Testimonial } from '../types';

const WHATSAPP = '+21628210870';

export default function HomePage() {
  const { t } = useI18n();
  const [properties, setProperties] = useState<Property[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [props, tests] = await Promise.all([
          getFeaturedProperties(),
          getTestimonials(),
        ]);
        setProperties(props);
        setTestimonials(tests);
      } catch (e) {
        setError(t('error.loading'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const services = [
    { icon: Home, title: t('services.buy.title'), desc: t('services.buy.desc'), href: '/achat', color: 'bg-primary/5 text-primary' },
    { icon: TrendingUp, title: t('services.sell.title'), desc: t('services.sell.desc'), href: '/vente', color: 'bg-blue-50 text-blue-600' },
    { icon: Calendar, title: t('services.annual.title'), desc: t('services.annual.desc'), href: '/location-annuelle', color: 'bg-purple-50 text-purple-600' },
    { icon: Waves, title: t('services.seasonal.title'), desc: t('services.seasonal.desc'), href: '/location-estivale', color: 'bg-amber-50 text-amber-600' },
  ];

  const features = [
    { icon: Award, title: t('why.expertise.title'), desc: t('why.expertise.desc') },
    { icon: CheckCircle2, title: t('why.trust.title'), desc: t('why.trust.desc') },
    { icon: Home, title: t('why.portfolio.title'), desc: t('why.portfolio.desc') },
    { icon: Users, title: t('why.support.title'), desc: t('why.support.desc') },
  ];

  return (
    <div>
      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-primary/80 pt-20">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="container-custom relative z-10 text-center py-24">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white/80 text-sm px-4 py-2 rounded-full mb-6 border border-white/20"
          >
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            {t('hero.breadcrumb')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6 leading-tight"
          >
            {t('hero.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/properties" className="btn-primary text-base px-8 py-4">
              {t('hero.cta.properties')}
              <ArrowRight size={18} />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 border border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-lg font-medium text-base transition-all duration-200 inline-flex items-center gap-2 backdrop-blur"
            >
              {t('hero.cta.contact')}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-16"
          >
            {[
              { value: '200+', label: 'Biens vendus' },
              { value: '10+', label: "Ans d'expérience" },
              { value: '98%', label: 'Clients satisfaits' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/60 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80H1440V30C1440 30 1200 0 720 0C240 0 0 30 0 30V80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── Search Bar ──────────────────────────────── */}
      <section className="relative z-20 -mt-4 pb-16">
        <div className="container-custom">
          <SearchBar />
        </div>
      </section>

      {/* ── Services ────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">{t('services.title')}</h2>
            <p className="text-gray-500 text-lg">{t('services.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
              >
                <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-5`}>
                  <service.icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{service.desc}</p>
                <Link
                  to={service.href}
                  className="inline-flex items-center gap-1.5 text-primary font-medium text-sm group-hover:gap-2.5 transition-all"
                >
                  {t('services.discover')}
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Properties ─────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="section-title mb-3">{t('properties.featured')}</h2>
              <p className="text-gray-500 text-lg">{t('properties.featured.subtitle')}</p>
            </div>
            <Link to="/properties" className="btn-outline text-sm whitespace-nowrap">
              Voir tous les biens
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 text-gray-500">{error}</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Home size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('properties.empty')}</h3>
              <p className="text-gray-400">{t('properties.empty.subtitle')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((property, idx) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ───────────────────────────── */}
      <section className="py-20 bg-primary text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">{t('why.title')}</h2>
            <p className="text-white/70 text-lg">{t('why.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={22} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="section-title mb-3">Ce que disent nos clients</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={16}
                        className={j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.message}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {t.client_name.charAt(0)}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{t.client_name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ──────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary to-primary-700 rounded-3xl p-10 md:p-16 text-white text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Prêt à concrétiser votre projet immobilier ?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Contactez notre équipe d'experts pour un accompagnement personnalisé.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="bg-white text-primary font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors">
                Nous contacter
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
