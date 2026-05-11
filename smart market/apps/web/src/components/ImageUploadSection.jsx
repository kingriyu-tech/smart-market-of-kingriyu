import React, { useState, useRef } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils.js';

const ImageUploadSection = ({ vegetableRecord, onUploadSuccess, onRemoveSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const hasImage = !!vegetableRecord?.image;
  const imageUrl = hasImage ? pb.files.getUrl(vegetableRecord, vegetableRecord.image) : null;

  const handleFile = async (file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, WebP, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const updatedRecord = await pb.collection('vegetables').update(vegetableRecord.id, formData, {
        $autoCancel: false
      });
      
      toast.success('Image uploaded successfully');
      if (onUploadSuccess) onUploadSuccess(updatedRecord);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleRemove = async () => {
    setIsUploading(true);
    try {
      // In PocketBase, setting a file field to null removes it
      const updatedRecord = await pb.collection('vegetables').update(vegetableRecord.id, { image: null }, {
        $autoCancel: false
      });
      
      toast.success('Image removed successfully');
      if (onRemoveSuccess) onRemoveSuccess(updatedRecord);
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove image');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground">Vegetable Photo</h3>
      
      {hasImage ? (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-border group bg-muted/30">
          <img 
            src={imageUrl} 
            alt={vegetableRecord.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm gap-3">
             <Button 
               type="button" 
               variant="secondary" 
               size="sm" 
               onClick={() => fileInputRef.current?.click()}
               disabled={isUploading}
               className="shadow-lg"
             >
               <Upload className="h-4 w-4 mr-2" /> Replace Image
             </Button>
             <Button 
               type="button" 
               variant="destructive" 
               size="sm" 
               onClick={handleRemove}
               disabled={isUploading}
               className="shadow-lg"
             >
               {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
               Remove Image
             </Button>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp,image/gif" 
            onChange={handleFileChange} 
            ref={fileInputRef} 
          />
        </div>
      ) : (
        <div 
          className={cn(
            "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
            isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border bg-muted/30 hover:bg-muted/80 hover:border-primary/50",
            isUploading && "opacity-50 pointer-events-none"
          )}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 mb-4 text-primary animate-spin" />
                <p className="text-sm font-medium text-foreground">Uploading image...</p>
              </>
            ) : (
              <>
                <div className="p-4 bg-background rounded-full shadow-sm mb-4 border border-border">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-foreground mb-1">
                  <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP up to 5MB
                </p>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp,image/gif" 
            onChange={handleFileChange} 
            ref={fileInputRef} 
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;