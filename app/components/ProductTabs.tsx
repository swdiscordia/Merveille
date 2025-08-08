import {useState} from 'react';

interface TabContent {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ProductTabsProps {
  product: {
    title: string;
    descriptionHtml: string;
  };
}

export function ProductTabs({product}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('details');

  // Fonctions de navigation
  const goToPreviousTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
    setActiveTab(tabs[previousIndex].id);
  };

  const goToNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
    setActiveTab(tabs[nextIndex].id);
  };

  const tabs: TabContent[] = [
    {
      id: 'details',
      label: 'DÉTAILS',
      content: (
        <div className="tab-content">
          <ul className="product-specs">
            <li>Matériaux : Bois de bouleau et acier inoxydable</li>
            <li>Mécanisme : Manivelle traditionnelle</li>
            <li>Dimensions : 6.5 x 5.2 x 4.2 cm</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'operation',
      label: 'FONCTIONNEMENT',
      content: (
        <div className="tab-content">
          <p>
            Il vous suffit simplement d&apos;actionner la manivelle en la tournant à vitesse constante pour laisse le mécanisme opérer et la mélodie se jouer. Une utilisation <strong>simple et rapide</strong> qui ne nécessite aucune pile ou batterie.
          </p>
        </div>
      ),
    },
         {
       id: 'description',
       label: 'DESCRIPTION',
       content: (
         <div className="tab-content">
           <div 
             className="product-description"
             dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
           />
         </div>
       ),
     },
    {
      id: 'delivery',
      label: 'LIVRAISON & RETOURS',
      content: (
        <div className="tab-content">
          <div className="delivery-section">
            <h4 className="delivery-title">
              Livraison suivie offerte
            </h4>
            <p>
              Livraison suivie gratuite pour toutes les commandes passées depuis la France métropolitaine, sans minimum d&apos;achat. Délai de livraison moyen entre 5 et 12 jours ouvrés.
            </p>
          </div>
          
          <div className="returns-section">
            <h4 className="returns-title">
              Retours gratuits
            </h4>
            <p>
              Bénéficiez de notre garantie &quot;satisfait ou remboursé&quot;. Si un article ne vous convient pas, vous disposez de 14 jours à compter de la réception de votre colis pour effectuer un retour gratuit et obtenir un remboursement.
            </p>
          </div>
          
          <p className="faq-link">
            <em>Pour plus d&apos;informations sur la livraison et les retours, nous vous invitons à consulter notre <a href="/faq" className="link">FAQ</a>.</em>
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="product-tabs">
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
                 <div className="tabs-navigation-arrows">
           <button 
             className="nav-arrow" 
             aria-label="Previous tab"
             onClick={goToPreviousTab}
           >
             <span>‹</span>
           </button>
           <button 
             className="nav-arrow" 
             aria-label="Next tab"
             onClick={goToNextTab}
           >
             <span>›</span>
           </button>
         </div>
      </div>
      
      <div className="tab-panel">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
} 