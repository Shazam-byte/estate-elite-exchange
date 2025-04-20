
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { type Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type Property = Database["public"]["Tables"]["properties"]["Row"];

export function PropertyDetail({ propertyId }: { propertyId: string }) {
  const [isFavorited, setIsFavorited] = useState(false);

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

  if (isLoading) {
    return (
      <div className="space-y-4">
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
    <Card className="w-full max-w-4xl mx-auto">
      <div className="aspect-[16/9] relative">
        <img
          src={property.image_urls?.[0] || "/placeholder.svg"}
          alt={property.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{property.title}</CardTitle>
            <CardDescription>{property.location}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart className={isFavorited ? "fill-primary" : ""} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-semibold">{formatPrice(Number(property.price))}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bedrooms</p>
            <p className="font-semibold">{property.bedrooms}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bathrooms</p>
            <p className="font-semibold">{property.bathrooms}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Area</p>
            <p className="font-semibold">{property.area} sqft</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground">{property.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {property.property_type} • {property.listing_type}
        </p>
        <Button>Contact Agent</Button>
      </CardFooter>
    </Card>
  );
}
