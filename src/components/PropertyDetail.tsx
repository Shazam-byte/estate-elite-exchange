
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MapPin, Building, Bed, Bath, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";

type Property = Database["public"]["Tables"]["properties"]["Row"];

export function PropertyDetail({ propertyId }: { propertyId: string }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(
      isFavorited 
        ? "Property removed from favorites" 
        : "Property added to favorites"
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-[400px] w-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden border-none shadow-none mb-8">
        <div className="relative">
          {property.image_urls && property.image_urls.length > 0 ? (
            <>
              <div className="aspect-[16/9] relative">
                <img
                  src={property.image_urls[activeImageIndex] || "/placeholder.svg"}
                  alt={property.title}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              {property.image_urls.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                  {property.image_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${property.title} - image ${index + 1}`}
                      className={`h-16 w-24 object-cover cursor-pointer rounded ${
                        index === activeImageIndex ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-[16/9] bg-muted flex items-center justify-center rounded-lg">
              <Building className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-background/80 hover:bg-background"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`bg-background/80 hover:bg-background ${
                isFavorited ? "text-primary" : ""
              }`}
              onClick={toggleFavorite}
            >
              <Heart className={isFavorited ? "fill-primary" : ""} />
            </Button>
          </div>
        </div>

        <div className="py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {formatPrice(Number(property.price))}
              </p>
              <p className="text-sm text-muted-foreground">
                {property.listing_type === "sale" ? "For Sale" : "For Rent"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-6">
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <Building className="h-5 w-5 mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium capitalize">{property.property_type}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <Bed className="h-5 w-5 mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">Bedrooms</p>
              <p className="font-medium">{property.bedrooms}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <Bath className="h-5 w-5 mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">Bathrooms</p>
              <p className="font-medium">{property.bathrooms}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-1"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              <p className="text-sm text-muted-foreground">Area</p>
              <p className="font-medium">{property.area} sqft</p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="description" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Property Details</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="p-4 border rounded-md mt-2">
          <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
        </TabsContent>
        <TabsContent value="details" className="p-4 border rounded-md mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Property Information</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Property ID</span>
                  <span>{property.id.slice(0, 8)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="capitalize">{property.property_type}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Listing Type</span>
                  <span className="capitalize">{property.listing_type}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Area</span>
                  <span>{property.area} sqft</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Interior Details</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Bedrooms</span>
                  <span>{property.bedrooms}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Bathrooms</span>
                  <span>{property.bathrooms}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Year Built</span>
                  <span>N/A</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Garage</span>
                  <span>N/A</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Contact Agent</CardTitle>
          <CardDescription>Interested in this property? Contact the agent for more information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="px-3 py-2 w-full border rounded-md"
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="px-3 py-2 w-full border rounded-md"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="px-3 py-2 w-full border rounded-md"
                placeholder="I'm interested in this property and would like more information..."
              ></textarea>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => toast.success("Your message has been sent to the agent.")}>
            Send Message
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
