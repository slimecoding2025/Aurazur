// ============================================================
// AURAZUR - Complete Real Estate Platform
// Single-file version — ready to be split by Blackbox AI
// ============================================================
// INSTRUCTIONS FOR BLACKBOX AI:
// Split this file into a proper Vite + React + TypeScript project:
// - src/main.tsx
// - src/App.tsx
// - src/lib/supabase.ts
// - src/lib/i18n.tsx (LanguageContext + translations)
// - src/components/Navbar.tsx
// - src/components/Footer.tsx
// - src/components/PropertyCard.tsx
// - src/components/SearchBar.tsx
// - src/components/AIChat.tsx
// - src/pages/HomePage.tsx
// - src/pages/PropertiesPage.tsx
// - src/pages/PropertyDetailPage.tsx
// - src/pages/AboutPage.tsx
// - src/pages/ContactPage.tsx
// - src/pages/TransactionPage.tsx (used for /achat /vente /location-annuelle /location-estivale)
// - src/types/index.ts
// - vite.config.ts (with OpenRouter middleware)
// - tailwind.config.js
// - index.html
// ============================================================

// ============================================================
// FILE: src/types/index.ts
// ============================================================
/*
export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  city: string;
  address: string;
  category: string;
  transaction_type: string;
  status: string;
  price: number;
  price_on_request: boolean;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  property_images?: PropertyImage[];
  amenities?: Amenity[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface Amenity {
  id: string;
  property_id: string;
  name: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  message: string;
  rating: number;
  created_at: string;
}

export interface ContactForm {
  full_name: string;
  email: string;
  phone: string;
  message: string;
  property_id?: string;
}
*/

// ============================================================
// FILE: SQL — Run this in Supabase SQL Editor
// ============================================================
/*
-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Properties table
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  city text check (city in ('Hammamet', 'Nabeul')),
  address text,
  category text check (category in ('villa', 'appartement', 'penthouse', 'duplex', 'terrain')),
  transaction_type text check (transaction_type in ('achat', 'vente', 'location_annuelle', 'location_estivale')),
  status text default 'available' check (status in ('available', 'sold', 'rented')),
  price numeric,
  price_on_request boolean default false,
  bedrooms int,
  bathrooms int,
  area numeric,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Property images table
create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  image_url text not null,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Amenities table
create table if not exists amenities (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  name text not null
);

-- Testimonials table
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  message text not null,
  rating int check (rating between 1 and 5),
  created_at timestamptz default now()
);

-- Contacts table
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  message text not null,
  property_id uuid references properties(id) on delete set null,
  created_at timestamptz default now()
);

-- Disable RLS for now
alter table properties disable row level security;
alter table property_images disable row level security;
alter table amenities disable row level security;
alter table testimonials disable row level security;
alter table contacts disable row level security;

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger properties_updated_at
  before update on properties
  for each row execute function update_updated_at();
*/

// ============================================================
// FILE: vite.config.ts
// ============================================================
/*
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Connect } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const OPENROUTER_API_KEY = env.OPENROUTER_API_KEY;

  return {
    plugins: [
      react(),
      {
        name: 'ai-chat-middleware',
        configureServer(server) {
          server.middlewares.use(
            '/api/ai-chat',
            async (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
              if (req.method !== 'POST') {
                next();
                return;
              }
              let body = '';
              req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
              req.on('end', async () => {
                try {
                  const { messages } = JSON.parse(body);
                  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                      'Content-Type': 'application/json',
                      'HTTP-Referer': 'https://aurazur.tn',
                      'X-Title': 'Aurazur IA',
                    },
                    body: JSON.stringify({
                      model: 'poolside/laguna-m.1:free',
                      messages: [
                        {
                          role: 'system',
                          content: "Tu es Aurazur IA, assistant immobilier expert à Nabeul et Hammamet, Tunisie. Réponds de façon professionnelle et concise. Tu parles français par défaut, mais tu peux aussi répondre en arabe ou en anglais selon la langue de l'utilisateur.",
                        },
                        ...messages,
                      ],
                    }),
                  });
                  const data = await response.json();
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                } catch (error) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'AI service error' }));
                }
              });
            }
          );
        },
      },
    ],
    define: {
      'process.env': {},
    },
  };
});
*/

// ============================================================
// FILE: tailwind.config.js
// ============================================================
/*
/** @type {import('tailwindcss').Config} * /
export default {
  content: ['./index.html', './src/** /*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2A7D6F',
          50: '#E8F5F3',
          100: '#C5E8E2',
          200: '#8DD0C6',
          300: '#56B8AA',
          400: '#2A9E8E',
          500: '#2A7D6F',
          600: '#216358',
          700: '#184941',
          800: '#10302A',
          900: '#081814',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
};
*/

