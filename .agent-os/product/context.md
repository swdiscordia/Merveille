# Merveille Technical Context

## Project Structure

```
merveille/
├── app/                          # Main application code
│   ├── components/              # React components
│   │   ├── AddToCartButton.tsx  # Shopping cart functionality
│   │   ├── CartMain.tsx         # Cart interface
│   │   ├── EmotionSection.tsx   # Emotional storytelling component
│   │   ├── Header.tsx           # Site navigation
│   │   ├── Footer.tsx           # Site footer
│   │   ├── ProductGallery.tsx   # Product image display
│   │   ├── ProductForm.tsx      # Product purchase form
│   │   ├── ProductTabs.tsx      # Product information tabs
│   │   ├── ServiceCards.tsx     # Trust and service info
│   │   └── ...                  # Other components
│   ├── routes/                  # Page routes
│   │   ├── _index.tsx          # Homepage
│   │   ├── products.$handle.tsx # Product detail pages
│   │   ├── collections.$handle.tsx # Collection pages
│   │   ├── cart.tsx            # Shopping cart page
│   │   ├── account/            # Customer account pages
│   │   └── ...                 # Other routes
│   ├── lib/                    # Utility libraries
│   │   ├── context.ts          # React context
│   │   ├── fragments.ts        # GraphQL fragments
│   │   ├── session.ts          # Session management
│   │   └── ...                 # Other utilities
│   ├── styles/                 # CSS styles
│   │   ├── app.css            # Main styles
│   │   ├── reset.css          # CSS reset
│   │   └── tailwind.css       # Tailwind imports
│   └── graphql/               # GraphQL queries
├── public/                    # Static assets
│   └── images/               # Product and content images
├── .agent-os/                # Agent OS documentation
│   └── product/              # Product documentation
├── package.json              # Dependencies and scripts
├── vite.config.ts           # Build configuration
├── react-router.config.ts   # Router configuration
└── tsconfig.json            # TypeScript configuration
```

## Technology Stack

### Core Framework
- **Shopify Hydrogen 2025.5.0**: Shopify's headless commerce framework
- **React Router 7.6.0**: Application routing and navigation
- **TypeScript 5.2.2**: Type-safe JavaScript development
- **Vite 6.2.4**: Fast build tool and development server

### Styling & UI
- **TailwindCSS 4.1.6**: Utility-first CSS framework
- **Custom CSS**: Emotion-focused styling for French luxury aesthetic
- **Responsive Design**: Mobile-first approach with desktop enhancements

### Data & API
- **Shopify Storefront API**: GraphQL-based e-commerce data
- **GraphQL Code Generator**: Type-safe API interactions
- **Shopify Customer Account API**: User authentication and management

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting
- **Shopify CLI**: Development and deployment tools

## Key Architectural Patterns

### Component Architecture
```typescript
// Example component structure
import {useLoaderData} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductItem({product}: {product: ProductFragment}) {
  return (
    <div className="product-card">
      {/* Component implementation */}
    </div>
  );
}
```

### Route Structure
- **File-based routing**: Routes defined by file structure in `app/routes/`
- **Dynamic routes**: Using `$` syntax for parameters (e.g., `products.$handle.tsx`)
- **Nested routes**: Account section uses nested routing structure
- **Loaders**: Data fetching using React Router loaders

### Data Fetching Pattern
```typescript
export async function loader({context, params}: LoaderFunctionArgs) {
  const deferredData = loadDeferredData({context});
  const criticalData = await loadCriticalData({context, params});
  return {...deferredData, ...criticalData};
}
```

### GraphQL Integration
- **Type Generation**: Automatic TypeScript types from GraphQL schema
- **Fragment Composition**: Reusable query fragments
- **Deferred Loading**: Critical vs. deferred data patterns

## Current Implementation Details

### Homepage Features
- **Hero Section**: Brand introduction and call-to-action
- **Featured Products**: Dynamic product recommendations
- **Collections Slider**: Interactive collection browsing
- **Emotion Sections**: Storytelling components
- **Values Section**: Artisan craftsmanship messaging
- **Newsletter**: Email subscription functionality

