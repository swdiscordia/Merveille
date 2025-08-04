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
                  <NavLink to="/policies/terms-of-service" className="footer-link">
                    CGV
                  </NavLink>
                  <NavLink to="/policies/terms-of-service" className="footer-link">
                    CGU
                  </NavLink>
                  <NavLink to="/policies/legal-notice" className="footer-link">
                    Mentions légales
                  </NavLink>
                  <NavLink to="/policies/privacy-policy" className="footer-link">
                    Politique de confidentialité
                  </NavLink>
                  <NavLink to="/policies/secure-payment" className="footer-link">
                    Paiement sécurisé
                  </NavLink>
                </div>
              </div>

              {/* Section BESOIN D'AIDE */}
              <div className="footer-section">
                <h3 className="footer-section-title">BESOIN D'AIDE ?</h3>
                <div className="footer-section-content">
                  <NavLink to="/pages/contact" className="footer-link">
                    Nous contacter
                  </NavLink>
                  <NavLink to="/pages/faq" className="footer-link">
                    FAQ's
                  </NavLink>
                  <NavLink to="/pages/order-tracking" className="footer-link">
                    Suivi de commande
                  </NavLink>
                  <NavLink to="/policies/refund-policy" className="footer-link">
                    Retours et remboursement
                  </NavLink>
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
