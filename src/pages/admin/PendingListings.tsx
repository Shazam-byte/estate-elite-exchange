import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string | null;
  image_urls: string[] | null;
  agent_id: string;
  property_type: string;
  listing_type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  created_at: string;
}

export default function PendingListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const fetchPendingListings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if user is admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData?.role !== 'admin') {
        navigate('/');
        return;
      }

      // Fetch pending properties
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching pending listings:', error);
      toast.error('Failed to fetch pending listings');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveListing = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'approved' })
        .eq('id', propertyId);

      if (error) throw error;
      
      setProperties(properties.filter(property => property.id !== propertyId));
      toast.success('Listing approved successfully');
    } catch (error) {
      console.error('Error approving listing:', error);
      toast.error('Failed to approve listing');
    }
  };

  const handleRejectListing = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'rejected' })
        .eq('id', propertyId);

      if (error) throw error;
      
      setProperties(properties.filter(property => property.id !== propertyId));
      toast.success('Listing rejected successfully');
    } catch (error) {
      console.error('Error rejecting listing:', error);
      toast.error('Failed to reject listing');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Pending Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {properties.map((property) => (
              <Card key={property.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{property.title}</h3>
                        <p className="text-sm text-gray-500">{property.location}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{property.property_type}</Badge>
                          <Badge variant="outline">{property.listing_type}</Badge>
                          <Badge variant="outline">{property.bedrooms} beds</Badge>
                          <Badge variant="outline">{property.bathrooms} baths</Badge>
                          <Badge variant="outline">{property.area} sqft</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${property.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          Listed: {new Date(property.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600">{property.description}</p>
                    {property.image_url && (
                      <img 
                        src={property.image_url} 
                        alt={property.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleRejectListing(property.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApproveListing(property.id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {properties.length === 0 && (
              <p className="text-center text-gray-500">No pending listings found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 