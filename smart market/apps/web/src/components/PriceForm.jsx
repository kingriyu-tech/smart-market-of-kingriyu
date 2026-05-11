import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const PriceForm = ({
  editingPrice,
  onSuccess,
  onCancel
}) => {
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vegetable_id: '',
    price: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchVegetables();
  }, []);

  useEffect(() => {
    if (editingPrice) {
      setFormData({
        vegetable_id: editingPrice.vegetable_id,
        price: editingPrice.price.toString(),
        date: editingPrice.date
      });
    }
  }, [editingPrice]);

  const fetchVegetables = async () => {
    try {
      const records = await pb.collection('vegetables').getFullList({
        $autoCancel: false
      });
      setVegetables(records);
    } catch (error) {
      console.error('Error fetching vegetables:', error);
      toast.error('Failed to load vegetables');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.vegetable_id || !formData.price || !formData.date) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const data = {
        vegetable_id: formData.vegetable_id,
        price: parseFloat(formData.price),
        date: formData.date
      };
      if (editingPrice) {
        await pb.collection('prices').update(editingPrice.id, data, {
          $autoCancel: false
        });
        toast.success('Price updated successfully');
      } else {
        await pb.collection('prices').create(data, {
          $autoCancel: false
        });
        toast.success('Price added successfully');
      }
      setFormData({
        vegetable_id: '',
        price: '',
        date: new Date().toISOString().split('T')[0]
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving price:', error);
      toast.error(error.message || 'Failed to save price');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      vegetable_id: '',
      price: '',
      date: new Date().toISOString().split('T')[0]
    });
    if (onCancel) onCancel();
  };

  return <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vegetable">Vegetable</Label>
        <Select value={formData.vegetable_id} onValueChange={value => setFormData({
        ...formData,
        vegetable_id: value
      })}>
          <SelectTrigger id="vegetable" className="text-foreground">
            <SelectValue placeholder="Select vegetable" />
          </SelectTrigger>
          <SelectContent>
            {vegetables.map(veg => <SelectItem key={veg.id} value={veg.id}>
                {veg.name}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (₱) per kg</Label>
        <Input id="price" type="number" step="0.01" min="0" placeholder="0.00" value={formData.price} onChange={e => setFormData({
        ...formData,
        price: e.target.value
      })} className="text-foreground" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" value={formData.date} onChange={e => setFormData({
        ...formData,
        date: e.target.value
      })} className="text-foreground" required />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : editingPrice ? 'Update Price' : 'Add Price'}
        </Button>
        {editingPrice && <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>}
      </div>
    </form>;
};

export default PriceForm;