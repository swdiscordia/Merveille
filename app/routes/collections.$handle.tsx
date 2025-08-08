import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItemCollection} from '~/components/ProductItemCollection';

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
  
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 16,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const baseVariables = {
    handle, 
    ...paginationVariables,
  };

  const collection = await storefront.query(COLLECTION_QUERY, {
        variables: baseVariables,
      });

  if (!collection?.collection) {
    throw redirect('/collections');
  }

  return {collection: collection.collection};
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
  const {collection} = useLoaderData<typeof loader>();

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

      {/* Main Content - Full Width */}
      <div className="collection-layout">
        <div className="collection-main-full">
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
