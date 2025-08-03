import {Suspense, useState, useEffect, useRef} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {SearchForm} from '~/components/SearchForm';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink 
            prefetch="intent" 
            to="/" 
            style={activeLinkStyle} 
            end
            className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors no-underline"
          >
            <strong>{shop.name}</strong>
          </NavLink>
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
          <HeaderCtas 
            isLoggedIn={isLoggedIn} 
            cart={cart} 
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
          />
        </div>
        {isSearchOpen && <SearchBar onClose={() => setIsSearchOpen(false)} />}
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  const navClasses = viewport === 'desktop' 
    ? "hidden md:flex gap-8" 
    : "flex flex-col space-y-4";

  return (
    <nav className={navClasses} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
          className="text-gray-900 hover:text-gray-700 transition-colors"
        >
          Accueil
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="text-gray-900 hover:text-gray-700 transition-colors font-medium"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
  isSearchOpen,
  setIsSearchOpen,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'> & {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}) {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink 
        prefetch="intent" 
        to="/account" 
        style={activeLinkStyle}
        className="text-gray-900 hover:text-gray-700 transition-all font-medium px-2 sm:px-3 py-2 rounded-md hover:border hover:border-black text-sm sm:text-base whitespace-nowrap border border-transparent"
      >
        <Suspense fallback={<span className="hidden sm:inline">Se connecter</span>}>
          <Await resolve={isLoggedIn} errorElement={<span className="hidden sm:inline">Se connecter</span>}>
            {(isLoggedIn) => (
              <span>
                <span className="hidden sm:inline">{isLoggedIn ? 'Compte' : 'Se connecter'}</span>
                <span className="sm:hidden">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </span>
            )}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open, close, type} = useAside();
  const isMenuOpen = type === 'mobile';
  
  const toggleMenu = () => {
    if (isMenuOpen) {
      close();
    } else {
      open('mobile');
    }
  };
  
  return (
    <button
      className="md:hidden p-2 rounded-md text-gray-900 hover:text-gray-700 hover:bg-gray-50 transition-colors"
      onClick={toggleMenu}
      aria-label={isMenuOpen ? "Fermer le menu mobile" : "Ouvrir le menu mobile"}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}

function SearchToggle({
  isSearchOpen,
  setIsSearchOpen,
}: {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}) {
  return (
    <button 
      className={`p-2 rounded-md transition-colors ${
        isSearchOpen 
          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
          : 'text-gray-900 hover:text-gray-700 hover:bg-gray-50'
      }`}
      onClick={() => setIsSearchOpen(!isSearchOpen)}
      aria-label="Rechercher"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="p-2 rounded-md text-gray-900 hover:text-gray-700 hover:bg-gray-50 transition-colors relative"
      aria-label="Panier"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {count}
        </span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function SearchBar({ onClose }: { onClose: () => void }) {
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Fermer la barre de recherche après soumission
  const handleSubmit = () => {
    setTimeout(() => onClose(), 100); // Délai pour permettre la navigation
  };

  return (
    <div 
      ref={searchBarRef}
      className="border-t bg-white py-4 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-lg mx-auto">
        <SearchForm action="/search" onSubmit={handleSubmit}>
          {({ inputRef }) => (
            <div className="relative flex items-center justify-center">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="search"
                name="q"
                placeholder="Rechercher..."
                autoFocus
                style={{ paddingLeft: '3rem' }}
                className="w-full pr-11 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 text-gray-400 hover:text-gray-600"
                aria-label="Fermer la recherche"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </SearchForm>
      </div>
    </div>
  );
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
