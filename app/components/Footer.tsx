import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="modern-footer">
            {/* Logo et titre principal */}
            <div className="footer-brand">
              <h2 className="footer-logo">Merveille du Monde</h2>
            </div>

            {/* Contenu principal du footer */}
            <div className="footer-content">
              {/* Section MERVEILLE DU MONDE */}
              <div className="footer-section">
                <h3 className="footer-section-title">MERVEILLE DU MONDE</h3>
                                 <div className="footer-section-content">
                   <p>La boutique en ligne spécialiste de merveille du monde !</p>
                   <p>Service client à votre service du Lundi au Dimanche.</p>
                 </div>
              </div>

              {/* Section INFORMATIONS */}
              <div className="footer-section">
                <h3 className="footer-section-title">INFORMATIONS</h3>
                <div className="footer-section-content">
                  <div className="footer-links-list">
                    <NavLink to="/policies/terms-of-service" className="footer-link-item">
                      <svg className="footer-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>CGV</span>
                    </NavLink>
                    <NavLink to="/policies/terms-of-service" className="footer-link-item">
                      <svg className="footer-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>CGU</span>
                    </NavLink>
                    <NavLink to="/policies/legal-notice" className="footer-link-item">
                      <svg className="footer-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Mentions légales</span>
                    </NavLink>
                    <NavLink to="/policies/privacy-policy" className="footer-link-item">
                      <svg className="footer-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>Politique de confidentialité</span>
                    </NavLink>
                    <NavLink to="/policies/secure-payment" className="footer-link-item">
                      <svg className="footer-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Paiement sécurisé</span>
                    </NavLink>
                  </div>
                </div>
              </div>

              {/* Section BESOIN D'AIDE */}
              <div className="footer-section">
                <h3 className="footer-section-title">BESOIN D'AIDE ?</h3>
                <div className="footer-section-content">
                  <div className="footer-links-list">
                    <NavLink to="/pages/contact" className="footer-link-item">
                      <svg className="footer-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Nous contacter</span>
                    </NavLink>
                    <NavLink to="/pages/faq" className="footer-link-item">
                      <svg className="footer-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>FAQ's</span>
                    </NavLink>
                    <NavLink to="/pages/order-tracking" className="footer-link-item">
                      <svg className="footer-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Suivi de commande</span>
                    </NavLink>
                    <NavLink to="/policies/refund-policy" className="footer-link-item">
                      <svg className="footer-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 21v-5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Retours et remboursement</span>
                    </NavLink>
                  </div>
                </div>
              </div>

              {/* Section NEWSLETTER */}
              <div className="footer-section">
                <h3 className="footer-section-title">NEWSLETTER</h3>
                <div className="footer-section-content">
                  <p>Recevez nos nouveautés et promotions directement dans votre boîte mail !</p>
                  <div className="newsletter-form">
                    <input 
                      type="email" 
                      placeholder="Votre e-mail" 
                      className="newsletter-input"
                    />
                                         <button className="newsletter-button" aria-label="S'abonner à la newsletter">
                       S'inscrire
                     </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Barre de paiement en bas */}
            <div className="footer-bottom">
              <div className="footer-bottom-content">
                <div className="footer-copyright">
                  Merveille du Monde
                </div>
                <div className="footer-payment">
                  <span className="payment-text">Nous acceptons</span>
                  <div className="payment-methods">
                    <div className="payment-icon amex" aria-label="American Express"></div>
                    <div className="payment-icon apple-pay" aria-label="Apple Pay"></div>
                    <div className="payment-icon google-pay" aria-label="Google Pay"></div>
                    <div className="payment-icon mastercard" aria-label="Mastercard"></div>
                    <div className="payment-icon paypal" aria-label="PayPal"></div>
                    <div className="payment-icon visa" aria-label="Visa"></div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}
