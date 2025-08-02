import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductVariantSelector({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();

  return (
    <div className="product-variant-selector">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-variant-option" key={option.name}>
            <h5 className="variant-option-title">{option.name}</h5>
            <div className="variant-thumbnails-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                // Get the variant image from the firstSelectableVariant
                const variantImage = value.firstSelectableVariant?.image;
                const swatchImage = swatch?.image?.previewImage?.url;
                const swatchColor = swatch?.color;

                // Use variant image if available, otherwise fall back to swatch
                const displayImage = variantImage?.url || swatchImage;
                const displayAlt = variantImage?.altText || name;

                if (isDifferentProduct) {
                  // SEO: When the variant is a combined listing child product
                  // that leads to a different url, render it as an anchor tag
                  return (
                    <Link
                      className={`variant-thumbnail${selected ? ' selected' : ''}${
                        !available ? ' unavailable' : ''
                      }`}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      aria-label={`Sélectionner ${name}`}
                      title={name}
                    >
                      {displayImage ? (
                        <div className="variant-thumbnail-image">
                          <img 
                            src={displayImage} 
                            alt={displayAlt}
                            loading="lazy"
                          />
                        </div>
                      ) : swatchColor ? (
                        <div 
                          className="variant-thumbnail-color"
                          style={{backgroundColor: swatchColor}}
                        />
                      ) : (
                        <div className="variant-thumbnail-text">
                          {name}
                        </div>
                      )}
                    </Link>
                  );
                } else {
                  // SEO: When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      className={`variant-thumbnail${selected ? ' selected' : ''}${
                        !available ? ' unavailable' : ''
                      }${exists && !selected ? ' available' : ''}`}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                      aria-label={`Sélectionner ${name}`}
                      title={name}
                    >
                      {displayImage ? (
                        <div className="variant-thumbnail-image">
                          <img 
                            src={displayImage} 
                            alt={displayAlt}
                            loading="lazy"
                          />
                        </div>
                      ) : swatchColor ? (
                        <div 
                          className="variant-thumbnail-color"
                          style={{backgroundColor: swatchColor}}
                        />
                      ) : (
                        <div className="variant-thumbnail-text">
                          {name}
                        </div>
                      )}
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
} 