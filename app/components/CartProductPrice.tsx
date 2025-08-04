import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function CartProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {

  return (
    <div className="cart-product-price">
      {compareAtPrice ? (
        <div className="cart-product-price-on-sale">
          {price ? <Money data={price} className="text-xs" /> : null}
          <s>
            <Money data={compareAtPrice} className="text-xs text-gray-500" />
          </s>
        </div>
      ) : price ? (
        <Money data={price} className="text-xs" />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
} 