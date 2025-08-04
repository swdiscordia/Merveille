import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {ProductGridSkeleton} from './ProductSkeleton';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
  enableInfiniteScroll = true,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
  enableInfiniteScroll?: boolean;
}) {
  const nextLinkRef = useRef<HTMLAnchorElement>(null);
  const isLoadingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        // Auto-scroll functionality
        useEffect(() => {
          isLoadingRef.current = isLoading;
        }, [isLoading]);

        useEffect(() => {
          if (!enableInfiniteScroll || !nextLinkRef.current) return;

          // Reset loading state when connection changes (new filters applied)
          isLoadingRef.current = false;

          const observer = new IntersectionObserver(
            (entries) => {
              const [entry] = entries;
              if (entry.isIntersecting && !isLoadingRef.current && connection.pageInfo.hasNextPage) {
                // Add a small delay to prevent immediate triggering after filter changes
                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                  if (!isLoadingRef.current && connection.pageInfo.hasNextPage) {
                    isLoadingRef.current = true;
                    nextLinkRef.current?.click();
                  }
                }, 100);
              }
            },
            {
              threshold: 0.1,
              rootMargin: '50px',
            }
          );

          observer.observe(nextLinkRef.current);

          return () => {
            clearTimeout(timeoutRef.current);
            if (nextLinkRef.current) {
              observer.unobserve(nextLinkRef.current);
            }
          };
        }, [enableInfiniteScroll, connection.pageInfo.hasNextPage, connection.pageInfo.startCursor, connection.pageInfo.endCursor, nodes.length]);

        return (
          <div className="paginated-section">
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            
            {/* Show skeleton loader when loading more products */}
            {isLoading && nodes.length > 0 && (
              <ProductGridSkeleton count={8} />
            )}
            
            {/* Hidden auto-trigger for infinite scroll */}
            <NextLink 
              ref={nextLinkRef}
              className="hidden-next-link"
              style={{ opacity: 0, height: 0, overflow: 'hidden' }}
            >
              Next
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}
