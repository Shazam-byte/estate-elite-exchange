
import { PropertyGrid } from "@/components/PropertyGrid";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Featured Properties</h1>
      </div>
      <PropertyGrid />
    </div>
  );
};

export default Index;
