import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const hasDiscounts = cart.discountCodes?.some(discount => discount.applicable) || false;
  const hasGiftCards = cart.appliedGiftCards && cart.appliedGiftCards.length > 0;
  const hasAnyDiscounts = hasDiscounts || hasGiftCards;

  // Calculer le pourcentage de réduction
  const calculateDiscountPercentage = () => {
    if (!cart.cost?.subtotalAmount?.amount || !cart.cost?.totalAmount?.amount) return null;
    
    const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
    const total = parseFloat(cart.cost.totalAmount.amount);
    const discount = subtotal - total;
    const percentage = (discount / subtotal) * 100;
    
    return Math.round(percentage);
  };

  const discountPercentage = calculateDiscountPercentage();

  return (
    <div aria-labelledby="cart-summary" className="border-t border-gray-200 pt-6 mt-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Total</h4>
      <dl className="space-y-2 mb-6">
        {/* Affichage conditionnel : soit total simple, soit détail avec réduction */}
        {hasAnyDiscounts ? (
          <>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Prix original</dt>
              <dd className="text-sm text-gray-500 line-through">
                {cart.cost?.subtotalAmount?.amount ? (
                  <Money data={cart.cost?.subtotalAmount} />
                ) : (
                  '-'
                )}
              </dd>
            </div>
            {discountPercentage && (
              <div className="flex justify-between text-green-600">
                <dt className="text-sm">Réduction</dt>
                <dd className="text-sm font-medium">
                  -{discountPercentage}%
                </dd>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <dt className="text-sm font-semibold text-gray-900">À payer</dt>
                <dd className="text-sm font-semibold text-gray-900">
                  {cart.cost?.totalAmount?.amount ? (
                    <Money data={cart.cost?.totalAmount} />
                  ) : (
                    '-'
                  )}
                </dd>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-between">
            <dt className="text-sm font-semibold text-gray-900">À payer</dt>
            <dd className="text-sm font-semibold text-gray-900">
              {cart.cost?.subtotalAmount?.amount ? (
                <Money data={cart.cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </dd>
          </div>
        )}
      </dl>
      <div className="space-y-4">
        <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
      </div>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-4">
      <a 
        href={checkoutUrl} 
        target="_self"
        className="block w-full bg-black text-white text-center py-4 px-6 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        style={{color: 'white'}}
      >
        Passer ma commande
      </a>
    </div>
  );
}
