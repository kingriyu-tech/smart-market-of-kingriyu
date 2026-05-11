import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const contactSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Please enter a valid email address'),
  address: z.string().optional(),
  business_hours: z.string().optional(),
  additional_info: z.string().optional(),
});

const ContactInfoForm = ({ initialData, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      address: initialData?.address === 'Not provided' ? '' : (initialData?.address || ''),
      business_hours: initialData?.business_hours === 'Not provided' ? '' : (initialData?.business_hours || ''),
      additional_info: initialData?.additional_info === 'Not provided' ? '' : (initialData?.additional_info || ''),
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let updatedRecord;
      
      if (initialData?.id) {
        // Update existing record
        updatedRecord = await pb.collection('contact_info').update(initialData.id, data, {
          $autoCancel: false
        });
        toast.success('Contact information updated successfully');
      } else {
        // Create new record if somehow one doesn't exist
        updatedRecord = await pb.collection('contact_info').create(data, {
          $autoCancel: false
        });
        toast.success('Contact information created successfully');
      }
      
      // Reset form with new data to reset isDirty state
      reset({
        phone: updatedRecord.phone,
        email: updatedRecord.email,
        address: updatedRecord.address,
        business_hours: updatedRecord.business_hours,
        additional_info: updatedRecord.additional_info,
      });

      if (onSuccess) {
        onSuccess(updatedRecord);
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Failed to save contact information');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
          <Input 
            id="phone" 
            placeholder="+1 (555) 000-0000" 
            className="text-foreground"
            {...register('phone')} 
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
          <Input 
            id="email" 
            type="email"
            placeholder="contact@market.com" 
            className="text-foreground"
            {...register('email')} 
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Physical Address</Label>
        <Textarea 
          id="address" 
          placeholder="123 Market Street, City, State ZIP" 
          className="resize-none min-h-[80px] text-foreground"
          {...register('address')} 
        />
      </div>

      {/* Business Hours */}
      <div className="space-y-2">
        <Label htmlFor="business_hours">Business Hours</Label>
        <Textarea 
          id="business_hours" 
          placeholder="Mon - Fri: 6:00 AM - 5:00 PM&#10;Sat - Sun: 7:00 AM - 3:00 PM" 
          className="resize-none min-h-[80px] text-foreground"
          {...register('business_hours')} 
        />
      </div>

      {/* Additional Info */}
      <div className="space-y-2">
        <Label htmlFor="additional_info">Additional Information (Optional)</Label>
        <Textarea 
          id="additional_info" 
          placeholder="Any extra details for visitors, parking information, etc." 
          className="resize-none min-h-[80px] text-foreground"
          {...register('additional_info')} 
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-border/50">
        <Button type="submit" disabled={!isDirty || isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Contact Info
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContactInfoForm;