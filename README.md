# Aurazur - Real Estate Platform

A modern real estate platform for properties in Nabeul and Hammamet, Tunisia, built with React, TypeScript, and Vite.

## 🌐 Features

- **Multi-language Support**: French, English, and Arabic (with RTL support)
- **Property Listings**: Browse and filter properties by city, category, price, and amenities
- **Advanced Search**: Filter by transaction type (buy/rent), bedrooms, bathrooms, area
- **Property Details**: View detailed property information with image gallery
- **Contact Management**: Direct WhatsApp integration and contact form
- **Testimonials**: Client reviews and ratings
- **Responsive Design**: Mobile-first, fully responsive UI
- **Admin Management**: Add properties with images and metadata

## 🛠 Tech Stack

- **Frontend**: React 19.2.6 + TypeScript 5.9.3
- **Build Tool**: Vite 5.4.21
- **Styling**: Tailwind CSS 3.4.1
- **Routing**: React Router DOM 6.30.4
- **Animation**: Framer Motion 11.18.2
- **Icons**: Lucide React 0.516.0
- **Internationalization**: Custom React Context (i18n)
- **Backend**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for images

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/slimecoding2025/Aurazur.git
cd Aurazur

# Install dependencies
npm install

# Create .env file with environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will run on `http://localhost:5173`

## 🔐 Environment Variables

Create a `.env` file in the root directory (already in .gitignore for security):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_key
```

**For Vercel deployment**, add these as environment variables in your Vercel project settings.

## 📁 Project Structure

```
src/
├── components/       # Reusable React components
│   ├── Navbar.tsx
│   ├── PropertyCard.tsx
│   └── ...
├── pages/           # Page components
│   ├── HomePage.tsx
│   ├── PropertiesPage.tsx
│   ├── PropertyDetailPage.tsx
│   └── ...
├── lib/             # Utilities and configurations
│   ├── supabase.ts  # Supabase client & queries
│   └── i18n.tsx     # Internationalization
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## 📦 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🗄 Database Schema

The platform uses PostgreSQL via Supabase with the following main tables:

- **properties**: Main property listings
- **property_images**: Images for each property
- **amenities**: Features and amenities
- **testimonials**: Client reviews
- **contacts**: Contact form submissions

## 🎨 Internationalization

The app supports three languages:
- **Français** (French)
- **English** (English)  
- **العربية** (Arabic with RTL)

Switch languages via the navbar language selector.

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel Settings
4. Deploy

```bash
git push origin main
```

### Other Platforms

The project builds to a `dist/` folder with static files that can be deployed to:
- Netlify
- GitHub Pages
- AWS S3
- Any static hosting

```bash
npm run build
# dist/ folder is ready for deployment
```

## 📸 Property Management

### Adding New Properties

Properties can be added via Supabase SQL Editor:

```sql
INSERT INTO properties (title, slug, description, city, address, category, transaction_type, status, price_on_request, bedrooms, bathrooms, area, featured)
VALUES (
  'Villa Title',
  'villa-slug',
  'Description...',
  'Hammamet',
  'Address',
  'villa',
  'achat',
  'available',
  true,
  3,
  2,
  400,
  true
);
```

Set `featured = true` to display on the homepage.

## 📧 Contact

For inquiries:
- WhatsApp: [Contact via app]
- Email: [Add contact email]

## 📄 License

This project is proprietary software. All rights reserved.

## 👤 Author

Slim Coding 2025

---

**Built with ❤️ for the Tunisian real estate market**
