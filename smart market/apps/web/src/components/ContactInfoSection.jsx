import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactInfoForm from './ContactInfoForm.jsx';

const ContactInfoSection = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContactData = async () => {
    setLoading(true);
    setError(null);
    try {
      const record = await pb.collection('contact_info').getFirstListItem('', {
        $autoCancel: false,
      });
      setContactData(record);
    } catch (err) {
      console.error('Error fetching contact info:', err);
      if (err.status === 404) {
        // No record exists yet, pass null to form to create one
        setContactData(null);
      } else {
        setError('Failed to load contact information.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  const handleSuccess = (updatedRecord) => {
    setContactData(updatedRecord);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Contact Information</CardTitle>
        <CardDescription>
          Manage the contact details, address, and business hours displayed to users on the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
            </div>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-24 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-24 w-full" /></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-destructive/5 rounded-lg border border-destructive/20">
            <AlertCircle className="h-8 w-8 text-destructive mb-3" />
            <p className="text-destructive font-medium mb-4">{error}</p>
            <Button onClick={fetchContactData} variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : (
          <ContactInfoForm 
            initialData={contactData} 
            onSuccess={handleSuccess} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ContactInfoSection;