// ============================================================
// FILE: index.html
// ============================================================
/*
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Aurazur - Agence immobilière à Nabeul et Hammamet, Tunisie. Achat, vente et location de biens immobiliers." />
    <title>Aurazur - Immobilier Nabeul & Hammamet</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
*/

// ============================================================
// FILE: src/main.tsx
// ============================================================
/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/

// ============================================================
// FILE: src/index.css
// ============================================================
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    @apply text-gray-800 bg-white;
  }
  [dir="rtl"] {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-all duration-200 inline-flex items-center gap-2;
  }
  .btn-outline {
    @apply border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-200 inline-flex items-center gap-2;
  }
  .section-title {
    @apply font-display text-3xl md:text-4xl font-semibold text-gray-900;
  }
  .container-custom {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
}
*/

// ============================================================
// FILE: .env (create this file — never commit to git)
// ============================================================
/*
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
*/

// ============================================================
// FILE: src/lib/supabase.ts
// ============================================================
/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Properties ──────────────────────────────────────────────
export async function getFeaturedProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images(*)')
    .eq('featured', true)
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(8);
  if (error) throw error;
  return data ?? [];
}

export async function getProperties(filters: {
  city?: string;
  category?: string;
  transaction_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
} = {}) {
  let query = supabase
    .from('properties')
    .select('*, property_images(*)')
    .order('created_at', { ascending: false });

  if (filters.city) query = query.eq('city', filters.city);
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.transaction_type) query = query.eq('transaction_type', filters.transaction_type);
  if (filters.min_price) query = query.gte('price', filters.min_price);
  if (filters.max_price) query = query.lte('price', filters.max_price);
  if (filters.bedrooms) query = query.eq('bedrooms', filters.bedrooms);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getPropertyBySlug(slug: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images(*), amenities(*)')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}

export async function getRelatedProperties(propertyId: string, category: string, city: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images(*)')
    .neq('id', propertyId)
    .eq('city', city)
    .eq('category', category)
    .limit(3);
  if (error) throw error;
  return data ?? [];
}

// ─── Contacts ────────────────────────────────────────────────
export async function submitContact(contact: {
  full_name: string;
  email: string;
  phone: string;
  message: string;
  property_id?: string;
}) {
  const { error } = await supabase.from('contacts').insert([contact]);
  if (error) throw error;
}

// ─── Testimonials ─────────────────────────────────────────────
export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);
  if (error) throw error;
  return data ?? [];
}
*/