### Product Pages
- **Product Gallery**: Multi-image carousel with zoom
- **Product Information**: Tabs for description, specifications, care
- **Variant Selection**: Size, color, material options
- **Add to Cart**: Shopify cart integration
- **Service Cards**: Shipping, warranty, support information

### Collection Pages
- **Collection Filtering**: By type, price, availability
- **Product Grid**: Responsive product display
- **Collection Tabs**: Category navigation
- **Sort Options**: Price, date, popularity

### User Account
- **Authentication**: Shopify Customer Account API
- **Profile Management**: Personal information updates
- **Order History**: Past purchases and tracking
- **Address Management**: Shipping and billing addresses

## Styling Approach

### Design System
- **Color Palette**: Luxury French aesthetic with warm tones
- **Typography**: Elegant fonts emphasizing craftsmanship
- **Spacing**: Generous whitespace for premium feel
- **Components**: Consistent button, card, and form styling

### Responsive Strategy
```css
/* Mobile-first approach */
.hero-title {
  @apply text-2xl md:text-4xl lg:text-5xl;
}

.collections-slider {
  @apply grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4;
}
```

### Custom CSS Classes
- **Emotion sections**: Specialized layouts for storytelling
- **Product cards**: Hover effects and image optimizations
- **Navigation**: French luxury brand aesthetics
- **Forms**: Elegant input styling with validation states

## Data Models

### Product Structure
```typescript
interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImage: Image;
  images: Image[];
  variants: ProductVariant[];
  priceRange: PriceRange;
  options: ProductOption[];
}
```

### Collection Structure
```typescript
interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: Image;
  products: Product[];
}
```

## Performance Considerations

### Loading Strategies
- **Critical vs. Deferred**: Above-fold content loads first
- **Image Optimization**: Shopify CDN with responsive images
- **Code Splitting**: Route-based code splitting with Vite
- **Prefetching**: Strategic link prefetching for navigation

### SEO Implementation
- **Meta Tags**: Dynamic title and description generation
- **Structured Data**: Product and organization schema
- **Canonical URLs**: Preventing duplicate content
- **Sitemap**: Dynamic sitemap generation

## Development Workflow

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run typecheck    # TypeScript validation
npm run lint         # Code linting
npm run codegen      # GraphQL type generation
```

### Git Workflow
- **Main Branch**: Production-ready code
- **Feature Branches**: Development work
- **Collection Branch**: Current active development

### Deployment
- **Shopify Oxygen**: Hosting platform
- **Automatic Deployment**: Git-based deployment pipeline
- **Environment Variables**: Shopify store configuration

## Security & Compliance

### Data Protection
- **Customer Data**: Handled through Shopify's secure infrastructure
- **Payment Processing**: Shopify's PCI-compliant payment system
- **GDPR Compliance**: European data protection standards

### Authentication
- **Customer Accounts**: Shopify Customer Account API
- **Session Management**: Secure session handling
- **Password Security**: Shopify's authentication system

## Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: Loading, interactivity, visual stability
- **Error Tracking**: Application error monitoring
- **User Experience**: Navigation and conversion tracking

### Business Analytics
- **Google Analytics**: User behavior and conversion tracking
- **Shopify Analytics**: E-commerce specific metrics
- **Custom Events**: Product interaction tracking

## Integration Points

### Shopify Platform
- **Storefront API**: Product and collection data
- **Customer Account API**: User management
- **Checkout API**: Cart and purchase flow
- **Admin API**: Order management (future)

### External Services
- **Email Marketing**: Newsletter integration (planned)
- **Social Media**: Sharing and marketing (planned)
- **Search Engines**: SEO optimization (in progress)
- **Analytics**: Google Analytics and Search Console (planned)

## Localization

### French Language Support
- **Content**: All text in French
- **Currency**: Euro (EUR) display
- **Date Formats**: European date formatting
- **Cultural Adaptation**: French luxury market preferences

### Future Internationalization
- **Multi-language**: Planned expansion to other languages
- **Currency**: Multiple currency support
- **Regional**: Market-specific adaptations