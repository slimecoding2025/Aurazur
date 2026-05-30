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
