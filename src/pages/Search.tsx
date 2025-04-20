import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyGrid } from "@/components/PropertyGrid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search as SearchIcon } from "lucide-react";
import { Enums } from "@/integrations/supabase/types";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<Enums["property_type"] | "">("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [minBeds, setMinBeds] = useState(0);
  
  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties", searchTerm, propertyType, minPrice, maxPrice, minBeds],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "approved");
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      if (propertyType) {
        query = query.eq("property_type", propertyType);
      }
      
      if (minPrice > 0) {
        query = query.gte("price", minPrice);
      }
      
      if (maxPrice < 2000000) {
        query = query.lte("price", maxPrice);
      }
      
      if (minBeds > 0) {
        query = query.gte("bedrooms", minBeds);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Properties</h1>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by location, title or description..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label htmlFor="property-type" className="mb-2 block">Property Type</Label>
              <Select 
                value={propertyType} 
                onValueChange={(value: Enums["property_type"] | "") => setPropertyType(value)}
              >
                <SelectTrigger id="property-type">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Type</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block">Price Range</Label>
              <div className="pt-6">
                <Slider
                  defaultValue={[minPrice, maxPrice]}
                  min={0}
                  max={2000000}
                  step={50000}
                  minStepsBetweenThumbs={1}
                  onValueChange={(values) => {
                    setMinPrice(values[0]);
                    setMaxPrice(values[1]);
                  }}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{formatCurrency(minPrice)}</span>
                  <span>{formatCurrency(maxPrice)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="min-beds" className="mb-2 block">Minimum Bedrooms</Label>
              <Select value={minBeds.toString()} onValueChange={(value) => setMinBeds(Number(value))}>
                <SelectTrigger id="min-beds">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {properties && properties.length > 0 ? (
        <PropertyGrid properties={properties} isLoading={isLoading} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No properties found</h2>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Search;
