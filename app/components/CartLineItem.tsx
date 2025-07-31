import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from '~/components/ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  // Layout pour page (PC) - style tableau
  if (layout === 'page') {
    return (
      <>
        {/* Version Desktop - Tableau */}
        <div className="hidden lg:grid grid-cols-12 gap-4 py-4 border-b border-gray-100 last:border-b-0">
          {/* Colonne Produit */}
          <div className="col-span-6 flex space-x-4">
            {image && (
              <div className="flex-shrink-0">
                <Image
                  alt={title}
                  aspectRatio="1/1"
                  data={image}
                  height={80}
                  loading="lazy"
                  width={80}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Link
                prefetch="intent"
                to={lineItemUrl}
                className="block hover:text-gray-600 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900 mb-1">
                  <strong>{product.title}</strong>
                </p>
              </Link>
              <ul className="space-y-1">
                {selectedOptions.map((option) => (
                  <li key={option.name} className="text-xs text-gray-500">
                    <small>
                      {option.name}: {option.value}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Colonne Quantité */}
          <div className="col-span-3 flex items-center justify-center">
            <CartLineQuantity line={line} layout={layout} />
          </div>

          {/* Colonne Total */}
          <div className="col-span-3 flex items-center justify-end">
            <div className="text-right">
              <ProductPrice price={line?.cost?.totalAmount} />
              <CartLineRemoveButton lineIds={[id]} disabled={false} />
            </div>
          </div>
        </div>

        {/* Version Mobile - Compact */}
        <div className="lg:hidden flex space-x-4 py-6 border-b border-gray-100 last:border-b-0">
          {image && (
            <div className="flex-shrink-0">
              <Image
                alt={title}
                aspectRatio="1/1"
                data={image}
                height={80}
                loading="lazy"
                width={80}
                className="w-20 h-20 object-cover rounded-md"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <Link
              prefetch="intent"
              to={lineItemUrl}
              className="block hover:text-gray-600 transition-colors"
            >
              <p className="text-sm font-medium text-gray-900 mb-1">
                <strong>{product.title}</strong>
              </p>
            </Link>
            <ProductPrice price={line?.cost?.totalAmount} />
            <ul className="mt-1 space-y-1">
              {selectedOptions.map((option) => (
                <li key={option.name} className="text-xs text-gray-500">
                  <small>
                    {option.name}: {option.value}
                  </small>
                </li>
              ))}
            </ul>
            <CartLineQuantity line={line} layout="aside" />
          </div>
        </div>
      </>
    );
  }

  // Layout pour aside (mobile/tablet) - style compact
  return (
    <li className="flex space-x-4 py-6 border-b border-gray-100 last:border-b-0">
      {image && (
        <div className="flex-shrink-0">
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={80}
            loading="lazy"
            width={80}
            className="w-20 h-20 object-cover rounded-md"
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
          className="block hover:text-gray-600 transition-colors"
        >
          <p className="text-sm font-medium text-gray-900 mb-1">
            <strong>{product.title}</strong>
          </p>
        </Link>
        <ProductPrice price={line?.cost?.totalAmount} />
        <ul className="mt-1 space-y-1">
          {selectedOptions.map((option) => (
            <li key={option.name} className="text-xs text-gray-500">
              <small>
                {option.name}: {option.value}
              </small>
            </li>
          ))}
        </ul>
        <CartLineQuantity line={line} layout={layout} />
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line, layout}: {line: CartLine; layout: CartLayout}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  // Style différent selon le layout
  if (layout === 'page') {
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center border border-gray-200 rounded-md">
          <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
            <button
              aria-label="Diminuer la quantité"
              disabled={quantity <= 1 || !!isOptimistic}
              name="decrease-quantity"
              value={prevQuantity}
              className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </CartLineUpdateButton>
          <span className="px-3 py-1 text-sm font-medium text-gray-900 border-x border-gray-200">
            {quantity}
          </span>
          <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
            <button
              aria-label="Augmenter la quantité"
              name="increase-quantity"
              value={nextQuantity}
              disabled={!!isOptimistic}
              className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </CartLineUpdateButton>
        </div>
      </div>
    );
  }

  // Layout aside (mobile)
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600">Quantité:</span>
        <div className="flex items-center border border-gray-200 rounded-md">
          <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
            <button
              aria-label="Diminuer la quantité"
              disabled={quantity <= 1 || !!isOptimistic}
              name="decrease-quantity"
              value={prevQuantity}
              className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </CartLineUpdateButton>
          <span className="px-3 py-1 text-sm font-medium text-gray-900 border-x border-gray-200">
            {quantity}
          </span>
          <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
            <button
              aria-label="Augmenter la quantité"
              name="increase-quantity"
              value={nextQuantity}
              disabled={!!isOptimistic}
              className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </CartLineUpdateButton>
        </div>
      </div>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button 
        disabled={disabled} 
        type="submit"
        className="text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1"
        aria-label="Supprimer l'article"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
