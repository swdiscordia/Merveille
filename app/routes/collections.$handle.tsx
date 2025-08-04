import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItemCollection} from '~/components/ProductItemCollection';
import {CollectionTabs} from '~/components/CollectionTabs';
import {NoResultsMessage} from '~/components/NoResultsMessage';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
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
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 16,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  // Build structured filters for products
  const filters = searchParams.getAll('filter');
  const priceMin = searchParams.get('price_min');
  const priceMax = searchParams.get('price_max');
  
  let structuredFilters: any[] = [];
  
  // Add category filters
  if (filters.length > 0) {
    filters.forEach(filter => {
      if (filter && filter.trim()) {
        structuredFilters.push({ tag: filter });
      }
    });
  }
  
  // Add price filters if they are not default values
  const minPrice = priceMin ? parseFloat(priceMin) : 0;
  const maxPrice = priceMax ? parseFloat(priceMax) : 1000;
  
  // Ensure we have valid price values
  if (isNaN(minPrice) || isNaN(maxPrice)) {
    console.error('Invalid price values:', { priceMin, priceMax, minPrice, maxPrice });
  }
  
  // Debug: log price filter values
  console.log('🔍 PRICE FILTER DEBUG:', {
    priceMin,
    priceMax,
    minPrice,
    maxPrice,
    structuredFilters
  });
  console.log(`🎯 Filter range: ${minPrice}€ to ${maxPrice}€`);
  
  if (minPrice > 0 || maxPrice < 1000) {
    // Shopify expects price filters in a specific format
    // The price should be in cents (multiply by 100)
    const minPriceCents = Math.floor(minPrice * 100);
    const maxPriceCents = Math.floor(maxPrice * 100);
    
    // Try different price filter structures
    if (minPrice > 0 && maxPrice < 1000) {
      // Range filter - try both formats
      structuredFilters.push({
        price: {
          min: minPriceCents,
          max: maxPriceCents
        }
      });
    } else if (minPrice > 0) {
      // Minimum price only
      structuredFilters.push({
        price: {
          min: minPriceCents
        }
      });
    } else if (maxPrice < 1000) {
      // Maximum price only
      structuredFilters.push({
        price: {
          max: maxPriceCents
        }
      });
    }
    
    // Alternative: try using variant price filter instead of product price filter
    if (structuredFilters.length > 0) {
      console.log('Price filter structure:', JSON.stringify(structuredFilters, null, 2));
    }
    
    // Also try alternative price filter format for Shopify
    if (minPrice > 0 || maxPrice < 1000) {
      const alternativeFilters = [...structuredFilters];
      alternativeFilters.push({
        variantPrice: {
          min: minPriceCents,
          max: maxPriceCents
        }
      });
      console.log('Alternative price filter structure:', JSON.stringify(alternativeFilters, null, 2));
    }
  }

  const baseVariables = {
    handle, 
    ...paginationVariables,
  };

  let collection;
  
  try {
    // Check if we have price filters
    const hasPriceFilters = structuredFilters.some(filter => filter.price || filter.variantPrice);
    
    if (hasPriceFilters) {
      // For price filters, always use client-side filtering for reliability
      console.log('Price filters detected, using client-side filtering...');
      const result = await storefront.query(COLLECTION_QUERY, {
        variables: baseVariables,
      });
      collection = result.collection;
    } else if (structuredFilters.length > 0) {
      // For non-price filters, try server-side filtering
      console.log('Applying non-price filters:', JSON.stringify(structuredFilters, null, 2));
      const result = await storefront.query(COLLECTION_QUERY_WITH_FILTERS, {
        variables: { ...baseVariables, filters: structuredFilters },
      });
      collection = result.collection;
    } else {
      // No filters, use simple query
      const result = await storefront.query(COLLECTION_QUERY, {
        variables: baseVariables,
      });
      collection = result.collection;
    }
  } catch (error) {
    console.error('Error querying collection:', error);
    // Fallback to simple query if filtered query fails
    if (structuredFilters.length > 0) {
      const result = await storefront.query(COLLECTION_QUERY, {
        variables: baseVariables,
      });
      collection = result.collection;
    } else {
      throw error;
    }
  }

  if (!collection) {
    // Debug: log available collections in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Collection "${handle}" not found. Available collections can be viewed at /collections`);
      console.log('Query variables used:', structuredFilters.length > 0 ? { ...baseVariables, filters: structuredFilters } : baseVariables);
    }
    
    // Map of missing collections to existing alternatives
    const collectionRedirects: Record<string, string> = {
      'boites-a-musique': '/collections/all',
      'music-boxes': '/collections/all',
      'musique': '/collections/all',
      'instruments': '/collections/all',
    };
    
    // For specific missing collections, redirect to alternatives
    if (collectionRedirects[handle]) {
      console.log(`Redirecting missing collection "${handle}" to "${collectionRedirects[handle]}"`);
      throw redirect(collectionRedirects[handle]);
    }
    
    // Create a more helpful error message
    const errorMessage = `Collection "${handle}" not found. ${
      structuredFilters.length > 0 
        ? 'This may be due to filters applied that return no results.' 
        : 'Please check if the collection exists or view all collections at /collections'
    }`;
    
    throw new Response(errorMessage, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  // Apply client-side filtering for price filters
  let hasValidServerSideResults = collection.products.nodes.length > 0;
  
  if (structuredFilters.length > 0) {
    const hasPriceFilters = structuredFilters.some(filter => filter.price || filter.variantPrice);
    
    if (hasPriceFilters) {
      console.log('Applying client-side price filtering...');
      console.log(`Filter range: ${minPrice}€ - ${maxPrice}€`);
      console.log(`Total products to filter: ${collection.products.nodes.length}`);
      
      // Filtrage strictement sur le prix de vente actuel UNIQUEMENT
      console.log(`🔍 FILTRE PRIX DEBUG - Plage: ${minPrice}€ à ${maxPrice}€`);
      
      const filteredProducts = collection.products.nodes.filter((product: any) => {
        if (product.variants && product.variants.nodes) {
          const hasValidVariant = product.variants.nodes.some((variant: any) => {
            // On prend UNIQUEMENT le prix de vente actuel
            const sellingPrice = parseFloat(
              typeof variant.price.amount === 'string'
                ? variant.price.amount.replace(/[^\d.]/g, '')
                : variant.price.amount
            ) || 0;
            
            const isInRange = sellingPrice >= minPrice && sellingPrice <= maxPrice;
            
            console.log(`  📦 "${product.title}" - Variant: ${variant.title}`);
            console.log(`    - Raw price: "${variant.price.amount}"`);
            console.log(`    - Parsed price: ${sellingPrice}€`);
            console.log(`    - In range ${minPrice}€-${maxPrice}€: ${isInRange}`);
            
            // Debug spécial pour Demon Slayer
            if (product.title.toLowerCase().includes('demon slayer')) {
              console.log(`    🎯 DEMON SLAYER - Price: ${sellingPrice}€, Range: ${minPrice}€-${maxPrice}€, Included: ${isInRange}`);
            }
            
            return isInRange;
          });
          
          console.log(`  ✅ "${product.title}" - Inclu dans les résultats: ${hasValidVariant}`);
          return hasValidVariant;
        }
        return false;
      });
      
      console.log(`📊 RÉSULTATS FINAUX:`);
      console.log(`  - Produits avant filtrage: ${collection.products.nodes.length}`);
      console.log(`  - Produits après filtrage: ${filteredProducts.length}`);
      console.log(`  - Produits filtrés: ${filteredProducts.map((p: any) => p.title).join(', ')}`);
      
      // Log all products that were filtered out
      const filteredOutProducts = collection.products.nodes.filter((product: any) => {
        // Re-run the same logic to see which products were excluded
        let minSellingPrice = Infinity;
        let maxSellingPrice = 0;
        
        if (product.variants && product.variants.nodes) {
          product.variants.nodes.forEach((variant: any) => {
            const sellingPriceRaw = variant.price.amount || '0';
            const sellingPrice = parseFloat(sellingPriceRaw.replace(/[^\d.]/g, '')) || 0;
            
            if (sellingPrice < minSellingPrice) {
              minSellingPrice = sellingPrice;
            }
            if (sellingPrice > maxSellingPrice) {
              maxSellingPrice = sellingPrice;
            }
          });
        }
        
        if (minSellingPrice === Infinity) {
          return false;
        }
        
        const isInPriceRange = minSellingPrice <= maxPrice;
        return !isInPriceRange;
      });
      
      if (filteredOutProducts.length > 0) {
        console.log(`❌ FILTERED OUT PRODUCTS:`);
        filteredOutProducts.forEach((product: any) => {
          let minSellingPrice = Infinity;
          let maxSellingPrice = 0;
          
          if (product.variants && product.variants.nodes) {
            product.variants.nodes.forEach((variant: any) => {
              const sellingPriceRaw = variant.price.amount || '0';
              const sellingPrice = parseFloat(sellingPriceRaw.replace(/[^\d.]/g, '')) || 0;
              
              if (sellingPrice < minSellingPrice) {
                minSellingPrice = sellingPrice;
              }
              if (sellingPrice > maxSellingPrice) {
                maxSellingPrice = sellingPrice;
              }
            });
          }
          
          console.log(`  - "${product.title}": ${minSellingPrice}€-${maxSellingPrice}€ (filter: ${minPrice}€-${maxPrice}€)`);
        });
      }
      
      // For price filters, we need to adjust pagination info to reflect the filtered results
      // If we have fewer products than expected, we should indicate no more pages
      const originalPageSize = 16; // This should match the pageBy value in getPaginationVariables
      const hasMorePages = collection.products.nodes.length === originalPageSize && collection.products.pageInfo.hasNextPage;
      
      // Update collection with filtered products and adjusted pagination
      collection = {
        ...collection,
        products: {
          ...collection.products,
          nodes: filteredProducts,
          // Adjust pageInfo based on filtered results
          pageInfo: {
            ...collection.products.pageInfo,
            // If we have fewer products than the page size, there are no more pages
            hasNextPage: hasMorePages && filteredProducts.length === originalPageSize,
            // Keep the same cursors for consistency
            startCursor: collection.products.pageInfo.startCursor,
            endCursor: collection.products.pageInfo.endCursor
          }
        }
      };
      
      hasValidServerSideResults = filteredProducts.length > 0;
    }
  }

  return {
    collection,
    hasFilteredResults: hasValidServerSideResults || structuredFilters.length === 0,
    appliedFilters: structuredFilters,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {collection, hasFilteredResults, appliedFilters} = useLoaderData<typeof loader>();

  return (
    <div className="collection-page">
      {/* Hero Header */}
      <div className="collection-hero">
        <div className="collection-hero-content">
          <div className="collection-breadcrumb">
            <span className="breadcrumb-home">Accueil</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Collections</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{collection.title}</span>
          </div>
          <h1 className="collection-hero-title">{collection.title}</h1>
          {collection.description && (
            <p className="collection-hero-description">{collection.description}</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="collection-layout">
        {/* Enhanced Sidebar */}
        <div className="collection-sidebar">
          <CollectionTabs />
          
        </div>
        
        {/* Enhanced Main Content */}
        <div className="collection-main">
          {/* Show No Results Message if no products found with filters */}
          {!hasFilteredResults && appliedFilters.length > 0 ? (
            <NoResultsMessage 
              appliedFilters={appliedFilters}
              collectionTitle={collection.title}
              collectionHandle={collection.handle}
            />
          ) : (
            /* Products Grid */
            <PaginatedResourceSection
              connection={collection.products}
              resourcesClassName="enhanced-products-grid"
            >
              {({node: product, index}) => (
                <ProductItemCollection
                  key={(product as any).id}
                  product={product as any}
                  loading={index < 8 ? 'eager' : undefined}
                />
              )}
            </PaginatedResourceSection>
          )}
        </div>
      </div>
      
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 10) {
      nodes {
        id
        title
        price {
          ...MoneyProductItem
        }
        compareAtPrice {
          ...MoneyProductItem
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

const COLLECTION_QUERY_WITH_FILTERS = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query CollectionWithFilters(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
