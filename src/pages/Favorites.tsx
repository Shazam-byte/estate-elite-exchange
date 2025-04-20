
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyGrid } from "@/components/PropertyGrid";
import { toast } from "@/components/ui/sonner";
import { useEffect } from "react";

const Favorites = () => {
  // This would need authentication to work properly
  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      // For demo purposes, showing all properties instead of actual favorites
      // In a real app, this would filter based on user's favorites
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "approved")
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load favorite properties");
    }
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Favorite Properties</h1>
      </div>
      
      {favorites && favorites.length > 0 ? (
        <PropertyGrid properties={favorites} isLoading={isLoading} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground">
            Browse our listings and heart the properties you love
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
