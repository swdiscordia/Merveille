import {Link} from 'react-router';

interface NoResultsMessageProps {
  appliedFilters: any[];
  collectionTitle: string;
  collectionHandle: string;
}

export function NoResultsMessage({appliedFilters, collectionTitle, collectionHandle}: NoResultsMessageProps) {
  const hasPriceFilter = appliedFilters.some(filter => filter.price);
  const hasCategoryFilter = appliedFilters.some(filter => filter.tag);
  
  const getFilterDescription = () => {
    const descriptions = [];
    
    if (hasPriceFilter) {
      const priceFilter = appliedFilters.find(filter => filter.price);
      if (priceFilter.price.min > 0 && priceFilter.price.max < 1000) {
        descriptions.push(`prix entre ${priceFilter.price.min}€ et ${priceFilter.price.max}€`);
      } else if (priceFilter.price.min > 0) {
        descriptions.push(`prix minimum ${priceFilter.price.min}€`);
      } else if (priceFilter.price.max < 1000) {
        descriptions.push(`prix maximum ${priceFilter.price.max}€`);
      }
    }
    
    if (hasCategoryFilter) {
      const categoryFilters = appliedFilters.filter(filter => filter.tag);
      if (categoryFilters.length === 1) {
        descriptions.push(`catégorie "${categoryFilters[0].tag}"`);
      } else {
        descriptions.push(`${categoryFilters.length} catégories sélectionnées`);
      }
    }
    
    return descriptions.join(' et ');
  };

  return (
    <div className="no-results-container">
      <div className="no-results-content">
        <div className="no-results-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h3 className="no-results-title">
          Aucun produit trouvé
        </h3>
        
        <p className="no-results-description">
          Nous n'avons trouvé aucun produit dans la collection <strong>{collectionTitle}</strong> 
          {appliedFilters.length > 0 && (
            <> correspondant à vos critères : <strong>{getFilterDescription()}</strong></>
          )}
        </p>
        
        <div className="no-results-actions">
          <Link 
            to={`/collections/${collectionHandle}`}
            className="clear-filters-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Effacer tous les filtres
          </Link>
        </div>
        
        <div className="no-results-suggestions">
          <h4>Suggestions pour améliorer votre recherche :</h4>
          <ul>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Essayez de modifier vos critères de prix
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Vérifiez l'orthographe de vos catégories
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 10H20M4 14H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Consultez notre collection complète
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 