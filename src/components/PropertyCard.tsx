import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Database } from "@/lib/types";
import { useNavigate } from "react-router-dom";

type Property = Database["public"]["Tables"]["properties"]["Row"];

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <div className="aspect-[16/9] relative">
        <img
          src={property.image_urls?.[0] || '/placeholder.svg'}
          alt={property.title}
          className="object-cover w-full h-full"
        />
        {property.status && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground rounded text-sm">
            {property.status}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{property.title}</h3>
          <p className="font-bold text-primary">{formatPrice(property.price)}</p>
        </div>
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm truncate">{property.location}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
      </CardContent>
    </Card>
  );
}
