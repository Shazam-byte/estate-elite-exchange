
import { useParams, Link } from "react-router-dom";
import { PropertyDetail } from "@/components/PropertyDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Property = () => {
  const { id } = useParams();

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Property not found</h2>
          <Link to="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="gap-1">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>
        </Button>
      </div>
      <PropertyDetail propertyId={id} />
    </div>
  );
};

export default Property;
