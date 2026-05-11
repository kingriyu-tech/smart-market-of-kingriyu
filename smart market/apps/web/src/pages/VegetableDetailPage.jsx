import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, AlertCircle, RefreshCcw, Settings } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header.jsx';
import VegetableDetailHeader from '@/components/VegetableDetailHeader.jsx';
import VegetableDetailChart from '@/components/VegetableDetailChart.jsx';
import ImageUploadSection from '@/components/ImageUploadSection.jsx';
import { linearRegression, getPredictionStats } from '@/lib/linearRegression.js';

const VegetableDetailPage = () => {
  const { vegetableName } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const isAdmin = currentUser?.role === 'admin';
  
  const [vegetable, setVegetable] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [stats, setStats] = useState(null);
  
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch vegetable details
      const vegRecord = await pb.collection('vegetables').getFirstListItem(`name="${vegetableName}"`, {
        $autoCancel: false
      });
      setVegetable(vegRecord);

      // 2. Fetch price records based on timeRange
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeRange);

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      const prices = await pb.collection('prices').getFullList({
        filter: `vegetable_id="${vegRecord.id}" && date >= "${startDateStr}" && date <= "${endDateStr}"`,
        sort: 'date',
        $autoCancel: false
      });

      const formattedData = prices.map(record => ({
        date: record.date,
        price: record.price
      }));

      setPriceData(formattedData);

      // 3. Calculate predictions and stats
      if (formattedData.length >= 2) {
        const result = linearRegression(formattedData, 7);
        setPredictions(result.predictions);
        setStats(getPredictionStats(formattedData, result.predictions));
      } else {
        setPredictions([]);
        setStats(getPredictionStats(formattedData, []));
      }

    } catch (err) {
      console.error('Error fetching vegetable details:', err);
      setError('Failed to load vegetable data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vegetableName) {
      fetchData();
    }
  }, [vegetableName, timeRange]);

  const handleBack = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  };

  const handleImageUpdate = (updatedRecord) => {
    setVegetable(updatedRecord);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Helmet>
        <title>{vegetableName ? `${vegetableName} Details - Smart Market` : 'Vegetable Details'}</title>
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-4 text-muted-foreground hover:text-foreground transition-colors"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {loading && !vegetable ? (
          <div className="space-y-8">
            <Skeleton className="h-64 md:h-80 w-full rounded-3xl" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
            <Skeleton className="h-[450px] w-full rounded-xl" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card/50 rounded-3xl border border-border/50">
            <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">Something went wrong</h2>
            <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
            <Button onClick={fetchData}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <VegetableDetailHeader 
              vegetable={vegetable} 
              stats={stats} 
            />
            
            <VegetableDetailChart 
              data={priceData}
              predictions={predictions}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />

            {isAdmin && (
              <div className="mt-12 p-6 md:p-8 bg-card rounded-2xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Admin Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage media and details for this vegetable</p>
                  </div>
                </div>
                
                <div className="max-w-2xl">
                  <ImageUploadSection 
                    vegetableRecord={vegetable}
                    onUploadSuccess={handleImageUpdate}
                    onRemoveSuccess={handleImageUpdate}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default VegetableDetailPage;