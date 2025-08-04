import { Link } from 'react-router';

interface CollectionNotFoundProps {
  handle: string;
  hasFilters?: boolean;
}

export function CollectionNotFound({ handle, hasFilters = false }: CollectionNotFoundProps) {
  return (
    <div className="collection-not-found">
      <div className="error-container">
        <h1>Collection "{handle}" introuvable</h1>
        
        {hasFilters ? (
          <div className="error-content">
            <p>
              Cette erreur peut être due aux filtres appliqués qui ne retournent aucun résultat.
            </p>
            <div className="error-actions">
              <Link to={`/collections/${handle}`} className="btn btn-primary">
                Voir la collection sans filtres
              </Link>
              <Link to="/collections" className="btn btn-secondary">
                Voir toutes les collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="error-content">
            <p>
              La collection que vous recherchez n'existe pas ou a été supprimée.
            </p>
            <div className="error-actions">
              <Link to="/collections/all" className="btn btn-primary">
                Voir tous les produits
              </Link>
              <Link to="/collections" className="btn btn-secondary">
                Parcourir les collections
              </Link>
              <Link to="/" className="btn btn-tertiary">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        )}
        
        <div className="error-suggestions">
          <h3>Collections populaires :</h3>
          <ul className="collection-suggestions">
            <li><Link to="/collections/all">Tous les produits</Link></li>
            <li><Link to="/collections">Parcourir toutes les collections</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}