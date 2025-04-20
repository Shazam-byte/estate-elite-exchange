
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyGrid } from "@/components/PropertyGrid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { data: properties, isLoading } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <div className="relative bg-black text-white">
        <div className="absolute inset-0 opacity-60 bg-gradient-to-r from-black to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1493962853295-0fd70327578a"
          alt="Luxury property"
          className="w-full h-[500px] object-cover"
        />
        <div className="container mx-auto px-4 py-16 relative z-20">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Property</h1>
            <p className="text-lg mb-8">
              Discover the perfect home with Estate Elite's extensive property listings
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link to="/search">
                  Browse Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/search">Advanced Search</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Properties</h2>
          <Button variant="ghost" asChild>
            <Link to="/search">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <PropertyGrid properties={properties} isLoading={isLoading} />
      </div>

      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search Properties</h3>
              <p className="text-muted-foreground">Find exactly what you're looking for with our advanced search tools</p>
            </div>
            <div>
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
              <p className="text-muted-foreground">Keep track of properties you love for easy comparison later</p>
            </div>
            <div>
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Contact Agents</h3>
              <p className="text-muted-foreground">Directly connect with real estate professionals to get your questions answered</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
