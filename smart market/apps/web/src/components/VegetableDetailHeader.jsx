import React from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getVegetableIcon } from '@/lib/vegetableIcons.js';
import { useVegetableBackgroundImage } from '@/hooks/useVegetableBackgroundImage.js';
import { cn } from '@/lib/utils.js';

const VegetableDetailHeader = ({ vegetable, stats }) => {
  // Get fallback image from Unsplash mapping hook
  const { imageUrl: fallbackImageUrl, isLoading: isFallbackLoading } = useVegetableBackgroundImage(vegetable);

  if (!vegetable || !stats) return null;

  const isPositiveTrend = stats.predictedChange > 0;
  const TrendIcon = isPositiveTrend ? ArrowUpRight : ArrowDownRight;

  // Determine if we have a custom uploaded image from PocketBase
  const hasCustomImage = !!vegetable.image;
  const customImageUrl = hasCustomImage ? pb.files.getUrl(vegetable, vegetable.image) : null;
  
  // Use custom uploaded image if it exists, otherwise fall back to Unsplash mapping
  const displayImageUrl = customImageUrl || fallbackImageUrl;
  const isImageLoading = hasCustomImage ? false : isFallbackLoading;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl group">
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105",
            isImageLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
          )}
          style={{ backgroundImage: `url(${displayImageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex items-end gap-6">
          <div className="h-20 w-20 md:h-24 md:w-24 bg-background/20 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center text-5xl md:text-6xl shadow-xl">
            {getVegetableIcon(vegetable.name)}
          </div>
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              {vegetable.name}
            </h1>
            {vegetable.description && (
              <p className="text-white/80 text-lg max-w-2xl line-clamp-2">
                {vegetable.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-primary/10 text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Current Price</p>
              <p className="text-3xl font-bold tracking-tight">₱{stats.currentPrice.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-primary/10 text-primary">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Average Price</p>
              <p className="text-3xl font-bold tracking-tight">₱{stats.averagePrice.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={cn(
              "p-4 rounded-xl",
              isPositiveTrend ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
            )}>
              <TrendIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">7-Day Forecast</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold tracking-tight">
                  {isPositiveTrend ? '+' : ''}{stats.predictedChange}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VegetableDetailHeader;