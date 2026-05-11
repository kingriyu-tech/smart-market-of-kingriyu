import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { RefreshCcw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Header from '@/components/Header.jsx';
import VegetableTileGrid from '@/components/VegetableTileGrid.jsx';
import ContactInfoCard from '@/components/ContactInfoCard.jsx';

const UserDashboard = () => {
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVegetables();
  }, []);

  const fetchVegetables = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await pb.collection('vegetables').getList(1, 50, {
        sort: 'name',
        $autoCancel: false
      });
      setVegetables(result.items);
    } catch (err) {
      console.error('Error fetching vegetables:', err);
      setError('Failed to load market data. Please check your connection and try again.');
      toast.error('Failed to load vegetables');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVegetable = (veg) => {
    navigate(`/user/vegetable/${encodeURIComponent(veg.name)}`);
  };

  return (
    <>
      <Helmet>
        <title>Market Catalog - Smart Market</title>
        <meta name="description" content="Browse available vegetables and view price trends" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
        <Header />

        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
          <div className="mb-10 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-foreground">
              Market Catalog
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Browse our selection of fresh vegetables. Click on any item to view detailed historical price trends and AI-powered market forecasts.
            </p>
          </div>

          {/* Disclaimer Alert */}
          <Alert className="mb-8 border-2 border-amber-500/50 bg-amber-50 dark:bg-amber-950/30 shadow-md">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div className="ml-4">
              <AlertTitle className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Wholesale Price Reference
              </AlertTitle>
              <AlertDescription className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                <div>🔸 <span className="font-medium">WHOLESALE PRICE</span></div>
                <div>🔸 <span className="font-medium">FARMERS' and DISPOSER'S REFERENCE ONLY</span></div>
                <div className="pt-2 border-t border-amber-200 dark:border-amber-800 mt-2">
                  <p>⚠️ Prices are subject to change depending on the availability and demand of commodities!</p>
                </div>
              </AlertDescription>
            </div>
          </Alert>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex flex-col bg-card rounded-2xl border border-border/50 overflow-hidden">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card/50 rounded-3xl border border-border/50">
              <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Unable to load catalog</h2>
              <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
              <Button onClick={fetchVegetables} size="lg">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : vegetables.length === 0 ? (
            <div className="text-center py-20 bg-card/50 rounded-3xl border border-border/50">
              <p className="text-xl text-muted-foreground">No vegetables available in the market yet.</p>
            </div>
          ) : (
            <VegetableTileGrid 
              vegetables={vegetables}
              onSelectVegetable={handleSelectVegetable}
              isAdmin={false}
            />
          )}

          {/* Contact Information Section */}
          <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
            <ContactInfoCard />
          </div>
        </main>
      </div>
    </>
  );
};

export default UserDashboard;