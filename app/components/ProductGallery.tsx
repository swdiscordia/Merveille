import {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductGallery({
  images,
  selectedVariantImage,
}: {
  images: ProductFragment['images'];
  selectedVariantImage?: NonNullable<ProductFragment['selectedOrFirstAvailableVariant']>['image'];
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Réinitialiser l'index sélectionné quand la variante change
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedVariantImage?.id]);

  // Combiner les images du produit avec l'image de la variante sélectionnée
  const allImages = [];
  
  // Ajouter l'image de la variante sélectionnée en premier si elle existe
  if (selectedVariantImage) {
    allImages.push(selectedVariantImage);
  }
  
  // Ajouter toutes les images du produit (en excluant l'image de la variante si elle existe déjà)
  if (images?.nodes) {
    images.nodes.forEach((image) => {
      // Éviter les doublons si l'image de la variante est déjà dans les images du produit
      const isDuplicate = selectedVariantImage && image.id === selectedVariantImage.id;
      if (!isDuplicate) {
        allImages.push(image);
      }
    });
  }

  // Si aucune image n'est disponible, afficher un placeholder
  if (allImages.length === 0) {
    return (
      <div className="product-gallery">
        <div className="product-gallery-main">
          <div className="product-image-placeholder">
            <span>Aucune image disponible</span>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = allImages[selectedImageIndex];

  return (
    <div className="product-gallery">
      {/* Image principale */}
      <div className="product-gallery-main">
        <div className="product-image">
          <Image
            alt={currentImage.altText || 'Product Image'}
            aspectRatio="1/1"
            data={currentImage}
            key={currentImage.id}
            sizes="(min-width: 45em) 50vw, 100vw"
          />
        </div>
      </div>

      {/* Miniatures */}
      {allImages.length > 1 && (
        <div className="product-gallery-thumbnails">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={`product-gallery-thumbnail${
                index === selectedImageIndex ? ' selected' : ''
              }`}
              onClick={() => setSelectedImageIndex(index)}
              aria-label={`Voir l'image ${index + 1}`}
            >
              <Image
                alt={image.altText || `Product image ${index + 1}`}
                aspectRatio="1/1"
                data={image}
                sizes="60px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 