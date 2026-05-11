import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ImageUploadSection from './ImageUploadSection.jsx';
import { Leaf } from 'lucide-react';

const VegetableDetailModal = ({ vegetable, isOpen, onClose, onUpdate }) => {
  if (!vegetable) return null;

  const handleImageUpdate = (updatedRecord) => {
    if (onUpdate) {
      onUpdate(updatedRecord);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg overflow-hidden p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Leaf className="w-5 h-5" />
              </div>
              <DialogTitle className="text-2xl">{vegetable.name}</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              {vegetable.description || 'No description provided for this vegetable.'}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-6 pt-4">
          <ImageUploadSection 
            vegetableRecord={vegetable} 
            onUploadSuccess={handleImageUpdate}
            onRemoveSuccess={handleImageUpdate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VegetableDetailModal;