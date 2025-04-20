import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string;
  image_urls?: string[];
  agent_id: string;
  created_at: string;
  status: string;
}

interface Agent {
  id: string;
  email: string;
  name: string;
  phone: string;
}

export default function Property() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch property details
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (propertyError) throw propertyError;
      if (!propertyData) throw new Error('Property not found');
      
      // Check if property is approved
      if (propertyData.status !== 'approved') {
        throw new Error('This property is not available for viewing');
      }

      setProperty(propertyData);

      // Fetch agent details
      const { data: agentData, error: agentError } = await supabase
        .from('users')
        .select('*')
        .eq('id', propertyData.agent_id)
        .single();

      if (agentError) throw agentError;
      setAgent(agentData);

      // Check if property is in user's favorites
      if (user) {
        const { data: favoriteData } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id)
          .eq('property_id', id)
          .single();

        setIsFavorite(!!favoriteData);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setError(error instanceof Error ? error.message : 'Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', id);

        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, property_id: id }]);

        if (error) throw error;
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleContactAgent = () => {
    if (agent) {
      window.location.href = `mailto:${agent.email}`;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Property Not Available</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  if (!property || !agent) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
        <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {(property.image_urls?.length > 0 || property.image_url) ? (
            <div className="space-y-4">
              <img
                src={property.image_urls?.[0] || property.image_url || '/placeholder.svg'}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              {property.image_urls && property.image_urls.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {property.image_urls.slice(1).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${property.title} - Image ${index + 2}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <img
              src="/placeholder.svg"
              alt={property.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          <p className="text-gray-600 mb-4">{property.description}</p>
          <p className="text-2xl font-bold mb-4">${property.price.toLocaleString()}</p>
          <p className="text-gray-500 mb-6">{property.location}</p>

          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={handleToggleFavorite}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={handleContactAgent}
            >
              Contact Agent
            </Button>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Agent Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{agent.name}</p>
              <p className="text-gray-600">{agent.email}</p>
              <p className="text-gray-600">{agent.phone}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
