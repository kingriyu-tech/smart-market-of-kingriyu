import React from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { cn } from '@/lib/utils.js';
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VegetableTileGrid = ({ 
  vegetables, 
  onSelectVegetable, 
  isAdmin = false,
  onEdit,
  onDelete
}) => {
  if (!vegetables || vegetables.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
      {vegetables.map((veg) => {
        const hasImage = !!veg.image;
        const imageUrl = hasImage ? pb.files.getUrl(veg, veg.image, { thumb: '400x300' }) : null;

        return (
          <div
            key={veg.id}
            onClick={() => onSelectVegetable(veg)}
            className={cn(
              "group relative flex flex-col bg-card text-card-foreground rounded-2xl border border-border/50 shadow-sm overflow-hidden transition-all duration-300 cursor-pointer",
              "hover:shadow-lg hover:border-primary/40 hover:-translate-y-1",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Space') {
                onSelectVegetable(veg);
              }
            }}
          >
            {/* Image Section */}
            <div className="relative h-40 sm:h-48 w-full bg-muted/30 overflow-hidden border-b border-border/50">
              {hasImage ? (
                <img 
                  src={imageUrl} 
                  alt={veg.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-sm font-medium opacity-70">No image</span>
                </div>
              )}
              
              {/* Admin Actions Overlay */}
              {isAdmin && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                  {onEdit && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-10 w-10 sm:h-8 sm:w-8 rounded-full shadow-md bg-background/90 backdrop-blur hover:bg-background touch-target sm:min-h-0 sm:min-w-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(veg);
                      }}
                      aria-label={`Edit ${veg.name}`}
                    >
                      <Edit className="h-4 w-4 text-foreground" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-10 w-10 sm:h-8 sm:w-8 rounded-full shadow-md bg-destructive/90 backdrop-blur hover:bg-destructive touch-target sm:min-h-0 sm:min-w-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(veg);
                      }}
                      aria-label={`Delete ${veg.name}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive-foreground" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-5 flex flex-col flex-grow">
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1">
                {veg.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
                {veg.description || 'No description available.'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VegetableTileGrid;