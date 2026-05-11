import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Phone, Mail, MapPin, Clock, Info, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ContactInfoCard = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        // Fetch the first available contact record
        const record = await pb.collection('contact_info').getFirstListItem('', {
          $autoCancel: false,
        });
        setContactInfo(record);
      } catch (err) {
        console.error('Error fetching contact info:', err);
        // If it's a 404, it just means no record exists yet, which is fine to show empty state
        if (err.status !== 404) {
          setError('Failed to load contact information.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) {
    return (
      <Card className="w-full bg-card border-border/50 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-destructive/5 border-destructive/20 shadow-sm rounded-2xl">
        <CardContent className="p-6 flex items-center gap-3 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!contactInfo) {
    return null; // Don't render anything if no contact info is set up yet
  }

  return (
    <Card className="w-full bg-card border-border/50 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
        <CardTitle className="text-2xl font-bold text-foreground">Contact & Location</CardTitle>
        <p className="text-sm text-muted-foreground">Get in touch with us for inquiries or visit our market.</p>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
                <a href={`tel:${contactInfo.phone}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                  {contactInfo.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                <a href={`mailto:${contactInfo.email}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="space-y-6">
            {contactInfo.address && contactInfo.address !== 'Not provided' && (
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary/30 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                  <p className="text-base font-medium text-foreground whitespace-pre-wrap">
                    {contactInfo.address}
                  </p>
                </div>
              </div>
            )}

            {contactInfo.business_hours && contactInfo.business_hours !== 'Not provided' && (
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary/30 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Business Hours</h4>
                  <p className="text-base font-medium text-foreground whitespace-pre-wrap">
                    {contactInfo.business_hours}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {contactInfo.additional_info && contactInfo.additional_info !== 'Not provided' && (
            <div className="md:col-span-2 pt-6 border-t border-border/50 flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Info className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Additional Information</h4>
                <p className="text-base text-foreground">
                  {contactInfo.additional_info}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;