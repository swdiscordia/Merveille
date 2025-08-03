export function ServiceCards() {
  return (
    <div className="service-cards">
      <div className="service-cards-container">
        <div className="service-card">
          <div className="service-icon">📦</div>
          <div className="service-content">
            <h3 className="service-title">Expédition prioritaire</h3>
            <p className="service-description">Envoi sous 24 à 48 heures</p>
          </div>
        </div>

        <div className="service-card">
          <div className="service-icon">✅</div>
          <div className="service-content">
            <h3 className="service-title">Satisfait ou remboursé</h3>
            <p className="service-description">Retour 14 jours<br />Garantie 2 ans</p>
          </div>
        </div>

        <div className="service-card">
          <div className="service-icon">🔐</div>
          <div className="service-content">
            <h3 className="service-title">Paiement sécurisé</h3>
            <p className="service-description">Protocole de cryptage SSL</p>
          </div>
        </div>
      </div>
    </div>
  );
}