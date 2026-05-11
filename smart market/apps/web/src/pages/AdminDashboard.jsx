import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import Header from '@/components/Header.jsx';
import PriceForm from '@/components/PriceForm.jsx';
import VegetableForm from '@/components/VegetableForm.jsx';
import PriceTable from '@/components/PriceTable.jsx';
import VegetableDetailModal from '@/components/VegetableDetailModal.jsx';
import ContactInfoSection from '@/components/ContactInfoSection.jsx';

const AdminDashboard = () => {
  const [prices, setPrices] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState(null);
  const [editingVegetable, setEditingVegetable] = useState(null);
  const [vegetableDialogOpen, setVegetableDialogOpen] = useState(false);
  
  // Detail Modal State
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pricesData, vegetablesData] = await Promise.all([
        pb.collection('prices').getFullList({
          sort: '-date',
          expand: 'vegetable_id',
          $autoCancel: false
        }),
        pb.collection('vegetables').getFullList({
          sort: 'name',
          $autoCancel: false
        })
      ]);

      setPrices(pricesData);
      setVegetables(vegetablesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this price entry?')) {
      return;
    }

    try {
      await pb.collection('prices').delete(id, { $autoCancel: false });
      toast.success('Price deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting price:', error);
      toast.error('Failed to delete price');
    }
  };

  const handleDeleteVegetable = async (e, id) => {
    e.stopPropagation(); // Prevent opening the detail modal
    if (!window.confirm('Are you sure you want to delete this vegetable? All associated prices will also be deleted.')) {
      return;
    }

    try {
      await pb.collection('vegetables').delete(id, { $autoCancel: false });
      toast.success('Vegetable deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting vegetable:', error);
      toast.error('Failed to delete vegetable');
    }
  };

  const handleEditPrice = (price) => {
    setEditingPrice(price);
  };

  const handlePriceFormSuccess = () => {
    setEditingPrice(null);
    fetchData();
  };

  const handleVegetableFormSuccess = () => {
    setEditingVegetable(null);
    setVegetableDialogOpen(false);
    fetchData();
  };

  const openVegetableDetail = (vegetable) => {
    setSelectedVegetable(vegetable);
    setDetailModalOpen(true);
  };

  const handleVegetableUpdate = (updatedVegetable) => {
    // Update the selected vegetable in the modal
    setSelectedVegetable(updatedVegetable);
    // Refresh the list to show updated data (like images)
    fetchData();
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Smart Market</title>
        <meta name="description" content="Manage vegetable prices and market data" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage vegetable prices, market data, and contact info</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Price Form */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{editingPrice ? 'Edit Price' : 'Add Price'}</CardTitle>
                  <CardDescription>
                    {editingPrice ? 'Update the price entry' : 'Enter new price data'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PriceForm
                    editingPrice={editingPrice}
                    onSuccess={handlePriceFormSuccess}
                    onCancel={() => setEditingPrice(null)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Price List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Price Entries</CardTitle>
                  <CardDescription>All recorded vegetable prices</CardDescription>
                </CardHeader>
                <CardContent>
                  <PriceTable
                    prices={prices}
                    onEdit={handleEditPrice}
                    onDelete={handleDeletePrice}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Vegetables Section */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vegetables</CardTitle>
                    <CardDescription>Manage vegetable catalog</CardDescription>
                  </div>
                  <Dialog open={vegetableDialogOpen} onOpenChange={setVegetableDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vegetable
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingVegetable ? 'Edit Vegetable' : 'Add New Vegetable'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingVegetable ? 'Update vegetable details' : 'Add a new vegetable to the catalog'}
                        </DialogDescription>
                      </DialogHeader>
                      <VegetableForm
                        editingVegetable={editingVegetable}
                        onSuccess={handleVegetableFormSuccess}
                        onCancel={() => {
                          setEditingVegetable(null);
                          setVegetableDialogOpen(false);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                    ))}
                  </div>
                ) : vegetables.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground">No vegetables found</p>
                    <p className="text-sm text-muted-foreground mt-1">Add your first vegetable above</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vegetables.map((veg) => (
                      <Card 
                        key={veg.id} 
                        className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50 group"
                        onClick={() => openVegetableDetail(veg)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 flex items-start gap-3">
                              {veg.image ? (
                                <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 border border-border">
                                  <img 
                                    src={pb.files.getUrl(veg, veg.image, { thumb: '100x100' })} 
                                    alt={veg.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center shrink-0 border border-border">
                                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{veg.name}</h3>
                                {veg.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {veg.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteVegetable(e, veg.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 ml-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information Settings Section */}
          <div className="pb-12">
            <ContactInfoSection />
          </div>

        </div>
      </div>

      {/* Vegetable Detail & Image Upload Modal */}
      <VegetableDetailModal 
        vegetable={selectedVegetable}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onUpdate={handleVegetableUpdate}
      />
    </>
  );
};

export default AdminDashboard;