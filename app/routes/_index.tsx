import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense, useState, useRef, useEffect} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  CollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {EmotionSection} from '~/components/EmotionSection';

export const meta: MetaFunction = () => {
  return [{title: 'Merveille | Artisanat d\'exception'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  // Filtrer la collection "frontpage" qui est créée automatiquement par Shopify
  const filteredCollections = collections.nodes.filter(
    (collection: CollectionFragment) => collection.handle !== 'frontpage'
  );

  return {
    collections: {
      ...collections,
      nodes: filteredCollections,
    },
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Merveille du Monde</h1>
          <p className="hero-subtitle">Artisanat d&apos;exception, créations uniques</p>
          <p className="hero-description">
            Découvrez notre collection d&apos;objets artisanaux soigneusement sélectionnés : 
            boîtes à musique, boîtes à bijoux et globes terrestres de qualité exceptionnelle.
          </p>
          <Link to="/collections" className="hero-cta">
            Découvrir nos collections
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Nouveautés</h2>
          <Suspense fallback={<div className="loading">Chargement de nos créations...</div>}>
            <Await resolve={data.recommendedProducts}>
              {(response) => (
                <div className="products-grid">
                  {response
                    ? response.products.nodes.map((product: any) => (
                        <ProductItem key={product.id} product={product} />
                      ))
                    : null}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </section>

      {/* All Collections Section */}
      {data.collections && data.collections.nodes.length > 0 && (
        <section className="collections-section">
          <div className="container">
            <h2 className="section-title">Nos Collections</h2>
            <CollectionsSlider collections={data.collections.nodes} />
          </div>
        </section>
      )}

      {/* Emotion Section */}
      <EmotionSection />

      {/* Artisanat Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Notre Savoir-Faire</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🎨</div>
              <h3>Artisanat Français</h3>
              <p>Chaque pièce est créée avec passion par des artisans français, respectant les traditions et techniques ancestrales.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">✨</div>
              <h3>Qualité Exceptionnelle</h3>
              <p>Nous sélectionnons uniquement les matériaux les plus nobles et les finitions les plus soignées pour nos créations.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">💝</div>
              <h3>Pièces Uniques</h3>
              <p>Chaque objet raconte une histoire et devient un héritage précieux à transmettre aux générations futures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <h2>Restez informé de nos nouvelles créations</h2>
          <p>Recevez en avant-première nos dernières collections et offres exclusives</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-button">
              S&apos;inscrire
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function CollectionsSlider({collections}: {collections: CollectionFragment[]}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Calculer le nombre de collections par vue basé sur la largeur d'écran
  const getCollectionsPerView = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768 ? 1 : 3.5;
    }
    return 3.5; // Valeur par défaut pour SSR
  };
  
  const [collectionsPerView, setCollectionsPerView] = useState(3.5);
  
  // Mettre à jour le nombre de collections par vue quand la fenêtre change de taille
  useEffect(() => {
    const updateCollectionsPerView = () => {
      setCollectionsPerView(window.innerWidth <= 768 ? 1 : 3.5);
    };
    
    updateCollectionsPerView();
    window.addEventListener('resize', updateCollectionsPerView);
    
    return () => window.removeEventListener('resize', updateCollectionsPerView);
  }, []);
  
  const maxIndex = Math.max(0, collections.length - Math.floor(collectionsPerView));

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <div className="collections-slider-container">
      <div className="collections-slider-wrapper">
        <div 
          ref={sliderRef}
          className={`collections-slider ${collectionsPerView === 1 ? 'mobile-view' : ''}`}
          style={{
            transform: `translateX(-${currentIndex * (100 / collectionsPerView)}%)`,
          }}
        >
          {collections.map((collection: CollectionFragment, index: number) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              index={index}
            />
          ))}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <button
        className={`slider-nav-button slider-nav-prev ${!canGoPrevious ? 'disabled' : ''}`}
        onClick={goToPrevious}
        disabled={!canGoPrevious}
        aria-label="Collection précédente"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button
        className={`slider-nav-button slider-nav-next ${!canGoNext ? 'disabled' : ''}`}
        onClick={goToNext}
        disabled={!canGoNext}
        aria-label="Collection suivante"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link to={`/collections/${collection.handle}`} className="collection-card">
      <div className="collection-image">
        {collection?.image ? (
          <Image
            alt={collection.image.altText || collection.title}
            aspectRatio="1/1"
            data={collection.image}
            loading={index < 6 ? 'eager' : undefined}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        ) : (
          <div className="collection-icon">🎵</div>
        )}
      </div>
      <div className="collection-label">
        {collection.title} →
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 50, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...Collection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