// ============================================================
// FILE: src/lib/i18n.tsx
// ============================================================
/*
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'fr' | 'en' | 'ar';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navbar
    'nav.home': 'Accueil',
    'nav.buy': 'Achat',
    'nav.sell': 'Vente',
    'nav.annual': 'Location Annuelle',
    'nav.seasonal': 'Location Estivale',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.cta': 'Nous contacter',

    // Hero
    'hero.breadcrumb': 'Nabeul • Hammamet • Tunisie',
    'hero.title': 'Trouvez le bien qui vous correspond',
    'hero.subtitle': 'Votre partenaire de confiance pour l\'achat, la vente et la location immobilière à Nabeul et Hammamet.',
    'hero.cta.properties': 'Voir les biens',
    'hero.cta.contact': 'Nous contacter',

    // Search
    'search.type': 'Type de bien',
    'search.transaction': 'Transaction',
    'search.location': 'Localisation',
    'search.budget': 'Budget',
    'search.button': 'Rechercher',
    'search.all': 'Tous',
    'search.villa': 'Villa',
    'search.apartment': 'Appartement',
    'search.penthouse': 'Penthouse',
    'search.duplex': 'Duplex',
    'search.terrain': 'Terrain',
    'search.buy': 'Achat',
    'search.sell': 'Vente',
    'search.annual': 'Location Annuelle',
    'search.seasonal': 'Location Estivale',
    'search.hammamet': 'Hammamet',
    'search.nabeul': 'Nabeul',

    // Properties
    'properties.featured': 'Biens en vedette',
    'properties.featured.subtitle': 'Découvrez notre sélection de biens d\'exception',
    'properties.empty': 'Aucun bien disponible pour le moment',
    'properties.empty.subtitle': 'Revenez bientôt pour découvrir nos nouvelles annonces.',
    'properties.for_sale': 'À VENDRE',
    'properties.annual_rent': 'À LOUER ANNUELLEMENT',
    'properties.seasonal_rent': 'À LOUER ESTIVALEMENT',
    'properties.on_request': 'Prix sur demande',
    'properties.bedrooms': 'ch.',
    'properties.bathrooms': 'sdb.',
    'properties.area': 'm²',
    'properties.details': 'Voir les détails',
    'properties.whatsapp': 'Contacter sur WhatsApp',
    'properties.count': 'bien(s) trouvé(s)',
    'properties.filters': 'Filtres',
    'properties.city': 'Ville',
    'properties.category': 'Catégorie',
    'properties.min_price': 'Prix min',
    'properties.max_price': 'Prix max',
    'properties.apply': 'Appliquer',
    'properties.reset': 'Réinitialiser',

    // Services
    'services.title': 'Nos Services',
    'services.subtitle': 'Un accompagnement complet pour tous vos projets immobiliers',
    'services.buy.title': 'Achat',
    'services.buy.desc': 'Trouvez la propriété de vos rêves parmi notre sélection exclusive de biens à Nabeul et Hammamet.',
    'services.sell.title': 'Vente',
    'services.sell.desc': 'Confiez-nous la vente de votre bien et bénéficiez de notre expertise du marché local.',
    'services.annual.title': 'Location Annuelle',
    'services.annual.desc': 'Des biens de qualité pour vos locations longue durée dans les meilleures résidences.',
    'services.seasonal.title': 'Location Estivale',
    'services.seasonal.desc': 'Profitez de nos villas et appartements pour des vacances mémorables en Tunisie.',
    'services.discover': 'Découvrir',

    // Why Us
    'why.title': 'Pourquoi nous choisir ?',
    'why.subtitle': 'L\'excellence au service de votre projet immobilier',
    'why.expertise.title': 'Expertise Locale',
    'why.expertise.desc': 'Plus de 10 ans d\'expérience sur le marché immobilier de Nabeul et Hammamet.',
    'why.trust.title': 'Confiance & Transparence',
    'why.trust.desc': 'Nous vous accompagnons avec honnêteté et professionnalisme à chaque étape.',
    'why.portfolio.title': 'Large Portefeuille',
    'why.portfolio.desc': 'Des centaines de biens disponibles pour répondre à tous vos besoins.',
    'why.support.title': 'Suivi Personnalisé',
    'why.support.desc': 'Un conseiller dédié à votre service, disponible 7j/7.',

    // About
    'about.title': 'À propos d\'Aurazur',
    'about.subtitle': 'Votre partenaire immobilier de confiance',
    'about.p1': 'Aurazur est une agence immobilière spécialisée dans les régions de Nabeul et Hammamet, au cœur de la côte nord-est tunisienne.',
    'about.p2': 'Nous proposons une gamme complète de services immobiliers : achat, vente, location annuelle et location estivale. Notre équipe d\'experts vous accompagne à chaque étape de votre projet.',
    'about.p3': 'Notre connaissance approfondie du marché local et notre engagement envers la satisfaction client font de nous le partenaire idéal pour tous vos projets immobiliers.',

    // Contact
    'contact.title': 'Contactez-nous',
    'contact.subtitle': 'Notre équipe est à votre disposition',
    'contact.name': 'Nom complet',
    'contact.email': 'Email',
    'contact.phone': 'Téléphone',
    'contact.message': 'Message',
    'contact.send': 'Envoyer le message',
    'contact.success': 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
    'contact.error': 'Une erreur est survenue. Veuillez réessayer.',
    'contact.address': 'Nabeul & Hammamet, Tunisie',
    'contact.phone_label': 'Téléphone',
    'contact.email_label': 'Email',

    // AI Chat
    'ai.title': 'Aurazur IA',
    'ai.placeholder': 'Posez votre question...',
    'ai.welcome': 'Bonjour ! Je suis Aurazur IA, votre assistant immobilier. Comment puis-je vous aider ?',
    'ai.send': 'Envoyer',
    'ai.thinking': 'En train de réfléchir...',
    'ai.error': 'Désolé, une erreur est survenue. Veuillez réessayer.',

    // Footer
    'footer.tagline': 'Votre partenaire immobilier de confiance à Nabeul et Hammamet.',
    'footer.rights': 'Tous droits réservés.',
    'footer.links': 'Liens rapides',
    'footer.contact': 'Contact',
    'footer.social': 'Réseaux sociaux',

    // Property Detail
    'detail.description': 'Description',
    'detail.amenities': 'Équipements',
    'detail.contact': 'Contacter l\'agence',
    'detail.related': 'Biens similaires',
    'detail.back': 'Retour aux biens',
    'detail.share': 'Partager',
    'detail.bedrooms': 'Chambres',
    'detail.bathrooms': 'Salles de bain',
    'detail.area': 'Surface',
    'detail.category': 'Catégorie',
    'detail.city': 'Ville',
    'detail.status': 'Statut',
    'detail.available': 'Disponible',
    'detail.sold': 'Vendu',
    'detail.rented': 'Loué',

    // General
    'loading': 'Chargement...',
    'error': 'Erreur',
    'error.loading': 'Erreur lors du chargement des données.',
    'whatsapp': 'Contacter sur WhatsApp',
    'tnd': 'TND',
    'month': '/ mois',
    'year': '/ an',
  },

  en: {
    'nav.home': 'Home',
    'nav.buy': 'Buy',
    'nav.sell': 'Sell',
    'nav.annual': 'Annual Rental',
    'nav.seasonal': 'Summer Rental',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cta': 'Contact Us',
    'hero.breadcrumb': 'Nabeul • Hammamet • Tunisia',
    'hero.title': 'Find the property that suits you',
    'hero.subtitle': 'Your trusted partner for buying, selling and renting real estate in Nabeul and Hammamet.',
    'hero.cta.properties': 'View Properties',
    'hero.cta.contact': 'Contact Us',
    'search.type': 'Property Type',
    'search.transaction': 'Transaction',
    'search.location': 'Location',
    'search.budget': 'Budget',
    'search.button': 'Search',
    'search.all': 'All',
    'search.villa': 'Villa',
    'search.apartment': 'Apartment',
    'search.penthouse': 'Penthouse',
    'search.duplex': 'Duplex',
    'search.terrain': 'Land',
    'search.buy': 'Buy',
    'search.sell': 'Sell',
    'search.annual': 'Annual Rental',
    'search.seasonal': 'Summer Rental',
    'search.hammamet': 'Hammamet',
    'search.nabeul': 'Nabeul',
    'properties.featured': 'Featured Properties',
    'properties.featured.subtitle': 'Discover our selection of exceptional properties',
    'properties.empty': 'No properties available at the moment',
    'properties.empty.subtitle': 'Check back soon for new listings.',
    'properties.for_sale': 'FOR SALE',
    'properties.annual_rent': 'ANNUAL RENTAL',
    'properties.seasonal_rent': 'SUMMER RENTAL',
    'properties.on_request': 'Price on request',
    'properties.bedrooms': 'bd.',
    'properties.bathrooms': 'ba.',
    'properties.area': 'm²',
    'properties.details': 'View Details',
    'properties.whatsapp': 'Contact on WhatsApp',
    'properties.count': 'property/ies found',
    'properties.filters': 'Filters',
    'properties.city': 'City',
    'properties.category': 'Category',
    'properties.min_price': 'Min price',
    'properties.max_price': 'Max price',
    'properties.apply': 'Apply',
    'properties.reset': 'Reset',
    'services.title': 'Our Services',
    'services.subtitle': 'Complete support for all your real estate projects',
    'services.buy.title': 'Buy',
    'services.buy.desc': 'Find the property of your dreams from our exclusive selection in Nabeul and Hammamet.',
    'services.sell.title': 'Sell',
    'services.sell.desc': 'Entrust us with the sale of your property and benefit from our local market expertise.',
    'services.annual.title': 'Annual Rental',
    'services.annual.desc': 'Quality properties for your long-term rentals in the best residences.',
    'services.seasonal.title': 'Summer Rental',
    'services.seasonal.desc': 'Enjoy our villas and apartments for a memorable vacation in Tunisia.',
    'services.discover': 'Discover',
    'why.title': 'Why choose us?',
    'why.subtitle': 'Excellence in the service of your real estate project',
    'why.expertise.title': 'Local Expertise',
    'why.expertise.desc': 'Over 10 years of experience in the real estate market of Nabeul and Hammamet.',
    'why.trust.title': 'Trust & Transparency',
    'why.trust.desc': 'We accompany you with honesty and professionalism at every step.',
    'why.portfolio.title': 'Large Portfolio',
    'why.portfolio.desc': 'Hundreds of properties available to meet all your needs.',
    'why.support.title': 'Personalized Support',
    'why.support.desc': 'A dedicated advisor at your service, available 7 days a week.',
    'about.title': 'About Aurazur',
    'about.subtitle': 'Your trusted real estate partner',
    'about.p1': 'Aurazur is a real estate agency specializing in the Nabeul and Hammamet regions, on the northeast coast of Tunisia.',
    'about.p2': 'We offer a complete range of real estate services: buying, selling, annual rental and summer rental. Our team of experts accompanies you at every stage of your project.',
    'about.p3': 'Our in-depth knowledge of the local market and our commitment to customer satisfaction make us the ideal partner for all your real estate projects.',
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Our team is at your disposal',
    'contact.name': 'Full Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.success': 'Message sent successfully! We will get back to you shortly.',
    'contact.error': 'An error occurred. Please try again.',
    'contact.address': 'Nabeul & Hammamet, Tunisia',
    'contact.phone_label': 'Phone',
    'contact.email_label': 'Email',
    'ai.title': 'Aurazur AI',
    'ai.placeholder': 'Ask your question...',
    'ai.welcome': 'Hello! I am Aurazur AI, your real estate assistant. How can I help you?',
    'ai.send': 'Send',
    'ai.thinking': 'Thinking...',
    'ai.error': 'Sorry, an error occurred. Please try again.',
    'footer.tagline': 'Your trusted real estate partner in Nabeul and Hammamet.',
    'footer.rights': 'All rights reserved.',
    'footer.links': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.social': 'Social Media',
    'detail.description': 'Description',
    'detail.amenities': 'Amenities',
    'detail.contact': 'Contact Agency',
    'detail.related': 'Similar Properties',
    'detail.back': 'Back to Properties',
    'detail.share': 'Share',
    'detail.bedrooms': 'Bedrooms',
    'detail.bathrooms': 'Bathrooms',
    'detail.area': 'Area',
    'detail.category': 'Category',
    'detail.city': 'City',
    'detail.status': 'Status',
    'detail.available': 'Available',
    'detail.sold': 'Sold',
    'detail.rented': 'Rented',
    'loading': 'Loading...',
    'error': 'Error',
    'error.loading': 'Error loading data.',
    'whatsapp': 'Contact on WhatsApp',
    'tnd': 'TND',
    'month': '/ month',
    'year': '/ year',
  },

  ar: {
    'nav.home': 'الرئيسية',
    'nav.buy': 'شراء',
    'nav.sell': 'بيع',
    'nav.annual': 'إيجار سنوي',
    'nav.seasonal': 'إيجار صيفي',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.cta': 'اتصل بنا',
    'hero.breadcrumb': 'نابل • الحمامات • تونس',
    'hero.title': 'اعثر على العقار المناسب لك',
    'hero.subtitle': 'شريكك الموثوق لشراء وبيع وتأجير العقارات في نابل والحمامات.',
    'hero.cta.properties': 'عرض العقارات',
    'hero.cta.contact': 'اتصل بنا',
    'search.type': 'نوع العقار',
    'search.transaction': 'نوع المعاملة',
    'search.location': 'الموقع',
    'search.budget': 'الميزانية',
    'search.button': 'بحث',
    'search.all': 'الكل',
    'search.villa': 'فيلا',
    'search.apartment': 'شقة',
    'search.penthouse': 'بنتهاوس',
    'search.duplex': 'دوبلكس',
    'search.terrain': 'أرض',
    'search.buy': 'شراء',
    'search.sell': 'بيع',
    'search.annual': 'إيجار سنوي',
    'search.seasonal': 'إيجار صيفي',
    'search.hammamet': 'الحمامات',
    'search.nabeul': 'نابل',
    'properties.featured': 'عقارات مميزة',
    'properties.featured.subtitle': 'اكتشف مجموعتنا المختارة من العقارات الاستثنائية',
    'properties.empty': 'لا توجد عقارات متاحة في الوقت الحالي',
    'properties.empty.subtitle': 'تابعنا قريباً لاكتشاف إعلاناتنا الجديدة.',
    'properties.for_sale': 'للبيع',
    'properties.annual_rent': 'للإيجار السنوي',
    'properties.seasonal_rent': 'للإيجار الصيفي',
    'properties.on_request': 'السعر عند الطلب',
    'properties.bedrooms': 'غرف',
    'properties.bathrooms': 'حمامات',
    'properties.area': 'م²',
    'properties.details': 'عرض التفاصيل',
    'properties.whatsapp': 'التواصل عبر واتساب',
    'properties.count': 'عقار(ات) تم العثور عليها',
    'properties.filters': 'الفلاتر',
    'properties.city': 'المدينة',
    'properties.category': 'الفئة',
    'properties.min_price': 'أدنى سعر',
    'properties.max_price': 'أقصى سعر',
    'properties.apply': 'تطبيق',
    'properties.reset': 'إعادة تعيين',
    'services.title': 'خدماتنا',
    'services.subtitle': 'دعم كامل لجميع مشاريعك العقارية',
    'services.buy.title': 'شراء',
    'services.buy.desc': 'اعثر على عقار أحلامك من مجموعتنا الحصرية في نابل والحمامات.',
    'services.sell.title': 'بيع',
    'services.sell.desc': 'ثق بنا في بيع عقارك واستفد من خبرتنا في السوق المحلية.',
    'services.annual.title': 'إيجار سنوي',
    'services.annual.desc': 'عقارات عالية الجودة لإيجاراتك طويلة المدى في أفضل الإقامات.',
    'services.seasonal.title': 'إيجار صيفي',
    'services.seasonal.desc': 'استمتع بفيلاتنا وشققنا لعطلة لا تُنسى في تونس.',
    'services.discover': 'اكتشف',
    'why.title': 'لماذا تختارنا؟',
    'why.subtitle': 'التميز في خدمة مشروعك العقاري',
    'why.expertise.title': 'خبرة محلية',
    'why.expertise.desc': 'أكثر من 10 سنوات من الخبرة في سوق العقارات في نابل والحمامات.',
    'why.trust.title': 'الثقة والشفافية',
    'why.trust.desc': 'نرافقك بأمانة واحترافية في كل خطوة.',
    'why.portfolio.title': 'محفظة واسعة',
    'why.portfolio.desc': 'مئات العقارات المتاحة لتلبية جميع احتياجاتك.',
    'why.support.title': 'متابعة شخصية',
    'why.support.desc': 'مستشار مخصص في خدمتك، متاح 7 أيام في الأسبوع.',
    'about.title': 'من نحن',
    'about.subtitle': 'شريكك العقاري الموثوق',
    'about.p1': 'أوراجور وكالة عقارية متخصصة في منطقتي نابل والحمامات، على الساحل الشمالي الشرقي لتونس.',
    'about.p2': 'نقدم مجموعة كاملة من الخدمات العقارية: الشراء والبيع والإيجار السنوي والإيجار الصيفي.',
    'about.p3': 'معرفتنا العميقة بالسوق المحلية والتزامنا برضا العملاء يجعلنا الشريك المثالي لجميع مشاريعك العقارية.',
    'contact.title': 'اتصل بنا',
    'contact.subtitle': 'فريقنا في خدمتك',
    'contact.name': 'الاسم الكامل',
    'contact.email': 'البريد الإلكتروني',
    'contact.phone': 'الهاتف',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال الرسالة',
    'contact.success': 'تم إرسال الرسالة بنجاح! سنرد عليك في أقرب وقت ممكن.',
    'contact.error': 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    'contact.address': 'نابل والحمامات، تونس',
    'contact.phone_label': 'الهاتف',
    'contact.email_label': 'البريد الإلكتروني',
    'ai.title': 'أوراجور AI',
    'ai.placeholder': 'اطرح سؤالك...',
    'ai.welcome': 'مرحباً! أنا مساعد أوراجور العقاري. كيف يمكنني مساعدتك؟',
    'ai.send': 'إرسال',
    'ai.thinking': 'جاري التفكير...',
    'ai.error': 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
    'footer.tagline': 'شريكك العقاري الموثوق في نابل والحمامات.',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.links': 'روابط سريعة',
    'footer.contact': 'اتصل بنا',
    'footer.social': 'وسائل التواصل الاجتماعي',
    'detail.description': 'الوصف',
    'detail.amenities': 'المرافق',
    'detail.contact': 'تواصل مع الوكالة',
    'detail.related': 'عقارات مشابهة',
    'detail.back': 'العودة إلى العقارات',
    'detail.share': 'مشاركة',
    'detail.bedrooms': 'غرف النوم',
    'detail.bathrooms': 'الحمامات',
    'detail.area': 'المساحة',
    'detail.category': 'الفئة',
    'detail.city': 'المدينة',
    'detail.status': 'الحالة',
    'detail.available': 'متاح',
    'detail.sold': 'مباع',
    'detail.rented': 'مؤجر',
    'loading': 'جاري التحميل...',
    'error': 'خطأ',
    'error.loading': 'خطأ في تحميل البيانات.',
    'whatsapp': 'التواصل عبر واتساب',
    'tnd': 'دينار',
    'month': '/ شهر',
    'year': '/ سنة',
  },
};

export const I18nContext = createContext<I18nContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key) => key,
  dir: 'ltr',
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string): string => {
    return translations[language][key] ?? translations['fr'][key] ?? key;
  };

  const dir: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
*/

