import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  created_at: string;
  status: string;
}

const MyListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          toast.error('No user found. Please log in again.');
          return;
        }

        const { data, error } = await supabase
          .from('properties')
          .select('id, title, price, location, created_at, status')
          .eq('agent_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching listings:', error);
          toast.error('Failed to fetch listings');
          setListings([]);
        } else {
          setListings(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('An unexpected error occurred');
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Listings</h1>
      
      {listings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't created any listings yet.</p>
          <Button onClick={() => navigate('/add-listing')}>
            Create Your First Listing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{listing.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${listing.price.toLocaleString()}</p>
                <p className="text-gray-500">{listing.location}</p>
                <p className="text-sm mt-2">
                  Listed on: {new Date(listing.created_at).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    listing.status === 'active' ? 'bg-green-100 text-green-800' : 
                    listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/property/${listing.id}`)}
                  className="w-full"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings; 