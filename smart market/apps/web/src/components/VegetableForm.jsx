import React, { useState, useEffect, useRef } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

const VegetableForm = ({ editingVegetable, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingVegetable) {
      setFormData({
        name: editingVegetable.name,
        description: editingVegetable.description || ''
      });
      
      if (editingVegetable.image) {
        setPreviewUrl(pb.files.getUrl(editingVegetable, editingVegetable.image));
      } else {
        setPreviewUrl(null);
      }
      setImageFile(null);
      setRemoveImage(false);
    } else {
      setFormData({ name: '', description: '' });
      setImageFile(null);
      setPreviewUrl(null);
      setRemoveImage(false);
    }
  }, [editingVegetable]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, WebP, GIF)');
      return;
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a vegetable name');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);

      if (imageFile) {
        submitData.append('image', imageFile);
      } else if (removeImage && editingVegetable?.image) {
        // Appending empty string removes the file in PocketBase
        submitData.append('image', ''); 
      }

      if (editingVegetable) {
        await pb.collection('vegetables').update(editingVegetable.id, submitData, { $autoCancel: false });
        toast.success('Vegetable updated successfully');
      } else {
        await pb.collection('vegetables').create(submitData, { $autoCancel: false });
        toast.success('Vegetable added successfully');
      }

      // Reset form
      setFormData({ name: '', description: '' });
      setImageFile(null);
      setPreviewUrl(null);
      setRemoveImage(false);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving vegetable:', error);
      toast.error(error.message || 'Failed to save vegetable');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setImageFile(null);
    setPreviewUrl(null);
    setRemoveImage(false);
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Vegetable Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g., Tomato"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="text-foreground"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="Brief description of the vegetable"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="text-foreground resize-none"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Vegetable Image</Label>
        {previewUrl ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border group bg-muted/30">
            <img 
              src={previewUrl} 
              alt="Vegetable preview" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
               <Button 
                 type="button" 
                 variant="destructive" 
                 size="sm" 
                 onClick={handleRemoveImage}
                 className="shadow-lg shadow-black/20"
               >
                 <X className="h-4 w-4 mr-2" /> Remove Image
               </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <label 
              htmlFor="image-upload" 
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/80 transition-colors border-border hover:border-primary/50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground/80 mt-1">
                  JPG, PNG, WebP up to 5MB
                </p>
              </div>
              <input 
                id="image-upload" 
                type="file" 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp,image/gif" 
                onChange={handleFileChange} 
                ref={fileInputRef} 
              />
            </label>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : editingVegetable ? 'Update Vegetable' : 'Add Vegetable'}
        </Button>
        {editingVegetable && (
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default VegetableForm;