// ============================================================
// FILE: src/App.tsx
// ============================================================
/*
import React from 'react';
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
*/

// ============================================================
// FILE: src/components/Navbar.tsx
// ============================================================
/*
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Globe } from 'lucide-react';
import { useI18n, Language } from '../lib/i18n';

const WHATSAPP = '+21628210870';

export default function Navbar() {
  const { t, language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/achat', label: t('nav.buy') },
    { href: '/vente', label: t('nav.sell') },
    { href: '/location-annuelle', label: t('nav.annual') },
    { href: '/location-estivale', label: t('nav.seasonal') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const langs: { code: Language; label: string }[] = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-display text-2xl font-semibold text-gray-900 tracking-tight">
              Aurazur
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === link.href
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Globe size={16} />
                <span className="uppercase">{language}</span>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[130px]">
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        language === l.code ? 'text-primary font-medium' : 'text-gray-700'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              <Phone size={16} />
              {t('nav.cta')}
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 flex gap-2">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    language === l.code
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {l.code.toUpperCase()}
                </button>
              ))}
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center mt-2 text-sm"
            >
              <Phone size={16} />
              {t('nav.cta')}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
*/

// ============================================================
// FILE: src/components/Footer.tsx
// ============================================================
/*
import React from 'react';
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
*/

