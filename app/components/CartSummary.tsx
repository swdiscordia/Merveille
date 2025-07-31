import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useRef, useState} from 'react';
import {FetcherWithComponents} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div aria-labelledby="cart-summary" className="border-t border-gray-200 pt-6 mt-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Total</h4>
      <dl className="space-y-2 mb-6">
        <div className="flex justify-between">
          <dt className="text-sm text-gray-600">Sous-total</dt>
          <dd className="text-sm font-medium text-gray-900">
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </div>
      </dl>
      <div className="space-y-4">
        <UnifiedCodeForm discountCodes={cart.discountCodes} giftCardCodes={cart.appliedGiftCards} />
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

// Composant unifié simplifié pour les codes
function UnifiedCodeForm({
  discountCodes,
  giftCardCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const [codeType, setCodeType] = useState<'discount' | 'giftcard'>('discount');
  const appliedGiftCardCodes = useRef<string[]>([]);

  const discountCodesList: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  const giftCardCodesList: string[] =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedGiftCardCode(code: string) {
    const formattedCode = code.replace(/\s/g, '');
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
  }

  return (
    <div className="space-y-3">
      {/* Affichage des codes appliqués */}
      {(discountCodesList.length > 0 || giftCardCodesList.length > 0) && (
        <div className="space-y-2">
          {discountCodesList.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-md space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Réduction appliquée:</span>
                <code className="text-sm bg-white px-2 py-1 rounded border break-all">{discountCodesList.join(', ')}</code>
              </div>
              <UpdateDiscountForm discountCodes={discountCodesList}>
                <button className="text-gray-400 hover:text-red-600 transition-colors p-1">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="sr-only">Supprimer</span>
                </button>
              </UpdateDiscountForm>
            </div>
          )}
          
          {giftCardCodesList.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-md space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Carte cadeau:</span>
                <code className="text-sm bg-white px-2 py-1 rounded border break-all">{giftCardCodesList.join(', ')}</code>
              </div>
              <UpdateGiftCardForm>
                <button 
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="sr-only">Supprimer</span>
                </button>
              </UpdateGiftCardForm>
            </div>
          )}
        </div>
      )}

      {/* Champ unifié pour les codes */}
      <div className="space-y-3">
        {/* Onglets élégants pour choisir le type */}
        <div className="flex border border-gray-200 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setCodeType('discount')}
            className={`flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
              codeType === 'discount'
                ? 'bg-black text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Code réduction
          </button>
          <button
            type="button"
            onClick={() => setCodeType('giftcard')}
            className={`flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
              codeType === 'giftcard'
                ? 'bg-black text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Carte cadeau
          </button>
        </div>

        {/* Formulaire conditionnel */}
        {codeType === 'discount' ? (
          <UpdateDiscountForm discountCodes={discountCodesList}>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input 
                type="text" 
                name="discountCode" 
                placeholder="Code de réduction" 
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Appliquer
              </button>
            </div>
          </UpdateDiscountForm>
        ) : (
          <UpdateGiftCardForm
            giftCardCodes={appliedGiftCardCodes.current}
            saveAppliedCode={saveAppliedGiftCardCode}
          >
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                name="giftCardCode"
                placeholder="Code carte cadeau"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Appliquer
              </button>
            </div>
          </UpdateGiftCardForm>
        )}
      </div>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}
