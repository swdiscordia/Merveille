import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {ProductVariantSelector} from './ProductVariantSelector';
import type {ProductFragment} from 'storefrontapi.generated';
import type {MappedProductOptions} from '@shopify/hydrogen';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const {open} = useAside();
  
  return (
    <div className="product-form">
      <ProductVariantSelector 
        productOptions={productOptions}
        selectedVariant={selectedVariant}
      />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}
