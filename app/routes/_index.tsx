import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';

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
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
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
          <p className="hero-subtitle">Artisanat d'exception, créations uniques</p>
          <p className="hero-description">
            Découvrez notre collection d'objets artisanaux soigneusement sélectionnés : 
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

      {/* Featured Collection */}
      {data.featuredCollection && (
        <section className="featured-collection-section">
          <div className="container">
            <FeaturedCollection collection={data.featuredCollection} />
          </div>
        </section>
      )}

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
              S'inscrire
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <div className="featured-collection-card">
      <Link
        className="featured-collection-link"
        to={`/collections/${collection.handle}`}
      >
        {image && (
          <div className="featured-collection-image">
            <Image data={image} sizes="100vw" />
          </div>
        )}
        <div className="featured-collection-content">
          <h2>{collection.title}</h2>
          <p>Découvrez notre collection vedette</p>
          <span className="featured-collection-cta">Voir la collection</span>
        </div>
      </Link>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
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
