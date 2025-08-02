import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  // Layout différent selon le contexte (page vs aside)
  if (layout === 'page') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - Liste des articles */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Votre panier</h1>
              <Link 
                to="/collections" 
                className="text-sm text-white bg-black px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium"
                style={{color: 'white'}}
              >
                Continuer les achats
              </Link>
            </div>
            
            <CartEmpty hidden={linesCount} layout={layout} />
            
            {cartHasItems && (
              <div className="space-y-4">
                {/* En-têtes des colonnes (visible seulement sur PC) */}
                <div className="hidden lg:grid grid-cols-12 gap-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">
                  <div className="col-span-6">PRODUIT</div>
                  <div className="col-span-3 text-center">QUANTITÉ</div>
                  <div className="col-span-3 text-right">TOTAL</div>
                </div>
                
                {/* Liste des articles */}
                <div className="space-y-4">
                  {(cart?.lines?.nodes ?? []).map((line) => (
                    <CartLineItem key={line.id} line={line} layout={layout} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Colonne latérale - Résumé */}
          <div className="lg:col-span-1">
            {cartHasItems && <CartSummary cart={cart} layout={layout} />}
          </div>
        </div>
      </div>
    );
  }

  // Layout pour aside (mobile/tablet)
  return (
    <div className="flex flex-col h-full">
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1" aria-labelledby="cart-lines">
          <ul className="space-y-4">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="text-center py-8">
      <div className="mb-6">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Votre panier est vide
      </h3>
      <p className="text-gray-500 mb-6">
        Il semble que vous n&apos;ayez encore rien ajouté, commençons par faire du shopping !
      </p>
      <Link 
        to="/collections" 
        onClick={close} 
        prefetch="viewport"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
        style={{color: 'white'}}
      >
        Continuer les achats →
      </Link>
    </div>
  );
}