// ============================================================
// FILE: src/components/PropertyCard.tsx
// ============================================================
/*
import React, { useState } from 'react';
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
*/

// ============================================================
// FILE: src/components/SearchBar.tsx
// ============================================================
/*
import React, { useState } from 'react';
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
*/

// ============================================================
// FILE: src/components/AIChat.tsx
// ============================================================
/*
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('ai.welcome') },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content ?? t('ai.error');
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: t('ai.error') }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <MessageCircle size={26} />
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        }`}
        style={{ maxHeight: '500px' }}
      >
        {/* Header */}
        <div className="bg-primary px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{t('ai.title')}</p>
              <p className="text-white/70 text-xs">En ligne</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 280 }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('ai.placeholder')}
            className="flex-1 text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-primary hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
*/

// ============================================================
// FILE: src/pages/HomePage.tsx
// ============================================================
/*
import React, { useEffect, useState } from 'react';
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
*/

// ============================================================
// FILE: src/pages/PropertiesPage.tsx
// ============================================================
/*
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Home } from 'lucide-react';
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
*/

// ============================================================
// FILE: src/pages/PropertyDetailPage.tsx
// ============================================================
/*
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, ArrowLeft, MessageCircle, Phone, Share2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../lib/i18n';
import { getPropertyBySlug, getRelatedProperties, submitContact } from '../lib/supabase';
import PropertyCard from '../components/PropertyCard';
import type { Property } from '../types';

const WHATSAPP = '+21628210870';

export default function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
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
      try {
        const prop = await getPropertyBySlug(slug);
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

  const handleSubmit = async (e: React.FormEvent) => {
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
*/

