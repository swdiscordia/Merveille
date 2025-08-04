export function ProductSkeleton() {
  return (
    <div className="product-skeleton">
      <div className="skeleton-image-container">
        <div className="skeleton-image"></div>
        <div className="skeleton-badges">
          <div className="skeleton-badge"></div>
        </div>
        <div className="skeleton-actions">
          <div className="skeleton-action-btn"></div>
          <div className="skeleton-action-btn"></div>
        </div>
      </div>
      <div className="skeleton-info">
        <div className="skeleton-title">
          <div className="skeleton-line skeleton-line-long"></div>
          <div className="skeleton-line skeleton-line-medium"></div>
        </div>
        <div className="skeleton-price">
          <div className="skeleton-line skeleton-line-short"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="enhanced-products-grid">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}