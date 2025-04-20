
import { Building, MapPin, Bed, Bath } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-[16/9] relative">
        <img
          src={property.image_urls?.[0] || '/placeholder.svg'}
          alt={property.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground rounded text-sm">
          {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{property.title}</h3>
          <p className="font-bold text-primary">{formatPrice(Number(property.price))}</p>
        </div>
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm truncate">{property.location}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-1" />
            <span>{property.property_type}</span>
          </div>
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms} baths</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          {Math.floor(Number(property.area))} sqft
        </p>
      </CardFooter>
    </Card>
  );
}