// ============================================================
// FILE: src/pages/TransactionPage.tsx
// ============================================================
/*
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../lib/i18n';
import { getProperties } from '../lib/supabase';
import PropertyCard from '../components/PropertyCard';
import type { Property } from '../types';

interface TransactionPageProps {
  type: 'achat' | 'vente' | 'location_annuelle' | 'location_estivale';
}

const PAGE_TITLES: Record<string, string> = {
  achat: 'Biens à acheter',
  vente: 'Biens à vendre',
  location_annuelle: 'Location Annuelle',
  location_estivale: 'Location Estivale',
};

const PAGE_SUBTITLES: Record<string, string> = {
  achat: 'Découvrez nos biens disponibles à l\'achat',
  vente: 'Nos biens disponibles à la vente',
  location_annuelle: 'Logements disponibles en location longue durée',
  location_estivale: 'Villas et appartements pour vos vacances',
};

export default function TransactionPage({ type }: TransactionPageProps) {
  const { t } = useI18n();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getProperties({ transaction_type: type });
        setProperties(data);
      } catch {
        setError(t('error.loading'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [type]);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-primary py-20 px-4">
        <div className="container-custom text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-semibold mb-4"
          >
            {PAGE_TITLES[type]}
          </motion.h1>
          <p className="text-white/70 text-lg">{PAGE_SUBTITLES[type]}</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <p className="text-gray-500 mb-8">
          {loading ? t('loading') : `${properties.length} ${t('properties.count')}`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <Link to="/properties" className="btn-primary">Voir tous les biens</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
*/

