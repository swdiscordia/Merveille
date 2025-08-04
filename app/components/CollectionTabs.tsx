import {useState, useEffect, useRef} from 'react';
import {useSearchParams, useNavigate, useLocation} from 'react-router';

interface TabContent {
  id: string;
  label: string;
  content: React.ReactNode;
}

export function CollectionTabs() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['filters']);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = searchParams.getAll('filter');
    const urlPriceMin = searchParams.get('price_min');
    const urlPriceMax = searchParams.get('price_max');
    
    setSelectedFilters(urlFilters);
    if (urlPriceMin || urlPriceMax) {
      setPriceRange({
        min: urlPriceMin ? parseInt(urlPriceMin) : 0,
        max: urlPriceMax ? parseInt(urlPriceMax) : 1000
      });
    }
  }, [searchParams]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const updateURLParams = (filters: string[], priceMin: number, priceMax: number) => {
    try {
      // Save current scroll position
      const currentScrollY = window.scrollY;
      
      const newSearchParams = new URLSearchParams(searchParams);
      
      // Check if filters have changed to determine if we should reset pagination
      const currentFilters = searchParams.getAll('filter');
      const currentPriceMin = searchParams.get('price_min');
      const currentPriceMax = searchParams.get('price_max');
      
      const filtersChanged = 
        JSON.stringify(currentFilters.sort()) !== JSON.stringify(filters.sort()) ||
        currentPriceMin !== (priceMin > 0 ? priceMin.toString() : null) ||
        currentPriceMax !== (priceMax < 1000 ? priceMax.toString() : null);
      
      // Remove all existing filter params
      newSearchParams.delete('filter');
      newSearchParams.delete('price_min');
      newSearchParams.delete('price_max');
      
      // Add new filter params
      filters.forEach(filter => {
        if (filter && filter.trim()) {
          newSearchParams.append('filter', filter);
        }
      });
      
      // Add price range if different from defaults
      if (priceMin > 0) {
        newSearchParams.set('price_min', priceMin.toString());
      }
      if (priceMax < 1000) {
        newSearchParams.set('price_max', priceMax.toString());
      }
      
      // Reset pagination if filters changed
      if (filtersChanged) {
        newSearchParams.delete('cursor');
        console.log('Filters changed, resetting pagination');
      } else {
        // Preserve existing pagination parameters if they exist
        const existingCursor = searchParams.get('cursor');
        if (existingCursor) {
          newSearchParams.set('cursor', existingCursor);
        }
      }
      
      // Debug: log the URL parameters being set
      console.log('Updating URL params:', {
        filters,
        priceMin,
        priceMax,
        filtersChanged,
        newSearchParams: newSearchParams.toString()
      });
      
      const newUrl = `${location.pathname}?${newSearchParams.toString()}`;
      
      // Try to use preventScrollReset if available, otherwise use manual restoration
      try {
        navigate(newUrl, { 
          replace: true,
          preventScrollReset: true 
        });
        
        // Double-check: restore scroll position after navigation as fallback
        requestAnimationFrame(() => {
          if (window.scrollY !== currentScrollY) {
            window.scrollTo(0, currentScrollY);
          }
        });
      } catch (navError) {
        // Fallback for older React Router versions
        navigate(newUrl, { replace: true });
        
        // Restore scroll position after navigation
        requestAnimationFrame(() => {
          window.scrollTo(0, currentScrollY);
        });
      }
    } catch (error) {
      console.error('Error updating URL params:', error);
    }
  };

  const handleFilterChange = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId) 
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    
    setSelectedFilters(newFilters);
    updateURLParams(newFilters, priceRange.min, priceRange.max);
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setPriceRange({ min: 0, max: 1000 });
    updateURLParams([], 0, 1000);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    // Validate price values
    const validValue = Math.max(0, Math.min(value, 1000)); // Cap between 0 and 1000
    
    const newPriceRange = {
      ...priceRange,
      [type]: validValue
    };
    
    // Ensure min is not greater than max
    if (type === 'min' && validValue > priceRange.max) {
      newPriceRange.max = validValue;
    }
    if (type === 'max' && validValue < priceRange.min) {
      newPriceRange.min = validValue;
    }
    
    setPriceRange(newPriceRange);
    
    // Debounce URL update for price changes
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      updateURLParams(selectedFilters, newPriceRange.min, newPriceRange.max);
    }, 800);
  };

  const categoryFilters = [
    { id: 'artiste-chanson', label: 'Artistes/Chansons populaires', count: 24 },
    { id: 'musique-film', label: 'Musiques de films', count: 18 },
    { id: 'musique-jeux', label: 'Musiques de jeux vidéo', count: 12 },
    { id: 'musique-serie', label: 'Musiques de séries', count: 8 },
    { id: 'classique', label: 'Musique classique', count: 15 },
    { id: 'enfants', label: 'Musiques pour enfants', count: 10 }
  ];

  // Filter categories based on search term
  const filteredCategories = categoryFilters.filter(filter =>
    filter.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs: TabContent[] = [
    {
      id: 'filters',
      label: 'Filtres',
      content: (
        <div className="filters-container">
          <div className="sidebar-header">
            <h3>Affiner votre recherche</h3>
            <button className="clear-filters" onClick={clearAllFilters}>
              Effacer tout
            </button>
          </div>
          <div className="modern-filters">
            {/* Container unifié pour catégories et prix */}
            <div className="filter-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('filters')}
              >
                <h5 className="section-title">Filtres</h5>
                <button 
                  className={`expand-btn ${expandedSections.includes('filters') ? 'expanded' : ''}`}
                  aria-label={expandedSections.includes('filters') ? 'Réduire' : 'Développer'}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path 
                      d="M6 9L1.5 4.5L2.5 3.5L6 7L9.5 3.5L10.5 4.5L6 9Z" 
                      fill="currentColor"
                      style={{ 
                        transform: expandedSections.includes('filters') 
                          ? 'rotate(0deg)' 
                          : 'rotate(-90deg)',
                        transformOrigin: 'center',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </svg>
                </button>
              </div>
              
              {expandedSections.includes('filters') && (
                <div className="section-content">
                  {/* Barre de recherche compacte */}
                  <div className="category-search-compact">
                    <div className="search-input-wrapper">
                      <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Rechercher une catégorie..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="category-search-input-compact"
                      />
                    </div>
                  </div>
                  
                  {/* Grille de catégories */}
                  <div className="filter-grid">
                    {filteredCategories.map((filter) => (
                      <label 
                        key={filter.id}
                        className="checkbox-filter-item"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(filter.id)}
                          onChange={() => handleFilterChange(filter.id)}
                          className="filter-checkbox-input"
                        />
                        <div className="custom-checkbox"></div>
                        <div className="filter-info">
                          <span className="filter-name">{filter.label}</span>
                          <span className="filter-count">({filter.count})</span>
                        </div>
                      </label>
                    ))}
                    {filteredCategories.length === 0 && searchTerm && (
                      <div className="no-results-search">
                        Aucune catégorie trouvée pour "{searchTerm}"
                      </div>
                    )}
                  </div>

                  {/* Séparateur visuel */}
                  <div className="filter-separator"></div>

                  {/* Section Prix intégrée */}
                  <div className="price-filter-integrated">
                    <h6 className="price-filter-title">Prix</h6>
                    
                    {/* Range Slider pour le prix */}
                    <div className="price-range-container">
                      <div className="price-inputs">
                        <div className="price-input-group">
                          <label htmlFor="price-min">Min</label>
                          <input
                            id="price-min"
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0)}
                            className="price-input"
                            min="0"
                            max="1000"
                          />
                          <span className="currency">€</span>
                        </div>
                        <div className="price-separator">-</div>
                        <div className="price-input-group">
                          <label htmlFor="price-max">Max</label>
                          <input
                            id="price-max"
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 1000)}
                            className="price-input"
                            min="0"
                            max="1000"
                          />
                          <span className="currency">€</span>
                        </div>
                      </div>
                      
                      <div className="range-slider">
                        <input
                          type="range"
                          min="0"
                          max="500"
                          value={priceRange.min}
                          onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value))}
                          className="range-input range-min"
                        />
                        <input
                          type="range"
                          min="0"
                          max="500"
                          value={priceRange.max}
                          onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value))}
                          className="range-input range-max"
                        />
                      </div>
                      
                      <div className="range-values">
                        <span>{priceRange.min}€</span>
                        <span>{priceRange.max}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="modern-collection-filters">
      {/* Header compact avec toggle */}
      <div className="filters-header">
        <div className="filters-header-left">
          <h4 className="filters-title">Filtres</h4>
          {selectedFilters.length > 0 && (
            <span className="active-filters-badge">
              {selectedFilters.length}
            </span>
          )}
        </div>
        <button 
          className="filters-toggle-btn"
          onClick={toggleFilters}
          aria-label={isFiltersOpen ? 'Fermer les filtres' : 'Ouvrir les filtres'}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
            style={{
              transform: isFiltersOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Filtres actifs avec tags */}
      {selectedFilters.length > 0 && (
        <div className="active-filters-tags">
          {selectedFilters.map((filterId) => {
            const filterData = categoryFilters.find(filter => filter.id === filterId);
            
            return filterData ? (
              <span key={filterId} className="filter-tag">
                {filterData.label}
                <button 
                  className="remove-filter"
                  onClick={() => handleFilterChange(filterId)}
                  aria-label={`Supprimer le filtre ${filterData.label}`}
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
          <button 
            className="clear-all-filters"
            onClick={clearAllFilters}
          >
            Tout effacer
          </button>
        </div>
      )}
      
      {/* Contenu des filtres avec animation */}
      <div className={`filters-content ${isFiltersOpen ? 'filters-open' : 'filters-closed'}`}>
        {tabs.find(tab => tab.id === 'filters')?.content}
      </div>
    </div>
  );
}