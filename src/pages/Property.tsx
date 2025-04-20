
import { useParams } from "react-router-dom";
import { PropertyDetail } from "@/components/PropertyDetail";

const Property = () => {
  const { id } = useParams();

  if (!id) {
    return <div>Property not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertyDetail propertyId={id} />
    </div>
  );
};

export default Property;
