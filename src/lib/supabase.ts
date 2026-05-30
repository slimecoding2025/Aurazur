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
