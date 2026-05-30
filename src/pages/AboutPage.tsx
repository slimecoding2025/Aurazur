import { Award, HeartHandshake, Users, Briefcase } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export default function AboutPage() {
  const { t } = useI18n();

  const values = [
    { icon: Users, title: t('about.team.title'), desc: t('about.team.desc') },
    { icon: HeartHandshake, title: t('about.mission.title'), desc: t('about.mission.desc') },
    { icon: Award, title: t('about.trust.title'), desc: t('about.trust.desc') },
    { icon: Briefcase, title: t('about.expertise.title'), desc: t('about.expertise.desc') },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-primary font-semibold mb-4">{t('about.tagline')}</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">{t('about.title')}</h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">{t('about.description')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((value) => (
                <div key={value.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <value.icon size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80" alt="Agence immobilière" className="w-full h-full object-cover min-h-[520px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-sm uppercase tracking-[0.24em] mb-2">{t('about.clients')}</p>
              <h2 className="text-3xl font-semibold mb-3">{t('about.clients_title')}</h2>
              <p className="text-sm text-white/80 leading-relaxed">{t('about.clients_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
