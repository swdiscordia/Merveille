import {useState} from 'react';

interface TabContent {
  id: string;
  label: string;
  content: React.ReactNode;
}

export function CollectionTabs() {
  const [activeTab, setActiveTab] = useState('filters');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const tabs: TabContent[] = [
    {
      id: 'filters',
      label: 'FILTRES',
      content: (
        <div className="tab-content">
          <div className="filters-section">
            <h4 className="filters-title">Filtrer par :</h4>
            <div className="filter-separator"></div>
            <div className="filter-list">
              <div 
                className="filter-item" 
                onClick={() => handleFilterChange('artiste-chanson')}
              >
                <div className="filter-content">
                  <input 
                    type="checkbox" 
                    id="artiste-chanson"
                    checked={selectedFilters.includes('artiste-chanson')}
                    onChange={() => handleFilterChange('artiste-chanson')}
                    className="filter-checkbox"
                  />
                  <label htmlFor="artiste-chanson" className="filter-label">Artiste/Chanson</label>
                </div>
                <span className="filter-count">(24)</span>
              </div>
              <div 
                className="filter-item"
                onClick={() => handleFilterChange('musique-film')}
              >
                <div className="filter-content">
                  <input 
                    type="checkbox" 
                    id="musique-film"
                    checked={selectedFilters.includes('musique-film')}
                    onChange={() => handleFilterChange('musique-film')}
                    className="filter-checkbox"
                  />
                  <label htmlFor="musique-film" className="filter-label">Musique de film</label>
                </div>
                <span className="filter-count">(18)</span>
              </div>
              <div 
                className="filter-item"
                onClick={() => handleFilterChange('musique-jeux')}
              >
                <div className="filter-content">
                  <input 
                    type="checkbox" 
                    id="musique-jeux"
                    checked={selectedFilters.includes('musique-jeux')}
                    onChange={() => handleFilterChange('musique-jeux')}
                    className="filter-checkbox"
                  />
                  <label htmlFor="musique-jeux" className="filter-label">Musique de jeux-vidéo</label>
                </div>
                <span className="filter-count">(12)</span>
              </div>
              <div 
                className="filter-item"
                onClick={() => handleFilterChange('musique-serie')}
              >
                <div className="filter-content">
                  <input 
                    type="checkbox" 
                    id="musique-serie"
                    checked={selectedFilters.includes('musique-serie')}
                    onChange={() => handleFilterChange('musique-serie')}
                    className="filter-checkbox"
                  />
                  <label htmlFor="musique-serie" className="filter-label">Musique de série</label>
                </div>
                <span className="filter-count">(8)</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="collection-tabs">
      <div className="tabs-navigation">
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="tab-panel">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}