// ============================================================
// FILE: src/pages/AboutPage.tsx
// ============================================================
/*
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Home, MapPin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-primary py-24 px-4">
        <div className="container-custom text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-semibold mb-4"
          >
            {t('about.title')}
          </motion.h1>
          <p className="text-white/70 text-xl">{t('about.subtitle')}</p>
        </div>
      </div>

      {/* Main content */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title mb-6">{t('about.title')}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{t('about.p1')}</p>
                <p>{t('about.p2')}</p>
                <p>{t('about.p3')}</p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link to="/properties" className="btn-primary">Voir nos biens</Link>
                <Link to="/contact" className="btn-outline">Nous contacter</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Home, value: '200+', label: 'Biens vendus' },
                { icon: Users, value: '500+', label: 'Clients satisfaits' },
                { icon: Award, value: '10+', label: "Ans d'expérience" },
                { icon: MapPin, value: '2', label: 'Villes couvertes' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon size={22} className="text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team / Values */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="section-title mb-4">Nos Valeurs</h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto">Ce qui nous définit et nous guide dans notre travail quotidien.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Intégrité', desc: 'Nous agissons avec honnêteté et transparence dans toutes nos transactions.' },
              { title: 'Excellence', desc: 'Nous visons la perfection dans chaque service que nous offrons à nos clients.' },
              { title: 'Engagement', desc: 'Votre satisfaction est notre priorité absolue, de A à Z.' },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <div className="w-1 h-10 bg-primary rounded-full mx-auto mb-5" />
                <h3 className="font-semibold text-gray-900 text-xl mb-3">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
*/

// ============================================================
// FILE: src/pages/ContactPage.tsx
// ============================================================
/*
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { submitContact } from '../lib/supabase';

const WHATSAPP = '+21628210870';

export default function ContactPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
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

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-primary py-24 px-4">
        <div className="container-custom text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-semibold mb-4"
          >
            {t('contact.title')}
          </motion.h1>
          <p className="text-white/70 text-xl">{t('contact.subtitle')}</p>
        </div>
      </div>

      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="font-semibold text-gray-900 text-lg mb-6">Informations de contact</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-0.5">{t('contact.address')}</p>
                      <p className="text-gray-500 text-sm">Nabeul & Hammamet, Tunisie</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-0.5">{t('contact.phone_label')}</p>
                      <a href="tel:+21628210870" className="text-primary text-sm hover:underline">+216 28 210 870</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-0.5">{t('contact.email_label')}</p>
                      <a href="mailto:aurazurtn@outlook.fr" className="text-primary text-sm hover:underline">aurazurtn@outlook.fr</a>
                    </div>
                  </div>
                </div>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-4 rounded-2xl transition-colors w-full justify-center"
              >
                <MessageCircle size={22} />
                Contacter sur WhatsApp
              </a>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h2 className="font-semibold text-gray-900 text-lg mb-6">Envoyer un message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t('contact.name')}</label>
                      <input type="text" required className={inputClass} value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} placeholder="Votre nom complet" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t('contact.phone')}</label>
                      <input type="tel" className={inputClass} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+216 XX XXX XXX" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t('contact.email')}</label>
                    <input type="email" className={inputClass} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="votre@email.com" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t('contact.message')}</label>
                    <textarea required rows={6} className={inputClass + ' resize-none'} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Décrivez votre projet immobilier..." />
                  </div>

                  {status === 'success' && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">
                      {t('contact.success')}
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {t('contact.error')}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-primary w-full justify-center disabled:opacity-60 py-4"
                  >
                    <Send size={18} />
                    {status === 'sending' ? t('loading') : t('contact.send')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
*/

// ============================================================
// FILE: package.json
// ============================================================
/*
{
  "name": "aurazur",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.383.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.12"
  }
}
*/

// ============================================================
// FILE: tsconfig.json
// ============================================================
/*
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
*/

// ============================================================
// FILE: tsconfig.node.json
// ============================================================
/*
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
*/

// ============================================================
// FILE: postcss.config.js
// ============================================================
/*
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
*/

// ============================================================
// END OF AURAZUR COMPLETE PLATFORM
// ============================================================

// This file is intentionally a JSX scaffold.
// All real code is inside the block comments above.
// Ask Blackbox AI to extract each file from the comments.

export default function AurazurPlaceholder() {
  return <div>AURAZUR — See file comments for full source code</div>;
}